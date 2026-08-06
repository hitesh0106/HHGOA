/**
 * Self-contained QR code generator (no external dependencies). Renders to a
 * data URL via canvas. Supports up to ~120 chars of text at error-correction
 * level M. Good enough for short verification URLs / IDs on the Builder ID card.
 *
 * Implements the QR Code specification (ISO/IEC 18004) for the byte mode
 * encoding with version auto-selection and Reed-Solomon error correction.
 */

type Version = number;
type EcLevel = "L" | "M" | "Q" | "H";

const EC_CODEWORDS_PER_BLOCK: Record<EcLevel, number[]> = {
  // Version index 0 = version 1; we use up to version 10 (max ~213 bytes for L).
  L: [7, 10, 15, 20, 26, 36, 40, 48, 60, 72],
  M: [10, 16, 26, 36, 48, 64, 72, 88, 110, 130],
  Q: [13, 22, 36, 52, 72, 96, 108, 132, 160, 192],
  H: [17, 28, 44, 64, 88, 112, 130, 156, 192, 224],
};
const EC_BLOCKS_PER_BLOCK: Record<EcLevel, number[]> = {
  L: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4],
  M: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5],
  Q: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8],
  H: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8],
};
const ALIGNMENT_PATTERNS: number[][] = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
];
const VERSION_CAPACITY_BYTES_M = [
  14, 26, 42, 62, 84, 106, 122, 152, 180, 213,
];
const VERSION_DATA_CODEWORDS = [
  19, 34, 55, 80, 108, 134, 154, 192, 230, 271,
];

/** Galois field tables for Reed-Solomon. */
const GF = (() => {
  const exp = new Uint8Array(512);
  const log = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
  return { exp, log };
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF.exp[(GF.log[a] + GF.log[b]) % 255];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let result = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(result.length + 1);
    for (let j = 0; j < result.length; j++) {
      next[j] ^= result[j];
      next[j + 1] ^= gfMul(result[j], GF.exp[i]);
    }
    result = next;
  }
  return result;
}

function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = rsGeneratorPoly(ecLen);
  const result = new Uint8Array(data.length + ecLen);
  result.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = result[i];
    if (coef === 0) continue;
    for (let j = 0; j < gen.length; j++) {
      result[i + j] ^= gfMul(gen[j], coef);
    }
  }
  return result.slice(data.length);
}

function pickVersion(byteLen: number, ec: EcLevel): Version {
  const capacity = ec === "M" ? VERSION_CAPACITY_BYTES_M : VERSION_CAPACITY_BYTES_M;
  for (let v = 1; v <= 10; v++) {
    if (byteLen <= capacity[v - 1] - 2) return v;
  }
  return 10;
}

function encodeBytes(text: string): Uint8Array {
  // UTF-8 encode then prefix with the byte-mode indicator + length.
  const utf8 = new TextEncoder().encode(text);
  const len = utf8.length;
  // We need 4-bit length for v1–v9, 8-bit for v10+.
  const bits: number[] = [];
  // Mode indicator: byte mode = 0100
  [0, 1, 0, 0].forEach((b) => bits.push(b));
  // Length
  const lenBits = len < 1 << 8 ? 8 : 16;
  for (let i = lenBits - 1; i >= 0; i--) bits.push((len >> i) & 1);
  // Data
  for (let i = 0; i < len; i++) {
    for (let j = 7; j >= 0; j--) bits.push((utf8[i] >> j) & 1);
  }
  // Terminator (up to 4 zero bits)
  for (let i = 0; i < 4 && bits.length % 8 !== 0; i++) bits.push(0);
  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);
  // Convert bits to bytes
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    bytes.push(b);
  }
  // Pad bytes (alternating 0xEC, 0x11)
  const pad = [0xec, 0x11];
  let pi = 0;
  while (bytes.length < VERSION_DATA_CODEWORDS[0] /* overwritten later */) {
    bytes.push(pad[pi % 2]);
    pi++;
  }
  return new Uint8Array(bytes);
}

interface QRMatrix {
  size: number;
  matrix: Uint8Array; // 0 = white, 1 = black, 2 = function pattern reserved
  reserved: Uint8Array;
}

function createMatrix(version: Version): QRMatrix {
  const size = 17 + 4 * version;
  const matrix = new Uint8Array(size * size);
  const reserved = new Uint8Array(size * size);
  const set = (r: number, c: number, v: number) => {
    matrix[r * size + c] = v;
  };
  const setRes = (r: number, c: number, v: number) => {
    matrix[r * size + c] = v;
    reserved[r * size + c] = 1;
  };

  // Finder patterns (3 corners)
  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const onBorder =
          (r === 0 || r === 6) && c >= 0 && c <= 6;
        const onSide =
          (c === 0 || c === 6) && r >= 0 && r <= 6;
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        setRes(rr, cc, onBorder || onSide || inner ? 1 : 0);
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);

  // Alignment patterns
  const aligns = ALIGNMENT_PATTERNS[version] || [];
  for (const r of aligns) {
    for (const c of aligns) {
      if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) {
        continue;
      }
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          const border = dr === -2 || dr === 2 || dc === -2 || dc === 2;
          const center = dr === 0 && dc === 0;
          setRes(rr, cc, border || center ? 1 : 0);
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setRes(6, i, i % 2 === 0 ? 1 : 0);
    setRes(i, 6, i % 2 === 0 ? 1 : 0);
  }

  // Format info placeholders — reserved for later.
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      reserved[8 * size + i] = 1;
      reserved[i * size + 8] = 1;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8 * size + (size - 1 - i)] = 1;
    reserved[(size - 1 - i) * size + 8] = 1;
  }
  reserved[(size - 8) * size + 8] = 1;

  // Dark module
  setRes(size - 8, 8, 1);

  return { size, matrix, reserved };
}

function placeData(matrix: QRMatrix, data: Uint8Array): void {
  const { size, reserved } = matrix;
  let bitIndex = 0;
  let direction = -1; // upward
  let col = size - 1;
  while (col > 0) {
    if (col === 6) col--; // skip timing column
    for (let i = 0; i < size; i++) {
      const r = direction === -1 ? size - 1 - i : i;
      for (let j = 0; j < 2; j++) {
        const c = col - j;
        if (reserved[r * size + c]) continue;
        const byteIdx = bitIndex >> 3;
        const bitInByte = 7 - (bitIndex & 7);
        const bit = byteIdx < data.length ? (data[byteIdx] >> bitInByte) & 1 : 0;
        matrix.matrix[r * size + c] = bit;
        bitIndex++;
      }
    }
    col -= 2;
    direction = -direction;
  }
}

function placeFormatInfo(matrix: QRMatrix, ec: EcLevel): void {
  const { size } = matrix;
  // Format info bits — using BCH encoding.
  const ecBits: Record<EcLevel, number> = { L: 0b01, M: 0b00, Q: 0b11, H: 0b10 };
  const data = ecBits[ec] << 3; // 5 bits, mask = 0
  const bch = (() => {
    let g = 0b10100110111;
    let d = data << 10;
    for (let i = 14; i >= 10; i--) {
      if ((d >> i) & 1) d ^= g << (i - 10);
    }
    return ((data << 10) | d) ^ 0b101010000010010;
  })();
  const bits: number[] = [];
  for (let i = 0; i < 15; i++) bits.push((bch >> i) & 1);

  // Place format info around top-left finder
  for (let i = 0; i <= 5; i++) matrix.matrix[8 * size + i] = bits[i];
  matrix.matrix[8 * size + 7] = bits[6];
  matrix.matrix[8 * size + 8] = bits[7];
  matrix.matrix[7 * size + 8] = bits[8];
  for (let i = 5; i >= 0; i--) matrix.matrix[i * size + 8] = bits[14 - i];

  // Place format info around top-right + bottom-left
  for (let i = 0; i < 8; i++) matrix.matrix[8 * size + (size - 1 - i)] = bits[i];
  for (let i = 8; i < 15; i++) matrix.matrix[(size - 15 + i) * size + 8] = bits[i];
}

function applyMask(matrix: QRMatrix, maskId: number): void {
  const { size, reserved } = matrix;
  const fn = (r: number, c: number): boolean => {
    switch (maskId) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2 + (r * c) % 3) === 0;
      case 6: return (((r * c) % 2 + (r * c) % 3) % 2) === 0;
      case 7: return (((r + c) % 2 + (r * c) % 3) % 2) === 0;
    }
    return false;
  };
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved[r * size + c]) continue;
      if (fn(r, c)) matrix.matrix[r * size + c] ^= 1;
    }
  }
}

/**
 * Generate a QR code matrix for the given text.
 * Returns a Uint8Array of 0/1 values plus the matrix size.
 */
export function generateQRMatrix(text: string, ec: EcLevel = "M"): { size: number; matrix: Uint8Array } {
  const version = pickVersion(text.length, ec);
  const m = createMatrix(version);
  const data = encodeBytes(text);
  // Truncate / pad to exactly the data codeword count for the version.
  const totalDataCodewords = VERSION_DATA_CODEWORDS[version - 1];
  const padded = new Uint8Array(totalDataCodewords);
  padded.set(data.subarray(0, totalDataCodewords));
  // Pad bytes
  let pi = 0;
  const pad = [0xec, 0x11];
  for (let i = data.length; i < totalDataCodewords; i++) {
    padded[i] = pad[pi % 2];
    pi++;
  }

  // Compute EC codewords.
  const ecPerBlock = EC_CODEWORDS_PER_BLOCK[ec][version - 1];
  const numBlocks = EC_BLOCKS_PER_BLOCK[ec][version - 1];
  const blockDataLen = Math.floor(totalDataCodewords / numBlocks);
  const shortBlocks = numBlocks - (totalDataCodewords % numBlocks);

  const blocks: { data: Uint8Array; ec: Uint8Array }[] = [];
  let offset = 0;
  for (let i = 0; i < numBlocks; i++) {
    const isShort = i < shortBlocks;
    const blockLen = blockDataLen + (isShort ? 0 : 1);
    const blockData = padded.subarray(offset, offset + blockLen);
    const ecBytes = rsEncode(blockData, ecPerBlock);
    blocks.push({ data: blockData, ec: ecBytes });
    offset += blockLen;
  }

  // Interleave data + ec bytes across blocks.
  const final: number[] = [];
  const maxDataLen = Math.max(...blocks.map((b) => b.data.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const b of blocks) if (i < b.data.length) final.push(b.data[i]);
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const b of blocks) final.push(b.ec[i]);
  }

  placeData(m, new Uint8Array(final));
  applyMask(m, 0);
  placeFormatInfo(m, ec);

  return { size: m.size, matrix: m.matrix };
}

/**
 * Render the QR matrix to a PNG data URL using canvas.
 */
export function qrToDataUrl(
  text: string,
  options: { size?: number; margin?: number; dark?: string; light?: string } = {}
): string {
  const { size = 240, margin = 4, dark = "#06301E", light = "#FFFFFF" } = options;
  const { size: matrixSize, matrix } = generateQRMatrix(text, "M");
  const totalSize = matrixSize + margin * 2;
  const pixelSize = Math.floor(size / totalSize);
  const actualSize = pixelSize * totalSize;

  const canvas = document.createElement("canvas");
  canvas.width = actualSize;
  canvas.height = actualSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, actualSize, actualSize);
  ctx.fillStyle = dark;
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r * matrixSize + c] === 1) {
        ctx.fillRect(
          (c + margin) * pixelSize,
          (r + margin) * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }
  return canvas.toDataURL("image/png");
}

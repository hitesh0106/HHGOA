import { chromium } from "playwright";
import { writeFileSync } from "fs";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

console.log("Loading app…");
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// Scroll to studio
await page.evaluate(() => document.getElementById("studio")?.scrollIntoView({ behavior: "instant", block: "start" }));
await page.waitForTimeout(1000);

// Upload photo
console.log("Uploading test photo…");
const fileInputs = await page.locator('input[type="file"]').all();
await fileInputs[1].setInputFiles("/home/z/my-project/upload/test-photo.jpg");
await page.waitForTimeout(3000);

// Fill form
console.log("Filling form…");
await page.locator('input[placeholder*="Aria"]').fill("Aria Mehra");
await page.locator('input[placeholder*="Full Stack"]').fill("Full Stack · AI");
await page.locator('input[placeholder*="IIT"]').fill("IIT Bombay");
await page.locator('input[placeholder*="your-handle"]').first().fill("aria-mehra");
await page.locator('input[placeholder*="@your-handle"]').fill("@ariabuilds");
await page.waitForTimeout(2000);

// Click Generate
console.log("Clicking Generate…");
await page.getByRole("button", { name: "Generate Builder ID" }).click();
await page.waitForTimeout(5000);

// Extract the PNG via JS
console.log("Extracting generated PNG…");
const dataUrl = await page.evaluate(async () => {
  const node = document.querySelector('div[style*="width: 1080"] > div');
  if (!node) return null;
  const mod = await import("https://esm.sh/html-to-image@1.11.13");
  return await mod.toPng(node, { pixelRatio: 1, cacheBust: true });
});

if (!dataUrl) {
  console.error("Failed to generate PNG");
  await browser.close();
  process.exit(1);
}

const buf = Buffer.from(dataUrl.split(",")[1], "base64");
const out = "/home/z/my-project/download/sample-builder-id.png";
writeFileSync(out, buf);
console.log(`✓ Saved ${out} (${(buf.length / 1024).toFixed(1)} KB)`);

if (errors.length > 0) {
  console.log("\nPage errors captured:");
  errors.forEach((e) => console.log("  -", e));
} else {
  console.log("\nNo page errors.");
}

await browser.close();

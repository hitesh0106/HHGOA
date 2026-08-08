/**
 * Lightweight Canvas Confetti generator.
 * Triggers a festive celebratory particle explosion when generating a card or team pass.
 */

export function triggerConfetti(): void {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);

  const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#10b981", "#ffffff"];
  const particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    vRot: number;
    opacity: number;
  }[] = [];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: w / 2,
      y: h / 2 - 50,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > 2500) {
      canvas.remove();
      return;
    }

    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // Gravity
      p.rotation += p.vRot;
      p.opacity = Math.max(0, 1 - elapsed / 2500);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

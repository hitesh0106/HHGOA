/**
 * Use the live app at localhost:3000 to render a real Builder ID PNG
 * and save it to /home/z/my-project/download/sample-builder-id.png
 * for visual verification.
 *
 * Uses Playwright (already installed for agent-browser).
 */
import { chromium } from "playwright";
import { writeFileSync } from "fs";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Collect console errors
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  console.log("Loading app…");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Scroll to studio
  await page.evaluate(() => {
    document.getElementById("studio")?.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await page.waitForTimeout(1000);

  // Upload the test photo via the file input
  console.log("Uploading test photo…");
  const fileInputs = await page.locator('input[type="file"]').all();
  if (fileInputs.length === 0) {
    throw new Error("No file input found");
  }
  await fileInputs[0].setInputFiles("/home/z/my-project/upload/test-photo.jpg");
  await page.waitForTimeout(2000);

  // Fill form
  console.log("Filling form…");
  await page.locator('input[placeholder*="Aria"]').fill("Aria Mehra").catch(() => {});
  await page.locator('input[placeholder*="AI · LLM"]').fill("AI · LLM Tooling").catch(() => {});
  await page.waitForTimeout(1500);

  // Click Generate PNG
  console.log("Clicking Generate PNG…");
  await page.getByRole("button", { name: "Generate PNG" }).click().catch((e) => {
    console.error("Could not click Generate:", e.message);
  });
  await page.waitForTimeout(4000);

  // Grab the generated PNG via JS — find the rendered data URL
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

  // Write to file
  const buf = Buffer.from(dataUrl.split(",")[1], "base64");
  const out = "/home/z/my-project/download/sample-builder-id.png";
  writeFileSync(out, buf);
  console.log(`✓ Saved ${out} (${(buf.length / 1024).toFixed(1)} KB)`);

  // Also generate a Profile Frame version
  console.log("Switching to Profile Frame…");
  await page.getByRole("radio", { name: /Profile Frame/ }).click().catch(() => {});
  await page.waitForTimeout(1500);

  await page.getByRole("button", { name: "Generate PNG" }).click().catch(() => {});
  await page.waitForTimeout(3000);

  const pfDataUrl = await page.evaluate(async () => {
    const node = document.querySelector('div[style*="width: 1080"] > div');
    if (!node) return null;
    const mod = await import("https://esm.sh/html-to-image@1.11.13");
    return await mod.toPng(node, { pixelRatio: 1, cacheBust: true });
  });

  if (pfDataUrl) {
    const pfBuf = Buffer.from(pfDataUrl.split(",")[1], "base64");
    const pfOut = "/home/z/my-project/download/sample-profile-frame.png";
    writeFileSync(pfOut, pfBuf);
    console.log(`✓ Saved ${pfOut} (${(pfBuf.length / 1024).toFixed(1)} KB)`);
  }

  if (errors.length > 0) {
    console.log("\nConsole errors captured:");
    errors.forEach((e) => console.log("  -", e));
  } else {
    console.log("\nNo console errors.");
  }

  await browser.close();
})();

// Renders screensaver.html to an exact 1920x1080 PNG.
// Usage: node screensaver/render.js [--blank] [--no-plate] [out.png]
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const args = process.argv.slice(2);
  const q = new URLSearchParams();
  if (args.includes("--blank")) q.set("blank", "1");
  if (args.includes("--no-plate")) q.set("plate", "0");
  const out = args.find(a => a.endsWith(".png")) ||
    path.join(__dirname, "TechMahindra_Oracle_Partner_Award_2026_1920x1080.png");

  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.join(__dirname, "screensaver.html") + "?" + q.toString());
  await page.evaluate(() => window.__logosReady);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  await browser.close();
  console.log("Wrote", out);
})();

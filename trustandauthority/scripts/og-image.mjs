// Renders public/og-image.png (1200×630) from HTML. Re-run after changing copy:
//   node scripts/og-image.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const font = (n) => readFileSync(new URL(`../public/fonts/${n}.woff2`, import.meta.url)).toString('base64');

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
const html = `<!doctype html><html><head>
<style>
  @font-face{font-family:'Cormorant Garamond';src:url('data:font/woff2;base64,${font('cormorant-garamond-latin-400-normal')}')}
  @font-face{font-family:Jost;font-weight:500;src:url('data:font/woff2;base64,${font('jost-latin-500-normal')}')}
  html,body{margin:0;width:1200px;height:630px;background:#F6F1E8;color:#2A2420}
  .c{box-sizing:border-box;height:100%;padding:88px 96px;display:flex;flex-direction:column;justify-content:space-between;
     background:linear-gradient(#F6F1E8,#F6F1E8) padding-box;border-bottom:28px solid #0E3D3D}
  .mark{font-family:'Cormorant Garamond',Georgia,serif;font-size:40px}
  .mark span{color:#7E6318}
  h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:84px;line-height:1.05;margin:0;max-width:900px}
  .rule{width:72px;height:3px;background:#C49A2A;margin-bottom:36px}
  .sub{font-family:Jost,Arial,sans-serif;font-weight:500;font-size:22px;letter-spacing:.08em;text-transform:uppercase;color:#675D53}
</style></head><body><div class="c">
  <div class="mark">Trust <span>&amp;</span> Authority</div>
  <div><div class="rule"></div><h1>Courses that start with your own judgment.</h1></div>
  <div class="sub">On-demand courses &middot; Join the waitlist</div>
</div></body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' }).catch(() => {});
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out);

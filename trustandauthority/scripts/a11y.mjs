// Accessibility checks for the built site (WCAG 2.1 AA).
//   npm run build && npm run test:a11y
// Runs axe-core on every page, then checks: 320px reflow, 200% text zoom,
// keyboard order through the waitlist form, visible focus, and text errors.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = createServer(async (req, res) => {
  let p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try { if ((await stat(p)).isDirectory()) p = path.join(p, 'index.html'); } catch { p = path.join(root, '404.html'); }
  try { res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(await readFile(p)); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
let failures = 0;
const fail = (m) => { failures++; console.log('  ✗', m); };
const pass = (m) => console.log('  ✓', m);

async function axe(page) {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }));
}

for (const route of ['/', '/thanks/', '/404/']) {
  console.log(`\n${route}`);
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + route);
  const r = await axe(page);
  r.violations.length
    ? r.violations.forEach((v) => fail(`axe ${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)\n      ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n      ')}`))
    : pass(`axe: 0 violations (${r.passes.length} rules passed)`);
  const h1s = await page.locator('h1').count();
  h1s === 1 ? pass('exactly one H1') : fail(`${h1s} H1s`);
  await page.close();
}

console.log('\nReflow and zoom (/)');
{
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await page.goto(base + '/');
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  over <= 0 ? pass('320px wide: no sideways scrolling') : fail(`320px wide: ${over}px horizontal overflow`);
  await page.close();

  const zoom = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await zoom.goto(base + '/');
  await zoom.addStyleTag({ content: 'html{font-size:200%}' });
  const z = await zoom.evaluate(() => ({
    over: document.documentElement.scrollWidth - window.innerWidth,
    clipped: [...document.querySelectorAll('p,h1,h2,h3,label,button')].filter((el) => el.scrollWidth > el.clientWidth + 1).length,
  }));
  z.over <= 0 && !z.clipped ? pass('200% text size: no overflow or clipped text') : fail(`200% text: overflow ${z.over}px, ${z.clipped} clipped`);
  await zoom.close();
}

console.log('\nKeyboard and form (/)');
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + '/');
  const order = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    order.push(await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      return { label: el.id || el.textContent.trim().slice(0, 30), outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 };
    }));
  }
  const labels = order.map((o) => o.label);
  console.log('    tab order:', labels.join(' → '));
  const expected = ['Skip to content', 'Trust and Authority', 'hero-name', 'hero-email', 'hero-consent', 'Join the waitlist'];
  JSON.stringify(labels) === JSON.stringify(expected.map((e, i) => (i === 1 ? labels[1] : e)))
    ? pass('tab order: skip link → logo → name → email → consent → button')
    : fail('unexpected tab order');
  order.every((o) => o.outline) ? pass('2px focus outline on every stop') : fail('missing focus outline on some stop');

  // Submit empty with the keyboard: expect text errors and focus on first field
  await page.keyboard.press('Enter');
  const after = await page.evaluate(() => ({
    focus: document.activeElement.id,
    errors: [...document.querySelectorAll('#hero-name-error,#hero-email-error,#hero-consent-error')].filter((e) => !e.hidden).map((e) => e.textContent),
    described: document.getElementById('hero-name').getAttribute('aria-describedby'),
  }));
  after.errors.length === 3 && after.focus === 'hero-name' && after.described === 'hero-name-error'
    ? pass(`empty submit: 3 text errors, focus moved to first name, errors linked via aria-describedby`)
    : fail(`empty submit: ${JSON.stringify(after)}`);

  // Bad email only
  await page.fill('#hero-name', 'Ada');
  await page.fill('#hero-email', 'not-an-email');
  await page.check('#hero-consent');
  await page.click('form[data-source="hero"] button');
  const e2 = await page.evaluate(() => ({ focus: document.activeElement.id, nameErr: !document.getElementById('hero-name-error').hidden }));
  e2.focus === 'hero-email' && !e2.nameErr ? pass('bad email: error on email only, focus moved there') : fail(`bad email: ${JSON.stringify(e2)}`);
  const r = await axe(page);
  r.violations.length ? r.violations.forEach((v) => fail(`axe with errors showing: ${v.id}`)) : pass('axe: 0 violations with errors showing');
  await page.close();
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} problem(s) found.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);

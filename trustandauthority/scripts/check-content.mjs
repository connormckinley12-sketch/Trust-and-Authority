// Blocks a production deploy while any of Molly's decisions are still open.
// Netlify sets CONTEXT=production for the live site; deploy previews pass.
import { site } from '../src/data/site.js';

const strict = process.env.CONTEXT === 'production' || process.env.STRICT_CONTENT === '1';

const required = {
  headline: 'Pick a headline (A, B, C, or her own)',
  launchWindow: 'Set a launch window for course 1',
  pricingAnswer: 'Decide pricing, or "Announced at launch."',
  photo: 'Hero photo of Molly',
  aboutBio: 'Confirm Meredith title and the Center’s official name (aboutBio)',
  aboutQuote: '"Why I teach this" lines (aboutQuote)',
};

const missing = Object.entries(required).filter(([k]) => site[k] == null);

if (!missing.length) {
  console.log('✓ All launch content is filled in.');
  process.exit(0);
}

console.log(`\n${missing.length} item(s) still waiting on Molly (src/data/site.js):`);
for (const [k, label] of missing) console.log(`  • ${k}: ${label}`);

if (strict) {
  console.error('\n✗ Production build stopped so placeholder text never goes live.\n');
  process.exit(1);
}
console.log('\nPreview build: these show as highlighted markers on the page.\n');

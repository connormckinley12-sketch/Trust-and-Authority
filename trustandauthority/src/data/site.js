// ─────────────────────────────────────────────────────────────
// Everything Molly still has to decide lives in this file.
//
// A value of `null` means "not decided yet". While anything is null:
//   • `npm run dev` and Netlify deploy previews show a highlighted
//     [Molly to supply] marker in its place, so it is easy to review.
//   • A production build (CONTEXT=production on Netlify, or STRICT_CONTENT=1)
//     FAILS, so placeholder text can never go live. See scripts/check-content.mjs.
// ─────────────────────────────────────────────────────────────

export const site = {
  url: 'https://trustandauthority.com',
  name: 'Trust & Authority',

  // Pick A, B, C from the brief, or write your own.
  //   A: "You have an idea. Do you trust it?"
  //   B: "Before you build it, learn to hear it."
  //   C: "Hear the whisper through the noisy crowd."
  headline: null,

  // e.g. "spring 2027". Used in the closing heading and the FAQ.
  launchWindow: null,

  // FAQ "What does it cost?" — a price, or "Announced at launch."
  pricingAnswer: null,

  // Hero / About photo. Drop the file in /public/images/ and set:
  //   { src: '/images/molly.jpg', alt: 'Molly McKinley …', width: 1200, height: 1500 }
  // Currently loads from Molly's Squarespace site. Before launch, save the file
  // to /public/images/molly.jpg and change src to '/images/molly.jpg'.
  photo: {
    src: 'https://images.squarespace-cdn.com/content/v1/6282a8b7c39f863cd10f8ece/bcdc28c9-9630-40f3-a04d-3595eaaff4b4/molly.jpg?format=1500w',
    alt: 'Molly McKinley smiling, holding a copy of her book, The Intentional Business',
    width: 1245,
    height: 1865,
  },

  // Confirm exact title and the Center's official name.
  aboutBio: null,
  // Draft from the brief (typos fixed), for Molly to confirm or rewrite:
  aboutBioDraft:
    'Molly McKinley teaches entrepreneurship and innovation at Meredith College, where she is the founding director of the Center for Entrepreneurial Impact. She is the author of The Intentional Business, the founder of Redtail Creative, and a 500-hour trained yoga teacher with 25+ years in marketing, PR, and brand building.',

  // Molly's "why I teach this" lines, in her words.
  aboutQuote: null,
  aboutQuoteDraft:
    "I was the kid selling lemonade on the corners and have helped launch numerous businesses. Through this experience, I'm able to help you get your idea out of your head and into the world.",

  // Only flip to true once written permission is on file
  // (and Meredith's policy on student statements is checked).
  studentQuotePermission: false,
  studentQuote:
    "I've never thought of myself as an entrepreneur, but I am a problem solver and I can build this.",

  // Optional: Molly's public profile URLs for Person schema (LinkedIn, Meredith page, etc.)
  sameAs: [],

  // Privacy-friendly analytics. Set PUBLIC_PLAUSIBLE_DOMAIN in Netlify env vars
  // (e.g. "trustandauthority.com") to switch it on. Off when unset.
};

export const courses = [
  {
    value: 'hearing-the-whisper',
    title: 'Hearing the Whisper',
    body: 'The inner work. Quiet the noise, notice what you actually believe, and learn to tell a pattern from a wish.',
  },
  {
    value: 'understanding-the-problem',
    title: 'Understanding the Problem',
    body: 'Design thinking. Sit with the problem long enough to understand it before you rush to a solution.',
  },
  {
    value: 'talking-to-customers',
    title: 'Talking to Customers',
    body: "Customer discovery. Learn who to ask, how to ask without leading, and how to hear the answer you didn't want.",
  },
  {
    value: 'idea-or-opportunity',
    title: 'Idea or Opportunity?',
    body: 'The market and the money. Reach a decision, including the decision not to build.',
  },
];

export const seo = {
  title: 'Trust & Authority: Courses for trusting your own business idea',
  description:
    'On-demand courses that start with your own judgment. Quiet the noise, find the problem worth solving, and find out whether your idea is a real opportunity. Join the waitlist.',
};

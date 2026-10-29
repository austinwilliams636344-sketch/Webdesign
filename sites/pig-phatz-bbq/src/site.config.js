// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT: Pig Phatz BBQ, Garden City, KS (concept / pitch demo).
// Facts: the business details supplied for the Lovable build (Phatz Smokehouse Showcase): address, phone,
// owners, menu, Google rating and review excerpts. See research/research.json for sources and conflicts.
// Still to confirm with the owners: weekly hours, prices.
// Film + images: AI-generated concept keyframes (film/keyframes), animated for free (no video model).
// Field-by-field documentation: references/config.md in the cinematic-site skill.
// ─────────────────────────────────────────────────────────────────────────────
import {
  Flame, MapPin, Beef, Drumstick, Soup, Users, Star, Heart,
  Package, Ham, Sandwich, CakeSlice,
} from 'lucide-react'

// Catering planner maths: planning quantities only, never prices (Pig Phatz hasn't published any).
// Common BBQ catering rule of thumb: about 1/3 lb of cooked meat and 1/4 lb of sides per guest.
function cateringPlan(guests) {
  const meat = Math.ceil((guests / 3) / 5) * 5
  const sides = Math.ceil((guests / 4) / 5) * 5
  const meats = guests < 40 ? 2 : guests < 120 ? 3 : 4
  return { meat, sides, meats, pans: Math.max(1, Math.ceil(guests / 25)) }
}

const PHONE = '(620) 295-0113'

export default {
  meta: {
    title: 'Pig Phatz BBQ: Slow-smoked BBQ in Garden City, KS',
    description: 'Family-owned BBQ on Spruce St in Garden City, KS. Slow-smoked brisket, pork belly burnt ends, ribs and pulled pork, huge portions and catering. Rated 4.7 from 88 Google reviews.',
  },

  brand: {
    name: 'Pig Phatz', // bold sans part of the logo
    accent: 'BBQ', // serif italic part of the logo
    logo: 'initial', // swap for 'img/logo.jpg' once the bulldog logo file is added to public/img
    legalName: 'Pig Phatz BBQ LLC',
    phone: PHONE,
    phoneHref: '+16202950113',
    email: '',
    area: 'Garden City, Kansas',
    hours: 'Call for today’s hours', // weekly hours not confirmed yet
    address: ['210 E Spruce St', 'Garden City, KS 67846'],
    since: null,
  },

  nav: {
    links: [
      { label: 'The smoke', href: '#home' },
      { label: 'Catering', href: '#process' },
      { label: 'Menu', href: '#services' },
      { label: 'Reviews', href: '#reviews' },
    ],
    cta: 'Plan catering',
    mobileCta: 'Plan your catering',
  },

  hero: {
    eyebrow: 'Family-owned · 210 E Spruce St · Garden City, KS',
    lines: ['Smoked', 'low &'],
    flourish: 'slow.',
    sub: 'Brisket, pork belly burnt ends, ribs and pulled pork, in huge portions, from Frankie & Beth on Spruce St. Feeding a crowd? We cater.',
    meta: [
      { icon: Star, text: '4.7 from 88 Google reviews', filled: true },
      { icon: Heart, text: 'Family-owned & operated' },
      { icon: Users, text: 'Dine in · Take out · Catering' },
    ],
    scrollCue: 'Scroll — from the pit to your plate',
  },

  // Hero form: a catering planner (quantities, not prices).
  quote: {
    eyebrow: 'Catering planner',
    title: 'How much BBQ does your crowd need?',
    doneTitle: 'Your plan is on its way',
    field: { label: 'Event date & town', placeholder: 'e.g. Sat, June 14 · Garden City', autoComplete: 'off' },
    slider: { label: 'Guests', min: 10, max: 300, step: 5, default: 50, format: (v) => `${v} guests` },
    estimate: (v) => {
      const p = cateringPlan(v)
      return [
        { label: 'Smoked meat to plan for', value: `≈ ${p.meat} lb`, highlight: true },
        { label: 'Sides', value: `≈ ${p.sides} lb` },
        { label: 'Suggested meats', value: `${p.meats} kinds` },
        { label: 'Full pans', value: `≈ ${p.pans}` },
      ]
    },
    mobileHint: (v) => `≈ ${cateringPlan(v).meat} lb of meat`,
    cta: 'Plan my order',
    submit: 'Send my catering request',
    sending: 'Sending…',
    privacy: 'Planning estimate only. Frankie & Beth confirm the menu, portions and pricing with you directly.',
    doneText: `Pig Phatz will reach out to plan your menu. Want to talk now? Call ${PHONE}.`,
  },

  chapters: [
    {
      eyebrow: '01 — The pit',
      title: 'It starts',
      flourish: 'with smoke.',
      body: 'Frankie and Beth, the husband-and-wife team behind Pig Phatz, put the meat on the smoker long before you walk in. Then they come out to greet you themselves.',
      aside: { type: 'stat', value: '4.7★', text: 'from 88 Google reviews. Guests keep mentioning the huge portions.' },
    },
    {
      eyebrow: '02 — Anatomy of a brisket',
      title: 'Bark outside.',
      flourish: 'Tender inside.',
      body: 'The crowd favorite is built in layers. Each one is the reason people come back for the next slice.',
      aside: {
        type: 'list',
        items: [
          { t: 'The bark', d: 'Rub and smoke, set into a dark crust' },
          { t: 'The smoke ring', d: 'The pink band hours on the pit leave' },
          { t: 'The fat cap', d: 'Rendered down to keep every slice juicy' },
          { t: 'The flat', d: 'Tender slices, cut across the grain' },
          { t: 'The point', d: 'Cubed and caramelized into burnt ends' },
        ],
      },
    },
    {
      eyebrow: '03 — Your table',
      title: 'Off the pit.',
      flourish: 'Onto your plate.',
      body: 'Pull up a chair on Spruce St, take it to go, or let Frankie & Beth bring the smoke to your party, office lunch or celebration.',
      aside: { type: 'stats', items: [['4.7★', 'on Google'], ['88', 'reviews'], ['$10–20', 'typical per person']] },
    },
  ],

  // Measured from the 4 keyframes (references/film-pipeline.md → "Framing").
  filmSubjects: {
    hero: [0.24, 0.2, 0.92, 0.97], // K1: the smoker
    ch1: [0.22, 0.17, 0.92, 0.82], // K2: the floating brisket + smoke
    ch2: [0.26, 0.05, 0.74, 0.95], // K3: the exploded layers
    ch3: [0.08, 0.45, 0.94, 0.9], // K4: the tray
  },

  // The film is in (public/frames/main), so no stills needed.
  stills: [],

  marquee: ['Brisket', 'Pork belly burnt ends', 'Ribs', 'Pulled pork', 'Chicken wings', 'Creamy mac & cheese', 'Beth’s cobbler', 'Catering'],
  marqueeIcon: Flame,

  pillars: {
    eyebrow: 'Family-owned & operated',
    title: 'Good BBQ.',
    flourish: 'Even better people.',
    stats: [
      { end: 4.7, decimals: 1, suffix: '★', label: 'Average Google rating' },
      { end: 88, label: 'Google reviews' },
      { end: 6, label: 'Smoked meats on the menu' },
      { end: 20, prefix: '$10–', label: 'Typical per person' },
    ],
  },

  features: [
    {
      kind: 'notifications',
      k: 'Order',
      t: 'Dine in or take it home',
      d: `Call ${PHONE} to order ahead, or pull up a chair and let Frankie & Beth say hi.`,
      items: [
        { icon: Beef, t: 'Brisket is sliced', d: 'Fresh off the smoker' },
        { icon: Ham, t: 'Pork belly burnt ends', d: 'Caramelized and ready' },
        { icon: Package, t: 'Your to-go order is up', d: 'Ready for pickup on Spruce St' },
      ],
    },
    {
      kind: 'signature',
      k: 'Smoke',
      t: 'Hours on the pit, not minutes',
      d: 'Big cuts need low heat and patience. That is where the bark and the smoke ring come from.',
      particle: 'spark',
      surface: 'line',
      counter: { label: 'On the pit', unit: 'hrs', start: 11.5, step: 0.01, decimals: 2 },
    },
    {
      kind: 'booking',
      k: 'Cater',
      t: 'Catering, booked in a minute',
      d: 'Events, parties, corporate lunches and celebrations of life. Tell us the date and headcount.',
      heading: 'Next weekend',
      note: 'Catering request',
      confirm: 'Saturday 4:00 PM · 60 guests · request sent',
    },
  ],

  calculator: null, // no published prices, so no honest price calculator

  process: {
    eyebrow: 'Catering with Pig Phatz',
    title: 'Feeding a crowd?',
    flourish: 'We’ve got you.',
    text: 'Events. Parties. Corporate lunches. Celebrations of life. Bring your people. We’ll bring the BBQ.',
    steps: [
      { t: 'Call', f: 'and tell us the plan.', d: 'Date, headcount and what your crowd likes. Use the planner above for a starting point.', img: 'img/k2.jpg', meta: [PHONE, 'Or use the form below'] },
      { t: 'Pick', f: 'your meats and sides.', d: 'Brisket, pork belly burnt ends, ribs, pulled pork, wings. Mac & cheese, potato salad, Beth’s cobbler.', img: 'img/k3.jpg', meta: ['6 smoked meats', 'Homemade sides'] },
      { t: 'Smoke', f: 'low and slow.', d: 'Your order goes on the pit ahead of time, so it comes off right when you need it.', img: 'img/k1.jpg', meta: ['Smoked for your event', 'Big portions'] },
      { t: 'Serve', f: 'and take the credit.', d: 'One catering customer called them “so professional and easygoing.” Then watch the pans empty.', img: 'img/k4.jpg', meta: ['Personal quote', 'No payment to ask'] },
    ],
  },

  services: {
    eyebrow: 'Straight from the smoker',
    title: 'Signature smoke.',
    flourish: 'Homemade sides.',
    images: [
      { src: 'img/svc-fire.jpg', alt: 'Fire in the smoker firebox' },
      { src: 'img/svc-tray.jpg', alt: 'Tray of brisket, ribs, burnt ends and pulled pork' },
    ],
    items: [
      { icon: Beef, t: 'Brisket', d: 'The crowd favorite: rich bark, tender slices. Also piled on a loaded brisket baked potato.' },
      { icon: Flame, t: 'Pork belly burnt ends', d: 'Smoky, juicy bites with a caramelized finish. Every bite hits.' },
      { icon: Ham, t: 'Ribs & smoked pork belly', d: 'Slow-smoked, saucy and made for getting your hands messy.' },
      { icon: Sandwich, t: 'Pulled pork', d: 'Tender and smoky. Even better with the house BBQ sauce.' },
      { icon: Drumstick, t: 'Chicken wings', d: 'Big smoke flavor in every wing. Bring your appetite.' },
      { icon: CakeSlice, t: 'Sides & Beth’s cobbler', d: 'Creamy mac & cheese, homemade fries, fried pickles, potato salad, and Beth’s homemade cobbler.' },
    ],
  },

  reviews: {
    eyebrow: 'Rated 4.7 from 88 Google reviews',
    title: 'The people',
    flourish: 'have spoken.',
    // Real Google review excerpts (from the Lovable build's supplied content).
    items: [
      { q: 'The best BBQ I’ve ever eaten. The brisket is amazing, as are the burnt ends.', n: 'Carlos N.', p: 'Google review' },
      { q: 'I’ve been looking for good pork belly for quite some time. I finally found it at Pig Phatz!', n: 'Adam S.', p: 'Google review' },
      { q: 'Fantastic food, cooked perfectly and quickly! The portion sizes are huge!', n: 'Chris O.', p: 'Google review' },
      { q: 'They catered an event I helped with — so professional and easygoing. The food was incredibly delicious.', n: 'Robyn M.', p: 'Google review · catering' },
      { q: 'The Mac n cheese is so creamy… the pork belly is juicy and flavorful.', n: 'Kristie M.', p: 'Google review' },
      { q: 'Beth’s cobbler is nothing short of amazing.', n: 'Roman S.', p: 'Google review' },
    ],
    trust: [
      { icon: Heart, t: 'Family-owned', d: 'Frankie & Beth come out to greet you personally' },
      { icon: MapPin, t: '210 E Spruce St', d: 'Garden City, KS 67846 · dine in or take out' },
      { icon: Users, t: 'Catering for any crowd', d: 'Events, parties, corporate lunches, celebrations of life' },
    ],
  },

  contact: {
    eyebrow: 'Catering & large orders',
    title: 'Let’s feed',
    flourish: 'your people.',
    text: 'Share a few details and Frankie & Beth will get the catering conversation started. You’ll work out the menu and pricing together.',
    image: 'img/k4.jpg',
    fields: ['Full name', 'Email', 'Phone'],
    interestLabel: 'What’s the occasion?',
    interests: ['Party or celebration', 'Corporate event', 'Celebration of life', 'A large to-go order', 'Something else'],
    messagePlaceholder: 'Date, headcount, venue, favorite meats and sides…',
    upload: null,
    submit: 'Request a catering quote',
    successTitle: 'You bring the people. We’ll talk BBQ.',
    successText: `This is a quote request, not a confirmed booking. Want to talk now? Call ${PHONE}.`,
  },

  footer: {
    blurb: 'Family-owned BBQ on Spruce St in Garden City, KS. Slow-smoked brisket, pork belly burnt ends, ribs and pulled pork, huge portions, homemade sides and catering.',
    status: '',
    services: ['Brisket', 'Pork belly burnt ends', 'Ribs', 'Catering'],
    watermark: 'pig phatz',
    note: 'Concept website.',
  },
}

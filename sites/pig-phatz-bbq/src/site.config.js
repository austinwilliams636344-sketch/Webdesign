// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT: Pig Phatz BBQ, Garden City, KS (concept / pitch demo).
// Facts come from research/research.json (public listings found by search). The business has no website;
// anything marked [PLACEHOLDER] is waiting on the owner (real reviews, confirmed hours).
// Film + images: AI-generated concept keyframes (film/keyframes), animated for free (no video model).
// Field-by-field documentation: references/config.md in the cinematic-site skill.
// ─────────────────────────────────────────────────────────────────────────────
import {
  Flame, MapPin, UtensilsCrossed, Beef, Drumstick, Soup, Users, Clock,
  Package, Ham, Sandwich,
} from 'lucide-react'

// Catering planner maths: planning quantities only, never prices (Pig Phatz hasn't published any).
// Common BBQ catering rule of thumb: about 1/3 lb of cooked meat and 1/4 lb of sides per guest.
function cateringPlan(guests) {
  const meat = Math.ceil((guests / 3) / 5) * 5
  const sides = Math.ceil((guests / 4) / 5) * 5
  const meats = guests < 40 ? 2 : guests < 120 ? 3 : 4
  return { meat, sides, meats, pans: Math.max(1, Math.ceil(guests / 25)) }
}

export default {
  meta: {
    title: 'Pig Phatz BBQ: Smoked meats in downtown Garden City, KS',
    description: 'Brisket, burnt ends, ribs, pulled pork and pork belly, smoked at Pig Phatz BBQ inside the Main Street Food & Brew Hall, 207 N Main St, Garden City, KS. Catering available.',
  },

  brand: {
    name: 'Pig Phatz', // bold sans part of the logo
    accent: 'BBQ', // serif italic part of the logo
    logo: 'initial',
    legalName: 'Pig Phatz BBQ LLC',
    phone: '(620) 640-1007',
    phoneHref: '+16206401007',
    email: '',
    area: 'Garden City, Kansas',
    hours: 'Call for today’s hours', // listings disagree (Thu–Sun vs Tue–Sun, 11 AM–9 PM): confirm with the owner
    address: ['207 N Main St', 'Garden City, KS 67846'],
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
    eyebrow: 'Main Street Food & Brew Hall · Garden City, KS',
    lines: ['Smoked', 'low &'],
    flourish: 'slow.',
    sub: 'Brisket, burnt ends, ribs, pulled pork and pork belly, straight off the pit in downtown Garden City. Feeding a crowd? We cater.',
    meta: [
      { icon: Flame, text: '7 smoked meats', filled: true },
      { icon: MapPin, text: '207 N Main St' },
      { icon: UtensilsCrossed, text: 'Catering available' },
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
    privacy: 'Planning estimate only. Pig Phatz confirms quantities, menu and pricing with you directly.',
    doneText: 'Pig Phatz will reach out to confirm your menu, quantities and pickup or setup.',
  },

  chapters: [
    {
      eyebrow: '01 — The pit',
      title: 'It starts',
      flourish: 'with smoke.',
      body: 'Before the doors open at the Food & Brew Hall, the meat is already on the smoker. Time, heat and smoke do the work.',
      aside: { type: 'stat', value: '7', text: 'smoked meats on the menu, from brisket and ribs to pork belly and chicken legs.' },
    },
    {
      eyebrow: '02 — Anatomy of a brisket',
      title: 'Bark outside.',
      flourish: 'Tender inside.',
      body: 'A smoked brisket is built in layers. Each one is the reason people come back for the next slice.',
      aside: {
        type: 'list',
        items: [
          { t: 'The bark', d: 'Rub and smoke, set into a dark crust' },
          { t: 'The smoke ring', d: 'The pink band hours on the pit leave' },
          { t: 'The fat cap', d: 'Rendered down to keep every slice juicy' },
          { t: 'The flat', d: 'Lean slices, cut across the grain' },
          { t: 'The point', d: 'Cubed, sauced and smoked again: burnt ends' },
        ],
      },
    },
    {
      eyebrow: '03 — Your table',
      title: 'Off the pit.',
      flourish: 'Onto your plate.',
      body: 'Grab a tray at the hall on North Main, or let Pig Phatz bring the smoke to your party, office or game day.',
      aside: { type: 'stats', items: [['7', 'smoked meats'], ['4', 'kitchens in the hall'], ['11 AM', 'doors open']] },
    },
  ],

  // Measure from the 4 keyframes once the film exists (references/film-pipeline.md → "Framing").
  filmSubjects: {
    hero: [0.24, 0.2, 0.92, 0.97], // K1: the smoker
    ch1: [0.22, 0.17, 0.92, 0.82], // K2: the floating brisket + smoke
    ch2: [0.26, 0.05, 0.74, 0.95], // K3: the exploded layers
    ch3: [0.08, 0.45, 0.94, 0.9], // K4: the tray
  },

  // The film is in (public/frames/main), so no stills needed.
  stills: [],

  marquee: ['Brisket', 'Burnt ends', 'Ribs', 'Pulled pork', 'Pork belly', 'Wings', 'Chicken legs', 'Catering'],
  marqueeIcon: Flame,

  pillars: {
    eyebrow: 'Downtown Garden City',
    title: 'Real smoke,',
    flourish: 'right on Main Street.',
    stats: [
      { end: 7, label: 'Smoked meats on the menu' },
      { end: 207, prefix: '', label: 'North Main Street, downtown' },
      { end: 4, label: 'Kitchens in the Food & Brew Hall' },
      { end: 11, suffix: ' AM', label: 'Doors open (call to confirm days)' },
    ],
  },

  features: [
    {
      kind: 'notifications',
      k: 'Order',
      t: 'Your order, called out hot',
      d: 'Order at the counter or call ahead, then grab a seat in the hall while it comes off the pit.',
      items: [
        { icon: Beef, t: 'Brisket is sliced', d: 'Fresh off the smoker' },
        { icon: Ham, t: 'Burnt ends are back', d: 'While the batch lasts' },
        { icon: Package, t: 'Catering order packed', d: 'Ready for pickup' },
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
      d: 'Pick a date, tell us the headcount and we’ll come back with a menu that feeds everyone.',
      heading: 'Next weekend',
      note: 'Catering request',
      confirm: 'Saturday 4:00 PM · 60 guests · request sent',
    },
  ],

  calculator: null, // no published prices, so no honest price calculator

  process: {
    eyebrow: 'Catering with Pig Phatz',
    title: 'Feeding a crowd',
    flourish: 'without the stress.',
    text: 'Birthdays, office lunches, game days and reunions. Four steps from first call to empty pans.',
    steps: [
      { t: 'Call', f: 'and tell us the plan.', d: 'Date, headcount and what your crowd likes. Use the planner above for a starting point.', img: 'img/k2.jpg', meta: ['(620) 640-1007', 'Or message on Facebook'] },
      { t: 'Pick', f: 'your meats and sides.', d: 'Brisket, burnt ends, ribs, pulled pork, pork belly, wings, chicken. Mix and match.', img: 'img/k3.jpg', meta: ['7 smoked meats', 'Sides to match'] },
      { t: 'Smoke', f: 'low and slow.', d: 'Your order goes on the pit ahead of time, so it comes off right when you need it.', img: 'img/k1.jpg', meta: ['Smoked to order', 'Packed hot'] },
      { t: 'Serve', f: 'and take the credit.', d: 'Pick it up downtown or ask about setup. Then watch the pans empty.', img: 'img/k4.jpg', meta: ['Pickup on Main St', 'Ask about setup'] },
    ],
  },

  services: {
    eyebrow: 'On the menu',
    title: 'Seven meats.',
    flourish: 'One pit.',
    images: [
      { src: 'img/svc-fire.jpg', alt: 'Fire in the smoker firebox' },
      { src: 'img/svc-tray.jpg', alt: 'Tray of brisket, ribs, burnt ends and pulled pork' },
    ],
    items: [
      { icon: Beef, t: 'Brisket', d: 'Sliced across the grain, with real bark and a deep smoke ring.' },
      { icon: Flame, t: 'Burnt ends', d: 'Cubes from the brisket point, smoked twice. Go early.' },
      { icon: Ham, t: 'Ribs & pork belly', d: 'Pork done two ways: ribs off the bone and rich, rendered belly.' },
      { icon: Sandwich, t: 'Pulled pork', d: 'Smoked shoulder, pulled by hand. On a plate or a bun.' },
      { icon: Drumstick, t: 'Wings & chicken legs', d: 'Smoked chicken for the crowd that wants something lighter.' },
      { icon: Soup, t: 'Sides', d: 'Apple pie baked beans and homemade fries, two sides customers keep mentioning.' },
    ],
  },

  reviews: {
    eyebrow: 'Garden City, in their words',
    title: 'Come hungry.',
    flourish: 'Leave happy.',
    // REAL reviews only. Paste the owner's best Google / Facebook reviews here (quote, first name, what they ordered).
    items: [
      { q: '[PLACEHOLDER: paste a real customer review here]', n: '[First name 1]', p: 'Google review' },
      { q: '[PLACEHOLDER: paste a real customer review here]', n: '[First name 2]', p: 'Facebook review' },
      { q: '[PLACEHOLDER: paste a real catering review here]', n: '[First name 3]', p: 'Catering customer' },
    ],
    trust: [
      { icon: MapPin, t: 'Downtown on Main', d: 'Inside the Main Street Food & Brew Hall, 207 N Main St' },
      { icon: Users, t: 'Catering for any crowd', d: 'Parties, offices, teams and family reunions' },
      { icon: Clock, t: 'Doors open at 11 AM', d: 'Call (620) 640-1007 to confirm today’s hours' },
    ],
  },

  contact: {
    eyebrow: 'Catering & large orders',
    title: 'Got a crowd',
    flourish: 'to feed?',
    text: 'Tell us the date, the headcount and what you’re celebrating. Pig Phatz will get back to you to plan the menu.',
    image: 'img/k4.jpg',
    fields: ['Full name', 'Email', 'Phone'],
    interestLabel: 'I’m asking about…',
    interests: ['Catering for an event', 'A large pickup order', 'The menu', 'Something else'],
    messagePlaceholder: 'Date, headcount, pickup or setup, favorite meats…',
    upload: null,
    submit: 'Send my request',
    successTitle: 'Got it. Fire’s lit.',
    successText: 'Pig Phatz will reach out to plan your order. Need it sooner? Call (620) 640-1007.',
  },

  footer: {
    blurb: 'Brisket, burnt ends, ribs, pulled pork and more, smoked in downtown Garden City at the Main Street Food & Brew Hall. Catering available.',
    status: '',
    services: ['Brisket', 'Burnt ends', 'Ribs & pork belly', 'Catering'],
    watermark: 'pig phatz',
    note: 'Concept website.',
  },
}

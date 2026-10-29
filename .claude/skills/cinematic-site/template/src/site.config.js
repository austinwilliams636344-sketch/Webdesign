// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT: the only file a new client normally needs (plus theme.js, the
// images in public/img and the film frames in public/frames).
// Everything here is the worked example: Aurea Solar, a premium Nordic solar installer.
// Field-by-field documentation: references/config.md in the cinematic-site skill.
// ─────────────────────────────────────────────────────────────────────────────
import {
  Star, Home, ShieldCheck, Sun, BatteryCharging, PlugZap, Building2, Gauge, Wrench,
  Zap, Award, Leaf,
} from 'lucide-react'

const eur = (n) => `€${Math.round(n).toLocaleString('en-US')}`

// Shared sizing maths for the quote form and the calculator (industry-specific).
function solarEstimate(bill) {
  const kwh = (bill * 12) / 0.32
  const kwp = Math.max(3, Math.min(20, Math.round(((kwh * 0.85) / 950) * 2) / 2))
  const savings = Math.round(bill * 12 * 0.78)
  const cost = kwp * 1350 + 5200
  return { kwp, panels: Math.round(kwp / 0.43), savings, payback: (cost / savings).toFixed(1) }
}

export default {
  meta: {
    title: 'Aurea Solar — Energy, engineered from light',
    description: 'Premium residential solar, battery storage and EV charging. Designed, installed and monitored by Aurea Solar.',
  },

  brand: {
    name: 'Aurea', // bold sans part of the logo
    accent: 'solar', // serif italic part of the logo ('' to hide)
    logo: 'sun', // 'sun' | 'initial' (a rounded monogram of the first letter) | path to an image in /public
    legalName: 'Aurea Solar ApS',
    phone: '+45 70 20 20 11',
    phoneHref: '+4570202011',
    email: 'hello@aureasolar.example',
    area: 'Copenhagen · Aarhus · Odense',
    hours: 'Mon–Fri 08–18 · Sat 10–14',
    address: ['Refshalevej 163', '1432 Copenhagen K'],
    since: 2011,
  },

  nav: {
    links: [
      { label: 'How it works', href: '#home' },
      { label: 'Savings', href: '#calculator' },
      { label: 'Process', href: '#process' },
      { label: 'Services', href: '#services' },
      { label: 'Reviews', href: '#reviews' },
    ],
    cta: 'Free design',
    mobileCta: 'Get a free design',
  },

  hero: {
    eyebrow: 'Solar · Storage · EV charging — since 2011',
    lines: ['Energy,', 'engineered'], // big sans lines (keep each line short: 1 word ideally)
    flourish: 'from light.', // serif italic gradient line
    sub: 'Premium solar systems designed around your home, installed by our own certified crews and monitored for 25 years.',
    meta: [
      { icon: Star, text: '4.9 from 1,840 reviews', filled: true },
      { icon: Home, text: '3,200+ homes powered' },
      { icon: ShieldCheck, text: '25-year warranty' },
    ],
    scrollCue: 'Scroll — see how solar works',
  },

  // Two-step lead form in the hero.
  quote: {
    eyebrow: 'Free solar design',
    title: 'See what your roof can earn',
    doneTitle: 'Your estimate is ready',
    field: { label: 'Home address', placeholder: 'Street, postcode, city', autoComplete: 'street-address' },
    slider: { label: 'Monthly electricity bill', min: 40, max: 600, step: 10, default: 180, format: (v) => `€${v}` },
    // Live preview under the slider (first 2 shown) and the result cards after submit (all shown).
    estimate: (v) => {
      const e = solarEstimate(v)
      return [
        { label: 'Estimated savings', value: `${eur(e.savings)}/yr`, highlight: true },
        { label: 'Suggested system', value: `${e.kwp} kWp` },
        { label: 'Panels', value: `${e.panels} × 430 W` },
        { label: 'Payback', value: `${e.payback} years` },
      ]
    },
    mobileHint: (v) => `save ${eur(solarEstimate(v).savings)}/yr`,
    cta: 'Design my system',
    submit: 'Get my free design',
    sending: 'Designing…',
    privacy: 'No spam, no pushy sales calls. A solar engineer replies within 24 h.',
    doneText: 'An engineer is drafting your 3D roof layout. Expect it in your inbox within 24 hours.',
  },

  // Scroll-film chapters. The film itself: public/frames/<film>/... (see frames.js).
  chapters: [
    {
      eyebrow: '01 — Lift-off',
      title: 'It begins',
      flourish: 'on your roof.',
      body: 'Every Aurea system starts with a millimetre-accurate drone survey of your roof, shading and energy use, so every single panel earns its place.',
      aside: { type: 'stat', value: '1 hour', text: 'of sunlight on Earth holds more energy than humanity uses in a year.' },
    },
    {
      eyebrow: '02 — Inside the panel',
      title: 'Light in.',
      flourish: 'Electrons out.',
      body: 'Photons strike the silicon and knock electrons loose. Hair-thin silver busbars collect them as direct current, silently, for 30+ years.',
      aside: {
        type: 'list', // 4–6 short items, appear while the subject is "explained"
        items: [
          { t: 'Tempered AR glass', d: '3.2 mm · 96% light transmission' },
          { t: 'EVA encapsulant', d: 'UV-stable, seals out moisture' },
          { t: 'N-type TOPCon cells', d: '23.8% module efficiency' },
          { t: 'Insulating backsheet', d: 'Dual-layer, fire class A' },
          { t: 'Anodised aluminium frame', d: 'Rated to 5,400 Pa snow load' },
          { t: 'IP68 junction box', d: 'Bypass diodes beat shade loss' },
        ],
      },
    },
    {
      eyebrow: '03 — Power',
      title: 'Sunlight by day.',
      flourish: 'Your own power by night.',
      body: 'An inverter turns DC into clean household AC. A home battery banks the surplus, so your lights stay on after sunset.',
      aside: { type: 'stats', items: [['−78%', 'average grid bill'], ['13.5', 'kWh home battery'], ['25 yr', 'warranty']] },
    },
  ],

  // Where the film's subject sits in each keyframe, as fractions of the frame [x0, y0, x1, y1].
  // Measure these from the 4 keyframes (references/film-pipeline.md → "Framing").
  filmSubjects: {
    hero: [0.25, 0.12, 0.85, 0.9], // keyframe 1: the building/scene
    ch1: [0.06, 0.2, 0.94, 0.8], // keyframe 2: the isolated object in the void
    ch2: [0.1, 0.05, 0.9, 0.95], // keyframe 3: the exploded / explained object
    ch3: [0.24, 0.2, 0.88, 0.86], // keyframe 4: the finished scene
  },

  // Shown instead of the film until one is extracted (e.g. real photos or K1–K4 stills). 1–4 images:
  // hero, chapter 1, 2, 3. Leave [] when a film exists; the film always wins.
  stills: [],

  marquee: ['Tier-1 N-type modules', 'Certified in-house crews', '25-year performance warranty', 'Drone-surveyed designs', 'Live app monitoring', 'Home battery storage', 'EV charging', 'Fixed-price quotes'],
  marqueeIcon: Sun,

  pillars: {
    eyebrow: 'Fifteen years in the sun',
    title: 'Quietly powering',
    flourish: 'thousands of homes.',
    stats: [
      { end: 3214, suffix: '+', label: 'Homes generating today' },
      { end: 48.6, decimals: 1, suffix: ' MW', label: 'Solar capacity installed' },
      { end: 4.9, decimals: 1, suffix: '★', label: 'Average from 1,840 reviews' },
      { end: 31, suffix: 'k t', label: 'CO₂ avoided every year' },
    ],
  },

  // Three animated cards. kinds: 'notifications' | 'signature' | 'booking'
  features: [
    {
      kind: 'notifications',
      k: 'Monitor',
      t: 'Your roof, live in your pocket',
      d: 'Every panel reports in real time. You get a nudge when the battery is full or the grid pays you back.',
      items: [
        { icon: BatteryCharging, t: 'Battery full', d: 'Stored 13.5 kWh for tonight' },
        { icon: Zap, t: 'Exported 6.2 kWh', d: 'Earned €1.86 from the grid today' },
        { icon: Gauge, t: 'Peak output 9.4 kW', d: 'Best day this month' },
      ],
    },
    {
      kind: 'signature',
      k: 'Generate',
      t: 'Every photon, accounted for',
      d: 'N-type cells keep harvesting on grey Nordic days and lose less power in the heat.',
      particle: 'streak', // 'streak' (light) | 'drop' (water, liquids) | 'spark' (electric, heat, tech)
      surface: 'cells', // 'cells' (grid tiles) | 'line' (a plain surface line)
      counter: { label: 'Today', unit: 'kWh', start: 18.42, step: 0.01, decimals: 2 },
    },
    {
      kind: 'booking',
      k: 'Start',
      t: 'A survey, booked in a minute',
      d: 'Pick a slot. An engineer flies the drone, measures the roof and leaves you a 3D design.',
      heading: 'Next week',
      note: 'Free roof survey',
      confirm: 'Thursday 10:00 — survey booked',
    },
  ],

  // Interactive calculator section (set to null to remove it and its nav link).
  calculator: {
    eyebrow: 'Savings calculator',
    title: 'Run the numbers.',
    flourish: 'Then run the sun.',
    text: "Move the sliders. These are the same assumptions our engineers start from, using Nordic irradiance and today's tariffs.",
    slider: { label: 'Monthly electricity bill', min: 60, max: 600, step: 10, default: 220, format: (v) => `€${v}` },
    toggles: [
      { key: 'battery', label: 'Home battery', icon: BatteryCharging, default: true },
      { key: 'ev', label: 'EV charger', icon: PlugZap, default: false },
    ],
    // Returns everything the result card shows. bars: 12 values 0–1 (monthly chart).
    compute: (v, t) => {
      const bill = v + (t.ev ? 70 : 0)
      const e = solarEstimate(bill)
      const share = t.battery ? 0.84 : 0.62
      const yearly = Math.round(bill * 12 * share)
      const cost = e.kwp * 1350 + 5200 + (t.battery ? 6900 : 0) + (t.ev ? 1100 : 0)
      const scale = 0.45 + v / 1100
      return {
        headlineLabel: 'You keep, every year',
        headline: eur(yearly),
        badge: `${Math.round(share * 100)}% self-powered`,
        bars: Array.from({ length: 12 }, (_, m) => Math.min(1, (0.25 + 0.75 * Math.sin((Math.PI * (m + 0.6)) / 12.2) ** 1.6) * scale)),
        barLabels: 'JFMAMJJASOND',
        stats: [
          ['System', `${e.kwp} kWp`],
          ['Panels', e.panels],
          ['Payback', `${(cost / yearly).toFixed(1)} yrs`],
          ['25-yr gain', `€${Math.round((yearly * 25 * 1.18 - cost) / 1000)}k`],
        ],
      }
    },
    cta: 'Lock in this design',
    navLabel: 'Savings',
  },

  process: {
    eyebrow: 'The Aurea method',
    title: 'From first call to first kilowatt',
    flourish: 'in under 30 days.',
    text: 'Four steps, one team, zero hand-offs. The person who designs your system is the one who signs it off.',
    steps: [
      { t: 'Survey', f: 'measured to the millimetre.', d: 'A certified engineer flies a drone over your roof, maps every shadow across all twelve months and reads your real consumption.', img: '/img/survey.jpg', meta: ['45-minute visit', 'Free, no obligation'] },
      { t: 'Design', f: 'built around your life.', d: 'You get a 3D render of your exact roof, a fixed price and a production forecast we put in writing.', img: '/img/exploded.jpg', meta: ['3D layout in 48 h', 'Fixed-price quote'] },
      { t: 'Install', f: 'in a single day.', d: 'Our own crews, never subcontractors. Panels, inverter and battery go in, and the site is left cleaner than we found it.', img: '/img/install.jpg', meta: ['1–2 day install', 'Grid paperwork handled'] },
      { t: 'Monitor', f: 'for the next 25 years.', d: 'We watch your system around the clock. If a panel underperforms, we usually know before you do.', img: '/img/house-night.jpg', meta: ['24/7 monitoring', '25-year warranty'] },
    ],
  },

  services: {
    eyebrow: 'What we install',
    title: 'One partner for',
    flourish: 'every watt.',
    images: [
      { src: '/img/battery.jpg', alt: 'Wall-mounted home battery' },
      { src: '/img/ev.jpg', alt: 'Electric car charging at home' },
    ],
    items: [
      { icon: Sun, t: 'Residential solar', d: 'All-black N-type arrays designed for your exact roof, from 3 to 20 kWp.' },
      { icon: BatteryCharging, t: 'Home battery storage', d: 'Bank the midday surplus and run your evenings on your own sunshine.' },
      { icon: PlugZap, t: 'EV charging', d: 'Smart chargers that fill your car from the roof first and the grid last.' },
      { icon: Building2, t: 'Commercial rooftops', d: 'Warehouses, farms and offices. Cut operating costs and hit ESG targets.' },
      { icon: Gauge, t: 'Monitoring & optimisation', d: 'Panel-level data, tariff-aware battery logic and monthly reports.' },
      { icon: Wrench, t: 'Service & upgrades', d: 'Cleaning, health checks and upgrades for any existing system, ours or not.' },
    ],
  },

  reviews: {
    eyebrow: 'Homeowners, in their words',
    title: 'Bills down.',
    flourish: 'Spirits up.',
    // Use REAL reviews from the client (Google, Trustpilot, their site). Never invent them for a real business.
    items: [
      { q: 'The drone survey alone told us more about our house than the estate agent did. Installed on a Tuesday, generating by Wednesday lunch. Our bill went from €240 to €38.', n: 'Mette & Jonas L.', p: '9.2 kWp + battery · Roskilde' },
      { q: 'Three quotes, and Aurea were the only ones who showed us where the shadows fall in December. The app is genuinely addictive. I check it more than the weather.', n: 'Henrik A.', p: '7.4 kWp · Aarhus' },
      { q: 'Crew was polite, fast and spotless. A panel underperformed after a storm. They called me about it before I had even noticed. That is what the 25 years means.', n: 'Sofie K.', p: '11 kWp + EV charger · Odense' },
    ],
    trust: [
      { icon: ShieldCheck, t: '25-year warranty', d: 'Panels, workmanship and output, in writing' },
      { icon: Award, t: 'Certified installers', d: 'Every electrician is employed, trained and authorised' },
      { icon: Leaf, t: 'Climate-positive', d: 'Recycled packaging, EV vans and a carbon-neutral install' },
    ],
  },

  contact: {
    eyebrow: 'Free design · No obligation',
    title: 'Your roof is already',
    flourish: 'collecting sunlight.',
    text: "Let's put it to work. Tell us a little about your home and a solar engineer, not a salesperson, will come back within 24 hours.",
    image: '/img/house-night.jpg',
    fields: ['Full name', 'Email', 'Phone', 'Postcode'],
    interestLabel: "I'm interested in…",
    interests: ['Solar panels', 'Solar + home battery', 'Solar + battery + EV charger', 'Commercial rooftop', 'Servicing an existing system'],
    messagePlaceholder: 'Anything we should know? Roof type, shading, plans for an EV…',
    upload: { title: 'Drop a recent electricity bill or roof photos', hint: 'Optional. PDF, JPG or PNG, up to 5 files.' },
    submit: 'Request my free design',
    successTitle: "Thank you, we're on it.",
    successText: 'Your engineer will email a first layout within 24 hours. Keep an eye on your inbox, and on the sky.',
  },

  footer: {
    blurb: 'Premium solar, storage and EV charging for Nordic homes and businesses. Designed, installed and monitored by one team since 2011.',
    status: '3,214 systems online · generating now',
    services: ['Residential solar', 'Home batteries', 'EV charging', 'Commercial'],
    watermark: 'aurea',
    note: 'Concept website.', // e.g. 'Concept website.' for a pitch demo, '' for a live client site
  },
}

# site.config.js + theme.js reference

All client content lives in `src/site.config.js` (a JS module, so it can import lucide icons and hold small
functions). Colours live in `src/theme.js`. The worked example in the template is Aurea Solar: replace every
value, keep the shape. Components never need editing for a normal client.

## theme.js (colours)
Dark cinematic base + ONE accent. Keep `background` near-black (the film voids are `#0A0A0B`).
Start from the client's brand colour for `primary`; derive `primary-dark` (~15 % darker) and `primary-light`
(~15 % lighter, used for serif flourishes). If their brand colour is dark or muddy, use it in the logo only and
pick an accent from the table below. **Restart the dev server after editing theme.js.**

| Industry feel | primary | primary-dark | primary-light | accent |
|---|---|---|---|---|
| Solar / energy / warm premium | `#F2A541` | `#D98A1F` | `#F8C77E` | `#8FB3E0` |
| Water / plumbing / pools / cleaning | `#4FB3E8` | `#2C8FC7` | `#8DD0F2` | `#F2C46D` |
| Green / landscaping / eco | `#7CC48A` | `#4E9E5E` | `#AEDDB7` | `#E8C26A` |
| Heat / HVAC / roofing / builders | `#F07A3C` | `#C95A22` | `#F6A87C` | `#8FB3E0` |
| Health / dental / clinics | `#7FD1C7` | `#4CAFA3` | `#B3E6DF` | `#F2B8A0` |
| Luxury / law / finance / real estate | `#C9A86A` | `#A5864A` | `#E2CC9C` | `#9FB4C7` |
| Tech / SaaS / electric | `#8C7CF0` | `#6A58D6` | `#B7ACF7` | `#5FD3E8` |
| Food / hospitality | `#E58A5B` | `#C0653A` | `#F0B394` | `#E8C26A` |

Fonts are fixed by index.html (Plus Jakarta Sans display, Cormorant Garamond serif flourish, Inter body,
JetBrains Mono labels). They suit almost every premium brand; only swap them if the client's identity demands it
(edit the Google Fonts link in index.html and `fontFamily` in tailwind.config.js together).

## site.config.js fields
| Key | What | Notes |
|---|---|---|
| `meta.title`, `meta.description` | Browser title + SEO description | "Brand — Tagline" |
| `brand` | `name`, `accent` (serif part of the wordmark, or ''), `logo` (`'sun'`, `'initial'`, or `/img/logo.svg`), `legalName`, `phone`, `phoneHref` (digits only), `email`, `area`, `hours`, `address[]`, `since` | Use their real logo file if it reads well on dark; otherwise `'initial'` |
| `nav.links[]` | `{label, href}`; hrefs: `#home #calculator #process #services #reviews` | `#calculator` is hidden automatically when `calculator: null` |
| `hero` | `eyebrow`, `lines[]` (1–2 short sans lines), `flourish` (serif gradient line), `sub`, `meta[]` (`{icon, text, filled}` ×3), `scrollCue` | Headline = 3 lines total, ≤ ~11 characters per line on phones |
| `quote` | Hero form: `field`, `slider` (`format(v)`), `estimate(v) → [{label, value, highlight}]` (first 2 = live preview, all = result), `mobileHint(v)`, button texts, `privacy`, `doneText` | Make the slider the one number that drives value for this industry (bill, m², rooms, budget, team size). Keep maths plausible and call it an estimate |
| `chapters[3]` | `eyebrow`, `title`, `flourish`, `body`, `aside` | aside: `{type:'stat', value, text}` (ch1), `{type:'list', items:[{t,d}]}` (ch2: the K3 parts), `{type:'stats', items:[[value,label]×3]}` (ch3) |
| `filmSubjects` | `{hero, ch1, ch2, ch3}` boxes `[x0,y0,x1,y1]` | See film-pipeline.md §5 |
| `marquee[]`, `marqueeIcon` | 6–8 short proof points + an industry icon | |
| `pillars` | `eyebrow/title/flourish`, `stats[]` `{end, decimals, prefix, suffix, label}` ×4 | Real numbers only |
| `features[3]` | `kind: 'notifications'` (`items[]` ×3 `{icon,t,d}`), `'signature'` (`particle`, `surface`, `counter{label,unit,start,step,decimals}`), `'booking'` (`heading`, `note`, `confirm`) + each `k`, `t`, `d` | Signature particle: `streak` light, `drop` water, `spark` electric/heat/tech |
| `calculator` | `eyebrow/title/flourish/text`, `slider`, `toggles[]` `{key,label,icon,default}`, `compute(v, toggles) → {headlineLabel, headline, badge, bars[12] (0–1), barLabels, stats:[[k,v]×4]}`, `cta`, or `null` | Use `null` when no honest calculator exists for the industry |
| `process` | `eyebrow/title/flourish/text`, `steps[4]` `{t, f (serif continuation), d, img, meta[2]}` | Image per step: real photos first |
| `services` | `eyebrow/title/flourish`, `images[2]` `{src, alt}` (portrait crops), `items[6]` `{icon, t, d}` | Lucide icons, semantically matched |
| `reviews` | `eyebrow/title/flourish`, `items[3]` `{q, n, p, stars?}`, `trust[3]` `{icon, t, d}` | Real reviews only (see research.md) |
| `contact` | `eyebrow/title/flourish/text`, `image`, `fields[]` (from `Full name`, `Email`, `Phone`, `Postcode`), `interestLabel`, `interests[]`, `messagePlaceholder`, `upload {title, hint}` or null, `submit`, `successTitle`, `successText` | |
| `footer` | `blurb`, `status` (live-style pill or ''), `services[]` (defaults to the first 4 services), `watermark` (big ghost word or ''), `note` | `note: 'Concept website.'` for a pitch demo |

Icons: import them at the top of site.config.js from `lucide-react` (`import { Droplets, Wrench } from 'lucide-react'`).
Check the name exists: `node -e "console.log(!!require('lucide-react')['Droplets'])"` inside the site folder.

## Images (public/img)
Reference images by path (`/img/name.jpg`). Needed: 4 process images, 2 portrait service images,
1 contact background (K4 works well). JPG, ~1600 px wide.

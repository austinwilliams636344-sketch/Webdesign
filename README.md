# R&R Diesel Repair — website

A static, mobile-first website with four pages: Home, Services, Reviews and Location. It has no build step and no framework.

## Preview locally

Open `index.html` in a browser. The Google Map and Google Fonts need an internet connection. To serve the site the way a real host would:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Upload the whole folder to any static host, such as Netlify, Cloudflare Pages, GitHub Pages or Vercel. You don't need to configure anything.

## Files

```
index.html  services.html  reviews.html  location.html
css/style.css            all styles (colors and fonts are set at the top in :root)
js/main.js               hours config, Open/Closed status, mobile menu, animations
js/vendor/               GSAP 3.12.5 + ScrollTrigger, hosted with the site (no CDN lookup)
images/hero-truck.svg    placeholder hero image, swap this out
images/favicon.svg
```

The header, footer, top bar and mobile call bar are the same on every page. If you change one, change all four files.

## Fill-in checklist

Search all files for `[` to find every placeholder.

| Placeholder | Where |
|---|---|
| `OPENING_TIME`, `DAYS_OPEN` | Top of `js/main.js`. These drive the Open/Closed status, the hours table and the hours text everywhere. |
| `[DAYS OPEN] · [OPENING TIME] – 5:00 PM CT` | Fallback text in the top bar, mobile menu and footer of all 4 pages. JS replaces it once the config is set, but update it too. |
| `openingHoursSpecification` | JSON-LD in `index.html` and `location.html`. Use full day names (`"Monday"`) and 24-hour `opens` (`"08:00"`). |
| `[SITE URL]` | JSON-LD in `index.html` and `location.html`, once the domain is known. |
| `[SERVICE NAME 1–6]`, `[DESCRIPTION]` | `services.html` cards. Home tiles 1–5 link to `services.html#service-1…5`. |
| `[REVIEW HERE]`, `[FIRST NAME]` | `reviews.html` (6 cards) and `index.html` (2 cards). Adjust the stars per review. |
| Google review link | `reviews.html`, the "Leave Us a Review" button. It currently links to a Google search for the shop. |
| Hero photo | Replace `images/hero-truck.svg`. A WebP of about 1200×960 under 150 KB is ideal. Update the `src` in `index.html`. |

When you fill in placeholders, remove the `ph` class. That class colors placeholder text pink so it's easy to spot.

## Notes

- The Open/Closed status and the "Today" highlight always use Central Time (America/Chicago), whatever the visitor's own time zone is.
- Animations turn off when the visitor's device has reduced motion enabled. If the scripts fail to load, all content still shows.
- The site never mentions 24/7 or emergency service. Keep it that way.

# Researching the business from its URL

Goal: a `research.json` (saved next to the site, e.g. `<site>/research/research.json`) with every fact the
site needs, each with its source URL, plus the client's real images downloaded to `research/images/`.

## Tools (Firecrawl MCP)
- `firecrawl_scrape` with `formats: ["markdown", "branding", "links", "images"]` on the homepage: copy, logo,
  colours, fonts, nav links, image URLs.
- `firecrawl_map` on the domain to find About / Services / Contact / Reviews / Projects / Team pages, then
  scrape the 3–6 that matter (markdown only).
- `firecrawl_scrape` with `formats: ["json"]` + `jsonOptions.schema` (below) on the best pages for structured facts.
- `firecrawl_search` for "<business name> <city> reviews", Google Business / Trustpilot / Yelp listings: rating,
  review count, real review quotes, opening hours, years in business.
If Firecrawl is unavailable use WebFetch / WebSearch the same way.

## No website (common for rural trades)
Use what exists, in this order, and save each source URL:
1. **Google Business Profile / Maps**: name, category, address, phone, hours, rating, review count, real
   review quotes, owner photos, "from the business" description, service list, service area. Use the Maps link
   if the user gave one, else `WebSearch` "<name> <city>" and the Maps/knowledge-panel result.
2. **Facebook page**: about text, services, photos, posts showing real jobs.
3. Directories: Yelp, BBB, Angi, state licence lookups (only for facts they actually show).
Google often blocks scraping; when a source can't be read, ask the user to paste the details (hours, services,
5–8 reviews with first names and star ratings) rather than guessing. Their profile photos are usually the only
real images: download what you can reach, otherwise ask the user for them and generate only empty slots.
Without a site there is no brand: pick the palette from the industry row in config.md and say so.

## Extraction schema
```json
{
  "name": "", "legalName": "", "tagline": "", "industry": "", "city": "", "serviceArea": "",
  "phone": "", "email": "", "address": [""], "hours": "", "founded": 0,
  "services": [{ "title": "", "description": "" }],
  "usps": [""], "process": [{ "step": "", "description": "" }],
  "stats": [{ "value": "", "label": "" }],
  "certifications": [""], "guarantees": [""],
  "rating": { "value": 0, "count": 0, "source": "" },
  "reviews": [{ "quote": "", "author": "", "context": "", "source": "" }],
  "brand": { "primaryColor": "", "logoUrl": "", "fonts": [""], "tone": "" },
  "images": [{ "url": "", "what": "", "usable": true }],
  "language": "en"
}
```

## Images
- Download the business's own photos (projects, building, team at work, products) from their site with
  curl into `research/images/`. Skip stock-looking, tiny (<1000 px wide), heavily text-overlaid or
  watermarked images. Check each one visually before using it.
- Use them for: the K1 keyframe reference (their real building/product), process steps, services images,
  contact background. Convert to JPG ~1600 px wide, q≈85 (`ffmpeg -i in -vf "scale='min(1600,iw)':-2" -q:v 3 out.jpg`).
- Missing slots (they rarely have 7 great photos): generate on-brand images with Higgsfield
  `generate_image_batch` (gpt_image_2_5, 4:3, high, 2k), in the same light and palette as the film, with no
  people's faces and no logos. Prefer their real photos wherever they exist.

## Honesty rules
- **Real facts only** for a real business: name, phone, address, services, prices, years, certifications.
  If something is unknown, leave it out or use a neutral phrasing; never invent a licence, an award, a stat or a
  guarantee.
- **Reviews**: only real quotes (with source) for a real business. If none can be found, replace the reviews
  section items with the business's own USPs or the client's own testimonials page, and tell the user.
  Invented reviews are only acceptable for a clearly fictional concept site (footer note "Concept website.").
- Stats in `pillars` must come from research (years trading, projects done, rating, review count, area served).
  If fewer than 4 exist, use fewer or swap in safe facts (e.g. founding year, number of services, service radius).
- Keep the client's language: a Danish business gets a Danish site (translate every string in the config).
- The quote-form and calculator maths must be plausible for the industry and labelled as estimates; never
  present a price the business did not publish as their actual price.

## What to hand the build step
1. research.json (facts + sources)
2. A one-paragraph brand read: tone (premium / friendly-local / technical), existing colour, what makes them different
3. The storyboard choice (references/film-storyboards.md) with the business-specific object and details
4. The image list: which real photos go where, and which slots need generated images

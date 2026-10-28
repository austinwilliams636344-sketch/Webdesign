# QA + lessons learned

Run with the dev server up (`npm run dev`, port 5173; set `URL=` for another port).

```bash
npm run build                      # must pass
npm run qa:layout                  # screenshots → qa/sheet_<size>.jpg (hero + 3 chapters, 6 sizes)
npm run qa:perf                    # 2 full film scrolls per size; target over33 = 0, max ≈ 16.8 ms
```
Then read every `qa/sheet_*.jpg` yourself and check:
- [ ] Chapter text never overlaps the film subject (tune `filmSubjects`, not the CSS)
- [ ] Hero fits one screen on phones (390×844 and 375×667): headline + form, nothing cut off
- [ ] Hero headline letters not clipped (descenders g, y, p) and lines ≤ ~11 chars on phones
- [ ] The film shows the right content in each chapter window (S1/S2/S3 timing)
- [ ] No page errors printed by qa:layout
- [ ] Scroll the lower sections in the browser: calculator bars render, process stack, services, reviews, contact
- [ ] Both forms step through to their success state
- [ ] All copy is the client's (no "Aurea", "solar", "kWp" left over: `grep -ri aurea src/`)

## Lessons already baked into the template (don't undo them)
- **Frames are decoded off the main thread** (`fetch → blob → createImageBitmap`) in a sliding window around
  the playhead. Drawing an undecoded `<img>` causes 40 ms hitches.
- **No `desynchronized: true`** on the canvas context (renders black in some captures/browsers).
- **No `backdrop-filter` and no `mix-blend-mode` over the canvas**: they repaint the whole screen every frame.
  Film overlays use `.film-card` (solid translucent). The hero form drops its blur on phones.
- **Lenis is prioritised in the GSAP ticker** and the ScrollTrigger uses `scrub: true` (no double smoothing,
  no one-frame lag).
- **Every source frame at 24 fps** + crossfade between neighbours: smooth when scrolling slowly.
- **Film framing per chapter** (`filmSubjects` + stages in ScrollFilm.jsx) with feathered edges: the film moves
  beside the text on desktop and above it on phones, so text never sits on the subject.
- **Headline reveal masks** have extra bottom padding with a negative margin so descenders aren't clipped.
- **Tailwind config changes** (theme.js, screens) need a dev-server restart; HMR won't pick them up.
- **puppeteer `clip` uses page coordinates**, so screenshots after scrolling must be full-viewport (the QA scripts do this).
- **sed on macOS**: use `#` as the delimiter when the pattern contains `|`.

## Handover
- Remove comparison films the client won't use (`public/frames/<key>` + its entry in `src/films.json`).
- Set `footer.note` (`''` for a live site).
- `npm run build` → `dist/` is a static site (Vercel, Netlify, Cloudflare Pages, any host). The frames make it
  ~60–70 MB, so a CDN-backed host is recommended.
- Forms are mock submits: wire them to the client's CRM/webhook before going live (HeroForm.jsx `submit`,
  Contact.jsx `onSubmit`).

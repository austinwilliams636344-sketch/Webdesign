---
name: cinematic-site
description: Turn any business (website URL, Google Business Profile, or just name + city when they have no website yet) into a premium "$10k" cinematic marketing site. Researches the business (real info, services, reviews, photos), designs an industry-specific 4-keyframe scroll film (the real place → the product isolated in a black void → exploded "how it works" view → the transformed result), generates it with Higgsfield (keyframes) + Topview Seedance 2.5 (videos), and builds a scroll-scrubbed React/GSAP site with a quote form in the hero from a proven template (the Aurea Solar build). Use when the user pastes a website URL and says "build a site like the solar one", "rebuild this website", "make a cinematic site for this business", "insert a website", "do the scroll-animation site for <url>", "pitch site for this prospect", or wants the Aurea-style site for another company.
argument-hint: [website URL | Google Maps link | business name + city] [optional: output folder, language, notes]
---

# Cinematic Site

You turn a business's existing website into a cinematic, scroll-driven marketing site that looks like a
$10k agency build: their real information and photos, a hero quote form, and a full-screen scroll film that
explains their product, made for their industry.

Everything is built from the template in `${CLAUDE_SKILL_DIR}/template` (React 19 + Vite + Tailwind 3 + GSAP +
Lenis). Client content lives in ONE file (`src/site.config.js`) plus `src/theme.js`, `public/img/` and the film
frames. You fill data; you don't rewrite components.

Read these when you reach the step that needs them (not all up front):
- `${CLAUDE_SKILL_DIR}/references/research.md`: what to extract from the URL, images, honesty rules
- `${CLAUDE_SKILL_DIR}/references/film-storyboards.md`: the 4-keyframe arc + storyboards for ~20 industries
- `${CLAUDE_SKILL_DIR}/references/film-pipeline.md`: keyframe prompts, video models/costs, extraction, framing
- `${CLAUDE_SKILL_DIR}/references/config.md`: every site.config.js field, palettes per industry
- `${CLAUDE_SKILL_DIR}/references/qa.md`: QA checklist, lessons learned, handover
- `${CLAUDE_SKILL_DIR}/template/src/site.config.js`: the complete worked example (Aurea Solar)

## Inputs
`$ARGUMENTS` = the business URL (+ optional notes). **No website is fine**: a Google Maps / Business Profile
link, a Facebook page, or just the business name + city works (see research.md, "No website"). If you have
none of these, ask for the name and city. Everything else has defaults:
- **Output folder**: the session's project folder if the user is in one, otherwise `~/Desktop/websites/<slug>/`.
- **Language**: the business's own language.
- **Footer note**: `'Concept website.'` (it's a pitch demo unless the user says it's going live).
- **Film mode**: `generate` when Higgsfield/Topview are connected and the user approves the cost; otherwise
  **`brief`**: build the site with `stills` instead of a film, and hand the user a film brief they generate
  themselves (step 5b). Use `brief` whenever the generation tools are missing or the user asks for video ideas.

## Workflow

Track progress with the session's task list. Steps 4–5 render for ~15 minutes: do steps 6–7 meanwhile.

### 1. Research (≈5 min)
Follow research.md: scrape the homepage (markdown + branding + images), map the site, scrape About/Services/
Contact/Reviews, search for reviews/ratings. Save `research/research.json` (+ sources) and download their usable
photos to `research/images/`. Note what's missing.

### 2. Concept (≈2 min)
- Pick the storyboard (film-storyboards.md) and write the business-specific K1–K4 lines + the 3 chapter beats.
- Brand read: tone, palette (their colour → `primary`, or the industry row in config.md), the hero headline
  (2 short sans lines + 1 serif flourish, e.g. "Energy, / engineered / *from light.*"), the quote-form slider
  variable and its estimate maths.
- Tell the user the concept in ≤8 lines **and the generation cost** (keyframes ≈ 4 images on Higgsfield; videos
  3 × 29.6 Topview credits on Seedance 2.5). Ask once before spending, unless the user's request already said to
  just build it. Then don't stop again until delivery.

### 3. Scaffold
```bash
zsh ${CLAUDE_SKILL_DIR}/scripts/new-site.sh <output-folder>
```
(copies the template, runs npm install, checks ffmpeg/cwebp/Chrome). Copy `research/` into the site folder.

### 4. Keyframes (Higgsfield `generate_image`, gpt_image_2_5, 16:9, high, 2k)
K1 first (with the client's real building/product photo as reference when good) → inspect → K2, K3, K4 in
parallel with K1 as reference. Inspect all four (black voids, same camera K1↔K4, no text/logos/faces) and
regenerate any bad one before animating. Save PNGs to `<site>/film/keyframes/`.

### 5. Videos (start + end frame, 8 s, 16:9): see film-pipeline.md §2
Default: **Topview `Seedance 2.5`, 1080p, 8 s**: upload K1–K4 (`ta_upload_credential` → curl PUT →
`ta_upload_check_file`), submit S1 (K1→K2), S2 (K2→K3), S3 (K3→K4) in parallel, poll with background sleeps,
download to `<site>/film/`. Fallbacks: Topview MiniMax H3 (free quota) → Higgsfield seedance_2_5 / minimax_h3.
If Topview isn't connected in this session, say so and use Higgsfield; don't wait on it.
Make a contact sheet (`zsh scripts/contact-sheet.sh film/sheet.jpg film/seg*.mp4`) and check the seams and story.

### 5b. Film brief (film mode `brief`, instead of steps 4–5)
Write `<site>/film/FILM-BRIEF.md` following film-pipeline.md §6: the story in one line, K1–K4 image prompts,
S1–S3 video prompts, settings, the exact file names to save as, and the one command that adds the film.
Fill every bracket with this business's real details. Until the film exists, set `stills` in site.config.js
(real photos first, in story order: scene, subject, detail, result) so the scroll section is never empty.
Give the user the brief's prompts in the final message too, ready to paste. If they can't pay for video
generation, they only make the 4 keyframes and you animate them for free (film-pipeline.md §7).

### 6. Content (while videos render)
- `src/theme.js`: palette. `src/site.config.js`: replace every Aurea value with researched content, in the
  business's language. Also set `<title>` + meta description in `index.html` (shown before JS loads, used by SEO). Real facts only; real reviews only; estimates labelled as estimates (research.md).
- `public/img/`: real photos converted to JPG ~1600 px; generate only the missing slots (Higgsfield
  `generate_image_batch`, same light/palette as the film, no faces, no logos). K4 makes a good contact background.
- Pick lucide icons per service; pick the signature particle (`streak` light / `drop` water / `spark` electric, heat, tech).

### 7. Film into the site (skip in `brief` mode; the brief tells the user this command)
```bash
cd <site> && npm run film -- main "<Label>" film/seg1.mp4 film/seg2.mp4 film/seg3.mp4 --default
```
Set `filmSubjects` from the four keyframes (film-pipeline.md §5).

### 8. QA (qa.md)
`npm run build` → start the dev server (Browser pane `preview_start`, or `npm run dev` in the background) →
`npm run qa:layout` and read every sheet → fix `filmSubjects`/copy until nothing overlaps or clips →
`npm run qa:perf` (target: over33 = 0). `grep -ri "aurea\|solar\|kWp" src/` must be empty (unless it's a solar client).

### 9. Deliver
Open it for the user (`open http://localhost:5173` and/or the Browser pane; in a cloud session, publish a
preview). In `brief` mode, also hand over the film brief prompts and say the film slots in with one command
once they send back seg1–3.mp4. Report: the URL, the film story in
one line, what came from their site vs. what was generated, anything missing or unverified (e.g. no reviews
found), credits spent, and the folder. Offer the next steps: a comparison film (`npm run film -- alt ...` adds a
switch), going live (wire the forms, remove the footer note), deploy.

## Critical rules
1. **Real business = real facts.** Never invent reviews, stats, certifications, awards or prices for a real
   company. Missing data is left out or phrased neutrally, and reported to the user.
2. **Use the client's own photos first**; generate only what's missing. No faces in generated images or the film.
3. **Edit data, not components.** site.config.js, theme.js, public/img, frames. Only touch components to fix a
   real bug, and then fix the template too.
4. **One clear physical subject per film**, following the K1→K2→K3→K4 arc. K2/K3 on a near-black void; K4 = K1's camera.
5. **State the cost before the first paid generation** (unless pre-approved); never resubmit a running task; one
   bad segment = regenerate only that segment.
6. **Never break the performance rules** in qa.md (off-main-thread decode, no blur/blend over the canvas,
   prioritised Lenis, scrub: true).
7. **Chapter text must never overlap the film subject** at any size: tune `filmSubjects` and re-run qa:layout.
8. **Restart the dev server after theme.js / tailwind changes.**
9. **Verify before claiming done**: build passes, QA sheets read, perf numbers reported as measured.
10. **Keep the user posted** during the long renders (one line per milestone), and lead the final message with
    the localhost link.

## Quick reference
```bash
zsh ${CLAUDE_SKILL_DIR}/scripts/new-site.sh ~/Desktop/websites/acme-roofing
npm run film -- main "Seedance" film/seg1.mp4 film/seg2.mp4 film/seg3.mp4 --default
npm run film -- alt "MiniMax" film/alt1.mp4 film/alt2.mp4 film/alt3.mp4      # adds an A/B switch
zsh scripts/contact-sheet.sh film/sheet.jpg film/seg1.mp4 film/seg2.mp4 film/seg3.mp4
npm run dev    |    npm run qa:layout    |    npm run qa:perf    |    npm run build
```
Template layout: `src/site.config.js` (content) · `src/theme.js` (colours) · `src/films.json` (written by
`npm run film`) · `src/components/*` (sections) · `src/lib/framePlayer.js` (the film engine) · `scripts/` (film + QA).

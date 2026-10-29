# Film pipeline: keyframes → 3 videos → frames → framing

Proven on Aurea Solar (Oct 2026). Total time ≈ 30–40 min, mostly render waiting.

## 1. Keyframes (Higgsfield MCP, `generate_image`)

Model `gpt_image_2_5`, `aspect_ratio: "16:9"`, `quality: "high"`, `resolution: "2k"`.
Generate **K1 first**, look at it, then K2/K3/K4 in parallel with K1 as `image_references`
(K3 can also reference K2 for the object's look).

If the client has a strong real photo of their building/product, upload it
(`media_upload` → curl PUT → `media_confirm`) and pass it as `image_references` for K1:
"Use the reference photo of the real building; keep its architecture, materials and colours."

### Prompt patterns (fill the brackets from the storyboard)

**K1 (scene):**
> Cinematic architectural photograph, three-quarter elevated view of [the place, with real details from
> research]. [The subject] clearly visible on/in it. [Best light: golden hour / soft morning], long soft shadows,
> [surroundings]. Subject centred slightly right with generous empty space, sky fading darker at the top.
> Shot on medium format, 35mm lens, ultra sharp, photoreal, premium editorial, no people, no text, no logos.

**K2 (isolated in void), reference K1:**
> Use the reference image. Keep the exact same camera angle, framing and lens. Remove [the place, landscape,
> sky] completely: the background becomes a pure seamless deep black studio void (#0A0A0B). The only thing
> left is [the subject], now floating weightlessly where it was, gently tilted toward the viewer. Warm
> [accent colour] rim light from the upper left catches its edges. Product-render quality, photoreal, ultra
> clean, premium tech-launch aesthetic, no text, no logos.

**K3 (explained), reference K1 (+K2):**
> Exploded-view product render of [the subject], floating centred in a pure seamless deep black studio void
> (#0A0A0B), three-quarter elevated angle. Separated into its layers with even gaps, top to bottom:
> 1) …, 2) …, 3) … [the 4–6 parts that become the Chapter 2 list]. [One part] glows faintly [accent colour]
> from within. Warm rim light from the upper left, delicate light beams, tiny drifting particles. Ultra clean,
> photoreal, Apple-style product launch aesthetic, lots of negative space, no text, no labels, no logos.

**K4 (result), reference K1:**
> Use the reference image. Keep the exact same [place], camera angle, framing, lens and [subject]. Change the
> time to [blue hour just after sunset / rain at dusk / snowy night]: [sky], every window glows with warm light,
> [small life details]. Calm, premium, [the outcome feeling]. Cinematic, photoreal, no people, no text, no logos.

Check each keyframe before animating: K2/K3 voids really black, K4 matches K1's camera, no text/logos,
no warped geometry. Regenerate a bad keyframe now; it is far cheaper than a bad video.

## 2. Three videos (start frame + end frame, 8 s, 16:9, no audio)

Same prompt for every platform (proven): **S1** "One continuous cinematic shot, no cuts, very slow push-in. [The
subject] smoothly detaches/lifts…, the [scene] slowly dissolves into pure seamless black until only [subject]
remains in a black void with warm rim light. Slow, elegant, photoreal premium product film."
**S2** "Continuous shot in a black studio void. [subject] … separates into its layers sliding apart into an
exploded view: [parts]. Warm light beams upper left, drifting particles. Slow, precise, Apple-style product film."
**S3** "Continuous shot. The exploded layers slide back together into one [subject] that glows warmly, then it
[returns/settles into the scene] as the [K4 scene] materializes out of the darkness: [K4 details]."

| Option | Model / settings | Cost (Oct 2026) | Render | Notes |
|---|---|---|---|---|
| **Topview** (preferred) | `topview_generate_video`, `taskType: image_to_video`, `model: "Seedance 2.5"`, `resolution: 1080`, `duration: 8`, `firstFrameFileId` + `endFrameFileId` | **29.6 credits / segment** | ~12–15 min | Best story-following and smooth light build-up. Output 1914×1082. **The site's main film.** |
| Topview (free) | `model: "MiniMax H3"`, `resolution: 1440`, `duration: 8`, `aspectRatio: "16:9"` | free MCP quota (10 granted) | ~13 min | 2560×1440, sharpest. Light can "snap on" mid-clip. |
| Higgsfield | `generate_video`, `model: "seedance_2_5"`, `mode: "omni_reference"`, `medias` roles `start_image` + `end_image`, `resolution: "1080p"`, `duration: 8`, `generate_audio: false`, `bitrate_mode: "high"` | 128 credits / segment | 15–30 min (queues) | Same model as Topview Seedance. |
| Higgsfield | `model: "minimax_h3"`, `start_image` + `end_image`, `duration: 8` | 16 credits / segment | ~15 min | Can hit provider 429 rate limits; retry later, one at a time. |

Topview flow: `topview_get_generation_config(type: video, taskType: image_to_video)` (confirm the model and
options are still listed) → per keyframe `ta_upload_credential(format: "png")` → `curl -X PUT --upload-file` →
`ta_upload_check_file` → submit the 3 segments in parallel → poll `topview_query_task` (wait between polls with a
background `sleep 240`; never resubmit a running task) → download `videos[0].filePath` with curl.
Check `topview_get_credit` / `topview_list_credit_logs` for real costs; the balance can lag, so trust the logs.

Before the first paid generation tell the user the model, the settings and the cost (3 × 29.6 credits for
Topview Seedance). Topview MiniMax uses the free quota when it is available (`topview_get_mcp_free_quota`).

## 3. Verify the clips

```bash
zsh scripts/contact-sheet.sh qa/film.jpg seg1.mp4 seg2.mp4 seg3.mp4
```
Look for: S1 starts on K1 and ends on K2 (a seamless join to S2), S3 ends on K4, no morphing faces, text or
logos, the subject reads clearly in each chapter window (S1 ≈ 0–33 % of scroll, S2 33–67 %, S3 67–100 %).
A bad segment: regenerate only that one with a sharper prompt.

## 4. Extract frames

```bash
npm run film -- main "Topview · Seedance" seg1.mp4 seg2.mp4 seg3.mp4 --default
```
Writes ~577 WebP frames per size (HD 1920w ≈ 40–50 MB, SD 1280w ≈ 18–20 MB) and updates `src/films.json` +
the preload in `index.html`. Add more films under other keys for an A/B switch (bottom-left on the site).
Remove extra films before handing a site over.

## 5. Framing (`filmSubjects` in site.config.js)

The template places the film beside the chapter text (desktop) or above it (phones) using
`filmSubjects`: for each keyframe, the rectangle around the subject as fractions of the frame `[x0, y0, x1, y1]`.

Measure them on the 4 keyframes (open them, estimate the box with ~5 % padding):
- `hero`: K1, the building/scene the eye should land on (it sits behind the form on desktop)
- `ch1`: K2, the floating object (take the union across S1's last third: objects drift)
- `ch2`: K3, the whole exploded stack incl. light beams you want visible
- `ch3`: K4, the building/scene

Then run `npm run qa:layout` and adjust until no chapter text overlaps the subject at any size.
Typical values: scene `[0.25, 0.12, 0.85, 0.9]`, floating object `[0.06, 0.2, 0.94, 0.8]`, exploded `[0.1, 0.05, 0.9, 0.95]`.

## 6. Film brief (film mode `brief`: the user generates the film)

When there are no generation tools in the session, or the user wants to make the videos themselves, write
`<site>/film/FILM-BRIEF.md` with every bracket filled for this business:

1. **Story in one line** (K1 → K4) and which storyboard it follows.
2. **Keyframes K1–K4**: the full prompts from §1, plus: "16:9, highest quality, 2K". Tell them to make K1
   first, then use K1 as the reference image for K2–K4 (same camera angle), and to check each one (voids pure
   black, K4 matches K1, no text, logos or faces). If they have a real photo of the place, use it as K1's reference.
3. **Videos S1–S3**: the prompts from §2, each with its start and end frame (S1 = K1→K2, S2 = K2→K3,
   S3 = K3→K4), 8 s, 16:9, 1080p, no audio. Name tools that support start + end frames (Higgsfield, Topview,
   Kling, Runway, Luma) and that Seedance 2.5 followed the story best in testing.
4. **What to send back**: `seg1.mp4`, `seg2.mp4`, `seg3.mp4` (and K1–K4 PNGs, used to set `filmSubjects`).
5. **How it goes in**: `npm run film -- main "Main" film/seg1.mp4 film/seg2.mp4 film/seg3.mp4 --default`, then
   set `filmSubjects` (§5), clear `stills`, and re-run QA.

Optional extras worth listing, each one line with a ready prompt: a 6–10 s hero loop for social/ads, a vertical
9:16 cut of S1 for Reels/TikTok, and a still of K4 for the contact background.

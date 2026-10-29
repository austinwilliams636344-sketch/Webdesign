# Pig Phatz BBQ: scroll film brief

**The story:** the smoker at dusk → one brisket lifts out of the smoke into darkness → the brisket comes
apart into its layers (bark, smoke ring, fat cap, flat, burnt ends) → it lands sliced on a butcher-paper tray
in the warm, busy food hall at night.

The site plays this as you scroll. Until you send the videos, it shows placeholder smoke and ember artwork.

You'll make **4 still images (K1–K4)**, then **3 videos (S1–S3)** that each animate from one still to the next.

---

## Step 1: the 4 keyframe images

Settings: **16:9, highest quality, 2K**. A good model is GPT Image or Nano Banana (Higgsfield has both).

Make **K1 first**. Then make K2, K3 and K4 using **K1 as the reference image**, so the camera angle matches.
If you have a real photo of their smoker, use it as K1's reference.

Check each one before moving on:
- K2 and K3 backgrounds are pure black.
- K4 has the same camera angle as K1.
- No text, no logos, no faces.

**K1 (the pit)**
> Cinematic food photograph, three-quarter elevated view of a large black steel offset barbecue smoker at
> dusk, parked behind a brick downtown building in a small Kansas town. Thick white wood smoke curls from
> the stack, glowing orange embers in the firebox, a whole brisket with dark peppery bark visible on the
> grate through the open lid. Warm orange firelight against a deep blue sky, long soft shadows. Subject
> centred slightly right with generous empty space, sky fading darker at the top. Shot on medium format,
> 35mm lens, ultra sharp, photoreal, premium editorial, no people, no text, no logos.

**K2 (the brisket alone in darkness)**, reference: K1
> Use the reference image. Keep the exact same camera angle, framing and lens. Remove the smoker, the
> building and the sky completely: the background becomes a pure seamless deep black studio void (#0A0A0B).
> The only thing left is one whole smoked brisket with a dark crackling bark, floating weightlessly where it
> was, gently tilted toward the viewer, a few wisps of smoke trailing off it. Warm ember-orange rim light
> from the upper left catches the edges of the bark. Food-launch quality, photoreal, ultra clean, no text,
> no logos.

**K3 (the brisket explained)**, reference: K1 (and K2)
> Exploded-view food render of a smoked brisket, floating centred in a pure seamless deep black studio void
> (#0A0A0B), three-quarter elevated angle. Separated into its layers with even gaps, top to bottom:
> 1) the dark peppery bark crust, 2) a thin pink smoke ring layer, 3) the glistening rendered fat cap,
> 4) juicy slices of the lean flat fanned out, 5) a cluster of caramelised burnt-end cubes from the point.
> The smoke ring glows faintly ember orange. Warm rim light from the upper left, delicate light beams, tiny
> drifting embers. Ultra clean, photoreal, premium product-launch aesthetic, lots of negative space, no
> text, no labels, no logos.

**K4 (your table)**, reference: K1
> Use the reference image. Keep the exact same camera angle, framing and lens. The smoker scene becomes a
> warm, lively food hall at night with exposed brick and string lights. In the same spot sits a metal tray
> lined with butcher paper, piled with sliced brisket, burnt ends, ribs and pulled pork, with sides of baked
> beans and fries. Steam rising, glasses of beer nearby, everything glowing in warm amber light. Calm,
> generous, satisfied feeling. Cinematic, photoreal, no people's faces, no text, no logos.

---

## Step 2: the 3 videos

Settings: **image-to-video with a start frame and an end frame, 8 seconds, 16:9, 1080p, no audio.**
These tools support start + end frames: Higgsfield, Topview, Kling, Runway, Luma.
In testing, **Seedance 2.5** followed the story best. MiniMax H3 is a cheaper second choice.

**S1: start K1 → end K2**
> One continuous cinematic shot, no cuts, very slow push-in. The smoked brisket smoothly lifts off the
> smoker grate, trailing wisps of smoke, while the smoker, building and dusk sky slowly dissolve into pure
> seamless black until only the brisket remains, floating in a black void with a warm ember-orange rim
> light. Slow, elegant, photoreal premium food film.

**S2: start K2 → end K3**
> Continuous shot in a black studio void. The floating brisket slowly separates into its layers, sliding
> apart into an exploded view: the bark crust lifts off the top, the pink smoke ring separates, the fat cap
> peels away, the lean flat fans into slices and the point breaks into caramelised burnt-end cubes. Warm
> light beams from the upper left, drifting embers. Slow, precise, premium product film.

**S3: start K3 → end K4**
> Continuous shot. The exploded brisket layers drift back together and settle as sliced brisket and burnt
> ends onto a butcher-paper tray, glowing warmly, as a lively food hall at night materialises out of the
> darkness around it: exposed brick, string lights, ribs, pulled pork, baked beans and fries, steam rising.
> Slow, warm, cinematic.

Watch each clip:
- S1 should end on K2, and S3 should end on K4.
- No warped meat, no text, no faces.
- If one clip is bad, regenerate just that one.

---

## Step 3: send them back

Send these files:
- `seg1.mp4`, `seg2.mp4`, `seg3.mp4`
- `K1.png` to `K4.png`, so the text can be placed around the brisket

The film goes in with one command:

```bash
npm run film -- main "Main" film/seg1.mp4 film/seg2.mp4 film/seg3.mp4 --default
```

Then `filmSubjects` in `src/site.config.js` gets measured from the keyframes, `stills` is cleared, and the
layout QA runs again.

---

## Extras (optional, good for social and ads)

- **Hero loop, 6–8 s:** "Slow push-in on the smoker at dusk, smoke curling from the stack, embers drifting
  up, no cuts, seamless loop." Start and end on K1. Use it as a Facebook cover video.
- **Vertical 9:16 Reels/TikTok cut:** run S1 again at 9:16 with K1 cropped vertically. Caption idea:
  "Smoked low & slow on Main Street."
- **Contact background:** K4 makes a great background for the catering form. Send it and I'll swap it in.

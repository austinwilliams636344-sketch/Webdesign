# Scroll-film storyboards by industry

Every film follows the same 4-keyframe / 3-segment arc, which the template's layout and timing
are built around:

| Keyframe | Role | Where it shows | Must look like |
|---|---|---|---|
| **K1** | The real-world scene (hero) | Hero, behind the form | Photoreal, golden hour or best light, subject centred-right, generous space |
| **K2** | The product/subject **isolated in a black void** | Chapter 1 | Same camera angle as K1, background removed to `#0A0A0B`, warm rim light |
| **K3** | The subject **explained**: exploded view, cross-section, layers, inner workings | Chapter 2 | Black void, labelled-able parts spaced apart, light beams + particles |
| **K4** | The **result**: the same scene as K1, transformed (blue hour, lights on, finished, happy) | Chapter 3 | Same camera as K1, emotional payoff |

Segments: **S1 = K1→K2** (the world dissolves, the subject lifts out), **S2 = K2→K3** (it comes apart /
reveals how it works), **S3 = K3→K4** (it reassembles and returns to the scene, transformed).

Chapter copy follows the same beats: **01 the start / where it begins**, **02 how it works (aside: list of
the parts in K3, 4–6 items)**, **03 the outcome (aside: 3 result stats)**.

Rules that make it work:
- K2 and K3 voids must be pure near-black so the canvas melts into the page (`theme.background`).
- K1 and K4 must share the camera angle and composition; generate K2 and K4 **with K1 as the image
  reference** ("keep the exact same camera angle, framing and lens").
- The subject must be one clear physical object: something that can float, explode and reassemble.
  Choose that object per business below. If the business is a service (law, consulting), use its
  signature artifact (a contract, a key, a chart) rather than people.
- Never put people's faces in the film (consistency breaks, uncanny). Hands are OK in K1/K4 at most.
- Use the client's **real** building/product photo as the K1 image reference when they have a good one.

---

## Home services

### Solar installer (worked example: Aurea)
- **K1** modern home at golden hour, black panel array on the roof
- **K2** the panel array floating in the void, rim light
- **K3** one panel exploded into layers: glass, EVA, glowing cell grid, backsheet, frame, junction box
- **K4** same home at blue hour, windows lit, panels on the roof
- Ch2 list: the panel layers. Ch3 stats: bill reduction, battery kWh, warranty years.
- Particle: `streak`, surface `cells`.

### Roofing
- **K1** house with a fresh slate/tile/metal roof, warm low sun
- **K2** a roof section (tiles + batten) lifted off, floating
- **K3** exploded roof build-up: tiles, battens, counter-battens, breathable membrane, insulation, rafters, flashing
- **K4** same house in heavy rain at dusk, interior lights warm and dry, rain sheeting off the roof
- Ch2 list: roof layers. Ch3 stats: years warranty, leak call-backs (0), roofs completed.
- Particle: `drop`, surface `line`.

### Plumbing / bathrooms
- **K1** a beautiful finished bathroom or kitchen, soft daylight
- **K2** the fixture (tap/shower valve/boiler) floating, chrome rim light
- **K3** exploded cartridge valve or boiler: body, cartridge, seals, spindle, aerator, pipework, water droplets
- **K4** the same room, water running perfectly, steam, morning light
- Particle: `drop`.

### HVAC / heat pumps
- **K1** house in winter dusk, outdoor heat-pump unit beside it, frost
- **K2** the outdoor unit floating
- **K3** exploded heat pump: fan, coil, compressor, expansion valve, refrigerant loop glowing warm/cool
- **K4** same house in snow at night, warm interior glow, faint heat shimmer
- Particle: `spark` (warm) or `drop` (cooling-led brand).

### Electrician / EV chargers / home batteries
- **K1** modern home with garage, EV on the driveway, evening
- **K2** the wall charger / consumer unit floating
- **K3** exploded charger: casing, PCB, relay, cable, connector, glowing current paths
- **K4** same home at night, car charging, lights on
- Particle: `spark`, surface `line`.

### Windows & doors
- **K1** façade with large windows, golden hour
- **K2** one window unit floating
- **K3** exploded triple glazing: panes, spacer bars, argon gap (subtle glow), frame chambers, seals, hardware
- **K4** same façade in a storm at night, warm quiet interior
- Particle: `drop`.

### Pest & termite control (proven: Ben the Bug Man, Oct 2026)
- **K1** the local style of family home (use the client's office/area photo as reference), golden hour, foundation line visible
- **K2** a clean rectangular cutaway of the home's foundation corner (brick wall, wooden sill + joists, concrete
  foundation, soil block with lawn) floating like an architectural model
- **K3** that block exploded: brick, sill/joists with faint termite tunnels, concrete, a glowing translucent
  barrier layer (treated soil) in the brand colour, soil with an in-ground bait station, a few tiny termites
- **K4** same home at blue hour, windows + porch lamp lit, protected
- S3 prompt: "layers slide back together sealed by a soft [brand colour] protective glow, then settle into the
  ground at the corner of the home as the scene materializes". Ch2 list: their actual treatment methods.
- No published prices → the hero form shows their real coupons; `calculator: null`.
- Particle: `drop`, surface `line`.

### Landscaping / garden design
- **K1** bare or overgrown garden at a house, overcast
- **K2** a soil block / planter section floating
- **K3** cross-section layers: plants, mulch, topsoil, drainage gravel, irrigation line, roots glowing
- **K4** the finished garden at golden hour, lights in the planting
- Particle: `drop` (irrigation).

### Pools / spas
- **K1** villa garden with a stunning pool, late sun
- **K2** a water cube / pool section floating
- **K3** cross-section: tiles, membrane, concrete shell, filtration pump, heater, LED lights
- **K4** pool lit at blue hour, steam, glow
- Particle: `drop`.

### Cleaning / pressure washing
- **K1** driveway/façade half grimy
- **K2** a paving slab floating
- **K3** micro view: dirt layer lifting off in particles, clean surface beneath
- **K4** spotless façade, sunlight
- Particle: `drop`.

## Health & beauty

### Dental clinic
- **K1** calm modern clinic interior, soft daylight (no patient faces)
- **K2** a single tooth model floating
- **K3** exploded tooth/implant: crown, abutment, implant screw, bone, gum layers
- **K4** clinic at golden hour, empty chair, plants, warm light
- Particle: `spark` (soft white) or `streak`.

### Physio / chiropractor / gym
- **K1** bright studio/gym interior, morning
- **K2** an anatomical spine or knee model floating
- **K3** exploded joint: bones, cartilage, ligaments, muscle groups glowing
- **K4** studio in evening light, equipment ready
- Particle: `spark`.

### Salon / spa / skincare
- **K1** serene salon or spa interior
- **K2** the hero product bottle floating
- **K3** exploded product: bottle, pump, formula droplets, botanical ingredients orbiting
- **K4** spa at dusk, candles, steam
- Particle: `drop`.

## Food & hospitality

### Restaurant / café / bakery
- **K1** the restaurant façade or dining room, evening glow
- **K2** the signature dish floating
- **K3** the dish deconstructed in layers (bun, patty, sauce… / pastry layers / coffee: crema, shot, milk)
- **K4** full dining room at night, warm, busy-feeling (no faces), candles
- Particle: `spark` (embers) or `drop` (coffee).

### Brewery / winery / distillery
- **K1** brewery/vineyard at golden hour
- **K2** the bottle floating
- **K3** exploded: bottle, liquid column, ingredients (hops, grain, grapes) orbiting, bubbles
- **K4** tasting room at night, glasses lit
- Particle: `drop`.

## Property & construction

### Builder / architect / renovation
- **K1** the empty plot or old house, morning
- **K2** a wall section / building block floating
- **K3** exploded wall build-up: cladding, insulation, frame, membrane, plasterboard
- **K4** the finished house at blue hour, lit
- Particle: `spark` (subtle).

### Real estate agency
- **K1** signature property exterior, golden hour
- **K2** a house key floating (or the house as a miniature model)
- **K3** the miniature house opening up: floors separating, rooms lit
- **K4** the property at night, lit, "sold" mood
- Particle: `streak`.

## Automotive

### Car detailing / garage / EV dealer
- **K1** the car outside the shop, golden hour
- **K2** the car (or a wheel) floating
- **K3** exploded wheel/brake: tyre, rim, disc, caliper, pads — or paint layers: clear coat, colour, primer, metal
- **K4** gleaming car at night under studio light
- Particle: `drop` (detailing) / `spark` (mechanics).

## Professional & tech

### Law / accounting / financial advice
- **K1** the office building or a refined desk, morning light
- **K2** a sealed document / leather folder floating
- **K3** document layers fanning out: pages, seal, signature, clauses glowing
- **K4** office at dusk, city lights, calm
- Particle: `streak`.

### SaaS / agency / tech product
- **K1** the device (laptop/phone) on a desk, soft daylight, product UI on screen
- **K2** the device floating in the void
- **K3** exploded device or UI layers stacked in 3D: data, logic, interface glowing
- **K4** the device in a night setting, glowing with the finished product
- Particle: `spark`, surface `cells`.

---

## If the industry is not listed
Pick: (1) the **place** the customer sees (K1/K4), (2) the **one object** the business is really about (K2),
(3) **what's inside it or how it's built** (K3), (4) the **feeling after** (K4: night/rain/snow/glow versions of K1
read as "it works"). Write it as the four lines above before generating anything.

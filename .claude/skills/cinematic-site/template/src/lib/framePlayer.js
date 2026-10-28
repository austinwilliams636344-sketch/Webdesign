// Scroll-driven image-sequence player.
//
// Why it's built this way:
// - Frames are fetched as compressed blobs (cheap to keep in memory, ~70 KB each).
// - Only a window of frames around the playhead is decoded, with createImageBitmap(blob),
//   which decodes off the main thread. Drawing during scroll is then a pure GPU blit,
//   so there is never a synchronous decode mid-scroll (the cause of visible hitches).
// - Fractional playheads crossfade between neighbouring frames, so slow scrolling reads
//   as continuous motion instead of stepping.
// - Rendering happens once per animation frame and only when the playhead moved.

const AHEAD = 20
const BEHIND = 6
const KEEP_AHEAD = 28
const KEEP_BEHIND = 10
const MAX_DECODING = 6
// decode order relative to the playhead: frames ahead in the scroll direction first, then behind
const OFFSETS = [
  ...Array.from({ length: AHEAD + 1 }, (_, d) => d),
  ...Array.from({ length: BEHIND }, (_, d) => -(d + 1)),
]

function coarseToFine(count) {
  const order = [0, count - 1]
  const seen = new Set(order)
  for (const step of [32, 16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i) }
  }
  return order
}

// A framing stage says where the film sits on screen:
//   { cover, cx, cy }      fill the viewport (cover × zoom), centred at cx/cy, never showing an edge
//   { box, subject }       fit the `subject` part of the frame (fractions of the frame) inside
//                          `box` (fractions of the viewport), e.g. the right half beside a text column
// setStage(t) blends between stage floor(t) and ceil(t).
function stageRect(stage, W, H, fw, fh) {
  if (stage.cover) {
    const s = Math.max(W / fw, H / fh) * stage.cover
    const w = fw * s
    const h = fh * s
    const x = Math.min(0, Math.max(W - w, stage.cx * W - w / 2))
    const y = Math.min(0, Math.max(H - h, stage.cy * H - h / 2))
    return [x, y, w, h]
  }
  const [x0, y0, x1, y1] = stage.box
  const [sx0, sy0, sx1, sy1] = stage.subject
  const s = Math.min(((x1 - x0) * W) / ((sx1 - sx0) * fw), ((y1 - y0) * H) / ((sy1 - sy0) * fh))
  const x = ((x0 + x1) / 2) * W - ((sx0 + sx1) / 2) * fw * s
  const y = ((y0 + y1) / 2) * H - ((sy0 + sy1) / 2) * fh * s
  return [x, y, fw * s, fh * s]
}

export function createFramePlayer(canvas, { count, src, stages: initialStages, background = '#0A0A0B', concurrency = 8 }) {
  const ctx = canvas.getContext('2d', { alpha: false })
  const blobs = Array.from({ length: count }) // undefined: not requested, null: in flight, Blob: ready
  const bitmaps = new Map()
  const decoding = new Set()
  const order = coarseToFine(count)
  let cursor = 0
  let inFlight = 0
  let destroyed = false

  let playhead = 0
  let lastDrawn = -1
  let dirty = true
  let direction = 1
  let size = null
  let stages = initialStages || [{ cover: 1, cx: 0.5, cy: 0.5 }]
  let stageRects = null
  let stage = 0
  const bg = background.match(/\w\w/g).map((h) => parseInt(h, 16)).join(',')

  // ---------- network ----------
  const nextToFetch = () => {
    // frames the viewer is about to reach jump the queue
    const p = Math.round(playhead)
    for (let d = 0; d <= AHEAD * 2; d++) {
      const i = p + d * direction
      if (i >= 0 && i < count && blobs[i] === undefined) return i
    }
    while (cursor < order.length && blobs[order[cursor]] !== undefined) cursor++
    return cursor < order.length ? order[cursor++] : -1
  }

  const pump = () => {
    while (!destroyed && inFlight < concurrency) {
      const i = nextToFetch()
      if (i < 0) return
      blobs[i] = null
      inFlight++
      fetch(src(i))
        .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
        .then((b) => { blobs[i] = b })
        .catch(() => { blobs[i] = undefined })
        .finally(() => { inFlight--; pump() })
    }
  }

  // ---------- decoding window ----------
  const decode = (i) => {
    decoding.add(i)
    createImageBitmap(blobs[i])
      .then((bmp) => {
        decoding.delete(i)
        if (destroyed) return bmp.close()
        bitmaps.set(i, bmp)
        if (!size) { size = [bmp.width, bmp.height]; measure() }
        if (Math.abs(i - playhead) < 2 || lastDrawn < 0) dirty = true
      })
      .catch(() => decoding.delete(i))
  }

  const warm = () => {
    const p = Math.round(playhead)
    for (const off of OFFSETS) {
      if (decoding.size >= MAX_DECODING) break
      const i = p + off * direction
      if (i < 0 || i >= count || bitmaps.has(i) || decoding.has(i) || !blobs[i]) continue
      decode(i)
    }
    for (const [i, bmp] of bitmaps) {
      const rel = (i - p) * direction
      if (rel < -KEEP_BEHIND || rel > KEEP_AHEAD) { bmp.close(); bitmaps.delete(i) }
    }
  }

  // ---------- drawing ----------
  function measure() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== w) canvas.width = w
    if (canvas.height !== h) canvas.height = h
    if (!size) return
    stageRects = stages.map((st) => stageRect(st, w, h, size[0], size[1]))
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    dirty = true
  }

  const nearestBitmap = (i) => {
    if (bitmaps.has(i)) return [i, bitmaps.get(i)]
    for (let d = 1; d < count; d++) {
      // prefer the frame we came from, so a late frame never jumps ahead of the scroll
      if (bitmaps.has(i - d * direction)) return [i - d * direction, bitmaps.get(i - d * direction)]
      if (bitmaps.has(i + d * direction)) return [i + d * direction, bitmaps.get(i + d * direction)]
    }
    return [-1, null]
  }

  const currentRect = () => {
    const t = Math.max(0, Math.min(stageRects.length - 1, stage))
    const i = Math.floor(t)
    const f = t - i
    const a = stageRects[i]
    const b = stageRects[Math.min(i + 1, stageRects.length - 1)]
    return a.map((v, k) => v + (b[k] - v) * f)
  }

  // Soft edges wherever the film rectangle sits inside the viewport.
  const feather = ([x, y, w, h]) => {
    const W = canvas.width
    const H = canvas.height
    const fx = w * 0.18
    const fy = h * 0.2
    const band = (x0, y0, x1, y1, rx, ry, rw, rh) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1)
      g.addColorStop(0, `rgba(${bg},1)`)
      g.addColorStop(1, `rgba(${bg},0)`)
      ctx.fillStyle = g
      ctx.fillRect(rx, ry, rw, rh)
    }
    if (x > 0.5) band(x, 0, x + fx, 0, x, y, fx, h)
    if (x + w < W - 0.5) band(x + w, 0, x + w - fx, 0, x + w - fx, y, fx, h)
    if (y > 0.5) band(0, y, 0, y + fy, x, y, w, fy)
    if (y + h < H - 0.5) band(0, y + h, 0, y + h - fy, x, y + h - fy, w, fy)
  }

  const render = () => {
    if (destroyed || !stageRects) return
    if (!dirty && playhead === lastDrawn) return
    const base = Math.floor(playhead)
    const frac = playhead - base
    const [i0, a] = nearestBitmap(base)
    if (!a) return
    ctx.globalAlpha = 1
    ctx.fillStyle = background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const rect = currentRect()
    ctx.drawImage(a, rect[0], rect[1], rect[2], rect[3])
    const b = bitmaps.get(base + 1)
    if (frac > 0.04 && i0 === base && b) {
      ctx.globalAlpha = frac
      ctx.drawImage(b, rect[0], rect[1], rect[2], rect[3])
      ctx.globalAlpha = 1
    }
    feather(rect)
    lastDrawn = i0 === base ? playhead : -1 // keep redrawing until the exact frame lands
    dirty = false
  }

  const tick = () => {
    render()
    warm()
  }

  const onResize = () => measure()
  window.addEventListener('resize', onResize)
  measure()
  pump()

  return {
    tick,
    seek(frame) {
      const f = Math.max(0, Math.min(count - 1, frame))
      if (f !== playhead) direction = f > playhead ? 1 : -1
      playhead = f
    },
    setStage(t) {
      if (t !== stage) { stage = t; dirty = true }
    },
    setStages(next) {
      stages = next
      measure()
    },
    destroy() {
      destroyed = true
      window.removeEventListener('resize', onResize)
      for (const bmp of bitmaps.values()) bmp.close()
      bitmaps.clear()
    },
  }
}

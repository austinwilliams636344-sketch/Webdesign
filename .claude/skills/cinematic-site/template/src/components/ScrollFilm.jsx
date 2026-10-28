import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown } from 'lucide-react'
import HeroForm from './HeroForm.jsx'
import site from '../site.config.js'
import { FILMS, framePath } from '../frames.js'
import { createFramePlayer } from '../lib/framePlayer.js'

gsap.registerPlugin(ScrollTrigger)

const H2 = 'font-display text-[34px] font-bold leading-[1] tracking-tighter sm:text-5xl side:text-[56px]'
const BODY = 'mt-4 text-[15px] leading-relaxed text-ink/70 sm:text-base side:mt-6 side:text-lg'

// Chapter text never shares space with the film's subject:
// stacked screens put it in the bottom half (film in the top half, see stagesFor),
// wide screens put it in a left column (film on the right).
function Chapter({ className, children }) {
  return (
    <div className={`${className} invisible absolute inset-0 z-10 flex items-end pb-8 sm:pb-12 side:items-center side:pb-0`}>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-background via-background/90 to-transparent side:inset-y-0 side:left-0 side:right-auto side:h-auto side:w-[50%] side:bg-gradient-to-r side:via-background/70" />
      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-xl side:max-w-[min(28rem,34vw)]">{children}</div>
      </div>
    </div>
  )
}

function Aside({ aside, index }) {
  if (!aside) return null
  if (aside.type === 'stat')
    return (
      <div className="mt-8 hidden items-baseline gap-4 border-t border-white/10 pt-6 side:flex">
        <p className="shrink-0 font-display text-4xl font-bold tracking-tighter gradient-text">{aside.value}</p>
        <p className="text-sm leading-relaxed text-ink/60">{aside.text}</p>
      </div>
    )
  if (aside.type === 'list')
    return (
      <ul className="mt-7 hidden grid-cols-2 gap-x-5 gap-y-3 border-t border-white/10 pt-6 side:grid">
        {aside.items.map((l, i) => (
          <li key={l.t} className={`ch${index + 1}-item flex items-start gap-2.5`}>
            <span className="mt-[3px] font-mono text-[10px] text-primary">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="block text-[13px] font-semibold leading-snug text-ink">{l.t}</span>
              <span className="block text-[11px] leading-snug text-ink/50">{l.d}</span>
            </span>
          </li>
        ))}
      </ul>
    )
  return (
    <div className="mt-6 grid grid-cols-3 gap-2.5 side:mt-8">
      {aside.items.map(([v, l]) => (
        <div key={l} className={`ch${index + 1}-item film-card rounded-2xl px-3 py-3 side:px-4 side:py-4`}>
          <p className="font-display text-xl font-bold tracking-tighter text-ink side:text-2xl">{v}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-ink/55">{l}</p>
        </div>
      ))}
    </div>
  )
}

const SIDE_QUERY = '(min-width: 1100px) and (min-aspect-ratio: 6/5)' // = the `side` screen in tailwind.config.js
const LANDSCAPE_QUERY = '(orientation: landscape)'
const SHORT_QUERY = '(max-width: 639px) and (max-height: 739px)' // = the `short` screen

// Where the film sits for each stage (hero, chapter 1, 2, 3), per layout. See framePlayer.js.
// box = where on screen (fractions of the viewport); subject = which part of the frame must fit.
const narrow = ([x0, y0, x1, y1], k = 0.06) => [x0 + k, y0, x1 - k, y1] // phones crop the sides a little
function stagesFor(layout) {
  const s = site.filmSubjects
  if (layout === 'side')
    return [
      { box: [0.44, 0, 1.06, 1], subject: s.hero }, // scene beside the headline, behind the form
      { box: [0.44, 0.14, 0.93, 0.88], subject: s.ch1 },
      { box: [0.44, 0.12, 0.93, 0.9], subject: s.ch2 },
      { box: [0.48, 0.14, 0.97, 0.88], subject: s.ch3 },
    ]
  const chapters = [
    { box: [0.02, 0.11, 0.98, 0.46], subject: narrow(s.ch1) },
    { box: [0.02, 0.1, 0.98, 0.47], subject: narrow(s.ch2, 0.04) },
    { box: [0, 0.1, 1, 0.47], subject: narrow(s.ch3, 0.02) },
  ]
  if (layout === 'landscape') return [{ box: [0.52, 0, 1.12, 1], subject: s.hero }, ...chapters]
  if (layout === 'short') return [{ box: [0.02, 0.08, 0.98, 0.25], subject: narrow(s.hero, 0.03) }, ...chapters]
  return [{ box: [0.02, 0.085, 0.98, 0.27], subject: narrow(s.hero, 0.03) }, ...chapters] // phones: band above the headline
}

export default function ScrollFilm({ film }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  // Shared between the player (recreated when the film changes) and the scroll timeline (created once).
  const playerRef = useRef(null)
  const progressRef = useRef(0)
  const camRef = useRef({ t: 0 })
  const { hero, chapters } = site

  // Frame player: one per film, so switching films keeps the scroll position and the timeline.
  useEffect(() => {
    if (!FILMS[film]) return // no film extracted yet (fresh template): the page still works
    // Phones get the 1280px set, everything else full HD.
    const set = window.matchMedia('(max-width: 767px)').matches ? 'sd' : 'hd'
    const side = window.matchMedia(SIDE_QUERY)
    const landscape = window.matchMedia(LANDSCAPE_QUERY)
    const short = window.matchMedia(SHORT_QUERY)
    const layout = () => stagesFor(side.matches ? 'side' : landscape.matches ? 'landscape' : short.matches ? 'short' : 'stack')
    const { count } = FILMS[film]
    const player = createFramePlayer(canvas.current, { count, src: (i) => framePath(film, i, set), stages: layout() })
    player.count = count
    player.seek(progressRef.current * (count - 1))
    player.setStage(camRef.current.t)
    playerRef.current = player
    const onLayout = () => player.setStages(layout())
    for (const mq of [side, landscape, short]) mq.addEventListener('change', onLayout)
    gsap.ticker.add(player.tick)
    return () => {
      for (const mq of [side, landscape, short]) mq.removeEventListener('change', onLayout)
      gsap.ticker.remove(player.tick)
      player.destroy()
      if (playerRef.current === player) playerRef.current = null
    }
  }, [film])

  // Scroll timeline: created once.
  useEffect(() => {
    const cam = camRef.current
    const moveCam = () => playerRef.current?.setStage(cam.t)
    const state = { p: 0 }
    const dots = wrap.current.querySelectorAll('.film-dot')
    let activeDot = -1

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('.hero-line', { yPercent: 110, duration: 1.3, ease: 'power4.out', stagger: 0.12, delay: 0.2 })
      gsap.from('.hero-fade', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.6 })
      gsap.from('.hero-form', { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.8 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          // Lenis already smooths the scroll; a second lag here made it feel late.
          scrub: true,
          onUpdate: (self) => {
            gsap.set('.film-progress', { scaleY: self.progress })
            const active = Math.min(3, Math.floor(self.progress * 4.05))
            if (active !== activeDot) {
              activeDot = active
              dots.forEach((el, i) => el.classList.toggle('is-active', i <= active))
            }
          },
        },
      })

      // The film spans the whole timeline (0 → 1). Segment 1 ≈ 0–0.33, 2 ≈ 0.33–0.67, 3 ≈ 0.67–1.
      tl.to(state, {
        p: 1,
        duration: 1,
        onUpdate: () => {
          progressRef.current = state.p
          const player = playerRef.current
          if (player) player.seek(state.p * (player.count - 1))
        },
      }, 0)

      // Camera: the film glides into the space beside each chapter's text
      tl.to(cam, { t: 1, duration: 0.08, ease: 'power2.inOut', onUpdate: moveCam }, 0.05)
      tl.to(cam, { t: 2, duration: 0.08, ease: 'power2.inOut', onUpdate: moveCam }, 0.33)
      tl.to(cam, { t: 3, duration: 0.09, ease: 'power2.inOut', onUpdate: moveCam }, 0.68)

      // Hero out
      tl.to('.hero-copy', { autoAlpha: 0, y: -80, duration: 0.06, ease: 'power1.in' }, 0.035)
      tl.to('.hero-form', { autoAlpha: 0, y: -60, duration: 0.05, ease: 'power1.in' }, 0.045)
      tl.to('.hero-scrim', { opacity: 0, duration: 0.08 }, 0.04)
      tl.to('.hero-meta-row', { autoAlpha: 0, duration: 0.04 }, 0.02)

      // Chapters: in/out windows on the timeline
      const windows = [[0.13, 0.29], [0.4, 0.64], [0.8, null]]
      windows.forEach(([inAt, outAt], i) => {
        const el = `.ch${i + 1}`
        tl.fromTo(el, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, inAt)
        if (wrap.current.querySelector(`.ch${i + 1}-item`))
          tl.fromTo(`.ch${i + 1}-item`, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.03, stagger: 0.012, ease: 'power2.out' }, inAt + 0.05)
        if (outAt) tl.to(el, { autoAlpha: 0, y: -60, duration: 0.05, ease: 'power2.in' }, outAt)
      })
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={wrap} className="relative" style={{ height: '640vh' }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full [transform:translateZ(0)]" aria-hidden="true" />

        {/* Edge blending so the film melts into the page */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_90%_at_50%_45%,transparent_55%,theme(colors.background/85%)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/80 to-transparent" />
        <div className="hero-scrim pointer-events-none absolute inset-0 bg-gradient-to-r from-background/90 via-background/45 to-background/10 lg:to-background/30" />

        {/* ───────────── HERO ───────────── */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pt-20 pb-6 sm:justify-center sm:px-10 sm:pt-24 sm:pb-28 lg:px-16">
          <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-12">
            <div className="hero-copy lg:col-span-7">
              <p className="hero-fade eyebrow mb-6 hidden items-center gap-3 text-primary sm:flex">
                <span className="ring-pulse inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {hero.eyebrow}
              </p>
              <h1 className="font-display text-[42px] font-semibold leading-[0.92] tracking-[-0.055em] text-ink [text-shadow:0_2px_40px_theme(colors.background/45%)] short:text-[34px] sm:text-[68px] lg:text-[80px] xl:text-[88px]">
                {hero.lines.map((line) => (
                  <span key={line} className="-mb-[0.16em] block overflow-hidden pb-[0.16em]">
                    <span className="hero-line block">{line}</span>
                  </span>
                ))}
                <span className="block overflow-hidden pb-[0.2em] pr-[0.1em]">
                  <span className="hero-line gradient-text block pr-[0.06em] font-serif text-[46px] font-normal italic leading-[0.95] tracking-[-0.02em] [text-shadow:none] short:text-[38px] sm:text-[76px] lg:text-[88px] xl:text-[96px]">
                    {hero.flourish}
                  </span>
                </span>
              </h1>
              <p className="hero-fade mt-5 hidden max-w-[27rem] text-base leading-relaxed text-ink/65 [text-wrap:pretty] sm:block sm:text-[17px]">{hero.sub}</p>
            </div>
            <div className="hero-form lg:col-span-5 lg:pl-6">
              <HeroForm />
            </div>
          </div>
        </div>

        <div className="hero-meta-row absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 pb-8 sm:px-10 lg:px-16">
            <div className="hero-fade hidden items-center gap-6 text-[13px] text-ink/60 md:flex xl:gap-8">
              {hero.meta.map(({ icon: Icon, text, filled }) => (
                <span key={text} className="flex items-center gap-2 whitespace-nowrap">
                  <Icon className={`h-4 w-4 text-primary ${filled ? 'fill-primary' : ''}`} strokeWidth={2.2} /> {text}
                </span>
              ))}
            </div>
            <div className="hero-fade hidden items-center gap-3 text-ink/60 sm:flex">
              <span className="eyebrow whitespace-nowrap">{hero.scrollCue}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">
                <ArrowDown className="h-4 w-4 animate-float" />
              </span>
            </div>
          </div>
        </div>

        {/* ───────────── CHAPTERS ───────────── */}
        {chapters.map((c, i) => (
          <Chapter key={c.eyebrow} className={`ch${i + 1}`}>
            <p className="eyebrow mb-4 text-primary side:mb-5">{c.eyebrow}</p>
            <h2 className={H2}>
              {c.title} <span className="font-serif font-medium italic text-primary-light">{c.flourish}</span>
            </h2>
            <p className={BODY}>{c.body}</p>
            <Aside aside={c.aside} index={i} />
          </Chapter>
        ))}

        {/* Progress rail */}
        <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
          <div className="relative flex h-56 flex-col justify-between">
            <div className="absolute left-[3px] top-0 h-full w-px bg-white/10" />
            <div className="film-progress absolute left-[3px] top-0 h-full w-px origin-top scale-y-0 bg-primary" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="film-dot group relative flex items-center gap-3">
                <span className="relative h-[7px] w-[7px] rounded-full border border-white/30 bg-background transition-colors duration-500 group-[.is-active]:border-primary group-[.is-active]:bg-primary" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 transition-colors duration-500 group-[.is-active]:text-ink/80">
                  {String(i).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

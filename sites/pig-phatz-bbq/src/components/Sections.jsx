import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Star, BadgeCheck, MousePointer2, Bell, CalendarCheck } from 'lucide-react'
import site from '../site.config.js'

gsap.registerPlugin(ScrollTrigger)

function useReveal(ref, selector = '.reveal') {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(selector).forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
    }, ref)
    return () => ctx.revert()
  }, [ref, selector])
}

function SectionHead({ eyebrow, title, flourish, text, dark = true, center = false }) {
  return (
    <div className={`reveal max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className={`eyebrow mb-5 ${dark ? 'text-primary' : 'text-primary-dark'}`}>{eyebrow}</p>
      <h2 className={`font-display text-3xl font-bold leading-[1.02] tracking-tighter sm:text-5xl lg:text-6xl ${dark ? 'text-ink' : 'text-paper-ink'}`}>
        {title} <span className={`font-serif font-medium italic ${dark ? 'text-primary-light' : 'text-primary-dark'}`}>{flourish}</span>
      </h2>
      {text && <p className={`mt-6 text-base leading-relaxed sm:text-lg ${dark ? 'text-ink/65' : 'text-paper-ink/65'} ${center ? 'mx-auto max-w-xl' : 'max-w-xl'}`}>{text}</p>}
    </div>
  )
}

/* ───────────────────────── Marquee ───────────────────────── */
export function Marquee() {
  const Icon = site.marqueeIcon
  return (
    <div className="relative overflow-hidden border-y border-divider bg-background py-6">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {[...site.marquee, ...site.marquee].map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-lg font-semibold tracking-tight text-ink/40">
            {t} <Icon className="h-4 w-4 text-primary/70" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── Pillars (CountUp) ───────────────────────── */
function CountUp({ end, decimals = 0, suffix = '', prefix = '', duration = 2000 }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration)
        setVal(end * (1 - Math.pow(1 - p, 4)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(ref.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [end, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

export function Pillars() {
  const ref = useRef(null)
  useReveal(ref)
  const p = site.pillars
  return (
    <section ref={ref} className="relative bg-background py-24 sm:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <SectionHead eyebrow={p.eyebrow} title={p.title} flourish={p.flourish} />
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-4xl border border-divider bg-divider lg:grid-cols-4">
          {p.stats.map((s) => (
            <div key={s.label} className="reveal bg-background p-6 sm:p-10">
              <p className="font-display text-4xl font-bold tracking-tighter sm:text-6xl gradient-text"><CountUp {...s} /></p>
              <p className="mt-3 text-sm text-ink/55">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Features (3 animated cards) ───────────────────────── */
function Notifications({ items }) {
  const tones = ['text-primary', 'text-accent', 'text-primary-light']
  const [cards, setCards] = useState(items.map((it, i) => ({ ...it, tone: tones[i % 3] })))
  useEffect(() => {
    const id = setInterval(() => setCards((c) => [...c.slice(1), c[0]]), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative h-44">
      {cards.map((c, i) => {
        const Icon = c.icon
        return (
          <div
            key={c.t}
            className="absolute inset-x-0 top-0 flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-surface p-4 shadow-2xl transition-all duration-700 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)]"
            style={{ transform: `translateY(${i * 22}px) scale(${1 - i * 0.05})`, opacity: Math.max(0, 1 - i * 0.3), zIndex: 3 - i }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5"><Icon className={`h-5 w-5 ${c.tone}`} strokeWidth={2.2} /></span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{c.t}</p>
              <p className="truncate text-xs text-ink/50">{c.d}</p>
            </div>
            <Bell className="ml-auto h-3.5 w-3.5 text-ink/30" />
          </div>
        )
      })}
    </div>
  )
}

// Signature animation: particles rain onto a surface and ripple on impact, with a live counter.
function Signature({ particle = 'streak', surface = 'cells', counter }) {
  const drops = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ left: 6 + ((i * 37) % 88), delay: (i * 0.53) % 3.6, dur: 1.6 + ((i * 7) % 10) / 10 })),
    [],
  )
  const [n, setN] = useState(counter.start)
  useEffect(() => {
    const id = setInterval(() => setN((k) => k + counter.step), 260)
    return () => clearInterval(id)
  }, [counter.step])
  return (
    <div className="relative h-44 overflow-hidden rounded-2xl border border-white/[0.06] bg-[radial-gradient(80%_100%_at_50%_0%,theme(colors.primary/18%),transparent_70%)]">
      {drops.map((d, i) => (
        <span key={i} className="absolute top-0" style={{ left: `${d.left}%` }}>
          <span className={`particle particle-${particle}`} style={{ animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
          <span className="particle-ripple" style={{ animationDelay: `${d.delay + d.dur * 0.72}s`, animationDuration: `${d.dur}s` }} />
        </span>
      ))}
      {surface === 'cells' ? (
        <div className="absolute inset-x-4 bottom-4 grid h-10 grid-cols-12 gap-[2px] rounded-md border border-white/10 bg-surface p-[2px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="rounded-[2px] bg-gradient-to-b from-white/[0.09] to-white/[0.03]" />
          ))}
        </div>
      ) : (
        <div className="absolute inset-x-4 bottom-7 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      )}
      <div className="absolute right-4 top-3 text-right">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">{counter.label}</p>
        <p className="font-display text-xl font-bold tracking-tight text-ink">
          {n.toFixed(counter.decimals ?? 2)} <span className="text-xs font-medium text-ink/50">{counter.unit}</span>
        </p>
      </div>
    </div>
  )
}

function Booking({ heading, note, confirm }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 4), 1400)
    return () => clearInterval(id)
  }, [])
  const target = 3
  return (
    <div className="relative h-44 rounded-2xl border border-white/[0.06] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-ink/80">{heading}</p>
        <p className="font-mono text-[10px] text-ink/40">{note}</p>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={i} className={`flex h-14 flex-col items-center justify-center rounded-lg border text-xs transition-all duration-500 ${i === target && phase >= 2 ? 'border-primary bg-primary text-background' : 'border-white/[0.06] bg-white/[0.02] text-ink/60'} ${i > 4 ? 'opacity-40' : ''}`}>
            <span className="font-medium">{d}</span>
            <span className="mt-0.5 font-mono text-[10px]">{20 + i}</span>
          </div>
        ))}
      </div>
      <div className={`mt-3 flex items-center gap-2 text-xs transition-opacity duration-500 ${phase === 3 ? 'opacity-100' : 'opacity-0'}`}>
        <CalendarCheck className="h-4 w-4 text-primary" /> <span className="text-ink/80">{confirm}</span>
      </div>
      <MousePointer2
        className="pointer-events-none absolute h-5 w-5 fill-ink text-background transition-all duration-1000 ease-out"
        style={{ left: phase === 0 ? '85%' : `${14 + target * 12.4}%`, top: phase === 0 ? '80%' : '52%', transform: phase === 2 ? 'scale(0.85)' : 'scale(1)' }}
      />
    </div>
  )
}

const WIDGETS = { notifications: Notifications, signature: Signature, booking: Booking }

export function Features() {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section className="relative bg-background pb-24 sm:pb-32" ref={ref}>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:px-10 md:grid-cols-3 lg:px-16">
        {site.features.map((c) => {
          const Widget = WIDGETS[c.kind]
          return (
            <article key={c.k} className="reveal group rounded-4xl border border-divider bg-gradient-to-b from-surface to-background p-6 transition-colors duration-500 hover:border-white/15 sm:p-8">
              <Widget {...c} />
              <p className="eyebrow mt-8 text-primary">{c.k}</p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{c.d}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ───────────────────────── Calculator ───────────────────────── */
export function Calculator() {
  const ref = useRef(null)
  useReveal(ref)
  const c = site.calculator
  const [value, setValue] = useState(c?.slider.default ?? 0)
  const [toggles, setToggles] = useState(() => Object.fromEntries((c?.toggles ?? []).map((t) => [t.key, t.default])))
  if (!c) return null
  const r = c.compute(value, toggles)

  return (
    <section id="calculator" ref={ref} className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={c.eyebrow} title={c.title} flourish={c.flourish} text={c.text} />
            <div className="reveal mt-10 space-y-8">
              <label className="block">
                <span className="mb-4 flex items-baseline justify-between text-sm text-ink/60">{c.slider.label} <span className="font-display text-2xl font-semibold text-ink">{c.slider.format(value)}</span></span>
                <input type="range" min={c.slider.min} max={c.slider.max} step={c.slider.step} value={value} onChange={(e) => setValue(+e.target.value)} className="w-full" aria-label={c.slider.label} />
              </label>
              {c.toggles.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {c.toggles.map(({ key, label, icon: Icon }) => {
                    const on = toggles[key]
                    return (
                      <button key={key} onClick={() => setToggles((t) => ({ ...t, [key]: !t[key] }))} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${on ? 'border-primary/50 bg-primary/10' : 'border-divider bg-surface hover:border-white/15'}`}>
                        <Icon className={`h-5 w-5 ${on ? 'text-primary' : 'text-ink/40'}`} strokeWidth={2.2} />
                        <span className="text-sm font-medium text-ink">{label}</span>
                        <span className={`ml-auto h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${on ? 'bg-primary' : 'bg-white/10'}`}>
                          <span className={`block h-4 w-4 rounded-full bg-background transition-transform ${on ? 'translate-x-4' : ''}`} />
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="reveal lg:col-span-6 lg:col-start-7">
            <div className="glass rounded-5xl p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-ink/55">{r.headlineLabel}</p>
                  <p className="mt-1 font-display text-5xl font-bold tracking-tighter sm:text-7xl gradient-text">{r.headline}</p>
                </div>
                {r.badge && <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] text-primary">{r.badge}</span>}
              </div>
              {r.bars && (
                <div className="mt-10 flex h-36 items-end gap-1.5 sm:gap-2.5">
                  {r.bars.map((b, i) => (
                    <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <div className="w-full rounded-t-md bg-gradient-to-t from-primary-dark/50 to-primary-light transition-all duration-700" style={{ height: `${Math.max(2, b * 100)}%` }} />
                      <span className="font-mono text-[9px] text-ink/35">{r.barLabels?.[i] ?? ''}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-divider sm:grid-cols-4">
                {r.stats.map(([k, v]) => (
                  <div key={k} className="bg-surface p-4">
                    <p className="text-[11px] text-ink/45">{k}</p>
                    <p className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">{v}</p>
                  </div>
                ))}
              </div>
              <a href="#contact" className="magnetic-btn mt-8 flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-background">
                {c.cta} <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Process (sticky stack) ───────────────────────── */
export function Process() {
  const ref = useRef(null)
  const p = site.process
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.stack-card')
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        gsap.to(card.querySelector('.stack-inner'), {
          scale: 0.9, opacity: 0.35, filter: 'blur(6px)', ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 15%', scrub: true },
        })
      })
      gsap.from('.proto-head', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.proto-head', start: 'top 85%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="process" ref={ref} className="relative bg-paper py-24 text-paper-ink sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="proto-head mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 text-primary-dark">{p.eyebrow}</p>
            <h2 className="font-display text-3xl font-bold leading-[1.02] tracking-tighter sm:text-5xl lg:text-6xl">
              {p.title} <span className="font-serif font-medium italic text-primary-dark">{p.flourish}</span>
            </h2>
          </div>
          <p className="max-w-sm text-paper-ink/60">{p.text}</p>
        </div>
        <div className="space-y-6">
          {p.steps.map((s, i) => (
            <div key={s.t} className="stack-card sticky top-24">
              <div className="stack-inner grid origin-top overflow-hidden rounded-5xl bg-paper-ink text-ink shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)] lg:min-h-[520px] lg:grid-cols-2">
                <div className="flex flex-col justify-between p-8 sm:p-12">
                  <div>
                    <p className="font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')} / {String(p.steps.length).padStart(2, '0')}</p>
                    <h3 className="mt-6 font-display text-4xl font-bold tracking-tighter sm:text-6xl">{s.t},</h3>
                    <p className="font-serif text-3xl italic text-primary-light sm:text-4xl">{s.f}</p>
                    <p className="mt-6 max-w-md leading-relaxed text-ink/65">{s.d}</p>
                  </div>
                  <div className="mt-10 flex flex-wrap gap-2">
                    {s.meta.map((m) => <span key={m} className="rounded-full border border-white/10 px-4 py-2 text-xs text-ink/70">{m}</span>)}
                  </div>
                </div>
                <div className="relative min-h-[260px] overflow-hidden">
                  <img src={s.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-paper-ink/70 via-transparent to-transparent lg:from-paper-ink/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Services grid ───────────────────────── */
export function Services() {
  const ref = useRef(null)
  useReveal(ref)
  const s = site.services
  return (
    <section id="services" ref={ref} className="relative bg-deep py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHead eyebrow={s.eyebrow} title={s.title} flourish={s.flourish} />
          {s.images?.length === 2 && (
            <div className="reveal grid grid-cols-2 gap-3 sm:w-[440px]">
              <img src={s.images[0].src} alt={s.images[0].alt} loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover" />
              <img src={s.images[1].src} alt={s.images[1].alt} loading="lazy" className="mt-10 aspect-[4/5] w-full rounded-3xl object-cover" />
            </div>
          )}
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-4xl border border-divider bg-divider sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map(({ icon: Icon, t, d }) => (
            <a key={t} href="#contact" className="reveal group relative bg-deep p-8 transition-colors duration-500 hover:bg-surface sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-6 w-6 text-primary" strokeWidth={2.2} />
              </span>
              <h3 className="mt-8 font-display text-xl font-semibold tracking-tight text-ink">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/55">{d}</p>
              <ArrowUpRight className="absolute right-8 top-8 h-5 w-5 text-ink/20 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Reviews + trust ───────────────────────── */
export function Reviews() {
  const ref = useRef(null)
  useReveal(ref)
  const r = site.reviews
  return (
    <section id="reviews" ref={ref} className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <SectionHead eyebrow={r.eyebrow} title={r.title} flourish={r.flourish} center />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {r.items.map((it) => (
            <figure key={it.n} className="reveal flex flex-col rounded-4xl border border-divider bg-surface p-8">
              <div className="flex gap-1">{Array.from({ length: it.stars ?? 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}</div>
              <blockquote className="mt-6 flex-1 font-serif text-xl leading-snug text-ink/90 sm:text-[22px]">“{it.q}”</blockquote>
              <figcaption className="mt-8 border-t border-divider pt-5">
                <p className="text-sm font-semibold text-ink">{it.n}</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink/45">{it.p}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {r.trust.map(({ icon: Icon, t, d }) => (
            <div key={t} className="reveal flex items-start gap-4 rounded-3xl border border-divider p-6">
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" strokeWidth={2.2} />
              <div>
                <p className="font-semibold text-ink">{t}</p>
                <p className="mt-1 text-sm text-ink/55">{d}</p>
              </div>
              <BadgeCheck className="ml-auto h-4 w-4 shrink-0 text-ink/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

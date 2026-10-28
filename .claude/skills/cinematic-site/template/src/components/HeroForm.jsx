import { useState } from 'react'
import { ArrowRight, ArrowLeft, MapPin, Loader2, Check } from 'lucide-react'
import site from '../site.config.js'

// Two-step lead form: field + slider with a live estimate → contact details → result cards.
// Mock submit (no backend). Wire `submit` to a CRM/webhook for a live client site.
export default function HeroForm() {
  const q = site.quote
  const [step, setStep] = useState(0)
  const [value, setValue] = useState(q.slider.default)
  const [status, setStatus] = useState('idle')
  const estimate = q.estimate(value)

  const next = (e) => {
    e.preventDefault()
    setStep(1)
  }
  const submit = (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      setStep(2)
    }, 1200)
  }

  return (
    <div className="glass relative overflow-hidden rounded-4xl p-5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] max-sm:bg-surface/90 max-sm:[backdrop-filter:none] sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mb-5 flex items-center justify-between sm:mb-6">
        <div>
          <p className="eyebrow text-primary short:hidden">{q.eyebrow}</p>
          <p className="mt-1.5 font-display text-xl font-semibold tracking-tight text-ink short:mt-0 short:text-lg">{step === 2 ? q.doneTitle : q.title}</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1 rounded-full transition-[width,background-color] duration-500 ${i <= step ? 'w-6 bg-primary' : 'w-3 bg-white/15'}`} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <form onSubmit={next} className="relative space-y-4 sm:space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-ink/60">{q.field.label}</span>
            <span className="relative block">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input required className="field pl-11" placeholder={q.field.placeholder} autoComplete={q.field.autoComplete} />
            </span>
          </label>
          <label className="block">
            <span className="mb-3 flex items-baseline justify-between text-xs font-medium text-ink/60">
              {q.slider.label}
              <span className="font-display text-lg font-semibold text-ink">
                {q.slider.format(value)}
                {q.mobileHint && <span className="ml-2 text-xs font-medium text-primary sm:hidden">{q.mobileHint(value)}</span>}
              </span>
            </span>
            <input type="range" min={q.slider.min} max={q.slider.max} step={q.slider.step} value={value} onChange={(e) => setValue(+e.target.value)} className="w-full" aria-label={q.slider.label} />
          </label>
          <div className="hidden grid-cols-2 gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:grid">
            {estimate.slice(0, 2).map((r) => (
              <div key={r.label}>
                <p className="text-[11px] text-ink/50">{r.label}</p>
                <p className={`font-display text-xl font-bold tracking-tight ${r.highlight ? 'gradient-text' : 'text-ink'}`}>{r.value}</p>
              </div>
            ))}
          </div>
          <button className="magnetic-btn flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-background shadow-lg shadow-primary/25">
            {q.cta} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={submit} className="relative space-y-3">
          <input required className="field" placeholder="Full name" autoComplete="name" />
          <input required type="email" className="field" placeholder="Email" autoComplete="email" />
          <input required type="tel" className="field" placeholder="Phone" autoComplete="tel" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(0)} className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-white/15 text-ink/70 transition hover:border-white/30 hover:text-ink" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button disabled={status === 'sending'} className="magnetic-btn flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-background shadow-lg shadow-primary/25 disabled:opacity-80">
              {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> {q.sending}</> : <>{q.submit} <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
          <p className="pt-1 text-center text-[11px] text-ink/40">{q.privacy}</p>
        </form>
      )}

      {step === 2 && (
        <div className="relative">
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/10 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-background"><Check className="h-4 w-4" strokeWidth={3} /></span>
            <p className="text-sm text-ink/80">{q.doneText}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {estimate.map((r) => (
              <div key={r.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <dt className="text-[11px] text-ink/50">{r.label}</dt>
                <dd className="mt-0.5 font-display text-lg font-semibold tracking-tight text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}

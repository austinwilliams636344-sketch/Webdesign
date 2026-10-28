import { useRef, useState } from 'react'
import { ArrowUpRight, CheckCircle2, Loader2, Mail, MapPin, Phone, Clock, UploadCloud, X } from 'lucide-react'
import { Logo, NAV_LINKS } from './Navbar.jsx'
import site from '../site.config.js'

const INPUT = 'w-full rounded-xl border border-paper-ink/10 bg-white px-4 py-3.5 text-[15px] text-paper-ink outline-none transition placeholder:text-paper-ink/40 focus:border-primary-dark focus:shadow-[0_0_0_4px_theme(colors.primary/18%)]'
const AUTOCOMPLETE = { 'Full name': ['text', 'name'], Email: ['email', 'email'], Phone: ['tel', 'tel'], Postcode: ['text', 'postal-code'], 'ZIP code': ['text', 'postal-code'] }

// Mock submit (no backend). Wire onSubmit to a CRM/webhook for a live client site.
export function ContactForm() {
  const c = site.contact
  const { brand } = site
  const [status, setStatus] = useState('idle')
  const [files, setFiles] = useState([])
  const [drag, setDrag] = useState(false)
  const input = useRef(null)

  const add = (list) => setFiles((prev) => [...prev, ...[...list].slice(0, 5 - prev.length)])
  const onSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1200)
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-background py-24 sm:py-32">
      {c.image && <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:px-16">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5 text-primary">{c.eyebrow}</p>
          <h2 className="font-display text-4xl font-bold leading-[1] tracking-tighter sm:text-6xl">
            {c.title} <span className="font-serif font-medium italic text-primary-light">{c.flourish}</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">{c.text}</p>
          <ul className="mt-10 space-y-4 text-ink/75">
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> <a href={`tel:${brand.phoneHref}`} className="hover:text-ink">{brand.phone}</a></li>
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> <a href={`mailto:${brand.email}`} className="hover:text-ink">{brand.email}</a></li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> {brand.area}</li>
            {brand.hours && <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" /> {brand.hours}</li>}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-5xl bg-paper p-6 text-paper-ink shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)] sm:p-10">
            {status === 'sent' ? (
              <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-primary-dark" strokeWidth={1.6} />
                <p className="mt-6 font-display text-3xl font-bold tracking-tight">{c.successTitle}</p>
                <p className="mt-3 max-w-sm text-paper-ink/60">{c.successText}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                {c.fields.map((p) => {
                  const [type, ac] = AUTOCOMPLETE[p] ?? ['text', 'off']
                  return <input key={p} required type={type} placeholder={p} autoComplete={ac} className={INPUT} />
                })}
                {c.interests?.length > 0 && (
                  <select defaultValue="" required className={`${INPUT} sm:col-span-2`}>
                    <option value="" disabled>{c.interestLabel}</option>
                    {c.interests.map((o) => <option key={o}>{o}</option>)}
                  </select>
                )}
                <textarea rows="3" placeholder={c.messagePlaceholder} className={`${INPUT} resize-none sm:col-span-2`} />
                {c.upload && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files) }}
                    onClick={() => input.current.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition sm:col-span-2 ${drag ? 'border-primary-dark bg-primary/10' : 'border-paper-ink/15 hover:border-paper-ink/30'}`}
                  >
                    <UploadCloud className="h-6 w-6 text-primary-dark" />
                    <p className="mt-2 text-sm font-medium">{c.upload.title}</p>
                    <p className="text-xs text-paper-ink/50">{c.upload.hint}</p>
                    <input ref={input} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => add(e.target.files)} />
                  </div>
                )}
                {files.length > 0 && (
                  <ul className="flex flex-wrap gap-2 sm:col-span-2">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 rounded-full bg-paper-ink/[0.06] py-1.5 pl-3 pr-1.5 text-xs">
                        {f.name}
                        <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="rounded-full p-0.5 hover:bg-paper-ink/10" aria-label={`Remove ${f.name}`}><X className="h-3 w-3" /></button>
                      </li>
                    ))}
                  </ul>
                )}
                <button disabled={status === 'sending'} className="magnetic-btn mt-2 flex items-center justify-center gap-2 rounded-full bg-paper-ink py-4 font-semibold text-ink sm:col-span-2">
                  {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>{c.submit} <ArrowUpRight className="h-4 w-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { brand, footer, services } = site
  return (
    <footer className="relative bg-deep pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid gap-12 border-b border-divider pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink/50">{footer.blurb}</p>
            {footer.status && (
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-divider px-4 py-2">
                <span className="ring-pulse h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px] text-ink/60">{footer.status}</span>
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <p className="eyebrow text-ink/40">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((l) => <li key={l.href}><a href={l.href} className="text-ink/65 hover:text-ink">{l.label}</a></li>)}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="eyebrow text-ink/40">Services</p>
            <ul className="mt-5 space-y-3 text-sm text-ink/65">
              {(footer.services ?? services.items.slice(0, 4).map((s) => s.t)).map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow text-ink/40">Visit</p>
            <p className="mt-5 text-sm leading-relaxed text-ink/65">
              {brand.address.map((l) => <span key={l} className="block">{l}</span>)}
              {brand.phone}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-8 text-xs text-ink/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {brand.legalName}. {footer.note}</p>
          <div className="flex gap-6"><a href="#" className="hover:text-ink">Privacy</a><a href="#" className="hover:text-ink">Terms</a><a href="#" className="hover:text-ink">Cookies</a></div>
        </div>
        {footer.watermark && (
          <p className="pointer-events-none mt-10 select-none text-center font-display text-[18vw] font-extrabold leading-none tracking-tighter text-white/[0.03]">{footer.watermark}</p>
        )}
      </div>
    </footer>
  )
}

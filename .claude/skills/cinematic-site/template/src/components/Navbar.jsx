import { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react'
import site from '../site.config.js'

// Nav links, minus the calculator link when the calculator section is switched off.
export const NAV_LINKS = site.nav.links.filter((l) => l.href !== '#calculator' || site.calculator)

function Mark() {
  const { logo, name } = site.brand
  if (logo === 'sun')
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7 text-primary" aria-hidden="true">
        <circle cx="16" cy="16" r="6" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M16 3.5v3.2M16 25.3v3.2M3.5 16h3.2M25.3 16h3.2M7.2 7.2l2.2 2.2M22.6 22.6l2.2 2.2M7.2 24.8l2.2-2.2M22.6 9.4l2.2-2.2" />
        </g>
      </svg>
    )
  if (logo === 'initial')
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-display text-sm font-extrabold text-background">
        {name.charAt(0)}
      </span>
    )
  return <img src={logo} alt="" className="h-7 w-auto" />
}

export function Logo({ className = '' }) {
  const { name, accent } = site.brand
  return (
    <a href="#home" className={`flex items-center gap-2.5 ${className}`} aria-label={`${name} home`}>
      <Mark />
      <span className="font-display text-lg font-bold tracking-tight text-ink">
        {name}
        {accent && <span className="font-serif text-xl font-medium italic text-primary-light"> {accent}</span>}
      </span>
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { brand, nav } = site

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5 transition-all duration-500 ${
            scrolled ? 'glass shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]' : 'border border-transparent'
          }`}
        >
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="lift-on-hover rounded-full px-4 py-2 text-sm font-medium text-ink/70 hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href={`tel:${brand.phoneHref}`} className="hidden items-center gap-2 px-3 text-sm font-medium text-ink/70 hover:text-ink md:flex">
              <Phone className="h-4 w-4 text-primary" /> {brand.phone}
            </a>
            <a href="#contact" className="magnetic-btn hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-background sm:inline-flex">
              {nav.cta} <ArrowUpRight className="h-4 w-4" />
            </a>
            <button onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      <div className={`glass-dark fixed inset-0 z-[70] flex flex-col px-6 pt-6 transition-opacity duration-500 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex items-center justify-between">
          <Logo />
          <button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="mt-16 space-y-2">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: `${open ? 80 + i * 50 : 0}ms` }} className={`transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <a href={l.href} onClick={() => setOpen(false)} className="block py-2 font-display text-4xl font-bold tracking-tighter">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" onClick={() => setOpen(false)} className="magnetic-btn mt-auto mb-10 flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-background">
          {nav.mobileCta} <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import site from './site.config.js'
import Navbar from './components/Navbar.jsx'
import ScrollFilm from './components/ScrollFilm.jsx'
import FilmSwitch from './components/FilmSwitch.jsx'
import { FILMS, DEFAULT_FILM } from './frames.js'
import { Marquee, Pillars, Features, Calculator, Process, Services, Reviews } from './components/Sections.jsx'
import { ContactForm, Footer } from './components/Contact.jsx'

gsap.registerPlugin(ScrollTrigger)

function initialFilm() {
  const key = new URLSearchParams(window.location.search).get('film')
  return FILMS[key]?.count > 0 ? key : DEFAULT_FILM
}

export default function App() {
  const [film, setFilm] = useState(initialFilm)
  const changeFilm = (key) => {
    setFilm(key)
    const url = new URL(window.location.href)
    url.searchParams.set('film', key)
    window.history.replaceState(null, '', url)
  }

  useEffect(() => {
    document.title = site.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.meta.description)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    // prioritised: scroll position updates before the film renders in the same tick
    gsap.ticker.add(raf, false, true)
    gsap.ticker.lagSmoothing(0)

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || a.getAttribute('href').length < 2) return
      e.preventDefault()
      lenis.scrollTo(a.getAttribute('href'), { offset: 0, duration: 1.6 })
    }
    document.addEventListener('click', onClick)
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)

    return () => {
      clearTimeout(id)
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <FilmSwitch film={film} onChange={changeFilm} />
      <main>
        <ScrollFilm film={film} />
        <Marquee />
        <Pillars />
        <Features />
        <Calculator />
        <Process />
        <Services />
        <Reviews />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}

import { Film } from 'lucide-react'
import { FILMS } from '../frames.js'

// Comparison control for the scroll film. Only lists films that have frames.
export default function FilmSwitch({ film, onChange }) {
  const films = Object.entries(FILMS).filter(([, f]) => f.count > 0)
  if (films.length < 2) return null
  return (
    <div className="glass fixed bottom-4 left-4 z-[55] flex items-center gap-1 rounded-full p-1 pl-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]">
      <Film className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
      <span className="mr-1 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 sm:inline">Film</span>
      {films.map(([key, f]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-pressed={film === key}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-300 ${
            film === key ? 'bg-primary text-background' : 'text-ink/65 hover:text-ink'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

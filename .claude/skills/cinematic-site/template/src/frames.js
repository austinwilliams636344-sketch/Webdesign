// Scroll films available on the site. Each one lives in public/frames/<key>/{hd,sd}/f_0001.webp…
// films.json is written by `npm run film` (scripts/extract-film.sh): { key: { label, count } }.
// The first film listed is the default; with 2+ films a comparison switch appears bottom-left.
import films from './films.json'

export const FILMS = films

export const DEFAULT_FILM = Object.keys(FILMS).find((k) => FILMS[k].count > 0)

export const framePath = (film, i, set = 'hd') => `/frames/${film}/${set}/f_${String(i + 1).padStart(4, '0')}.webp`

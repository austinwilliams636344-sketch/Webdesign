// Brand palette. Tailwind reads this (tailwind.config.js) and the CSS uses it via theme().
// Dark, cinematic base + one warm accent works best with the scroll film.
// Restart the dev server after changing it (Tailwind config is read at startup).
export default {
  primary: '#F2A541', // the accent: buttons, eyebrows, highlights
  'primary-dark': '#D98A1F',
  'primary-light': '#F8C77E',
  accent: '#8FB3E0', // secondary, used sparingly
  background: '#0A0A0B', // page + film void colour (keyframe voids should be near this)
  surface: '#141416',
  ink: '#F4F1EA', // text on dark
  muted: '#8C8A85',
  divider: '#232326',
  deep: '#060607', // darkest sections (services, footer)
  paper: '#F3EEE5', // light section (process) + contact card
  'paper-ink': '#15140F', // text on paper
}

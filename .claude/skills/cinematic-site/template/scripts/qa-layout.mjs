// Screenshot the hero + each film chapter at the key screen sizes, then contact sheets per size.
//   npm run qa:layout            (dev server must be running on :5173)
// Check: chapter text never overlaps the film subject, nothing clipped, hero fits on phones.
import puppeteer from 'puppeteer-core'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'

const URL = process.env.URL || 'http://localhost:5173/'
const SIZES = (process.argv[2] || '1680x972x1,1440x900x2,1280x720x1,1024x768x1,390x844x2,375x667x2').split(',')
const STOPS = [0, 0.22, 0.55, 0.93] // hero, chapter 1, 2, 3
const out = 'qa'; mkdirSync(out, { recursive: true })
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const b = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: [...(process.platform === 'darwin' ? ['--use-angle=metal'] : ['--no-sandbox'])] })
for (const sz of SIZES) {
  const [w, h, dpr] = sz.split('x').map(Number)
  const p = await b.newPage()
  p.on('pageerror', (e) => console.log(`[${sz}] page error:`, e.message))
  await p.setViewport({ width: w, height: h, deviceScaleFactor: dpr })
  await p.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 })
  await new Promise((r) => setTimeout(r, 2500))
  const shots = []
  for (const s of STOPS) {
    await p.evaluate(async (s) => { const el = document.querySelector('#home'); window.scrollTo(0, (el.offsetHeight - innerHeight) * s); await new Promise((r) => setTimeout(r, 1800)) }, s)
    const f = `${out}/${sz}_${s}.png`; await p.screenshot({ path: f }); shots.push(f)
  }
  const scale = w > h ? 'scale=720:-2' : 'scale=300:-2'
  const grid = w > h ? '[a][b]hstack[t];[c][d]hstack[u];[t][u]vstack' : '[a][b][c][d]hstack=inputs=4'
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...shots.flatMap((f) => ['-i', f]), '-filter_complex', `[0]${scale}[a];[1]${scale}[b];[2]${scale}[c];[3]${scale}[d];${grid}`, `${out}/sheet_${sz}.jpg`])
  await p.close()
  console.log(`${out}/sheet_${sz}.jpg`)
}
await b.close()

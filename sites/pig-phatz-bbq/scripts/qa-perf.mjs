// Scroll the whole film twice at 60 fps and report frame times. Target: over33 = 0, max ≤ ~17 ms.
//   npm run qa:perf [-- 1440x900x2,390x844x3]     (dev server must be running on :5173)
import puppeteer from 'puppeteer-core'
const URL = process.env.URL || 'http://localhost:5173/'
const SIZES = (process.argv[2] || '1440x900x2,2560x1440x1,390x844x3').split(',')
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const b = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: [...(process.platform === 'darwin' ? ['--use-angle=metal'] : ['--no-sandbox']), '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
for (const sz of SIZES) {
  const [w, h, dpr] = sz.split('x').map(Number)
  const p = await b.newPage()
  await p.setViewport({ width: w, height: h, deviceScaleFactor: dpr })
  await p.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 })
  await new Promise((r) => setTimeout(r, 4000))
  const run = () => p.evaluate(async () => {
    window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 1200))
    const end = document.querySelector('#home').offsetHeight - innerHeight
    const d = []; let last = performance.now(); const t0 = last
    await new Promise((res) => { function step(t) { d.push(t - last); last = t; const k = Math.min(1, (t - t0) / 8000); window.scrollTo(0, end * k); k < 1 ? requestAnimationFrame(step) : res() } requestAnimationFrame(step) })
    d.shift(); const s = [...d].sort((a, b) => a - b)
    return { frames: d.length, p95: +s[Math.floor(s.length * 0.95)].toFixed(1), max: +s.at(-1).toFixed(1), over33: d.filter((x) => x > 33).length }
  })
  console.log(sz, JSON.stringify(await run()), JSON.stringify(await run()))
  await p.close()
}
await b.close()

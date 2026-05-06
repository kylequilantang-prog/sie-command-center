# SIE Command Center

A finance-terminal study dashboard for the FINRA SIE exam. Built for **Kyle Quilantang** — exam day **Friday, July 10, 2026 · 10:15 AM** at the Ventura–Camarillo Test Center.

Editorial dark mode. Fraunces + JetBrains Mono. WSB-green accent on pure black. PWA-installable on iPhone.

## What it does

- **Live countdown** to exam day
- **Phase tracker** — 5 study phases (May 11 – Jul 9)
- **Today's Focus** — derived from the current study week
- **Practice exam logger** with the 3-consecutive-80% gate
- **Score trajectory** chart (inline SVG, 80% pass-line)
- **Weakness tracker** — tag weak units when logging exam scores; aggregate counts surface drill targets for the final week
- **Session logger** with hours + 1–5 confidence + topic, mobile-optimized modal
- **Streak**, total hours, 7-day confidence average
- **Whiteboard checklist** — toggle each weekly map as it gets built
- **Resource stack** — free YouTube, FINRA, SIEPracticeExam, Knopman, Quizlet, NotebookLM
- **NotebookLM quick-link** — week-aware (placeholder URLs until per-week notebooks exist)
- **Test-day mode** — on July 10, takes over with the drive-time and address
- **Offline** via service worker
- **Export / Import / Reset** in the footer (JSON portable backup)

## Stack

Vanilla HTML / CSS / JS. No build step, no framework, no backend. Data lives in `localStorage` under `sie-state-v2`. Migrates from the v1 prototype's `sie-state` key automatically.

```
index.html
css/styles.css
js/data.js        // PHASES, EXAMS, WEEKLY_FOCUS, helpers
js/storage.js     // load/save/migrate, export/import
js/render.js      // all DOM rendering
js/app.js         // init + event delegation + modals
manifest.json
service-worker.js
icons/
  icon.svg         (master)
  icon-180.png     (apple-touch-icon)
  icon-192.png
  icon-512.png
  icon-1024.png
archive/
  v1.html          (the original prototype, preserved)
CLAUDE-CODE-BRIEF.md  (the design source-of-truth)
```

## Run locally

Open `index.html` directly in a browser. That's it. Service worker registration is silent on `file://` and active when served over HTTP.

For PWA install testing, serve over a local HTTP server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080/
```

## Deploy (GitHub Pages)

```bash
gh repo create kylequilantang-prog/sie-command-center --public --source=. --remote=origin --push --description "Finance-terminal study dashboard for the FINRA SIE exam"
gh api -X POST /repos/kylequilantang-prog/sie-command-center/pages -f 'source[branch]=main' -f 'source[path]=/'
```

Live URL: `https://kylequilantang-prog.github.io/sie-command-center/`

## Install on iPhone

1. Open the live URL in Safari.
2. Tap the Share button → **Add to Home Screen**.
3. The icon (italic green "S" with the date marker) lands on the home screen.
4. Open from there to run as a standalone PWA — no browser chrome.

## Data

Everything is local. Nothing leaves the phone. Use **Export** (footer) periodically if you care about a backup.

Schema is JSON-stable; new fields are added with defaults via `Object.assign(emptyState(), parsed)` so old export files keep working.

## License

MIT. Built for Kyle Q.

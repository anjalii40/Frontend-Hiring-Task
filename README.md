# 📅 Interactive Wall Calendar Component

A polished, interactive Next.js calendar built as a **Frontend Engineering Challenge**.

## ✨ Features

| Feature | Details |
|---|---|
| **Wall Calendar Aesthetic** | 3-panel layout: hero image · date grid · notes |
| **Day Range Selector** | Click start → click end; visual band across selected days |
| **Holiday Markers** | Red dots + tooltip for public holidays |
| **Notes Section** | Lined-paper textarea, auto-saves per month via `localStorage` |
| **Month Theming** | Each month has its own accent palette injected as CSS vars |
| **Flip Animation** | Subtle page-turn on month change |
| **Responsive** | Desktop (side-by-side) · Tablet · Mobile (stacked) |
| **Keyboard Navigation** | Arrow keys move focus between day cells |

## 🚀 Running Locally

```bash
cd calendar-app
npm install
npm run dev
# → Open http://localhost:3000
```

## 🏗 Architecture

```
src/
  components/Calendar/   # All UI components + CSS module
  hooks/
    useCalendar.ts       # Month nav + range selection state
    useNotes.ts          # localStorage persistence per month
  data/
    holidays.ts          # Static holiday list
    monthImages.ts       # 12 month themes (image + accent colors)
  app/
    page.tsx             # Root page
    layout.tsx           # Google Fonts + metadata
```

## 🎨 Design Decisions

- **Vanilla CSS Modules** — no Tailwind, for full control and portability
- **No backend** — all persistence via `localStorage` keyed by `YYYY-MM`
- **AI-generated hero images** — one per month, stored in `public/images/`
- **CSS custom properties** — month themes are applied as `--accent-*` vars on `:root` so a single CSS variable change repaints the entire UI
- **Flip animation** — CSS `rotateX` perspective transform (not JS-driven) for clean 60fps

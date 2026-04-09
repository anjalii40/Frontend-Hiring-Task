<div align="center">
  
# Interactive Wall Calendar ✨

A beautiful, functional, and highly interactive wall calendar built for the modern web.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animated-purple?style=flat-square&logo=framer)](https://www.framer.com/motion/)

[Live Demo](http://localhost:3000) • [Video Walkthrough](https://www.loom.com/share/c7e0245bea1e4096b2eedef64eb81512)

</div>

---

## 🎨 Overview

This project reimagines the standard digital calendar utility as a structured, premium physical wall calendar. It merges date-range selection, persistent goal tracking, mapped daily notes, and a dynamic themed hero section into a single, cohesive interface.

> **Note:** The calendar is currently scoped securely to the year `2027` to demonstrate fixed-timeline behavior.

---

## ✨ Features

- 🖼️ **Themed Hero Panel:** Every month features a unique visual aesthetic with its own motivational quote and custom CSS variable injections that style the whole application.
- 🎯 **Daily & Monthly Goals:** Track daily study targets and monthly progress. Features built-in micro-animations like confetti on completion!
- 📝 **Synced Storage Notes:** Two independent note systems (daily and monthly) mapped exactly to the dates you click. Data is synced silently via browser `localStorage`.
- 📐 **Responsive Geometry:** Scales elegantly. Side-by-side on desktop, stacked linearly on mobile, preserving the aesthetic without sacrificing touch usability.
- 🌌 **Immersive Background:** A React-Three-Fiber particle background that responds to your mouse and matches the month's intensity.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have Node.js (v18+) mapped to your environment.

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Your interactive calendar will now be running at `http://localhost:3000`.

---

## 📂 Architecture

<details>
<summary><strong>Click to expand project structure</strong></summary>

```text
src/
  ├── app/                  # Next.js App Router (page.tsx, layout.tsx)
  ├── components/Calendar/  # Core Domain Components
  │   ├── CalendarContainer.tsx # Main composition layer
  │   ├── HeroImage.tsx     # Themed dynamic visuals
  │   ├── GoalTracker.tsx   # State-driven progress
  │   ├── NotesSection.tsx  # localStorage note sync
  │   └── ThreeBackground.tsx # R3F Canvas
  ├── data/                 # Static mocks (holidays, monthly configs)
  └── hooks/                # Custom React logic (useCalendar, useNotes)
```

</details>

---

## 🛠️ Built With

* **[Next.js](https://nextjs.org/)** - React framework
* **[React 19](https://react.dev/)** - UI library
* **[Framer Motion](https://www.framer.com/motion/)** - Spring animations & transitions
* **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)** - WebGL background ambience
* **[CSS Modules](https://github.com/css-modules/css-modules)** - Vanilla, locally scoped styling 

---

## 💡 Design Notes

- **Content First:** The UI is intentionally compact. We use an 8px grid system and tabular-nums for crisp layout math.
- **Local Persistence:** There is NO backend. All interactions write functionally to `localStorage` ensuring instant load times and data privacy.

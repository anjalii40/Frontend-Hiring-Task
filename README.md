# Interactive Wall Calendar

A responsive, animated wall-calendar experience built with Next.js, React, Framer Motion, and React Three Fiber.

This project combines a visual monthly calendar, date-range selection, goal tracking, synced notes, and a dynamic themed hero section into a single compact interface.

## Demo

- Local: `http://localhost:3000`
- Year locked to: `2027`

Add your hosted demo and walkthrough here:

- Live demo: `TODO`
- Video walkthrough: `TODO`

## Preview

Use this section for screenshots or GIFs when presenting the project:

```md
![Desktop Preview](./docs/desktop-preview.png)
![Mobile Preview](./docs/mobile-preview.png)
![Range Selection Demo](./docs/range-demo.gif)
```

## Highlights

- Wall-calendar inspired layout with hero panel, calendar grid, and tracking rail
- Fixed `2027` calendar with wrapped month navigation
- Dark and light themes with saved preference
- Month-based accent system and animated background intensity
- Date-range selection with synced range labels
- Daily notes synced to clicked calendar date
- Monthly notes synced to selected range
- Daily and monthly goal tracking
- Animated task checklist with saved state
- Responsive layout for desktop, tablet, and mobile

## What The App Does

This app is built around three main workflows:

1. Navigate a visually rich month-by-month calendar
2. Track study or task goals with progress feedback
3. Save notes tied to specific dates and selected ranges

The interface is intentionally designed to feel more like a premium wall calendar than a plain scheduling utility.

## Feature Breakdown

### Calendar Experience

- Monthly calendar grid always keeps a consistent 6-row height
- `Today` is highlighted
- Holiday markers appear as small dots on matching dates
- Keyboard navigation is supported across day cells
- Month navigation is limited to `January 2027` through `December 2027`
- Attempting to move past the year wraps within 2027 instead of entering 2026 or 2028

### Hero Panel

- Each month uses its own image from `public/images`
- Each month also has a dedicated motivational mode title and quote
- Hero content transitions smoothly on month change
- Month accent theme affects the hero glow and ambient background mood
- Month and year are shown directly in the hero lockup

### Date Range Selection

- `Select range` mode can be toggled from the calendar header
- First click sets the start date
- Second click sets the end date
- In-range dates are visually highlighted in the calendar
- Start and end labels appear above the grid
- Range can be cleared from the header

### Notes

There are two independent note systems:

#### Daily Notes

- Daily notes automatically sync to the date clicked in the calendar
- Manual date input was removed to keep the flow simple
- Notes are saved per day in `localStorage`
- Includes a `Save` button for immediate persistence
- Button briefly changes to `Saved` after storing

#### Monthly Notes

- Monthly notes are stored separately from daily notes
- When a full date range is selected, the notes header syncs to that range
- Example: `Feb 9 - Feb 20`
- Includes the same explicit save interaction

### Goal Tracker

The tracking rail includes three collapsible sections:

#### Daily Goal

- Daily target is controlled with a stepper-style `- value +` input
- Section is intentionally simplified to focus on target-setting
- Includes a small helper note for context

#### Monthly Progress

- Supports weekly or monthly mode
- Start and end date inputs are limited to 2027
- Total task target is configurable
- Displays total, done, left, and percentage progress
- Progress bar animates on change

#### Task List

- Comes with default sample tasks
- Users can add custom tasks
- Checkbox interaction includes animation
- Completed tasks reorder visually
- Task state is persisted in `localStorage`

### Progress Feedback

- Numeric counts animate into place
- Progress bars animate smoothly
- Daily goal completion triggers confetti once when the threshold is crossed
- Header stat uses a compact split-stat summary

### Themes and Motion

- Supports both dark and light mode
- Theme preference is stored locally
- Month theme injects accent variables into the UI
- Full-screen Three.js background adapts to month intensity
- Light mode background is tuned separately so motion remains visible

## Responsive Behavior

### Desktop

- Preserves the segmented wall-calendar composition
- Hero panel and calendar remain visually dominant
- Goal tracker and notes stay grouped in the side rail

### Tablet

- Layout stacks into hero → calendar → tracking rail
- Calendar maintains clear spacing and stable row height

### Mobile

- Layout collapses vertically
- Buttons and inputs become touch-friendly
- Day cells keep usable tap areas
- Notes and task interactions remain fully accessible

## Animation Details

The project uses Framer Motion plus CSS transitions for controlled motion.

Included interactions:

- hero content transitions
- staggered section entry
- dropdown expand / collapse
- animated checkbox tick
- task reorder animation
- count-up metrics
- progress bar fill animation
- confetti burst on daily completion
- Three.js particles, mesh motion, and ring motion

## Tech Stack

- Next.js `16.2.2`
- React `19`
- TypeScript
- Framer Motion
- Three.js
- React Three Fiber
- CSS Modules

## Architecture

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx

  components/
    Calendar/
      Calendar.module.css
      CalendarContainer.tsx
      CalendarGrid.tsx
      CalendarHeader.tsx
      DayCell.tsx
      GoalTracker.tsx
      HeroImage.tsx
      NotesSection.tsx
      ThreeBackground.tsx

  data/
    calendarConfig.ts
    holidays.ts
    monthImages.ts
    monthJourneyThemes.ts

  hooks/
    useCalendar.ts
    useNotes.ts

public/
  images/
    jan.png
    feb.png
    mar.png
    apr.png
    may.png
    jun.png
    jul.png
    aug.png
    sep.png
    oct.png
    nov.png
    dec.png
```

## Key Modules

### `src/components/Calendar/CalendarContainer.tsx`

The main composition layer. It wires together:

- theme state
- calendar state
- notes state
- month-specific visual variables
- hero panel
- calendar grid
- goal tracker
- notes rail

### `src/hooks/useCalendar.ts`

Responsible for:

- active month state
- animation direction
- date-range selection
- 2027-only month navigation

### `src/hooks/useNotes.ts`

Responsible for:

- reading note content from `localStorage`
- debounced auto-save behavior
- explicit save action used by the notes buttons

### `src/components/Calendar/GoalTracker.tsx`

Handles:

- daily target controls
- monthly progress setup
- task list state
- progress summaries
- confetti behavior

### `src/components/Calendar/ThreeBackground.tsx`

Handles the animated ambient layer:

- particles
- flowing mesh
- ring accents
- month-aware intensity and color tuning

## Persistence

This project uses browser `localStorage` only.

Persisted data includes:

- theme preference
- daily notes
- monthly notes
- goal settings
- task list state
- task completion state

There is no backend and no remote data source.

## Running Locally

### Install

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Scripts

- `npm run dev` — start local development server
- `npm run build` — create production build
- `npm run start` — run production build
- `npm run lint` — run ESLint

## Design Notes

- The UI is intentionally compact and content-first
- Accent color is used sparingly for state, emphasis, and progress
- The visual style mixes minimal utility UI with a more editorial hero panel
- Motion is meant to feel premium and controlled, not flashy

## Known Notes

- A Next.js warning may appear during lint for the font link in `layout.tsx`
- Since persistence is local-only, clearing browser storage resets notes and tracker state

## Possible Extensions

- deployed demo link and media assets in the README
- export / import for notes and tracker state
- optional recurring goal presets
- richer holiday datasets
- shareable calendar snapshots

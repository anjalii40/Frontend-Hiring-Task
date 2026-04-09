"use client";
import React, { useEffect, useState, type CSSProperties } from "react";
import type { Variants, Transition } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Calendar.module.css";
import CalendarHeader from "./CalendarHeader";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesSection from "./NotesSection";
import GoalTracker from "./GoalTracker";
import ThreeBackground from "./ThreeBackground";
import { useCalendar } from "@/hooks/useCalendar";
import { useNotes } from "@/hooks/useNotes";
import { MONTH_JOURNEY_THEMES } from "@/data/monthJourneyThemes";
import { MONTH_THEMES } from "@/data/monthImages";
import { toInputDate } from "@/data/calendarConfig";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

type ThemeMode = "light" | "dark";

// Framer Motion variants — subtle fade + slight upward motion
const baseTransition: Transition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] };

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: i * 0.06 } as Transition,
  }),
};

export default function CalendarContainer() {
  const {
    viewDate, range, today, isAnimating, animDir, changeMonth, handleDayClick, clearRange,
  } = useCalendar();

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const monthTheme = MONTH_JOURNEY_THEMES[month];
  const imageTheme = MONTH_THEMES[month];
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("app-calendar-theme") === "light" ? "light" : "dark";
  });
  const dark = themeMode === "dark";
  const [isRangeSelecting, setIsRangeSelecting] = useState(false);
  const [dailyNoteDate, setDailyNoteDate] = useState(() => toInputDate(today));
  const {
    note: monthlyNote,
    setNote: setMonthlyNote,
    saveNote: saveMonthlyNote,
  } = useNotes(monthKey);
  const {
    note: dailyNote,
    setNote: setDailyNote,
    saveNote: saveDailyNote,
  } = useNotes(`day-${dailyNoteDate}`);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    window.localStorage.setItem("app-calendar-theme", themeMode);
  }, [dark, themeMode]);

  const animClass = isAnimating
    ? animDir === "next"
      ? styles.flipNext
      : styles.flipPrev
    : "";
  const monthThemeVars = {
    "--accent": monthTheme.accent,
    "--accent-hover": monthTheme.accentHover,
    "--accent-muted": monthTheme.accentMuted,
    "--accent-orange": monthTheme.accent,
    "--accent-orange-muted": monthTheme.accentMuted,
    "--month-glow": monthTheme.glow,
  } as CSSProperties;

  return (
    <div
      className={`${styles.pageWrapper} ${dark ? styles.darkTheme : styles.lightTheme}`}
      style={monthThemeVars}
    >
      <ThreeBackground dark={dark} theme={monthTheme} />
      {/* Top bar */}
      <motion.div
        className={styles.topBar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <span className={styles.topBarTitle}>Interactive Calendar</span>
        <button
          type="button"
          className={styles.themeBtn}
          aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
          aria-pressed={dark}
          onClick={() => setThemeMode((current) => (current === "dark" ? "light" : "dark"))}
        >
          <span className={styles.orangeDot} aria-hidden="true" />
          {dark ? "Dark Theme" : "Light Theme"}
        </button>
      </motion.div>

      {/* Calendar card */}
      <motion.div
        className={`${styles.calendarCard} ${animClass}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.spiralContainer} aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className={styles.spiralRing}>
              <div className={styles.spiralHole} />
              <div className={styles.spiralWire} />
            </div>
          ))}
        </div>
        <div className={styles.calendarInner}>

          {/* TOP — Motivational month panel (Hero) */}
          <motion.div
            className={styles.leftPanel}
            custom={0}
            variants={childVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroImage
              monthIndex={month}
              monthLabel={MONTH_NAMES[month]}
              year={year}
              icon={monthTheme.icon}
              theme={imageTheme}
            />
            {/* Geometric divider matching wall calendar style */}
            <div className={styles.heroGeometricOverlay}>
              <div className={styles.heroGeometricCutout} />
            </div>
          </motion.div>

          {/* CENTER — Calendar grid */}
          <motion.div
            className={styles.centerPanel}
            custom={1}
            variants={childVariants}
            initial="hidden"
            animate="visible"
          >
            <CalendarHeader
              viewDate={viewDate}
              onPrev={() => changeMonth("prev")}
              onNext={() => changeMonth("next")}
              range={range}
              onClear={clearRange}
              isRangeSelecting={isRangeSelecting}
              onToggleRangeSelect={() => setIsRangeSelecting((active) => !active)}
            />

            <AnimatePresence mode="popLayout">
              {(range.start || range.end) && (
                <motion.div
                  key="range"
                  className={styles.rangeDisplay}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={`${styles.rangeTag} ${styles.startTag}`}>
                    {range.start
                      ? range.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "—"}
                  </span>
                  <span className={styles.rangeSep}>→</span>
                  <span className={`${styles.rangeTag} ${styles.endTag}`}>
                    {range.end
                      ? range.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "Select end"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <CalendarGrid
              viewDate={viewDate}
              today={today}
              range={range}
              onDayClick={(date) => {
                setDailyNoteDate(toInputDate(date));
                if (isRangeSelecting) handleDayClick(date);
              }}
            />

            <p className={styles.selectionHint}>
              {!isRangeSelecting
                ? "Use Select range to choose dates"
                : !range.start
                ? "Click a date to start your selection"
                : !range.end
                ? "Click another date to complete the range"
                : "Date range selected"}
            </p>
          </motion.div>

          {/* RIGHT — Notes */}
          <motion.div
            className={styles.rightPanel}
            custom={2}
            variants={childVariants}
            initial="hidden"
            animate="visible"
          >
            <GoalTracker />
            <NotesSection
              monthlyNote={monthlyNote}
              setMonthlyNote={setMonthlyNote}
              saveMonthlyNote={saveMonthlyNote}
              dailyNote={dailyNote}
              setDailyNote={setDailyNote}
              saveDailyNote={saveDailyNote}
              dailyDate={dailyNoteDate}
              range={range}
            />
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

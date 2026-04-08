"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Calendar.module.css";
import type { DateRange } from "@/hooks/useCalendar";

interface NotesSectionProps {
  monthlyNote: string;
  setMonthlyNote: (v: string) => void;
  saveMonthlyNote: () => void;
  dailyNote: string;
  setDailyNote: (v: string) => void;
  saveDailyNote: () => void;
  dailyDate: string;
  range: DateRange;
}

function formatInputDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Selected day";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatRangeMeta(range: DateRange) {
  if (!range.start || !range.end) return "";

  const start = range.start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const end = range.end.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${start} - ${end}`;
}

function NotesChevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      className={styles.dropdownChevron}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

function NoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function NotesDropdown({
  title,
  meta,
  open,
  onToggle,
  children,
}: {
  title: string;
  meta?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const contentId = `${title.toLowerCase().replace(/\s+/g, "-")}-content`;

  return (
    <div className={styles.notesDropdown}>
      <motion.button
        className={styles.notesDropdownButton}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
        whileTap={{ scale: 0.98 }}
      >
        <span className={styles.notesHeader}>
          <NoteIcon />
          <span>
            <span className={styles.notesLabel}>{title}</span>
            {meta ? <span className={styles.notesMeta}>{meta}</span> : null}
          </span>
        </span>
        <NotesChevron open={open} />
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            className={styles.notesDropdownContent}
            initial={{ height: 0, opacity: 0, y: -4 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -4 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NotesSection({
  monthlyNote,
  setMonthlyNote,
  saveMonthlyNote,
  dailyNote,
  setDailyNote,
  saveDailyNote,
  dailyDate,
  range,
}: NotesSectionProps) {
  const [dailyOpen, setDailyOpen] = useState(false);
  const [monthlyOpen, setMonthlyOpen] = useState(false);
  const [dailySaved, setDailySaved] = useState(false);
  const [monthlySaved, setMonthlySaved] = useState(false);

  const triggerSavedState = (type: "daily" | "monthly") => {
    if (type === "daily") {
      saveDailyNote();
      setDailySaved(true);
      window.setTimeout(() => setDailySaved(false), 1200);
      return;
    }

    saveMonthlyNote();
    setMonthlySaved(true);
    window.setTimeout(() => setMonthlySaved(false), 1200);
  };

  return (
    <div className={styles.notesSection}>
      <NotesDropdown
        title="Daily notes"
        meta={formatInputDate(dailyDate)}
        open={dailyOpen}
        onToggle={() => setDailyOpen((value) => !value)}
      >
        <textarea
          className={styles.notesTextarea}
          value={dailyNote}
          onChange={(event) => setDailyNote(event.target.value)}
          placeholder={"- Target problems\n- Concept to revise\n- Blocker to clear"}
          rows={5}
          aria-label={`Daily notes: ${formatInputDate(dailyDate)}`}
        />
        <div className={styles.notesFooter}>
          <p className={styles.notesHint}>- Saved only for this day</p>
          <motion.button
            type="button"
            className={`${styles.saveNoteBtn} ${dailySaved ? styles.saveNoteBtnSaved : ""}`}
            onClick={() => triggerSavedState("daily")}
            whileTap={{ scale: 0.96 }}
          >
            {dailySaved ? "Saved" : "Save"}
          </motion.button>
        </div>
      </NotesDropdown>

      <NotesDropdown
        title="Monthly notes"
        meta={formatRangeMeta(range)}
        open={monthlyOpen}
        onToggle={() => setMonthlyOpen((value) => !value)}
      >
        <textarea
          className={styles.notesTextarea}
          value={monthlyNote}
          onChange={(event) => setMonthlyNote(event.target.value)}
          placeholder={"- Monthly focus\n- Weak topics\n- End-of-month review"}
          rows={5}
          aria-label="Monthly notes"
        />
        <div className={styles.notesFooter}>
          <p className={styles.notesHint}>- Saved only for this month</p>
          <motion.button
            type="button"
            className={`${styles.saveNoteBtn} ${monthlySaved ? styles.saveNoteBtnSaved : ""}`}
            onClick={() => triggerSavedState("monthly")}
            whileTap={{ scale: 0.96 }}
          >
            {monthlySaved ? "Saved" : "Save"}
          </motion.button>
        </div>
      </NotesDropdown>
    </div>
  );
}

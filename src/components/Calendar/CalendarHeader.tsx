import React from "react";
import styles from "./Calendar.module.css";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface CalendarHeaderProps {
  viewDate: Date;
  onPrev: () => void;
  onNext: () => void;
  range: { start: Date | null; end: Date | null };
  onClear: () => void;
  isRangeSelecting: boolean;
  onToggleRangeSelect: () => void;
}

export default function CalendarHeader({
  viewDate,
  onPrev,
  onNext,
  range,
  onClear,
  isRangeSelecting,
  onToggleRangeSelect,
}: CalendarHeaderProps) {
  const month = MONTH_NAMES[viewDate.getMonth()];
  const year = viewDate.getFullYear();
  const hasRange = range.start || range.end;

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.navBtn}
          onClick={onPrev}
          aria-label="Previous month"
        >
          ‹
        </button>
      </div>
      <div className={styles.headerCenter}>
        <h1 className={styles.monthName}>{month}</h1>
        <span className={styles.yearLabel}>{year}</span>
      </div>
      <div className={styles.headerRight}>
        <button
          className={`${styles.selectRangeBtn} ${isRangeSelecting ? styles.selectRangeBtnActive : ""}`}
          onClick={onToggleRangeSelect}
          aria-pressed={isRangeSelecting}
        >
          Select range
        </button>
        {hasRange && (
          <button className={styles.clearBtn} onClick={onClear}>
            Clear
          </button>
        )}
        <button
          className={styles.navBtn}
          onClick={onNext}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
    </div>
  );
}

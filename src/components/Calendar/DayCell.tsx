import React from "react";
import styles from "./Calendar.module.css";
import { Holiday } from "@/data/holidays";

interface DayCellProps {
  day: number;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isOtherMonth: boolean;
  holiday?: Holiday;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  tabIndex: number;
}

export default function DayCell({
  day,
  isToday,
  isStart,
  isEnd,
  isInRange,
  isOtherMonth,
  holiday,
  onClick,
  onKeyDown,
  tabIndex,
}: DayCellProps) {
  const classes = [
    styles.dayCell,
    isOtherMonth ? styles.otherMonth : "",
    isToday ? styles.today : "",
    isStart ? styles.rangeStart : "",
    isEnd ? styles.rangeEnd : "",
    isInRange ? styles.inRange : "",
    holiday ? styles.hasHoliday : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      aria-label={`${day}${holiday ? `, ${holiday.name}` : ""}${isToday ? ", today" : ""}`}
      aria-pressed={isStart || isEnd}
    >
      <span className={styles.dayNumber}>{day}</span>
      {holiday && (
        <span className={styles.holidayDot} title={holiday.name} />
      )}
      {(isStart || isEnd) && (
        <span className={styles.selectedRing} />
      )}
    </button>
  );
}

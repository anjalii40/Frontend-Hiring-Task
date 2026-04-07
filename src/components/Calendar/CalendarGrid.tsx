import React, { useRef, useCallback } from "react";
import styles from "./Calendar.module.css";
import DayCell from "./DayCell";
import { DateRange } from "@/hooks/useCalendar";
import { getHolidayForDay } from "@/data/holidays";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  viewDate: Date;
  today: Date;
  range: DateRange;
  onDayClick: (date: Date) => void;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(d: Date, start: Date, end: Date) {
  return d > start && d < end;
}

export default function CalendarGrid({
  viewDate,
  today,
  range,
  onDayClick,
}: CalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build cells: leading empty + days
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to six full weeks so the calendar dimensions stay uniform by month.
  while (cells.length < 42) cells.push(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      const focusable = gridRef.current?.querySelectorAll<HTMLButtonElement>(
        "button[data-day]"
      );
      if (!focusable) return;
      const arr = Array.from(focusable);
      const cur = arr.findIndex((b) => b === document.activeElement);
      if (cur === -1) return;
      let next = -1;
      if (e.key === "ArrowRight") next = cur + 1;
      if (e.key === "ArrowLeft") next = cur - 1;
      if (e.key === "ArrowDown") next = cur + 7;
      if (e.key === "ArrowUp") next = cur - 7;
      if (next >= 0 && next < arr.length) {
        e.preventDefault();
        arr[next].focus();
      }
      void idx;
    },
    []
  );

  return (
    <div className={styles.gridWrapper} ref={gridRef}>
      <div className={styles.weekdayHeader}>
        {WEEKDAYS.map((w) => (
          <span key={w} className={styles.weekdayLabel}>
            {w}
          </span>
        ))}
      </div>
      <div className={styles.daysGrid}>
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className={styles.emptyCell} />;
          }
          const date = new Date(year, month, day);
          const isStart = range.start ? isSameDay(date, range.start) : false;
          const isEnd = range.end ? isSameDay(date, range.end) : false;
          const isInRange =
            range.start && range.end
              ? isBetween(date, range.start, range.end)
              : false;
          const isToday = isSameDay(date, today);
          const holiday = getHolidayForDay(month, day);

          return (
            <DayCell
              key={day}
              day={day}
              isToday={isToday}
              isStart={isStart}
              isEnd={isEnd}
              isInRange={isInRange}
              isOtherMonth={false}
              holiday={holiday}
              onClick={() => onDayClick(date)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              tabIndex={isToday || (idx === firstDay && !isToday) ? 0 : -1}
            />
          );
        })}
      </div>
    </div>
  );
}

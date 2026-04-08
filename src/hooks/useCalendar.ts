"use client";
import { useState, useCallback } from "react";
import { CALENDAR_YEAR, toCalendarDate } from "@/data/calendarConfig";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function useCalendar() {
  const today = toCalendarDate(new Date());
  const [viewDate, setViewDate] = useState(
    new Date(CALENDAR_YEAR, today.getMonth(), 1)
  );
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<"next" | "prev">("next");

  const changeMonth = useCallback(
    (dir: "next" | "prev") => {
      if (isAnimating) return;
      setAnimDir(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setViewDate((d) => {
          const nextMonth = dir === "next" ? d.getMonth() + 1 : d.getMonth() - 1;
          const wrappedMonth = (nextMonth + 12) % 12;
          return new Date(CALENDAR_YEAR, wrappedMonth, 1);
        });
        setIsAnimating(false);
      }, 350);
    },
    [isAnimating]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      setRange((prev) => {
        if (!prev.start || (prev.start && prev.end)) {
          return { start: date, end: null };
        }
        if (date < prev.start) {
          return { start: date, end: prev.start };
        }
        return { start: prev.start, end: date };
      });
    },
    []
  );

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
  }, []);

  return {
    viewDate,
    range,
    today,
    isAnimating,
    animDir,
    changeMonth,
    handleDayClick,
    clearRange,
  };
}

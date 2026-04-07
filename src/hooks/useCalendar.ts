"use client";
import { useState, useCallback } from "react";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function useCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
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
          const m = dir === "next" ? d.getMonth() + 1 : d.getMonth() - 1;
          return new Date(d.getFullYear(), m, 1);
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

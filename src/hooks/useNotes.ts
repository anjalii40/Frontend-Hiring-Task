"use client";
import { useState, useEffect, useCallback, useRef } from "react";

function readStoredNote(storageKey: string) {
  if (typeof window === "undefined") return "";

  try {
    return localStorage.getItem(storageKey) ?? "";
  } catch {
    return "";
  }
}

export function useNotes(monthKey: string) {
  const storageKey = `calendar-notes-${monthKey}`;
  const [note, setNoteState] = useState(() => readStoredNote(storageKey));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setNoteState(readStoredNote(storageKey));
    }, 0);

    return () => clearTimeout(loadTimer);
  }, [storageKey]);

  const setNote = useCallback(
    (text: string) => {
      setNoteState(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, text);
        } catch {
          /* ignore */
        }
      }, 300);
    },
    [storageKey]
  );

  return { note, setNote };
}

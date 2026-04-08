export const CALENDAR_YEAR = 2027;
export const CALENDAR_START_DATE = `${CALENDAR_YEAR}-01-01`;
export const CALENDAR_END_DATE = `${CALENDAR_YEAR}-12-31`;

export function toInputDate(date: Date) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

export function toCalendarDate(date: Date) {
  return new Date(CALENDAR_YEAR, date.getMonth(), date.getDate());
}

export function clampDateStringToCalendarYear(value: string, fallback = CALENDAR_START_DATE) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return fallback;

  return toInputDate(new Date(CALENDAR_YEAR, date.getMonth(), date.getDate()));
}

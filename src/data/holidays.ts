export interface Holiday {
  month: number; // 0-indexed
  day: number;
  name: string;
}

export const HOLIDAYS: Holiday[] = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 0, day: 26, name: "Republic Day" },
  { month: 1, day: 14, name: "Valentine's Day" },
  { month: 2, day: 8, name: "Holi" },
  { month: 2, day: 25, name: "Good Friday" },
  { month: 3, day: 14, name: "Dr. Ambedkar Jayanti" },
  { month: 3, day: 22, name: "Earth Day" },
  { month: 4, day: 1, name: "Labour Day" },
  { month: 4, day: 12, name: "Mother's Day" },
  { month: 5, day: 21, name: "World Music Day" },
  { month: 6, day: 4, name: "Independence Day (US)" },
  { month: 7, day: 15, name: "Independence Day (India)" },
  { month: 7, day: 26, name: "Women's Equality Day" },
  { month: 8, day: 2, name: "Labour Day (US)" },
  { month: 8, day: 5, name: "Teacher's Day" },
  { month: 9, day: 2, name: "Gandhi Jayanti" },
  { month: 9, day: 31, name: "Halloween" },
  { month: 10, day: 1, name: "Diwali" },
  { month: 10, day: 14, name: "Children's Day" },
  { month: 11, day: 25, name: "Christmas Day" },
  { month: 11, day: 31, name: "New Year's Eve" },
];

export function getHolidaysForMonth(month: number): Holiday[] {
  return HOLIDAYS.filter((h) => h.month === month);
}

export function getHolidayForDay(month: number, day: number): Holiday | undefined {
  return HOLIDAYS.find((h) => h.month === month && h.day === day);
}

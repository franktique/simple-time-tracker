import { CalendarDay } from "@/types";

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function formatMonth(monthString: string): string {
  const [year, month] = monthString.split("-").map(Number);
  const date = new Date(year, month - 1, 1); // Parse in local timezone
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export function getNextMonth(currentMonth: string): string {
  const [year, month] = currentMonth.split("-").map(Number);
  const date = new Date(year, month - 1, 1); // Parse in local timezone
  date.setMonth(date.getMonth() + 1);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, "0");
  return `${newYear}-${newMonth}`;
}

export function getPreviousMonth(currentMonth: string): string {
  const [year, month] = currentMonth.split("-").map(Number);
  const date = new Date(year, month - 1, 1); // Parse in local timezone
  date.setMonth(date.getMonth() - 1);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, "0");
  return `${newYear}-${newMonth}`;
}

export function getDaysInMonth(monthString: string): CalendarDay[] {
  const year = parseInt(monthString.slice(0, 4));
  const month = parseInt(monthString.slice(5, 7)) - 1; // JavaScript months are 0-indexed

  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const days: CalendarDay[] = [];

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const isToday = dateString === todayString;

    days.push({
      date: dateString,
      dayOfMonth: day,
      dayOfWeek: date.getDay(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      isCurrentMonth: true,
      isToday,
    });
  }

  return days;
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function hoursToMilliseconds(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export function millisecondsToHours(milliseconds: number): number {
  return milliseconds / (60 * 60 * 1000);
}

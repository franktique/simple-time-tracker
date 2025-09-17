import { CalendarDay } from '@/types';

export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function formatMonth(monthString: string): string {
  const date = new Date(monthString + '-01');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
}

export function getNextMonth(currentMonth: string): string {
  const date = new Date(currentMonth + '-01');
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 7);
}

export function getPreviousMonth(currentMonth: string): string {
  const date = new Date(currentMonth + '-01');
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().slice(0, 7);
}

export function getDaysInMonth(monthString: string): CalendarDay[] {
  const year = parseInt(monthString.slice(0, 4));
  const month = parseInt(monthString.slice(5, 7)) - 1; // JavaScript months are 0-indexed

  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();

  const days: CalendarDay[] = [];

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().slice(0, 10);
    const isToday = dateString === today.toISOString().slice(0, 10);

    days.push({
      date: dateString,
      dayOfMonth: day,
      dayOfWeek: date.getDay(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      isCurrentMonth: true,
      isToday
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
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function hoursToMilliseconds(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export function millisecondsToHours(milliseconds: number): number {
  return milliseconds / (60 * 60 * 1000);
}
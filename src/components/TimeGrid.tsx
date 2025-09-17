'use client';

import { getDaysInMonth } from '@/utils/dateHelpers';
import { TimeEntry } from '@/types';

interface TimeGridProps {
  currentMonth: string;
  timeEntries: Record<string, TimeEntry>;
}

export function TimeGrid({ currentMonth, timeEntries }: TimeGridProps) {
  const days = getDaysInMonth(currentMonth);

  const getTotalMinutesForDay = (date: string) => {
    return Object.values(timeEntries)
      .filter(entry => entry.date === date)
      .reduce((total, entry) => total + entry.minutes, 0);
  };

  const getDayName = (dayOfWeek: number) => {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return dayNames[dayOfWeek];
  };

  const isWeekend = (dayOfWeek: number) => dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Two-row header system */}
        <div
          className="sticky top-0 z-10"
          style={{ backgroundColor: 'var(--color-background-secondary, var(--color-background))' }}
        >
          {/* First row: Day names and numbers */}
          <div
            className="flex border-b"
            style={{ borderColor: 'var(--color-foreground)', borderOpacity: '0.2' }}
          >
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dayData = days.find(d => d.dayOfMonth === dayNum);
              const isCurrentMonth = dayData?.isCurrentMonth;
              const isToday = dayData?.isToday;
              const dayOfWeek = dayData?.dayOfWeek ?? 0;
              const isWeekendDay = isWeekend(dayOfWeek);

              const getBackgroundColor = () => {
                if (!isCurrentMonth) return 'var(--color-background)';
                if (isWeekendDay) return '#fef2f2';
                if (isToday) return 'var(--color-orange-light, #dbeafe)';
                // Weekdays get orange background
                return 'var(--color-orange-primary, var(--color-background))';
              };

              const getTextColor = () => {
                if (!isCurrentMonth) return 'var(--color-foreground)';
                if (isWeekendDay) return '#dc2626';
                if (isToday) return 'var(--color-orange-primary, #2563eb)';
                // For weekdays on orange background: use contrast color (white in dark mode, dark in light mode)
                return 'var(--color-contrast, white)';
              };

              const getOpacity = () => {
                if (!isCurrentMonth) return '0.6';
                return '1';
              };

              return (
                <div
                  key={dayNum}
                  className="w-10 h-12 flex flex-col items-center justify-center text-xs font-medium border-r"
                  style={{
                    backgroundColor: getBackgroundColor(),
                    color: getTextColor(),
                    opacity: getOpacity(),
                    borderColor: 'var(--color-foreground)',
                    borderOpacity: '0.2'
                  }}
                >
                  {dayNum <= days.length && (
                    <>
                      <span className="text-[10px] leading-none">
                        {getDayName(dayOfWeek)}
                      </span>
                      <span className="text-sm font-bold leading-none mt-1">
                        {dayNum}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Second row: Daily tracked minutes totals */}
          <div className="flex">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dayData = days.find(d => d.dayOfMonth === dayNum);
              const isCurrentMonth = dayData?.isCurrentMonth;
              const dayOfWeek = dayData?.dayOfWeek ?? 0;
              const isWeekendDay = isWeekend(dayOfWeek);

              const date = dayData?.date;
              const totalMinutes = date ? getTotalMinutesForDay(date) : 0;

              const getTotalsBackgroundColor = () => {
                if (!isCurrentMonth) return 'var(--color-background)';
                if (isWeekendDay) return '#fef2f2';
                return 'var(--color-background)';
              };

              const getTotalsTextColor = () => {
                if (!isCurrentMonth) return 'var(--color-foreground)';
                if (isWeekendDay) return '#dc2626';
                return 'var(--color-foreground)';
              };

              const getTotalsOpacity = () => {
                if (!isCurrentMonth) return '0.6';
                return '0.8';
              };

              return (
                <div
                  key={`total-${dayNum}`}
                  className="w-10 h-6 flex items-center justify-center text-xs border-r"
                  style={{
                    backgroundColor: getTotalsBackgroundColor(),
                    color: getTotalsTextColor(),
                    opacity: getTotalsOpacity(),
                    borderColor: 'var(--color-foreground)',
                    borderOpacity: '0.2'
                  }}
                >
                  {dayNum <= days.length && totalMinutes > 0 && totalMinutes}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
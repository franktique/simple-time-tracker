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
        <div className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
          {/* First row: Day names and numbers */}
          <div className="flex border-b border-gray-300 dark:border-gray-600">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dayData = days.find(d => d.dayOfMonth === dayNum);
              const isCurrentMonth = dayData?.isCurrentMonth;
              const isToday = dayData?.isToday;
              const dayOfWeek = dayData?.dayOfWeek ?? 0;
              const isWeekendDay = isWeekend(dayOfWeek);

              return (
                <div
                  key={dayNum}
                  className={`
                    w-10 h-12 flex flex-col items-center justify-center text-xs font-medium border-r border-gray-300 dark:border-gray-600
                    ${!isCurrentMonth
                      ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600'
                      : isWeekendDay
                        ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
                        : isToday
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }
                  `}
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

              return (
                <div
                  key={`total-${dayNum}`}
                  className={`
                    w-10 h-6 flex items-center justify-center text-xs border-r border-gray-300 dark:border-gray-600
                    ${!isCurrentMonth
                      ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600'
                      : isWeekendDay
                        ? 'bg-red-50 dark:bg-red-950 text-red-400 dark:text-red-500'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }
                  `}
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
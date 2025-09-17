'use client';

import { Task, TimeEntry, ActiveTimer } from '@/types';
import { getDaysInMonth } from '@/utils/dateHelpers';
import { TimeCell } from './TimeCell';

interface TaskTimeRowProps {
  task: Task;
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  activeTimers: Record<string, ActiveTimer>;
  currentMonth: string;
  level: number;
  onUpdateTime: (taskId: string, date: string, minutes: number) => void;
  onStartTimer: (taskId: string, date: string) => void;
  onStopTimer: (taskId: string, date: string) => void;
}

export function TaskTimeRow({
  task,
  timeEntries,
  activeTimers,
  currentMonth,
  onUpdateTime,
  onStartTimer,
  onStopTimer
}: TaskTimeRowProps) {
  const days = getDaysInMonth(currentMonth);

  const isWeekend = (dayOfWeek: number) => dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <div className="flex border-b border-gray-300 dark:border-gray-600">
      {Array.from({ length: 31 }, (_, i) => {
        const dayNum = i + 1;
        const dayData = days.find(d => d.dayOfMonth === dayNum);

        if (!dayData) {
          return (
            <div
              key={dayNum}
              className="w-10 h-8 bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-600"
            />
          );
        }

        const isWeekendDay = isWeekend(dayData.dayOfWeek);
        const entryId = `${task.id}-${dayData.date}`;
        const timeEntry = timeEntries[entryId];
        const activeTimer = activeTimers[task.id];

        return (
          <div
            key={dayNum}
            className={`
              w-10 h-8 border-r border-gray-300 dark:border-gray-600
              ${!dayData.isCurrentMonth
                ? 'bg-gray-100 dark:bg-gray-900'
                : isWeekendDay
                  ? 'bg-red-50 dark:bg-red-950'
                  : 'bg-white dark:bg-gray-800'
              }
            `}
          >
            <TimeCell
              task={task}
              date={dayData.date}
              timeEntry={timeEntry}
              activeTimer={activeTimer}
              onUpdateTime={onUpdateTime}
              onStartTimer={onStartTimer}
              onStopTimer={onStopTimer}
              isCurrentMonth={dayData.isCurrentMonth}
            />
          </div>
        );
      })}
    </div>
  );
}
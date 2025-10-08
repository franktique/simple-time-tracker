"use client";

import { Task, TimeEntry, ActiveTimer, CheckEntry } from "@/types";
import { getDaysInMonth } from "@/utils/dateHelpers";
import { TimeCell } from "./TimeCell";
import { CheckmarkCell } from "./CheckmarkCell";

interface TaskTimeRowProps {
  task: Task;
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  activeTimers: Record<string, ActiveTimer>;
  currentMonth: string;
  level: number;
  onUpdateTime: (taskId: string, date: string, minutes: number) => void;
  onToggleCheck: (taskId: string, date: string, isChecked: boolean) => void;
  getCheckEntry: (taskId: string, date: string) => CheckEntry | undefined;
  onStartTimer: (taskId: string, date: string) => void;
  onStopTimer: (taskId: string, date: string) => void;
  onTaskHover: (taskId: string | null) => void;
}

export function TaskTimeRow({
  task,
  timeEntries,
  activeTimers,
  currentMonth,
  onUpdateTime,
  onToggleCheck,
  getCheckEntry,
  onStartTimer,
  onStopTimer,
  onTaskHover,
}: TaskTimeRowProps) {
  const days = getDaysInMonth(currentMonth);

  const isWeekend = (dayOfWeek: number) => dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <div
      className="flex h-8"
      onMouseEnter={() => onTaskHover(task.id)}
      onMouseLeave={() => onTaskHover(null)}
    >
      {Array.from({ length: 31 }, (_, i) => {
        const dayNum = i + 1;
        const dayData = days.find((d) => d.dayOfMonth === dayNum);

        if (!dayData) {
          return (
            <div
              key={dayNum}
              className="w-10 h-8 border-r border-b"
              style={{
                backgroundColor: "var(--color-background)",
                opacity: "0.4",
                borderColor: "var(--color-foreground)",
              }}
            />
          );
        }

        const isWeekendDay = isWeekend(dayData.dayOfWeek);
        const entryId = `${task.id}-${dayData.date}`;
        const timeEntry = timeEntries[entryId];
        const checkEntry = getCheckEntry(task.id, dayData.date);
        const activeTimer = activeTimers[task.id];

        const getCellBackgroundColor = () => {
          if (!dayData.isCurrentMonth) return "var(--color-background)";
          if (isWeekendDay) return "#fef2f2";
          return "var(--color-background)";
        };

        const getCellOpacity = () => {
          if (!dayData.isCurrentMonth) return "0.6";
          return "1";
        };

        // Render checkmark cell for unique and habit tracking types
        if (task.trackingType === 'unique' || task.trackingType === 'habit') {
          return (
            <div
              key={dayNum}
              className="w-10 h-8 border-r border-b flex items-center justify-center"
              style={{
                backgroundColor: getCellBackgroundColor(),
                opacity: getCellOpacity(),
                borderColor: "var(--color-foreground)",
              }}
            >
              <CheckmarkCell
                taskId={task.id}
                date={dayData.date}
                isChecked={checkEntry?.isChecked || false}
                onToggleCheck={onToggleCheck}
                trackingType={task.trackingType}
                taskCompleted={task.isCompleted}
              />
            </div>
          );
        }

        // Render time cell for manual and automatic tracking types
        return (
          <div
            key={dayNum}
            className="w-10 h-8 border-r border-b"
            style={{
              backgroundColor: getCellBackgroundColor(),
              opacity: getCellOpacity(),
              borderColor: "var(--color-foreground)",
            }}
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

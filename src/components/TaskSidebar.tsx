"use client";

import { Task, TimeEntry } from "@/types";
import { TaskRow } from "./TaskRow";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { shouldHideTask } from "@/utils/taskHelpers";

interface TaskSidebarProps {
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  currentMonth: string;
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (parentId: string | null) => void;
  onTaskEdit: (taskId: string, updates: { name?: string; trackingType?: 'manual' | 'automatic' | 'unique' | 'habit' }) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskToggleComplete: (taskId: string) => void;
  hoveredTaskId: string | null;
  hideCompleted: boolean;
}

export function TaskSidebar({
  tasks,
  timeEntries,
  currentMonth,
  onTaskToggle,
  onTaskAdd,
  onTaskEdit,
  onTaskDelete,
  onTaskToggleComplete,
  hoveredTaskId,
  hideCompleted,
}: TaskSidebarProps) {
  const rootTasks = Object.values(tasks)
    .filter((task) => task.parentId === null)
    .filter((task) => !shouldHideTask(task, tasks, hideCompleted))
    .sort((a, b) => a.order - b.order);

  const getTotalHours = () => {
    // This would calculate total hours across all tasks
    // For now, returning placeholder values matching the screenshot
    return { logged: 104, target: 176 };
  };

  // TODO: Use getTotalHours() when implementing actual totals display
  getTotalHours();

  return (
    <div
      className="w-96 border-r flex flex-col"
      style={{
        backgroundColor:
          "var(--color-background-secondary, var(--color-background))",
        borderColor: "var(--color-orange-primary, var(--color-foreground))",
      }}
    >
      {/* Activities header */}
      <div
        className="h-12 px-4 border-b flex items-center"
        style={{
          borderColor: "var(--color-orange-primary, var(--color-foreground))",
          backgroundColor:
            "var(--color-background-surface, var(--color-background))",
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 hover:bg-orange-100 hover:text-orange-600"
              style={{
                color: "var(--color-orange-primary, var(--color-foreground))",
              }}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <h2
              className="font-semibold"
              style={{
                color: "var(--color-orange-primary, var(--color-foreground))",
              }}
            >
              Activities
            </h2>
          </div>
        </div>
      </div>

      {/* Totals header row */}
      <div
        className="h-6 px-4 border-b flex items-center justify-end"
        style={{
          borderColor: "var(--color-orange-primary, var(--color-foreground))",
          backgroundColor:
            "var(--color-background-surface, var(--color-background))",
        }}
      >
        <span
          className="text-sm font-medium"
          style={{
            color: "var(--color-orange-primary, var(--color-foreground))",
            opacity: "0.8",
          }}
        >
          Totals
        </span>
      </div>

      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {rootTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              tasks={tasks}
              timeEntries={timeEntries}
              currentMonth={currentMonth}
              level={0}
              onToggle={onTaskToggle}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onAdd={onTaskAdd}
              onToggleComplete={onTaskToggleComplete}
              hoveredTaskId={hoveredTaskId}
              hideCompleted={hideCompleted}
            />
          ))}

          {/* Add new root task button */}
          <Button
            variant="outline"
            onClick={() => onTaskAdd(null)}
            className="w-full mt-2 justify-start border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
          >
            + Add new category
          </Button>
        </div>
      </div>
    </div>
  );
}

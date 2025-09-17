'use client';

import { Task } from '@/types';
import { TaskRow } from './TaskRow';

interface TaskSidebarProps {
  tasks: Record<string, Task>;
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (parentId: string | null) => void;
  onTaskEdit: (taskId: string, name: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskSidebar({
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskEdit,
  onTaskDelete
}: TaskSidebarProps) {
  const rootTasks = Object.values(tasks)
    .filter(task => task.parentId === null)
    .sort((a, b) => a.order - b.order);

  const getTotalHours = () => {
    // This would calculate total hours across all tasks
    // For now, returning placeholder values matching the screenshot
    return { logged: 104, target: 176 };
  };

  const { logged, target } = getTotalHours();

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Activities header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Activities</h2>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {logged}/{target}
          </span>
        </div>
      </div>

      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {rootTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              tasks={tasks}
              level={0}
              onToggle={onTaskToggle}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onAdd={onTaskAdd}
            />
          ))}

          {/* Add new root task button */}
          <button
            onClick={() => onTaskAdd(null)}
            className="w-full p-2 mt-2 text-left text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            + Add new category
          </button>
        </div>
      </div>
    </div>
  );
}
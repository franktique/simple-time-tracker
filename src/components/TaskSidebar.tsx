'use client';

import { Task } from '@/types';
import { TaskRow } from './TaskRow';

interface TaskSidebarProps {
  tasks: Record<string, Task>;
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (parentId: string | null) => void;
  onTaskEdit: (taskId: string, name: string) => void;
  onTaskDelete: (taskId: string) => void;
  hoveredTaskId: string | null;
}

export function TaskSidebar({
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskEdit,
  onTaskDelete,
  hoveredTaskId
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
    <div
      className="w-80 border-r flex flex-col"
      style={{
        backgroundColor: 'var(--color-background-secondary, var(--color-background))',
        borderColor: 'var(--color-orange-primary, var(--color-foreground))',
        borderOpacity: '0.3'
      }}
    >
      {/* Activities header */}
      <div
        className="p-4 border-b"
        style={{
          borderColor: 'var(--color-orange-primary, var(--color-foreground))',
          borderOpacity: '0.2',
          backgroundColor: 'var(--color-background-surface, var(--color-background))'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-orange-primary, var(--color-foreground))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-orange-light, rgba(0,0,0,0.1))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <h2
              className="font-semibold"
              style={{ color: 'var(--color-orange-primary, var(--color-foreground))' }}
            >
              Activities
            </h2>
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-orange-primary, var(--color-foreground))', opacity: '0.8' }}
          >
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
              hoveredTaskId={hoveredTaskId}
            />
          ))}

          {/* Add new root task button */}
          <button
            onClick={() => onTaskAdd(null)}
            className="w-full p-2 mt-2 text-left text-sm rounded-md transition-colors"
            style={{
              color: 'var(--color-orange-primary, var(--color-foreground))',
              backgroundColor: 'transparent',
              border: `1px solid var(--color-orange-primary, var(--color-foreground))`,
              borderOpacity: '0.3'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-orange-light, rgba(0,0,0,0.1))';
              e.currentTarget.style.borderColor = 'var(--color-orange-hover, var(--color-foreground))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'var(--color-orange-primary, var(--color-foreground))';
            }}
          >
            + Add new category
          </button>
        </div>
      </div>
    </div>
  );
}
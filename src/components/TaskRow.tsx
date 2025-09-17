'use client';

import { useState } from 'react';
import { Task } from '@/types';

interface TaskRowProps {
  task: Task;
  tasks: Record<string, Task>;
  level: number;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string, name: string) => void;
  onDelete: (taskId: string) => void;
  onAdd: (parentId: string | null) => void;
  hoveredTaskId: string | null;
}

export function TaskRow({
  task,
  tasks,
  level,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  hoveredTaskId
}: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);

  const hasChildren = task.children.length > 0;
  const childTasks = task.children
    .map(childId => tasks[childId])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  const handleToggle = () => {
    if (hasChildren) {
      onToggle(task.id);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      if (editName.trim()) {
        onEdit(task.id, editName.trim());
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditName(task.name);
      setIsEditing(false);
    }
  };

  const getTrackingIcon = () => {
    if (task.trackingType === 'automatic') {
      return (
        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      );
    } else if (hasChildren) {
      return null;
    } else {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-foreground)', opacity: '0.5' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    }
  };

  // Calculate total hours for this task (placeholder for now)
  const totalHours = hasChildren ? 0 : (task.trackingType === 'manual' ? 8 : 8);

  // Check if this task is being hovered from the time grid
  const isHighlighted = hoveredTaskId === task.id;

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1 px-2 rounded-md transition-colors group h-8"
        style={{
          marginLeft: level * 16,
          backgroundColor: isHighlighted ? 'var(--color-orange-light, rgba(255,165,0,0.2))' : 'transparent'
        }}
        onMouseEnter={(e) => {
          if (!isHighlighted) {
            e.currentTarget.style.backgroundColor = 'var(--color-orange-light, rgba(0,0,0,0.05))';
          }
        }}
        onMouseLeave={(e) => {
          if (!isHighlighted) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {/* Expand/Collapse button */}
        <button
          onClick={handleToggle}
          className={`w-4 h-4 flex items-center justify-center rounded transition-all ${!hasChildren ? 'invisible' : ''}`}
          style={{
            backgroundColor: 'transparent',
            color: task.isExpanded ? 'var(--color-orange-primary, var(--color-foreground))' : 'var(--color-foreground)',
            opacity: hasChildren ? '0.8' : '0'
          }}
        >
          {hasChildren && (
            <svg
              className={`w-3 h-3 transition-all duration-200 ${task.isExpanded ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Task name */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {getTrackingIcon()}

          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyDown}
              className="flex-1 px-1 py-0.5 text-sm border rounded"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                borderColor: 'var(--color-foreground)',
                borderOpacity: '0.3'
              }}
              autoFocus
            />
          ) : (
            <span
              className={`flex-1 truncate cursor-pointer transition-colors ${hasChildren ? 'text-sm font-medium uppercase tracking-wide' : 'text-sm'}`}
              style={{
                color: hasChildren ? 'var(--color-orange-primary, var(--color-foreground))' : 'var(--color-foreground)',
                opacity: hasChildren ? '1' : '0.9'
              }}
              onClick={handleEdit}
            >
              {task.name}
            </span>
          )}
        </div>

        {/* Total hours */}
        <span
          className="text-xs font-medium min-w-[2rem] text-right"
          style={{ color: 'var(--color-foreground)', opacity: '0.6' }}
        >
          {!hasChildren && totalHours > 0 ? totalHours : ''}
        </span>

        {/* Action buttons */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <button
            onClick={() => onAdd(task.id)}
            className="w-5 h-5 flex items-center justify-center rounded transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-foreground)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-orange-light, rgba(0,0,0,0.1))';
              e.currentTarget.style.color = 'var(--color-orange-primary, var(--color-foreground))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-foreground)';
            }}
            title="Add subtask"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="w-5 h-5 flex items-center justify-center rounded transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Delete task"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Child tasks */}
      {task.isExpanded && childTasks.map(childTask => (
        <TaskRow
          key={childTask.id}
          task={childTask}
          tasks={tasks}
          level={level + 1}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          hoveredTaskId={hoveredTaskId}
        />
      ))}
    </div>
  );
}
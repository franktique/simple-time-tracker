'use client';

import { useState } from 'react';
import { Task, TimeEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ChevronRight, Play, Edit3, Plus, Trash2 } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  currentMonth: string;
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
  timeEntries,
  currentMonth,
  level,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  hoveredTaskId
}: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  const getTrackingIcon = () => {
    if (task.trackingType === 'automatic') {
      return <Play className="w-3 h-3 text-blue-500" />;
    } else if (hasChildren) {
      return null;
    } else {
      return <Edit3 className="w-3 h-3 opacity-50" />;
    }
  };

  // Calculate total minutes for this task across the current month
  const calculateTaskMinutes = (taskId: string): number => {
    return Object.values(timeEntries)
      .filter(entry => {
        // Filter entries for this task and current month
        if (entry.taskId !== taskId) return false;

        // Check if the entry date is in the current month
        const entryMonth = entry.date.substring(0, 7); // Extract YYYY-MM
        return entryMonth === currentMonth;
      })
      .reduce((total, entry) => total + entry.minutes, 0);
  };

  const totalMinutes = calculateTaskMinutes(task.id);

  // Check if this task is being hovered from the time grid
  const isHighlighted = hoveredTaskId === task.id;

  return (
    <div>
      <div
        className="flex items-center gap-1 px-2 rounded-md transition-colors group h-8"
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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className={`w-4 h-4 p-0 hover:bg-orange-100 ${!hasChildren ? 'invisible' : ''}`}
          style={{
            color: task.isExpanded ? 'var(--color-orange-primary, var(--color-foreground))' : 'var(--color-foreground)',
            opacity: hasChildren ? '0.8' : '0'
          }}
        >
          {hasChildren && (
            <ChevronRight
              className={`w-3 h-3 transition-all duration-200 ${task.isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </Button>

        {/* Task name */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {getTrackingIcon()}

          {isEditing ? (
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyDown}
              className="flex-1 h-7 text-sm"
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
          {!hasChildren && totalMinutes > 0 ? totalMinutes : ''}
        </span>

        {/* Action buttons */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAdd(task.id)}
            className="w-5 h-5 p-0 hover:bg-orange-100 hover:text-orange-600"
            title="Add subtask"
          >
            <Plus className="w-3 h-3" />
          </Button>

          {/* Only show delete button for tasks without children */}
          {!hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="w-5 h-5 p-0 hover:bg-red-100 hover:text-red-600"
              title="Delete task"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Child tasks */}
      {task.isExpanded && childTasks.map(childTask => (
        <TaskRow
          key={childTask.id}
          task={childTask}
          tasks={tasks}
          timeEntries={timeEntries}
          currentMonth={currentMonth}
          level={level + 1}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          hoveredTaskId={hoveredTaskId}
        />
      ))}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        variant="destructive"
      />
    </div>
  );
}
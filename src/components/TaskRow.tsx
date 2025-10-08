'use client';

import { useState } from 'react';
import { Task, TimeEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { TaskEditDialog } from '@/components/TaskEditDialog';
import { TaskCompletionDialog } from '@/components/TaskCompletionDialog';
import { ChevronRight, Play, Edit3, Plus, Trash2, CheckCircle, RotateCcw } from 'lucide-react';
import { formatTime } from '@/utils/dateHelpers';
import { hasTaskTimeEntries, shouldHideTask } from '@/utils/taskHelpers';

interface TaskRowProps {
  task: Task;
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  currentMonth: string;
  level: number;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string, updates: { name?: string; trackingType?: 'manual' | 'automatic' | 'unique' | 'habit' }) => void;
  onDelete: (taskId: string) => void;
  onAdd: (parentId: string | null) => void;
  onToggleComplete: (taskId: string) => void;
  hoveredTaskId: string | null;
  hideCompleted: boolean;
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
  onToggleComplete,
  hoveredTaskId,
  hideCompleted
}: TaskRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const hasChildren = task.children.length > 0;
  const childTasks = task.children
    .map(childId => tasks[childId])
    .filter(Boolean)
    .filter(childTask => !shouldHideTask(childTask, tasks, hideCompleted))
    .sort((a, b) => a.order - b.order);

  const handleToggle = () => {
    if (hasChildren) {
      onToggle(task.id);
    }
  };

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditConfirm = (updates: { name?: string; trackingType?: 'manual' | 'automatic' | 'unique' | 'habit' }) => {
    onEdit(task.id, updates);
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  const handleComplete = () => {
    setShowCompletionDialog(true);
  };

  const handleConfirmComplete = () => {
    onToggleComplete(task.id);
    setShowCompletionDialog(false);
  };

  const getTrackingIcon = () => {
    if (task.trackingType === 'automatic') {
      return (
        <div className="flex items-center" title="Automatic tracking - use start/stop timer">
          <Play className="w-3 h-3 text-blue-500" />
        </div>
      );
    } else if (hasChildren) {
      return null;
    } else {
      return (
        <div className="flex items-center" title="Manual tracking - click cells to input time">
          <Edit3 className="w-3 h-3 text-gray-500" />
        </div>
      );
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

  // Check if task has time entries (determines if delete should be disabled)
  const hasEntries = hasTaskTimeEntries(task.id, timeEntries);

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

          <span
            className={`flex-1 truncate cursor-pointer transition-colors ${hasChildren ? 'text-sm font-medium uppercase tracking-wide' : 'text-sm'} ${task.isCompleted ? 'line-through opacity-60' : ''}`}
            style={{
              color: hasChildren ? 'var(--color-orange-primary, var(--color-foreground))' : 'var(--color-foreground)',
              opacity: hasChildren ? '1' : (task.isCompleted ? '0.6' : '0.9')
            }}
            onClick={handleEdit}
          >
            {task.name}
          </span>
        </div>

        {/* Total hours */}
        <span
          className="text-xs font-medium min-w-[2rem] text-right"
          style={{ color: 'var(--color-foreground)', opacity: '0.6' }}
        >
          {!hasChildren && totalMinutes > 0 ? (
            task.trackingType === 'automatic'
              ? formatTime(totalMinutes * 60 * 1000)
              : totalMinutes.toFixed(1)
          ) : ''}
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

          {/* Show completion button for leaf tasks */}
          {!hasChildren && (
            task.isCompleted ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleComplete}
                className="w-5 h-5 p-0 hover:bg-orange-100 hover:text-orange-600"
                title="Mark as incomplete"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleComplete}
                className="w-5 h-5 p-0 hover:bg-green-100 hover:text-green-600"
                title="Mark as completed"
              >
                <CheckCircle className="w-3 h-3" />
              </Button>
            )
          )}

          {/* Only show delete button for tasks without children */}
          {!hasChildren && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDelete}
                      disabled={hasEntries}
                      className={`w-5 h-5 p-0 ${
                        hasEntries
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-red-100 hover:text-red-600'
                      }`}
                      title={hasEntries ? undefined : "Delete task"}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </span>
                </TooltipTrigger>
                {hasEntries && (
                  <TooltipContent>
                    <p>Cannot delete task with time entries</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
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
          onToggleComplete={onToggleComplete}
          hoveredTaskId={hoveredTaskId}
          hideCompleted={hideCompleted}
        />
      ))}

      {/* Edit dialog */}
      <TaskEditDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onConfirm={handleEditConfirm}
        task={task}
        hasTimeEntries={hasTaskTimeEntries(task.id, timeEntries)}
      />

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

      {/* Task completion dialog */}
      <TaskCompletionDialog
        isOpen={showCompletionDialog}
        task={task}
        onClose={() => setShowCompletionDialog(false)}
        onConfirm={handleConfirmComplete}
      />
    </div>
  );
}
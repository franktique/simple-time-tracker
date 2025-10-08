'use client';

import { useState, useEffect, useRef } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrackingTypeSelector } from '@/components/TrackingTypeSelector';

interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updates: { name?: string; trackingType?: 'manual' | 'automatic' | 'unique' | 'habit' }) => void;
  task: Task;
  hasTimeEntries: boolean;
}

/**
 * Dialog component for editing an existing task with name and tracking type selection
 * Tracking type can only be changed if task has no time entries and no children
 */
export function TaskEditDialog({
  isOpen,
  onClose,
  onConfirm,
  task,
  hasTimeEntries
}: TaskEditDialogProps) {
  const [name, setName] = useState(task.name);
  const [trackingType, setTrackingType] = useState<'manual' | 'automatic' | 'unique' | 'habit'>(task.trackingType);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if tracking type can be changed
  const canChangeTrackingType = !task.children.length && !hasTimeEntries;

  useEffect(() => {
    if (isOpen) {
      setName(task.name);
      setTrackingType(task.trackingType);
      // Focus input after a short delay to ensure dialog is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, task]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (name.trim()) {
      const updates: { name?: string; trackingType?: 'manual' | 'automatic' | 'unique' | 'habit' } = {};

      if (name.trim() !== task.name) {
        updates.name = name.trim();
      }

      if (canChangeTrackingType && trackingType !== task.trackingType) {
        updates.trackingType = trackingType;
      }

      if (Object.keys(updates).length > 0) {
        onConfirm(updates);
      }
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="task-name" className="block text-sm font-medium mb-1">
                Task Name
              </label>
              <Input
                ref={inputRef}
                id="task-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter task name..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tracking Type
              </label>
              {canChangeTrackingType ? (
                <>
                  <TrackingTypeSelector
                    value={trackingType}
                    onChange={setTrackingType}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {trackingType === 'manual'
                      ? 'Click cells to input time directly'
                      : 'Use start/stop buttons to track time automatically'}
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center gap-2">
                      <TrackingTypeSelector
                        value={task.trackingType}
                        onChange={() => {}} // No-op since it's disabled
                        disabled
                      />
                      <span className="text-sm text-gray-600">
                        ({task.trackingType})
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {hasTimeEntries
                      ? 'Tracking type cannot be changed because this task has recorded time entries.'
                      : 'Tracking type cannot be changed for parent tasks.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
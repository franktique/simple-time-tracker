'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrackingTypeSelector } from '@/components/TrackingTypeSelector';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, trackingType: 'manual' | 'automatic' | 'unique' | 'habit') => void;
  defaultTrackingType: 'manual' | 'automatic' | 'unique' | 'habit';
  title?: string;
}

/**
 * Dialog component for creating a new task with name and tracking type selection
 */
export function TaskDialog({
  isOpen,
  onClose,
  onConfirm,
  defaultTrackingType,
  title = 'Create New Task'
}: TaskDialogProps) {
  const [name, setName] = useState('');
  const [trackingType, setTrackingType] = useState<'manual' | 'automatic' | 'unique' | 'habit'>(defaultTrackingType);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setTrackingType(defaultTrackingType);
      // Focus input after a short delay to ensure dialog is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, defaultTrackingType]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim(), trackingType);
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
          <h2 className="text-lg font-semibold mb-4">{title}</h2>

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
              <TrackingTypeSelector
                value={trackingType}
                onChange={setTrackingType}
              />
              <p className="text-xs text-gray-500 mt-2">
                {trackingType === 'manual'
                  ? 'Click cells to input time directly'
                  : 'Use start/stop buttons to track time automatically'}
              </p>
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
                Create Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

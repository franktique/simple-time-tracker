'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, TimeEntry, ActiveTimer } from '@/types';
import { formatTime } from '@/utils/dateHelpers';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface TimeCellProps {
  task: Task;
  date: string;
  timeEntry?: TimeEntry;
  activeTimer?: ActiveTimer;
  onUpdateTime: (taskId: string, date: string, minutes: number) => void;
  onStartTimer: (taskId: string, date: string) => void;
  onStopTimer: (taskId: string, date: string) => void;
  isCurrentMonth?: boolean;
  isToday?: boolean;
}

export function TimeCell({
  task,
  date,
  timeEntry,
  activeTimer,
  onUpdateTime,
  onStartTimer,
  onStopTimer,
  isCurrentMonth = true,
  isToday = false
}: TimeCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [displayTime, setDisplayTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLeafTask = task.children.length === 0;
  // Timer is active for THIS cell only if the activeTimer's date matches this cell's date
  const hasTimer = activeTimer !== undefined && activeTimer.date === date;
  const minutes = timeEntry?.minutes || 0;

  // Update display time for active timers
  useEffect(() => {
    // For cells without an active timer, just show the stored minutes
    if (!hasTimer) {
      setDisplayTime(minutes);
      return;
    }

    // This cell has the active timer - update every second
    const interval = setInterval(() => {
      const elapsed = activeTimer.elapsedTime + (Date.now() - activeTimer.startTime);
      const timerMinutes = elapsed / (60 * 1000);
      setDisplayTime(minutes + timerMinutes);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTimer, activeTimer, minutes]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Cleanup context menu on unmount
  useEffect(() => {
    return () => {
      setContextMenu(null);
    };
  }, []);

  const handleCellClick = () => {
    if (!isLeafTask) return;

    if (task.trackingType === 'manual' && !hasTimer) {
      setInputValue(minutes.toString());
      setIsEditing(true);
    }
  };

  const handleInputSubmit = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      onUpdateTime(task.id, date, value);
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleTimerToggle = () => {
    if (hasTimer) {
      onStopTimer(task.id, date);
    } else {
      onStartTimer(task.id, date);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    // Only show context menu if there's a time entry to delete
    if (minutes > 0 && isLeafTask && isCurrentMonth && !hasTimer) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDeleteEntry = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onUpdateTime(task.id, date, 0);
    setShowDeleteConfirm(false);
  };

  const formatDisplayValue = () => {
    // For automatic tracking tasks, always show time in MM:SS format
    if (task.trackingType === 'automatic') {
      if (displayTime === 0) return '';
      return formatTime(displayTime * 60 * 1000);
    }

    // For manual tracking tasks, show decimal hours
    if (displayTime === 0) return '';
    if (displayTime === Math.floor(displayTime)) {
      return displayTime.toString();
    }
    return displayTime.toFixed(1);
  };

  // Don't render anything for parent tasks
  if (!isLeafTask) {
    return <div className="h-full w-full"></div>;
  }

  // Don't render if not in current month
  if (!isCurrentMonth) {
    return <div className="h-full w-full"></div>;
  }

  return (
    <>
      <div
        className="h-full w-full flex items-center justify-center text-sm relative group cursor-pointer"
        style={{
          backgroundColor: hasTimer ? 'var(--color-orange-light, #dbeafe)' : (isToday ? 'var(--color-orange-light, #dbeafe)' : 'transparent')
        }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          if (task.trackingType === 'manual' && !hasTimer && !isToday) {
            e.currentTarget.style.backgroundColor = 'var(--color-orange-light, rgba(0,0,0,0.05))';
          }
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          if (task.trackingType === 'manual' && !hasTimer) {
            e.currentTarget.style.backgroundColor = isToday ? 'var(--color-orange-light, #dbeafe)' : 'transparent';
          }
        }}
        onClick={handleCellClick}
        onContextMenu={handleContextMenu}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={handleInputKeyDown}
            className="w-full h-full px-1 text-center text-sm border-none outline-none"
            style={{
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-foreground)'
            }}
            step="0.1"
            min="0"
          />
        ) : (
          <>
            {/* Show timer button only for automatic tracking tasks */}
            {task.trackingType === 'automatic' && (isHovered || hasTimer) && (
              <button
                onClick={handleTimerToggle}
                className="absolute inset-0 flex items-center justify-center transition-all hover:bg-orange-50 hover:bg-opacity-30"
                style={{
                  color: hasTimer ? 'var(--color-orange-primary, #2563eb)' : 'var(--color-foreground)',
                  opacity: hasTimer ? '1' : '0.7'
                }}
                title={hasTimer ? 'Stop timer' : 'Start timer'}
              >
                {hasTimer ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}

            {/* Display time value */}
            <span
              className={`${task.trackingType === 'automatic' ? 'absolute bottom-0.5 right-0.5 px-1 text-xs pointer-events-none rounded' : ''} ${hasTimer ? 'font-medium' : ''}`}
              style={{
                color: hasTimer ? 'var(--color-orange-primary, #2563eb)' : 'var(--color-foreground)',
                opacity: hasTimer ? '1' : '0.9',
                backgroundColor: hasTimer && task.trackingType === 'automatic' ? 'white' : 'transparent',
                zIndex: 10
              }}
            >
              {formatDisplayValue()}
            </span>
          </>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            {
              label: 'Delete Entry',
              onClick: handleDeleteEntry,
              danger: true
            }
          ]}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Time Entry"
        message={`Are you sure you want to delete ${formatDisplayValue() || 'this time entry'} for "${task.name}" on ${date}?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
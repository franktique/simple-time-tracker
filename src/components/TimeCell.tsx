'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, TimeEntry, ActiveTimer } from '@/types';
import { formatTime } from '@/utils/dateHelpers';

interface TimeCellProps {
  task: Task;
  date: string;
  timeEntry?: TimeEntry;
  activeTimer?: ActiveTimer;
  onUpdateTime: (taskId: string, date: string, minutes: number) => void;
  onStartTimer: (taskId: string, date: string) => void;
  onStopTimer: (taskId: string, date: string) => void;
  isCurrentMonth?: boolean;
}

export function TimeCell({
  task,
  date,
  timeEntry,
  activeTimer,
  onUpdateTime,
  onStartTimer,
  onStopTimer,
  isCurrentMonth = true
}: TimeCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [displayTime, setDisplayTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLeafTask = task.children.length === 0;
  const hasTimer = activeTimer !== undefined;
  const minutes = timeEntry?.minutes || 0;

  // Update display time for active timers
  useEffect(() => {
    if (!activeTimer) {
      setDisplayTime(minutes);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = activeTimer.elapsedTime + (Date.now() - activeTimer.startTime);
      const timerMinutes = elapsed / (60 * 1000);
      setDisplayTime(minutes + timerMinutes);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, minutes]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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

  const formatDisplayValue = () => {
    if (hasTimer) {
      return formatTime(displayTime * 60 * 1000);
    }
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
    <div
      className="h-full w-full flex items-center justify-center text-sm relative group cursor-pointer"
      style={{
        backgroundColor: hasTimer ? 'var(--color-orange-light, #dbeafe)' : 'transparent'
      }}
      onMouseEnter={(e) => {
        if (task.trackingType === 'manual' && !hasTimer) {
          e.currentTarget.style.backgroundColor = 'var(--color-orange-light, rgba(0,0,0,0.05))';
        }
      }}
      onMouseLeave={(e) => {
        if (task.trackingType === 'manual' && !hasTimer) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      onClick={handleCellClick}
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
          {task.trackingType === 'automatic' && (
            <button
              onClick={handleTimerToggle}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: hasTimer ? 'var(--color-orange-primary, #2563eb)' : 'var(--color-foreground)',
                opacity: hasTimer ? '1' : '0.6'
              }}
              title={hasTimer ? 'Stop timer' : 'Start timer'}
            >
              {hasTimer ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}

          {/* Display time value */}
          <span
            className={`${task.trackingType === 'automatic' ? 'absolute bottom-0 right-0 px-1 text-xs' : ''} ${hasTimer ? 'font-medium' : ''}`}
            style={{
              color: hasTimer ? 'var(--color-orange-primary, #2563eb)' : 'var(--color-foreground)',
              opacity: hasTimer ? '1' : '0.9'
            }}
          >
            {formatDisplayValue()}
          </span>
        </>
      )}
    </div>
  );
}
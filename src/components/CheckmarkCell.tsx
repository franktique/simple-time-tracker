'use client';

import { Check } from 'lucide-react';

interface CheckmarkCellProps {
  taskId: string;
  date: string;
  isChecked: boolean;
  onToggleCheck: (taskId: string, date: string, isChecked: boolean) => void;
  disabled?: boolean;
  trackingType: 'unique' | 'habit';
  taskCompleted?: boolean;
}

export function CheckmarkCell({
  taskId,
  date,
  isChecked,
  onToggleCheck,
  disabled = false,
  trackingType,
  taskCompleted = false
}: CheckmarkCellProps) {
  const handleClick = () => {
    if (disabled) return;

    // For unique tracking, if already checked, don't allow unchecking
    if (trackingType === 'unique' && isChecked) {
      return;
    }

    onToggleCheck(taskId, date, !isChecked);
  };

  const getCellStyle = () => {
    const baseStyle = "w-8 h-8 rounded border-2 flex items-center justify-center transition-all cursor-pointer";

    if (isChecked) {
      return `${baseStyle} bg-green-100 border-green-400 text-green-600 hover:bg-green-200`;
    }

    if (taskCompleted && trackingType === 'unique') {
      return `${baseStyle} bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed`;
    }

    return `${baseStyle} bg-white border-gray-300 hover:border-green-400 hover:bg-green-50`;
  };

  const getIcon = () => {
    if (!isChecked) return null;

    return <Check className="w-5 h-5" />;
  };

  const getTitle = () => {
    if (taskCompleted && trackingType === 'unique') {
      return 'Task completed - no more checks allowed';
    }

    if (isChecked) {
      if (trackingType === 'unique') {
        return 'Checked - task completed (click to view)';
      } else {
        return 'Checked - click to uncheck';
      }
    }

    return 'Click to check';
  };

  return (
    <div
      className={getCellStyle()}
      onClick={handleClick}
      title={getTitle()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-pressed={isChecked}
      aria-label={`Check mark for ${date}, ${isChecked ? 'checked' : 'unchecked'}`}
    >
      {getIcon()}
    </div>
  );
}
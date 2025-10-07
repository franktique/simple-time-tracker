'use client';

import { Play, Edit3 } from 'lucide-react';

interface TrackingTypeSelectorProps {
  value: 'manual' | 'automatic';
  onChange: (value: 'manual' | 'automatic') => void;
  disabled?: boolean;
}

/**
 * Component for selecting the tracking type of a task.
 * - Manual: User inputs time directly into cells
 * - Automatic: User uses start/stop timer buttons
 */
export function TrackingTypeSelector({
  value,
  onChange,
  disabled = false
}: TrackingTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange('manual')}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-all ${
          value === 'manual'
            ? 'border-orange-400 bg-orange-50 text-orange-700'
            : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title="Manual time entry - click cells to input time directly"
      >
        <Edit3 className="w-4 h-4" />
        <span>Manual Entry</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('automatic')}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-all ${
          value === 'automatic'
            ? 'border-blue-400 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title="Automatic timer - use start/stop buttons to track time"
      >
        <Play className="w-4 h-4" />
        <span>Auto Timer</span>
      </button>
    </div>
  );
}

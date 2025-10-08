'use client';

import { formatMonth, getNextMonth, getPreviousMonth } from '@/utils/dateHelpers';
import { ThemeToggle } from './ThemeToggle';
import { ExportButton } from './ExportButton';
import { ImportButton } from './ImportButton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeaderProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  userName?: string;
  hideCompleted: boolean;
  onToggleHideCompleted: () => void;
}

export function Header({ currentMonth, onMonthChange, userName = 'User', hideCompleted, onToggleHideCompleted }: HeaderProps) {
  const handlePreviousMonth = () => {
    onMonthChange(getPreviousMonth(currentMonth));
  };

  const handleNextMonth = () => {
    onMonthChange(getNextMonth(currentMonth));
  };

  return (
    <div
      className="flex items-center justify-between p-4 border-b transition-colors"
      style={{
        backgroundColor: 'var(--color-background-secondary, var(--color-background))',
        borderColor: 'var(--color-foreground)'
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>
            {userName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <h1 className="text-xl font-semibold min-w-[150px] text-center" style={{ color: 'var(--color-foreground)' }}>
          {formatMonth(currentMonth)}
        </h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={onToggleHideCompleted}
            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
          />
          <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>
            Hide completed
          </span>
        </label>
        <ExportButton />
        <ImportButton />
        <ThemeToggle />
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          Profile
        </Button>
      </div>
    </div>
  );
}
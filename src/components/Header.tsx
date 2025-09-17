'use client';

import { formatMonth, getNextMonth, getPreviousMonth } from '@/utils/dateHelpers';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  userName?: string;
}

export function Header({ currentMonth, onMonthChange, userName = 'User' }: HeaderProps) {
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
        borderColor: 'var(--color-foreground)',
        borderOpacity: '0.1'
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
        <button
          onClick={handlePreviousMonth}
          className="p-2 rounded-md transition-colors hover:brightness-110"
          style={{ backgroundColor: 'transparent' }}
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-foreground)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-xl font-semibold min-w-[150px] text-center" style={{ color: 'var(--color-foreground)' }}>
          {formatMonth(currentMonth)}
        </h1>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-md transition-colors hover:brightness-110"
          style={{ backgroundColor: 'transparent' }}
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-foreground)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          className="px-3 py-1 text-sm rounded-md transition-colors"
          style={{
            backgroundColor: 'var(--color-orange-primary, #3b82f6)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-orange-hover, #2563eb)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-orange-primary, #3b82f6)';
          }}
        >
          Profile
        </button>
      </div>
    </div>
  );
}
'use client';

import { formatMonth, getNextMonth, getPreviousMonth } from '@/utils/dateHelpers';

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
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {userName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 min-w-[150px] text-center">
          {formatMonth(currentMonth)}
        </h1>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Profile
        </button>
      </div>
    </div>
  );
}
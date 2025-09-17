'use client';

import { useTheme } from '@/hooks/useTheme';

const themeIcons = {
  light: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  dark: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  system: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const nextTheme = () => {
    const themes = ['system', 'light', 'dark'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const isDarkMode = actualTheme === 'dark';

  return (
    <button
      onClick={nextTheme}
      className="flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors"
      style={{
        backgroundColor: isDarkMode ? 'var(--color-orange-primary, #374151)' : '#f3f4f6',
        color: isDarkMode ? 'white' : '#374151'
      }}
      onMouseEnter={(e) => {
        if (isDarkMode) {
          e.currentTarget.style.backgroundColor = 'var(--color-orange-hover, #4b5563)';
        } else {
          e.currentTarget.style.backgroundColor = '#e5e7eb';
        }
      }}
      onMouseLeave={(e) => {
        if (isDarkMode) {
          e.currentTarget.style.backgroundColor = 'var(--color-orange-primary, #374151)';
        } else {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }
      }}
      title={`Current theme: ${themeLabels[theme]}. Click to cycle themes.`}
    >
      {themeIcons[theme]}
      <span className="hidden sm:inline">{themeLabels[theme]}</span>
    </button>
  );
}
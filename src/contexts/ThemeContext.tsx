'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem('theme') as Theme;
  return stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'system';
}

function calculateActualTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with proper values from the start
  const [isInitialized, setIsInitialized] = useState(false);
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    const calculatedActualTheme = calculateActualTheme(storedTheme);

    setThemeState(storedTheme);
    setActualTheme(calculatedActualTheme);

    // Only update DOM if it differs from the server-rendered state
    const root = document.documentElement;
    const currentClass = root.classList.contains('dark') ? 'dark' : 'light';

    if (currentClass !== calculatedActualTheme) {
      root.classList.remove('light', 'dark');
      root.classList.add(calculatedActualTheme);
    }

    setIsInitialized(true);
  }, []);

  // Handle theme changes and system preference updates
  useEffect(() => {
    if (!isInitialized) return;

    const updateTheme = () => {
      const newActualTheme = calculateActualTheme(theme);
      setActualTheme(newActualTheme);

      // Update localStorage
      localStorage.setItem('theme', theme);

      // Update DOM classes
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newActualTheme);
    };

    updateTheme();

    // Listen for system theme changes only when theme is 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newActualTheme = getSystemTheme();
        setActualTheme(newActualTheme);

        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newActualTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, isInitialized]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';

const themeIcons = {
  light: <Sun className="w-4 h-4" />,
  dark: <Moon className="w-4 h-4" />,
  system: <Monitor className="w-4 h-4" />,
};

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const themes = ['system', 'light', 'dark'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // TODO: Use actualTheme if needed for theming logic

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={nextTheme}
      className="flex items-center gap-2"
      title={`Current theme: ${themeLabels[theme]}. Click to cycle themes.`}
    >
      {themeIcons[theme]}
      <span className="hidden sm:inline">{themeLabels[theme]}</span>
    </Button>
  );
}
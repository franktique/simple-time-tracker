export interface Task {
  id: string;
  name: string;
  parentId: string | null;
  children: string[];
  trackingType: 'manual' | 'automatic';
  isExpanded: boolean;
  isCompleted: boolean;
  order: number;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD format
  minutes: number;
  isActive: boolean;
  startTime?: number; // timestamp for active timers
}

export interface ActiveTimer {
  taskId: string;
  date: string; // YYYY-MM-DD format - the specific date/cell being tracked
  startTime: number;
  elapsedTime: number; // in milliseconds
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultTrackingType: 'manual' | 'automatic';
  timeFormat: '12h' | '24h';
}

export interface AppState {
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  activeTimers: Record<string, ActiveTimer>;
  currentMonth: string; // YYYY-MM format
  userPreferences: UserPreferences;
  isLoading: boolean;
}

export interface CalendarDay {
  date: string;
  dayOfMonth: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  isCurrentMonth: boolean;
  isToday: boolean;
}
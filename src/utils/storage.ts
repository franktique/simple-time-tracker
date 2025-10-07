import { Task, TimeEntry, ActiveTimer, UserPreferences, AppState } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'timetracker-tasks',
  TIME_ENTRIES: 'timetracker-entries',
  ACTIVE_TIMERS: 'timetracker-timers',
  PREFERENCES: 'timetracker-preferences',
  VERSION: 'timetracker-version'
} as const;

const CURRENT_VERSION = '1.0.0';

export class StorageManager {
  private static debounceTimers: Record<string, NodeJS.Timeout> = {};

  static saveData<T>(key: string, data: T, immediate = false): void {
    const save = () => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    };

    if (immediate) {
      save();
      return;
    }

    if (this.debounceTimers[key]) {
      clearTimeout(this.debounceTimers[key]);
    }

    this.debounceTimers[key] = setTimeout(() => {
      save();
      delete this.debounceTimers[key];
    }, 300);
  }

  static loadData<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return defaultValue;
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  static saveTasks(tasks: Record<string, Task>): void {
    this.saveData(STORAGE_KEYS.TASKS, tasks);
  }

  static loadTasks(): Record<string, Task> {
    const tasks = this.loadData(STORAGE_KEYS.TASKS, {});

    // If no tasks exist, create sample hierarchical data
    if (Object.keys(tasks).length === 0) {
      return this.createSampleTasks();
    }

    // Migrate existing tasks to include isCompleted field
    Object.keys(tasks).forEach(taskId => {
      const task = tasks[taskId];
      if (task.isCompleted === undefined) {
        task.isCompleted = false;
      }
    });

    return tasks;
  }

  private static createSampleTasks(): Record<string, Task> {
    const tasks: Record<string, Task> = {};

    // Create ADMIN category (top-level, parent task)
    const adminTask: Task = {
      id: 'admin-1',
      name: 'ADMIN',
      parentId: null,
      children: ['planning-1'],
      trackingType: 'manual',
      isExpanded: false,
      isCompleted: false,
      order: 0
    };
    tasks[adminTask.id] = adminTask;

    // Create planning subtask under ADMIN
    const planningTask: Task = {
      id: 'planning-1',
      name: 'planning',
      parentId: 'admin-1',
      children: [],
      trackingType: 'manual',
      isExpanded: false,
      isCompleted: false,
      order: 0
    };
    tasks[planningTask.id] = planningTask;

    return tasks;
  }

  static saveTimeEntries(entries: Record<string, TimeEntry>): void {
    this.saveData(STORAGE_KEYS.TIME_ENTRIES, entries);
  }

  static loadTimeEntries(): Record<string, TimeEntry> {
    return this.loadData(STORAGE_KEYS.TIME_ENTRIES, {});
  }

  static saveActiveTimers(timers: Record<string, ActiveTimer>): void {
    this.saveData(STORAGE_KEYS.ACTIVE_TIMERS, timers, true);
  }

  static loadActiveTimers(): Record<string, ActiveTimer> {
    return this.loadData(STORAGE_KEYS.ACTIVE_TIMERS, {});
  }

  static savePreferences(preferences: UserPreferences): void {
    this.saveData(STORAGE_KEYS.PREFERENCES, preferences);
  }

  static loadPreferences(): UserPreferences {
    return this.loadData(STORAGE_KEYS.PREFERENCES, {
      theme: 'system',
      defaultTrackingType: 'manual',
      timeFormat: '24h'
    });
  }

  static initializeStorage(): AppState {
    this.migrateIfNeeded();

    return {
      tasks: this.loadTasks(),
      timeEntries: this.loadTimeEntries(),
      activeTimers: this.loadActiveTimers(),
      currentMonth: new Date().toISOString().slice(0, 7),
      userPreferences: this.loadPreferences(),
      isLoading: false
    };
  }

  private static migrateIfNeeded(): void {
    const currentVersion: string = this.loadData(STORAGE_KEYS.VERSION, '0.0.0');

    if (currentVersion !== CURRENT_VERSION) {
      console.log(`Migrating storage from ${currentVersion} to ${CURRENT_VERSION}`);
      this.saveData(STORAGE_KEYS.VERSION, CURRENT_VERSION, true);
    }
  }

  static exportData(): string {
    const data = {
      tasks: this.loadTasks(),
      timeEntries: this.loadTimeEntries(),
      preferences: this.loadPreferences(),
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.tasks) this.saveData(STORAGE_KEYS.TASKS, data.tasks, true);
      if (data.timeEntries) this.saveData(STORAGE_KEYS.TIME_ENTRIES, data.timeEntries, true);
      if (data.preferences) this.saveData(STORAGE_KEYS.PREFERENCES, data.preferences, true);

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
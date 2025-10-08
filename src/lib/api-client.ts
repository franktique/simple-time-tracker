import { Task, TimeEntry, ActiveTimer, UserPreferences, CheckEntry } from '@/types';

const API_BASE = '/api';

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Tasks API
export const tasksAPI = {
  getAll: () => fetchAPI<Record<string, Task>>('/tasks'),

  getById: (id: string) => fetchAPI<Task>(`/tasks/${id}`),

  create: (task: Task) => fetchAPI<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),

  update: (id: string, updates: Partial<Task>) => fetchAPI<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),

  delete: (id: string) => fetchAPI<{ success: boolean }>(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};

// Time Entries API
export const timeEntriesAPI = {
  getAll: () => fetchAPI<Record<string, TimeEntry>>('/time-entries'),

  getByDateRange: (startDate: string, endDate: string) =>
    fetchAPI<Record<string, TimeEntry>>(`/time-entries?startDate=${startDate}&endDate=${endDate}`),

  getById: (id: string) => fetchAPI<TimeEntry>(`/time-entries/${id}`),

  upsert: (entry: TimeEntry) => fetchAPI<TimeEntry>('/time-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  }),

  delete: (id: string) => fetchAPI<{ success: boolean }>(`/time-entries/${id}`, {
    method: 'DELETE',
  }),
};

// Timers API
export const timersAPI = {
  getAll: () => fetchAPI<Record<string, ActiveTimer>>('/timers'),

  getByTask: (taskId: string) => fetchAPI<ActiveTimer>(`/timers/${taskId}`),

  start: (timer: ActiveTimer) => fetchAPI<ActiveTimer>('/timers', {
    method: 'POST',
    body: JSON.stringify(timer),
  }),

  update: (taskId: string, updates: Partial<ActiveTimer>) =>
    fetchAPI<ActiveTimer>(`/timers/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  stop: (taskId: string) => fetchAPI<{ success: boolean }>(`/timers/${taskId}`, {
    method: 'DELETE',
  }),
};

// Check Entries API
export const checkEntriesAPI = {
  getAll: () => fetchAPI<Record<string, CheckEntry>>('/check-entries'),

  getByDateRange: (startDate: string, endDate: string) =>
    fetchAPI<Record<string, CheckEntry>>(`/check-entries?startDate=${startDate}&endDate=${endDate}`),

  getByTask: (taskId: string) => fetchAPI<CheckEntry[]>(`/check-entries/task/${taskId}`),

  getById: (id: string) => fetchAPI<CheckEntry>(`/check-entries/${id}`),

  upsert: (entry: CheckEntry) => fetchAPI<CheckEntry>('/check-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  }),

  delete: (id: string) => fetchAPI<{ success: boolean }>(`/check-entries/${id}`, {
    method: 'DELETE',
  }),

  deleteByTask: (taskId: string) => fetchAPI<{ success: boolean }>(`/check-entries/task/${taskId}`, {
    method: 'DELETE',
  }),
};

// Preferences API
export const preferencesAPI = {
  get: () => fetchAPI<UserPreferences>('/preferences'),

  update: (updates: Partial<UserPreferences>) => fetchAPI<UserPreferences>('/preferences', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
};

// Export/Import API
export interface ExportData {
  version: string;
  exportDate: string;
  data: {
    tasks: Record<string, Task>;
    timeEntries: Record<string, TimeEntry>;
    checkEntries: Record<string, CheckEntry>;
    activeTimers: Record<string, ActiveTimer>;
    userPreferences: UserPreferences;
  };
}

export interface ImportResponse {
  success: boolean;
  message: string;
  stats: {
    tasks: number;
    timeEntries: number;
    checkEntries: number;
    activeTimers: number;
  };
}

export const exportAPI = {
  getAll: () => fetchAPI<ExportData>('/export'),
};

export const importAPI = {
  uploadData: (data: ExportData) => fetchAPI<ImportResponse>('/import', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

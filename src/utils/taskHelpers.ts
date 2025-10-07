import { Task, TimeEntry } from '@/types';

/**
 * Gets the flattened list of visible tasks in the exact same order as they appear in the sidebar
 * This ensures perfect alignment between sidebar tasks and time grid rows
 */
export function getVisibleTasks(tasks: Record<string, Task>): Task[] {
  const visibleTasks: Task[] = [];

  const addTaskAndChildren = (task: Task) => {
    visibleTasks.push(task);
    if (task.isExpanded && task.children.length > 0) {
      const children = task.children
        .map(childId => tasks[childId])
        .filter(Boolean)
        .sort((a, b) => a.order - b.order);
      children.forEach(addTaskAndChildren);
    }
  };

  // Get root tasks in order
  const rootTasks = Object.values(tasks)
    .filter(task => task.parentId === null)
    .sort((a, b) => a.order - b.order);

  // Process each root task and its children recursively
  rootTasks.forEach(addTaskAndChildren);

  return visibleTasks;
}

/**
 * Calculates the total hours logged for a specific task across all dates
 */
export function getTaskTotalHours(taskId: string, timeEntries: Record<string, TimeEntry>): number {
  return Object.values(timeEntries)
    .filter((entry: TimeEntry) => entry.taskId === taskId)
    .reduce((total: number, entry: TimeEntry) => total + (entry.minutes || 0) / 60, 0);
}

/**
 * Gets the nesting level of a task in the hierarchy
 */
export function getTaskLevel(task: Task, tasks: Record<string, Task>): number {
  let level = 0;
  let currentTask = task;

  while (currentTask.parentId !== null) {
    level++;
    const parent = tasks[currentTask.parentId];
    if (!parent) break;
    currentTask = parent;
  }

  return level;
}

/**
 * Checks if a task has any time entries
 */
export function hasTaskTimeEntries(taskId: string, timeEntries: Record<string, TimeEntry>): boolean {
  return Object.values(timeEntries).some(entry => entry.taskId === taskId);
}

/**
 * Checks if a task's tracking type can be changed
 * Returns false if task has children or has time entries
 */
export function canChangeTrackingType(task: Task, timeEntries: Record<string, TimeEntry>): boolean {
  return !task.children.length && !hasTaskTimeEntries(task.id, timeEntries);
}
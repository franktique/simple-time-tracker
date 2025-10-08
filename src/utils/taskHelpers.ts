import { Task, TimeEntry } from '@/types';

/**
 * Gets the flattened list of visible tasks in the exact same order as they appear in the sidebar
 * This ensures perfect alignment between sidebar tasks and time grid rows
 */
export function getVisibleTasks(tasks: Record<string, Task>, hideCompleted: boolean = false): Task[] {
  const visibleTasks: Task[] = [];

  const addTaskAndChildren = (task: Task) => {
    // Skip task if it should be hidden
    if (shouldHideTask(task, tasks, hideCompleted)) {
      return;
    }

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

/**
 * Checks if a task is fully completed
 * A task is fully completed if:
 * 1. It is marked as completed, OR
 * 2. It has children and ALL children are recursively fully completed
 */
export function isTaskFullyCompleted(task: Task, tasks: Record<string, Task>): boolean {
  // If task is directly marked as completed
  if (task.isCompleted) {
    return true;
  }

  // If task has no children, and is not marked completed, it's not fully completed
  if (task.children.length === 0) {
    return false;
  }

  // If task has children, check if ALL children are fully completed
  return task.children.every(childId => {
    const child = tasks[childId];
    if (!child) return false;
    return isTaskFullyCompleted(child, tasks);
  });
}

/**
 * Determines if a task should be hidden based on the hideCompleted filter
 */
export function shouldHideTask(task: Task, tasks: Record<string, Task>, hideCompleted: boolean): boolean {
  if (!hideCompleted) {
    return false;
  }

  return isTaskFullyCompleted(task, tasks);
}
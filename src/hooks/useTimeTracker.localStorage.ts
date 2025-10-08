'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppState, Task, TimeEntry, ActiveTimer, CheckEntry } from '@/types';
import { StorageManager } from '@/utils/storage';
import { getCurrentMonth } from '@/utils/dateHelpers';

export function useTimeTracker() {
  const [state, setState] = useState<AppState>(() => ({
    tasks: {},
    timeEntries: {},
    checkEntries: {},
    activeTimers: {},
    currentMonth: getCurrentMonth(),
    userPreferences: {
      theme: 'system',
      defaultTrackingType: 'manual',
      timeFormat: '24h'
    },
    isLoading: true
  }));

  // Initialize data from localStorage
  useEffect(() => {
    const initialState = StorageManager.initializeStorage();
    setState(initialState);
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (!state.isLoading) {
      StorageManager.saveTasks(state.tasks);
      StorageManager.saveTimeEntries(state.timeEntries);
      StorageManager.saveActiveTimers(state.activeTimers);
      StorageManager.savePreferences(state.userPreferences);
    }
  }, [state.tasks, state.timeEntries, state.activeTimers, state.userPreferences, state.isLoading]);

  // Task management functions
  const addTask = useCallback((name: string, parentId: string | null = null) => {
    const id = Date.now().toString();
    const newTask: Task = {
      id,
      name,
      parentId,
      children: [],
      trackingType: state.userPreferences.defaultTrackingType,
      isExpanded: false,
      isCompleted: false,
      order: Object.keys(state.tasks).length
    };

    setState(prev => {
      const updatedTasks = { ...prev.tasks, [id]: newTask };

      // Add child reference to parent
      if (parentId && updatedTasks[parentId]) {
        updatedTasks[parentId] = {
          ...updatedTasks[parentId],
          children: [...updatedTasks[parentId].children, id]
        };
      }

      return { ...prev, tasks: updatedTasks };
    });

    return id;
  }, [state.userPreferences.defaultTrackingType, state.tasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: { ...prev.tasks[taskId], ...updates }
      }
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setState(prev => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      const updatedTasks = { ...prev.tasks };
      const updatedEntries = { ...prev.timeEntries };
      const updatedTimers = { ...prev.activeTimers };

      // Remove all child tasks recursively
      const removeTaskAndChildren = (id: string) => {
        const taskToRemove = updatedTasks[id];
        if (!taskToRemove) return;

        taskToRemove.children.forEach(removeTaskAndChildren);
        delete updatedTasks[id];

        // Remove time entries for this task
        Object.keys(updatedEntries).forEach(entryId => {
          if (updatedEntries[entryId].taskId === id) {
            delete updatedEntries[entryId];
          }
        });

        // Remove active timer
        if (updatedTimers[id]) {
          delete updatedTimers[id];
        }
      };

      removeTaskAndChildren(taskId);

      // Remove reference from parent
      if (task.parentId && updatedTasks[task.parentId]) {
        updatedTasks[task.parentId] = {
          ...updatedTasks[task.parentId],
          children: updatedTasks[task.parentId].children.filter(id => id !== taskId)
        };
      }

      return {
        ...prev,
        tasks: updatedTasks,
        timeEntries: updatedEntries,
        activeTimers: updatedTimers
      };
    });
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    updateTask(taskId, { isExpanded: !state.tasks[taskId]?.isExpanded });
  }, [state.tasks, updateTask]);

  const toggleTaskComplete = useCallback((taskId: string) => {
    updateTask(taskId, { isCompleted: !state.tasks[taskId]?.isCompleted });
  }, [state.tasks, updateTask]);

  // Time entry functions
  const updateTimeEntry = useCallback((taskId: string, date: string, minutes: number) => {
    const entryId = `${taskId}-${date}`;

    setState(prev => {
      if (minutes <= 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [entryId]: _, ...rest } = prev.timeEntries;
        return { ...prev, timeEntries: rest };
      }

      const entry: TimeEntry = {
        id: entryId,
        taskId,
        date,
        minutes,
        isActive: false
      };

      return {
        ...prev,
        timeEntries: { ...prev.timeEntries, [entryId]: entry }
      };
    });
  }, []);

  // Timer functions
  const startTimer = useCallback((taskId: string, date: string) => {
    const now = Date.now();
    const timer: ActiveTimer = {
      taskId,
      date,
      startTime: now,
      elapsedTime: 0
    };

    setState(prev => ({
      ...prev,
      activeTimers: { ...prev.activeTimers, [taskId]: timer }
    }));
  }, []);

  const stopTimer = useCallback((taskId: string, date: string) => {
    setState(prev => {
      const timer = prev.activeTimers[taskId];
      if (!timer) return prev;

      const totalElapsed = timer.elapsedTime + (Date.now() - timer.startTime);
      const minutes = totalElapsed / (60 * 1000);

      // Add time to existing entry or create new one
      const entryId = `${taskId}-${date}`;
      const existingEntry = prev.timeEntries[entryId];
      const totalMinutes = (existingEntry?.minutes || 0) + minutes;

      const entry: TimeEntry = {
        id: entryId,
        taskId,
        date,
        minutes: totalMinutes,
        isActive: false
      };

      // Remove timer
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [taskId]: _, ...restTimers } = prev.activeTimers;

      return {
        ...prev,
        timeEntries: { ...prev.timeEntries, [entryId]: entry },
        activeTimers: restTimers
      };
    });
  }, []);

  // Check entry functions
  const toggleCheckEntry = useCallback(async (taskId: string, date: string, isChecked: boolean) => {
    const entryId = `${taskId}-${date}`;
    const task = state.tasks[taskId];

    if (!task) return;

    const entry = {
      id: entryId,
      taskId,
      date,
      isChecked,
      createdAt: new Date()
    };

    setState(prev => ({
      ...prev,
      checkEntries: { ...prev.checkEntries, [entryId]: entry }
    }));

    // Save to localStorage
    StorageManager.saveCheckEntries({ ...state.checkEntries, [entryId]: entry });

    // For unique tracking, if checked, mark task as completed
    if (task.trackingType === 'unique' && isChecked) {
      await updateTask(taskId, { isCompleted: true });
    }
  }, [state.tasks, state.checkEntries, updateTask]);

  const getCheckEntry = useCallback((taskId: string, date: string): CheckEntry | undefined => {
    const entryId = `${taskId}-${date}`;
    return state.checkEntries[entryId];
  }, [state.checkEntries]);

  // Month navigation
  const setCurrentMonth = useCallback((month: string) => {
    setState(prev => ({ ...prev, currentMonth: month }));
  }, []);

  // Initialize with sample data if no tasks exist
  useEffect(() => {
    if (!state.isLoading && Object.keys(state.tasks).length === 0) {
      addTask('PROJECTS');
      const nonProjectId = addTask('NON-PROJECT ACTIVITIES');

      // Add some sample tasks similar to the screenshot
      const otherId = addTask('OTH - Other', nonProjectId);
      addTask('npa-oth', otherId);
      addTask('bench', otherId);

      const businessId = addTask('Business development', nonProjectId);
      addTask('Business development', businessId);

      const deliveryId = addTask('Delivery and program management', nonProjectId);
      addTask('Delivery and program management', deliveryId);

      const peopleId = addTask('People management', nonProjectId);
      addTask('People management', peopleId);

      const researchId = addTask('Research and development', nonProjectId);
      addTask('Research and development', researchId);

      const teachingId = addTask('Teaching', nonProjectId);
      addTask('Teaching', teachingId);

      const upskillingId = addTask('Upskilling', nonProjectId);
      addTask('Upskilling', upskillingId);

      // Expand main categories
      updateTask(nonProjectId, { isExpanded: true });
      updateTask(otherId, { isExpanded: true });
    }
  }, [state.isLoading, state.tasks, addTask, updateTask]);

  return {
    state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    toggleTaskComplete,
    updateTimeEntry,
    toggleCheckEntry,
    getCheckEntry,
    startTimer,
    stopTimer,
    setCurrentMonth
  };
}
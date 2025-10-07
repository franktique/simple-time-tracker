'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppState, Task, ActiveTimer } from '@/types';
import { tasksAPI, timeEntriesAPI, timersAPI, preferencesAPI } from '@/lib/api-client';
import { getCurrentMonth } from '@/utils/dateHelpers';

export function useTimeTracker() {
  const [state, setState] = useState<AppState>(() => ({
    tasks: {},
    timeEntries: {},
    activeTimers: {},
    currentMonth: getCurrentMonth(),
    userPreferences: {
      theme: 'system',
      defaultTrackingType: 'manual',
      timeFormat: '24h'
    },
    isLoading: true
  }));

  // Initialize data from API
  useEffect(() => {
    async function loadData() {
      try {
        const [tasks, timeEntries, activeTimers, userPreferences] = await Promise.all([
          tasksAPI.getAll(),
          timeEntriesAPI.getAll(),
          timersAPI.getAll(),
          preferencesAPI.get(),
        ]);

        setState({
          tasks,
          timeEntries,
          activeTimers,
          currentMonth: getCurrentMonth(),
          userPreferences,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to load data:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }

    loadData();
  }, []);

  // Task management functions
  const addTask = useCallback(async (name: string, parentId: string | null = null) => {
    const id = Date.now().toString();
    const newTask: Task = {
      id,
      name,
      parentId,
      children: [],
      trackingType: state.userPreferences.defaultTrackingType,
      isExpanded: false,
      order: Object.keys(state.tasks).length
    };

    try {
      await tasksAPI.create(newTask);

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

      // Update parent if needed
      if (parentId) {
        const parent = state.tasks[parentId];
        if (parent) {
          await tasksAPI.update(parentId, {
            children: [...parent.children, id]
          });
        }
      }

      return id;
    } catch (error) {
      console.error('Failed to add task:', error);
      return id;
    }
  }, [state.userPreferences.defaultTrackingType, state.tasks]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      await tasksAPI.update(taskId, updates);

      setState(prev => ({
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...prev.tasks[taskId], ...updates }
        }
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    const task = state.tasks[taskId];
    if (!task) return;

    try {
      await tasksAPI.delete(taskId);

      setState(prev => {
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
          const parent = updatedTasks[task.parentId];
          updatedTasks[task.parentId] = {
            ...parent,
            children: parent.children.filter(id => id !== taskId)
          };

          // Update parent in backend
          tasksAPI.update(task.parentId, {
            children: parent.children.filter(id => id !== taskId)
          }).catch(console.error);
        }

        return {
          ...prev,
          tasks: updatedTasks,
          timeEntries: updatedEntries,
          activeTimers: updatedTimers
        };
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, [state.tasks]);

  const toggleTask = useCallback(async (taskId: string) => {
    const task = state.tasks[taskId];
    if (!task) return;

    await updateTask(taskId, { isExpanded: !task.isExpanded });
  }, [state.tasks, updateTask]);

  // Time entry functions
  const updateTimeEntry = useCallback(async (taskId: string, date: string, minutes: number) => {
    const entryId = `${taskId}-${date}`;

    try {
      if (minutes <= 0) {
        await timeEntriesAPI.delete(entryId);
        setState(prev => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [entryId]: _, ...rest } = prev.timeEntries;
          return { ...prev, timeEntries: rest };
        });
      } else {
        const entry = {
          id: entryId,
          taskId,
          date,
          minutes,
          isActive: false
        };

        await timeEntriesAPI.upsert(entry);
        setState(prev => ({
          ...prev,
          timeEntries: { ...prev.timeEntries, [entryId]: entry }
        }));
      }
    } catch (error) {
      console.error('Failed to update time entry:', error);
    }
  }, []);

  // Timer functions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startTimer = useCallback(async (taskId: string, _date: string) => {
    const now = Date.now();
    const timer: ActiveTimer = {
      taskId,
      startTime: now,
      elapsedTime: 0
    };

    try {
      await timersAPI.start(timer);
      setState(prev => ({
        ...prev,
        activeTimers: { ...prev.activeTimers, [taskId]: timer }
      }));
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  }, []);

  const stopTimer = useCallback(async (taskId: string, date: string) => {
    const timer = state.activeTimers[taskId];
    if (!timer) return;

    try {
      const totalElapsed = timer.elapsedTime + (Date.now() - timer.startTime);
      const minutes = totalElapsed / (60 * 1000);

      // Add time to existing entry or create new one
      const entryId = `${taskId}-${date}`;
      const existingEntry = state.timeEntries[entryId];
      const totalMinutes = (existingEntry?.minutes || 0) + minutes;

      await timeEntriesAPI.upsert({
        id: entryId,
        taskId,
        date,
        minutes: totalMinutes,
        isActive: false
      });

      await timersAPI.stop(taskId);

      setState(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [taskId]: _, ...restTimers } = prev.activeTimers;

        return {
          ...prev,
          timeEntries: {
            ...prev.timeEntries,
            [entryId]: {
              id: entryId,
              taskId,
              date,
              minutes: totalMinutes,
              isActive: false
            }
          },
          activeTimers: restTimers
        };
      });
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  }, [state.activeTimers, state.timeEntries]);

  // Month navigation
  const setCurrentMonth = useCallback((month: string) => {
    setState(prev => ({ ...prev, currentMonth: month }));
  }, []);

  // Initialize with sample data if no tasks exist
  useEffect(() => {
    if (!state.isLoading && Object.keys(state.tasks).length === 0) {
      (async () => {
        await addTask('PROJECTS');
        const nonProjectId = await addTask('NON-PROJECT ACTIVITIES');

        // Add some sample tasks
        const otherId = await addTask('OTH - Other', nonProjectId);
        await addTask('npa-oth', otherId);
        await addTask('bench', otherId);

        const businessId = await addTask('Business development', nonProjectId);
        await addTask('Business development', businessId);

        const deliveryId = await addTask('Delivery and program management', nonProjectId);
        await addTask('Delivery and program management', deliveryId);

        const peopleId = await addTask('People management', nonProjectId);
        await addTask('People management', peopleId);

        const researchId = await addTask('Research and development', nonProjectId);
        await addTask('Research and development', researchId);

        const teachingId = await addTask('Teaching', nonProjectId);
        await addTask('Teaching', teachingId);

        const upskillingId = await addTask('Upskilling', nonProjectId);
        await addTask('Upskilling', upskillingId);

        // Expand main categories
        await updateTask(nonProjectId, { isExpanded: true });
        await updateTask(otherId, { isExpanded: true });
      })();
    }
  }, [state.isLoading, state.tasks, addTask, updateTask]);

  return {
    state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    updateTimeEntry,
    startTimer,
    stopTimer,
    setCurrentMonth
  };
}

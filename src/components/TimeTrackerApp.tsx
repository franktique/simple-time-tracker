'use client';

import { useState } from 'react';
import { useTimeTracker } from '@/hooks/useTimeTracker';
import { getVisibleTasks } from '@/utils/taskHelpers';
import { Header } from './Header';
import { TaskSidebar } from './TaskSidebar';
import { TimeGrid } from './TimeGrid';
import { TaskTimeRow } from './TaskTimeRow';
import { TaskDialog } from './TaskDialog';

export function TimeTrackerApp() {
  const {
    state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    toggleTaskComplete,
    updateTimeEntry,
    startTimer,
    stopTimer,
    setCurrentMonth
  } = useTimeTracker();

  // Hover state for task highlighting
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  // Task creation dialog state
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskDialogParentId, setTaskDialogParentId] = useState<string | null>(null);

  const handleTaskAdd = (parentId: string | null) => {
    setTaskDialogParentId(parentId);
    setIsTaskDialogOpen(true);
  };

  const handleTaskCreate = (name: string, trackingType: 'manual' | 'automatic') => {
    addTask(name, taskDialogParentId, trackingType);
  };

  const handleTaskEdit = (taskId: string, updates: { name?: string; trackingType?: 'manual' | 'automatic' }) => {
    updateTask(taskId, updates);
  };

  const handleTaskToggleComplete = (taskId: string) => {
    toggleTaskComplete(taskId);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
        <div className="opacity-60">Loading...</div>
      </div>
    );
  }

  // Get flattened list of visible tasks using shared utility
  const visibleTasks = getVisibleTasks(state.tasks);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <Header
        currentMonth={state.currentMonth}
        onMonthChange={setCurrentMonth}
        userName="Franklyn Tique"
      />

      <div className="flex flex-1 overflow-hidden">
        <TaskSidebar
          tasks={state.tasks}
          timeEntries={state.timeEntries}
          currentMonth={state.currentMonth}
          onTaskToggle={toggleTask}
          onTaskAdd={handleTaskAdd}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={deleteTask}
          onTaskToggleComplete={handleTaskToggleComplete}
          hoveredTaskId={hoveredTaskId}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TimeGrid currentMonth={state.currentMonth} timeEntries={state.timeEntries} />

          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--color-background)' }}>
            {visibleTasks.map((task) => (
              <TaskTimeRow
                key={task.id}
                task={task}
                tasks={state.tasks}
                timeEntries={state.timeEntries}
                activeTimers={state.activeTimers}
                currentMonth={state.currentMonth}
                level={0}
                onUpdateTime={updateTimeEntry}
                onStartTimer={startTimer}
                onStopTimer={stopTimer}
                onTaskHover={setHoveredTaskId}
              />
            ))}
          </div>
        </div>
      </div>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onConfirm={handleTaskCreate}
        defaultTrackingType={state.userPreferences.defaultTrackingType}
      />
    </div>
  );
}
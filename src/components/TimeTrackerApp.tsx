'use client';

import { useTimeTracker } from '@/hooks/useTimeTracker';
import { getVisibleTasks } from '@/utils/taskHelpers';
import { Header } from './Header';
import { TaskSidebar } from './TaskSidebar';
import { TimeGrid } from './TimeGrid';
import { TaskTimeRow } from './TaskTimeRow';

export function TimeTrackerApp() {
  const {
    state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    updateTimeEntry,
    startTimer,
    stopTimer,
    setCurrentMonth
  } = useTimeTracker();

  const handleTaskAdd = (parentId: string | null) => {
    const name = prompt('Enter task name:');
    if (name?.trim()) {
      addTask(name.trim(), parentId);
    }
  };

  const handleTaskEdit = (taskId: string, name: string) => {
    updateTask(taskId, { name });
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // Get flattened list of visible tasks using shared utility
  const visibleTasks = getVisibleTasks(state.tasks);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Header
        currentMonth={state.currentMonth}
        onMonthChange={setCurrentMonth}
        userName="Franklyn Tique"
      />

      <div className="flex flex-1 overflow-hidden">
        <TaskSidebar
          tasks={state.tasks}
          onTaskToggle={toggleTask}
          onTaskAdd={handleTaskAdd}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={deleteTask}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TimeGrid currentMonth={state.currentMonth} timeEntries={state.timeEntries} />

          <div className="flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-700">
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
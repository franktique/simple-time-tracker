import { NextRequest, NextResponse } from 'next/server';
import { transaction } from '@/lib/db/connection';
import { Task, TimeEntry, CheckEntry, ActiveTimer, UserPreferences } from '@/types';

interface ImportData {
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

function validateImportData(data: unknown): data is ImportData {
  if (!data || typeof data !== 'object') return false;

  const importData = data as ImportData;

  if (!importData.version || !importData.data) return false;
  if (!importData.data.tasks || typeof importData.data.tasks !== 'object') return false;
  if (!importData.data.timeEntries || typeof importData.data.timeEntries !== 'object') return false;
  if (!importData.data.checkEntries || typeof importData.data.checkEntries !== 'object') return false;
  if (!importData.data.activeTimers || typeof importData.data.activeTimers !== 'object') return false;
  if (!importData.data.userPreferences || typeof importData.data.userPreferences !== 'object') return false;

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!validateImportData(body)) {
      return NextResponse.json(
        { error: 'Invalid import data structure' },
        { status: 400 }
      );
    }

    const { data } = body;

    await transaction(async (client) => {
      // Clear all existing data
      await client.query('DELETE FROM active_timers');
      await client.query('DELETE FROM check_entries');
      await client.query('DELETE FROM time_entries');
      await client.query('DELETE FROM tasks');
      await client.query("DELETE FROM user_preferences WHERE id = 'default'");

      // Insert tasks
      const taskValues = Object.values(data.tasks);
      for (const task of taskValues) {
        await client.query(
          `INSERT INTO tasks (id, name, parent_id, tracking_type, is_expanded, is_completed, "order")
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [task.id, task.name, task.parentId, task.trackingType, task.isExpanded, task.isCompleted, task.order]
        );
      }

      // Insert time entries
      const timeEntryValues = Object.values(data.timeEntries);
      for (const entry of timeEntryValues) {
        await client.query(
          `INSERT INTO time_entries (id, task_id, date, minutes, is_active, start_time)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [entry.id, entry.taskId, entry.date, entry.minutes, entry.isActive, entry.startTime || null]
        );
      }

      // Insert check entries
      const checkEntryValues = Object.values(data.checkEntries);
      for (const entry of checkEntryValues) {
        await client.query(
          `INSERT INTO check_entries (id, task_id, date, is_checked)
           VALUES ($1, $2, $3, $4)`,
          [entry.id, entry.taskId, entry.date, entry.isChecked]
        );
      }

      // Insert active timers
      const timerValues = Object.values(data.activeTimers);
      for (const timer of timerValues) {
        await client.query(
          `INSERT INTO active_timers (task_id, date, start_time, elapsed_time)
           VALUES ($1, $2, $3, $4)`,
          [timer.taskId, timer.date, timer.startTime, timer.elapsedTime]
        );
      }

      // Insert user preferences
      await client.query(
        `INSERT INTO user_preferences (id, theme, default_tracking_type, time_format)
         VALUES ('default', $1, $2, $3)`,
        [data.userPreferences.theme, data.userPreferences.defaultTrackingType, data.userPreferences.timeFormat]
      );
    });

    return NextResponse.json({
      success: true,
      message: 'Data imported successfully',
      stats: {
        tasks: Object.keys(data.tasks).length,
        timeEntries: Object.keys(data.timeEntries).length,
        checkEntries: Object.keys(data.checkEntries).length,
        activeTimers: Object.keys(data.activeTimers).length,
      }
    });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { error: 'Failed to import data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

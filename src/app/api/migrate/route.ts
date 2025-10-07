import { NextRequest, NextResponse } from 'next/server';
import { createTask } from '@/lib/db/tasks';
import { upsertTimeEntry } from '@/lib/db/timeEntries';
import { createOrUpdateActiveTimer } from '@/lib/db/timers';
import { updateUserPreferences } from '@/lib/db/preferences';
import { Task, TimeEntry, ActiveTimer, UserPreferences } from '@/types';

interface MigrationData {
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  activeTimers: Record<string, ActiveTimer>;
  preferences: UserPreferences;
}

export async function POST(request: NextRequest) {
  try {
    const data: MigrationData = await request.json();

    // Migrate tasks
    const taskPromises = Object.values(data.tasks).map(task => createTask(task));
    await Promise.all(taskPromises);

    // Migrate time entries
    const entryPromises = Object.values(data.timeEntries).map(entry => upsertTimeEntry(entry));
    await Promise.all(entryPromises);

    // Migrate active timers
    const timerPromises = Object.values(data.activeTimers).map(timer => createOrUpdateActiveTimer(timer));
    await Promise.all(timerPromises);

    // Migrate preferences
    if (data.preferences) {
      await updateUserPreferences(data.preferences);
    }

    return NextResponse.json({
      success: true,
      migrated: {
        tasks: Object.keys(data.tasks).length,
        timeEntries: Object.keys(data.timeEntries).length,
        activeTimers: Object.keys(data.activeTimers).length,
        preferences: !!data.preferences
      }
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

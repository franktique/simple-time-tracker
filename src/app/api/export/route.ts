import { NextResponse } from 'next/server';
import { getAllTasks } from '@/lib/db/tasks';
import { getAllTimeEntries } from '@/lib/db/timeEntries';
import { getAllCheckEntries } from '@/lib/db/checkEntries';
import { getAllActiveTimers } from '@/lib/db/timers';
import { getUserPreferences } from '@/lib/db/preferences';

export async function GET() {
  try {
    const [tasks, timeEntries, checkEntries, activeTimers, userPreferences] = await Promise.all([
      getAllTasks(),
      getAllTimeEntries(),
      getAllCheckEntries(),
      getAllActiveTimers(),
      getUserPreferences(),
    ]);

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        tasks,
        timeEntries,
        checkEntries,
        activeTimers,
        userPreferences,
      },
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

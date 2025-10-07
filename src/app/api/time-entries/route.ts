import { NextRequest, NextResponse } from 'next/server';
import { getAllTimeEntries, upsertTimeEntry, getTimeEntriesByDate } from '@/lib/db/timeEntries';
import { TimeEntry } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate && endDate) {
      const entries = await getTimeEntriesByDate(startDate, endDate);
      const entriesMap: Record<string, TimeEntry> = {};
      entries.forEach(entry => {
        entriesMap[entry.id] = entry;
      });
      return NextResponse.json(entriesMap);
    }

    const entries = await getAllTimeEntries();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const entry: TimeEntry = await request.json();

    // Validate required fields
    if (!entry.id || !entry.taskId || !entry.date) {
      return NextResponse.json(
        { error: 'Missing required fields: id, taskId, date' },
        { status: 400 }
      );
    }

    const savedEntry = await upsertTimeEntry(entry);
    return NextResponse.json(savedEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json(
      { error: 'Failed to create time entry' },
      { status: 500 }
    );
  }
}

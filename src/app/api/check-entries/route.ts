import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCheckEntries,
  getCheckEntriesByDate,
  upsertCheckEntry,
  getCheckEntriesByTask
} from '@/lib/db/checkEntries';
import { CheckEntry } from '@/types';

// GET all check entries or filter by date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const taskId = searchParams.get('taskId');

    let checkEntries: CheckEntry[] = [];

    if (taskId) {
      checkEntries = await getCheckEntriesByTask(taskId);
    } else if (startDate && endDate) {
      checkEntries = await getCheckEntriesByDate(startDate, endDate);
    } else {
      const allEntries = await getAllCheckEntries();
      checkEntries = Object.values(allEntries);
    }

    const entriesMap = checkEntries.reduce((acc, entry) => {
      acc[entry.id] = entry;
      return acc;
    }, {} as Record<string, CheckEntry>);

    return NextResponse.json(entriesMap);
  } catch (error) {
    console.error('Error fetching check entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch check entries' },
      { status: 500 }
    );
  }
}

// POST to create or update a check entry
export async function POST(request: NextRequest) {
  try {
    const body: CheckEntry = await request.json();

    // Validate required fields
    if (!body.id || !body.taskId || !body.date || typeof body.isChecked !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: id, taskId, date, isChecked' },
        { status: 400 }
      );
    }

    const entry = await upsertCheckEntry(body);
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error creating/updating check entry:', error);
    return NextResponse.json(
      { error: 'Failed to create/update check entry' },
      { status: 500 }
    );
  }
}
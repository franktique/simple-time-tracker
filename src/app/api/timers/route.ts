import { NextRequest, NextResponse } from 'next/server';
import { getAllActiveTimers, createOrUpdateActiveTimer } from '@/lib/db/timers';
import { ActiveTimer } from '@/types';

export async function GET() {
  try {
    const timers = await getAllActiveTimers();
    return NextResponse.json(timers);
  } catch (error) {
    console.error('Error fetching active timers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active timers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const timer: ActiveTimer = await request.json();

    // Validate required fields
    if (!timer.taskId || timer.startTime === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, startTime' },
        { status: 400 }
      );
    }

    const savedTimer = await createOrUpdateActiveTimer(timer);
    return NextResponse.json(savedTimer, { status: 201 });
  } catch (error) {
    console.error('Error creating timer:', error);
    return NextResponse.json(
      { error: 'Failed to create timer' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getActiveTimerByTask, createOrUpdateActiveTimer, deleteActiveTimer } from '@/lib/db/timers';
import { ActiveTimer } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const timer = await getActiveTimerByTask(taskId);

    if (!timer) {
      return NextResponse.json(
        { error: 'Timer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(timer);
  } catch (error) {
    console.error('Error fetching timer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timer' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const updates: Partial<ActiveTimer> = await request.json();

    if (!updates.date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const timer: ActiveTimer = {
      taskId,
      date: updates.date,
      startTime: updates.startTime || Date.now(),
      elapsedTime: updates.elapsedTime || 0,
    };

    const updatedTimer = await createOrUpdateActiveTimer(timer);
    return NextResponse.json(updatedTimer);
  } catch (error) {
    console.error('Error updating timer:', error);
    return NextResponse.json(
      { error: 'Failed to update timer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    await deleteActiveTimer(taskId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting timer:', error);
    return NextResponse.json(
      { error: 'Failed to delete timer' },
      { status: 500 }
    );
  }
}

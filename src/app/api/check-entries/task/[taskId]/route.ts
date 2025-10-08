import { NextRequest, NextResponse } from 'next/server';
import { getCheckEntriesByTask, deleteCheckEntriesByTask } from '@/lib/db/checkEntries';

// GET all check entries for a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const entries = await getCheckEntriesByTask(taskId);

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching task check entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task check entries' },
      { status: 500 }
    );
  }
}

// DELETE all check entries for a specific task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    await deleteCheckEntriesByTask(taskId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task check entries:', error);
    return NextResponse.json(
      { error: 'Failed to delete task check entries' },
      { status: 500 }
    );
  }
}
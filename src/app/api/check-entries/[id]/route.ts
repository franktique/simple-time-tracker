import { NextRequest, NextResponse } from 'next/server';
import { getCheckEntryById, deleteCheckEntry } from '@/lib/db/checkEntries';

// GET a specific check entry by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entry = await getCheckEntryById(id);

    if (!entry) {
      return NextResponse.json(
        { error: 'Check entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching check entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch check entry' },
      { status: 500 }
    );
  }
}

// DELETE a specific check entry by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCheckEntry(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting check entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete check entry' },
      { status: 500 }
    );
  }
}
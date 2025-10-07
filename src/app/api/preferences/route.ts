import { NextRequest, NextResponse } from 'next/server';
import { getUserPreferences, updateUserPreferences } from '@/lib/db/preferences';
import { UserPreferences } from '@/types';

export async function GET() {
  try {
    const preferences = await getUserPreferences();
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const updates: Partial<UserPreferences> = await request.json();

    const updatedPreferences = await updateUserPreferences(updates);
    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

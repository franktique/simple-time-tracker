import { query } from './connection';
import { UserPreferences } from '@/types';

export interface DbUserPreferences {
  id: string;
  theme: 'light' | 'dark' | 'system';
  default_tracking_type: 'manual' | 'automatic';
  time_format: '12h' | '24h';
  created_at: Date;
  updated_at: Date;
}

function dbPreferencesToUserPreferences(dbPrefs: DbUserPreferences): UserPreferences {
  return {
    theme: dbPrefs.theme,
    defaultTrackingType: dbPrefs.default_tracking_type,
    timeFormat: dbPrefs.time_format,
  };
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const results = await query<DbUserPreferences>(
    "SELECT * FROM user_preferences WHERE id = 'default'"
  );

  if (results.length === 0) {
    // Return default if not found
    return {
      theme: 'system',
      defaultTrackingType: 'manual',
      timeFormat: '24h',
    };
  }

  return dbPreferencesToUserPreferences(results[0]);
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (preferences.theme !== undefined) {
    fields.push(`theme = $${paramIndex++}`);
    values.push(preferences.theme);
  }
  if (preferences.defaultTrackingType !== undefined) {
    fields.push(`default_tracking_type = $${paramIndex++}`);
    values.push(preferences.defaultTrackingType);
  }
  if (preferences.timeFormat !== undefined) {
    fields.push(`time_format = $${paramIndex++}`);
    values.push(preferences.timeFormat);
  }

  if (fields.length > 0) {
    await query(
      `UPDATE user_preferences SET ${fields.join(', ')} WHERE id = 'default'`,
      values
    );
  }

  return getUserPreferences();
}

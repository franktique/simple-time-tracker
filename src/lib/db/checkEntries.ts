import { query } from './connection';
import { CheckEntry } from '@/types';

export interface DbCheckEntry {
  id: string;
  task_id: string;
  date: string;
  is_checked: boolean;
  created_at: Date;
  updated_at: Date;
}

function dbCheckEntryToCheckEntry(dbEntry: DbCheckEntry): CheckEntry {
  return {
    id: dbEntry.id,
    taskId: dbEntry.task_id,
    date: dbEntry.date,
    isChecked: dbEntry.is_checked,
    createdAt: dbEntry.created_at,
  };
}

export async function getAllCheckEntries(): Promise<Record<string, CheckEntry>> {
  const dbEntries = await query<DbCheckEntry>('SELECT * FROM check_entries');

  const entriesMap: Record<string, CheckEntry> = {};
  dbEntries.forEach(dbEntry => {
    entriesMap[dbEntry.id] = dbCheckEntryToCheckEntry(dbEntry);
  });

  return entriesMap;
}

export async function getCheckEntriesByDate(startDate: string, endDate: string): Promise<CheckEntry[]> {
  const dbEntries = await query<DbCheckEntry>(
    'SELECT * FROM check_entries WHERE date >= $1 AND date <= $2 ORDER BY date ASC',
    [startDate, endDate]
  );

  return dbEntries.map(dbCheckEntryToCheckEntry);
}

export async function getCheckEntriesByTask(taskId: string): Promise<CheckEntry[]> {
  const dbEntries = await query<DbCheckEntry>(
    'SELECT * FROM check_entries WHERE task_id = $1 ORDER BY date ASC',
    [taskId]
  );

  return dbEntries.map(dbCheckEntryToCheckEntry);
}

export async function getCheckEntryById(id: string): Promise<CheckEntry | null> {
  const results = await query<DbCheckEntry>('SELECT * FROM check_entries WHERE id = $1', [id]);
  return results.length > 0 ? dbCheckEntryToCheckEntry(results[0]) : null;
}

export async function getCheckEntryByTaskAndDate(taskId: string, date: string): Promise<CheckEntry | null> {
  const results = await query<DbCheckEntry>(
    'SELECT * FROM check_entries WHERE task_id = $1 AND date = $2',
    [taskId, date]
  );
  return results.length > 0 ? dbCheckEntryToCheckEntry(results[0]) : null;
}

export async function upsertCheckEntry(entry: CheckEntry): Promise<CheckEntry> {
  await query(
    `INSERT INTO check_entries (id, task_id, date, is_checked)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (task_id, date)
     DO UPDATE SET is_checked = EXCLUDED.is_checked, updated_at = CURRENT_TIMESTAMP`,
    [entry.id, entry.taskId, entry.date, entry.isChecked]
  );

  return (await getCheckEntryById(entry.id)) || entry;
}

export async function deleteCheckEntry(id: string): Promise<void> {
  await query('DELETE FROM check_entries WHERE id = $1', [id]);
}

export async function deleteCheckEntriesByTask(taskId: string): Promise<void> {
  await query('DELETE FROM check_entries WHERE task_id = $1', [taskId]);
}

export async function getCheckedDatesForTask(taskId: string): Promise<string[]> {
  const results = await query<{ date: string }>(
    'SELECT date FROM check_entries WHERE task_id = $1 AND is_checked = true ORDER BY date ASC',
    [taskId]
  );
  return results.map(r => r.date);
}

export async function getCheckedCountForTask(taskId: string): Promise<number> {
  const result = await query<{ count: string }>(
    'SELECT COUNT(*) as count FROM check_entries WHERE task_id = $1 AND is_checked = true',
    [taskId]
  );
  return parseInt(result[0]?.count || '0', 10);
}
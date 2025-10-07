import { query } from './connection';
import { TimeEntry } from '@/types';

export interface DbTimeEntry {
  id: string;
  task_id: string;
  date: string;
  minutes: number;
  is_active: boolean;
  start_time: number | null;
  created_at: Date;
  updated_at: Date;
}

function dbTimeEntryToTimeEntry(dbEntry: DbTimeEntry): TimeEntry {
  return {
    id: dbEntry.id,
    taskId: dbEntry.task_id,
    date: dbEntry.date,
    minutes: Number(dbEntry.minutes),
    isActive: dbEntry.is_active,
    startTime: dbEntry.start_time || undefined,
  };
}

export async function getAllTimeEntries(): Promise<Record<string, TimeEntry>> {
  const dbEntries = await query<DbTimeEntry>('SELECT * FROM time_entries');

  const entriesMap: Record<string, TimeEntry> = {};
  dbEntries.forEach(dbEntry => {
    entriesMap[dbEntry.id] = dbTimeEntryToTimeEntry(dbEntry);
  });

  return entriesMap;
}

export async function getTimeEntriesByDate(startDate: string, endDate: string): Promise<TimeEntry[]> {
  const dbEntries = await query<DbTimeEntry>(
    'SELECT * FROM time_entries WHERE date >= $1 AND date <= $2 ORDER BY date ASC',
    [startDate, endDate]
  );

  return dbEntries.map(dbTimeEntryToTimeEntry);
}

export async function getTimeEntriesByTask(taskId: string): Promise<TimeEntry[]> {
  const dbEntries = await query<DbTimeEntry>(
    'SELECT * FROM time_entries WHERE task_id = $1 ORDER BY date ASC',
    [taskId]
  );

  return dbEntries.map(dbTimeEntryToTimeEntry);
}

export async function getTimeEntryById(id: string): Promise<TimeEntry | null> {
  const results = await query<DbTimeEntry>('SELECT * FROM time_entries WHERE id = $1', [id]);
  return results.length > 0 ? dbTimeEntryToTimeEntry(results[0]) : null;
}

export async function upsertTimeEntry(entry: TimeEntry): Promise<TimeEntry> {
  await query(
    `INSERT INTO time_entries (id, task_id, date, minutes, is_active, start_time)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (task_id, date)
     DO UPDATE SET minutes = $4, is_active = $5, start_time = $6`,
    [entry.id, entry.taskId, entry.date, entry.minutes, entry.isActive, entry.startTime || null]
  );

  return entry;
}

export async function deleteTimeEntry(id: string): Promise<void> {
  await query('DELETE FROM time_entries WHERE id = $1', [id]);
}

export async function deleteTimeEntriesByTask(taskId: string): Promise<void> {
  await query('DELETE FROM time_entries WHERE task_id = $1', [taskId]);
}

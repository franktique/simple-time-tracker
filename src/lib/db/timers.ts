import { query } from './connection';
import { ActiveTimer } from '@/types';

export interface DbActiveTimer {
  task_id: string;
  date: string;
  start_time: number;
  elapsed_time: number;
  created_at: Date;
  updated_at: Date;
}

function dbTimerToActiveTimer(dbTimer: DbActiveTimer): ActiveTimer {
  return {
    taskId: dbTimer.task_id,
    date: dbTimer.date,
    startTime: Number(dbTimer.start_time),
    elapsedTime: Number(dbTimer.elapsed_time),
  };
}

export async function getAllActiveTimers(): Promise<Record<string, ActiveTimer>> {
  const dbTimers = await query<DbActiveTimer>('SELECT * FROM active_timers');

  const timersMap: Record<string, ActiveTimer> = {};
  dbTimers.forEach(dbTimer => {
    timersMap[dbTimer.task_id] = dbTimerToActiveTimer(dbTimer);
  });

  return timersMap;
}

export async function getActiveTimerByTask(taskId: string): Promise<ActiveTimer | null> {
  const results = await query<DbActiveTimer>(
    'SELECT * FROM active_timers WHERE task_id = $1',
    [taskId]
  );

  return results.length > 0 ? dbTimerToActiveTimer(results[0]) : null;
}

export async function createOrUpdateActiveTimer(timer: ActiveTimer): Promise<ActiveTimer> {
  await query(
    `INSERT INTO active_timers (task_id, date, start_time, elapsed_time)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (task_id, date)
     DO UPDATE SET start_time = $3, elapsed_time = $4`,
    [timer.taskId, timer.date, timer.startTime, timer.elapsedTime]
  );

  return timer;
}

export async function deleteActiveTimer(taskId: string): Promise<void> {
  await query('DELETE FROM active_timers WHERE task_id = $1', [taskId]);
}

export async function deleteAllActiveTimers(): Promise<void> {
  await query('DELETE FROM active_timers');
}

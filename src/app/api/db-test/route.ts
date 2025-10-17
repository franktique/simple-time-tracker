import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db/connection';

export async function GET() {
  try {
    const pool = getPool();

    // Test basic connection
    const connectionTest = await pool.query('SELECT NOW() as current_time');

    // Count records in each table
    const tasksCount = await pool.query('SELECT COUNT(*) as count FROM tasks');
    const timeEntriesCount = await pool.query('SELECT COUNT(*) as count FROM time_entries');
    const checkEntriesCount = await pool.query('SELECT COUNT(*) as count FROM check_entries');
    const timersCount = await pool.query('SELECT COUNT(*) as count FROM active_timers');

    // Get sample task if any exist
    const sampleTask = await pool.query('SELECT id, name FROM tasks LIMIT 1');

    return NextResponse.json({
      success: true,
      connection: {
        connected: true,
        currentTime: connectionTest.rows[0].current_time,
        database: pool.options.database || 'unknown',
        host: pool.options.host || 'unknown',
      },
      counts: {
        tasks: parseInt(tasksCount.rows[0].count),
        timeEntries: parseInt(timeEntriesCount.rows[0].count),
        checkEntries: parseInt(checkEntriesCount.rows[0].count),
        activeTimers: parseInt(timersCount.rows[0].count),
      },
      sample: {
        task: sampleTask.rows[0] || null,
      },
      environment: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDbHost: !!process.env.DB_HOST,
        hasDbName: !!process.env.DB_NAME,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        environment: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasDbHost: !!process.env.DB_HOST,
          hasDbName: !!process.env.DB_NAME,
          nodeEnv: process.env.NODE_ENV,
        }
      },
      { status: 500 }
    );
  }
}

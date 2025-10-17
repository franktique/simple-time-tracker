// Load environment variables with custom priority (.env first, then .env.local)
import '../load-env';

import { getPool, closePool } from '../src/lib/db/connection';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const pool = getPool();
    const result = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('Database name:', result.rows[0].db_name);
    await closePool();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error);
    }
    await closePool();
    process.exit(1);
  }
}

testConnection();

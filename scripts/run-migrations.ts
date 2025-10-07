import { readFileSync } from 'fs';
import { join } from 'path';
import { getPool, closePool } from '../src/lib/db/connection';

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    const pool = getPool();

    // Read the migration file
    const migrationPath = join(__dirname, '../src/lib/db/migrations/001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Execute the migration
    await pool.query(migrationSQL);

    console.log('✅ Migrations completed successfully!');

    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\nCreated tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    await closePool();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:');
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error);
    }
    await closePool();
    process.exit(1);
  }
}

runMigrations();

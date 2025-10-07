const { Pool } = require('pg');

async function runMigration() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'simple-tracker',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Check if column already exists
    const result = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'tasks'
      AND column_name = 'is_completed'
    `);

    if (result.rows.length === 0) {
      // Add the column
      await pool.query(`
        ALTER TABLE tasks
        ADD COLUMN is_completed BOOLEAN DEFAULT FALSE NOT NULL
      `);

      console.log('✅ Successfully added is_completed column to tasks table');
    } else {
      console.log('✅ is_completed column already exists in tasks table');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
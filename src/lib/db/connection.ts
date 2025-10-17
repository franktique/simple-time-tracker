import { Pool, PoolClient } from 'pg';

let pool: Pool | null = null;

// Helper function to clean DATABASE_URL (remove quotes if present)
function cleanDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;

  // Remove surrounding quotes (single or double)
  let cleaned = url.trim();
  if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
      (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
    cleaned = cleaned.slice(1, -1);
  }

  return cleaned;
}

export function getPool(): Pool {
  if (!pool) {
    // Use DATABASE_URL if available (includes SSL params), otherwise use individual env vars
    const databaseUrl = cleanDatabaseUrl(process.env.DATABASE_URL);
    const config = databaseUrl
      ? {
          connectionString: databaseUrl,
          ssl: {
            rejectUnauthorized: false,
          },
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        }
      : {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME || 'simple-tracker',
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
          ssl: process.env.DB_HOST?.includes('neon.tech')
            ? { rejectUnauthorized: false }
            : false,
        };

    pool = new Pool(config);

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  return pool;
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return await pool.connect();
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

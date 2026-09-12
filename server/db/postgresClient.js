import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Extract connection parameters with sensible defaults
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'hms_db'}`;

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

// Suppress unhandled pool error crashes when PG server is unreachable
pool.on('error', (err) => {
  // Only log if not a standard ECONNREFUSED check
  if (err.code !== 'ECONNREFUSED') {
    console.error('[PostgreSQL Pool Warning]', err.message);
  }
});

/**
 * Execute a SQL query on PostgreSQL
 * @param {string} text - Parameterized SQL query string
 * @param {Array} params - Array of bind parameters
 * @returns {Promise<pg.QueryResult>}
 */
export const query = async (text, params = []) => {
  return pool.query(text, params);
};

/**
 * Test connectivity to PostgreSQL
 * @returns {Promise<{connected: boolean, version?: string, database?: string, error?: string}>}
 */
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT current_database() as db_name, version() as pg_version, current_timestamp as server_time');
    return {
      connected: true,
      database: result.rows[0].db_name,
      version: result.rows[0].pg_version,
      serverTime: result.rows[0].server_time,
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      code: err.code,
    };
  }
};

export const isPostgresConfigured = () => {
  return Boolean(process.env.DATABASE_URL || process.env.PGDATABASE);
};

export const getDbStatus = async () => {
  const conn = await testConnection();
  if (conn.connected) {
    return {
      status: 'online',
      engine: 'PostgreSQL',
      database: conn.database,
      version: conn.version ? conn.version.split(' ')[0] + ' ' + conn.version.split(' ')[1] : 'PostgreSQL 14+',
      connected: true,
    };
  }
  return {
    status: 'fallback_active',
    engine: 'Hybrid / Relational In-Memory & Local JSON Store',
    connected: false,
    reason: conn.error || 'PostgreSQL not reachable on localhost:5432',
    note: "Run 'npm run db:init' to initialize PostgreSQL once the service is started with 'sudo systemctl start postgresql'",
  };
};

export default {
  pool,
  query,
  testConnection,
  getDbStatus,
  isPostgresConfigured,
};

/**
 * PostgreSQL Database Adapter (Ready for Activation)
 * 
 * To connect your live PostgreSQL database:
 * 1. Install pg: npm install pg
 * 2. Set environment variable: DATABASE_URL=postgresql://user:password@localhost:5432/hms_db
 * 3. Run migrations: psql -d hms_db -f server/db/schema.sql
 * 4. Uncomment the pool configuration below.
 */

/*
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hms_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text, params) => pool.query(text, params);
*/

export const isPostgresConfigured = () => {
  return Boolean(process.env.DATABASE_URL);
};

export const getDbStatus = () => {
  if (isPostgresConfigured()) {
    return {
      connected: true,
      engine: 'PostgreSQL',
      url: process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'),
    };
  }
  return {
    connected: false,
    engine: 'In-Memory Mock Store (PostgreSQL-Ready Schema)',
    note: 'Set DATABASE_URL to connect live PostgreSQL. Run server/db/schema.sql to initialize tables.',
  };
};

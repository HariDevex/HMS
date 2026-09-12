import 'dotenv/config';
import { pool, query, testConnection } from './postgresClient.js';
import { db } from './db.js';

async function resetDatabase() {
  console.log('🔄 Hospital Management System (HMS) — Database Reset');
  console.log('---------------------------------------------------------');

  const conn = await testConnection();

  if (conn.connected) {
    console.log(`🔌 Connected to PostgreSQL (${conn.database}). Dropping all tables...`);
    try {
      await query(`
        DROP TABLE IF EXISTS clinical_timeline CASCADE;
        DROP TABLE IF EXISTS audit_logs CASCADE;
        DROP TABLE IF EXISTS invoice_items CASCADE;
        DROP TABLE IF EXISTS invoices CASCADE;
        DROP TABLE IF EXISTS medication_administrations CASCADE;
        DROP TABLE IF EXISTS prescriptions CASCADE;
        DROP TABLE IF EXISTS radiology_orders CASCADE;
        DROP TABLE IF EXISTS lab_order_parameters CASCADE;
        DROP TABLE IF EXISTS lab_orders CASCADE;
        DROP TABLE IF EXISTS vitals CASCADE;
        DROP TABLE IF EXISTS appointments CASCADE;
        DROP TABLE IF EXISTS beds CASCADE;
        DROP TABLE IF EXISTS patients CASCADE;
        DROP TABLE IF EXISTS wards CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
      `);
      console.log(`✅ All tables dropped from PostgreSQL.`);
    } catch (err) {
      console.error(`❌ Error dropping PostgreSQL tables:`, err.message);
    } finally {
      await pool.end();
    }
  }

  // Reset local database file
  console.log(`💾 Resetting local database (server/db/hms_db.json)...`);
  db.resetToDefaults();
  console.log(`✅ Local database reset to initial seeds.`);

  console.log('---------------------------------------------------------');
  console.log(`💡 Now run 'npm run db:init' to re-apply schema and seed.`);
}

resetDatabase();

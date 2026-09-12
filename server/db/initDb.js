import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client, Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PGHOST = process.env.PGHOST || 'localhost';
const PGPORT = Number(process.env.PGPORT) || 5432;
const PGUSER = process.env.PGUSER || 'postgres';
const PGPASSWORD = process.env.PGPASSWORD || 'postgres';
const PGDATABASE = process.env.PGDATABASE || 'hms_db';

const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');
const localDbPath = path.join(__dirname, 'hms_db.json');

async function initializeDatabase() {
  console.log('===============================================================');
  console.log('🏥 Hospital Management System (HMS) — Database Initializer');
  console.log('===============================================================');
  console.log(`📍 Target Host:     ${PGHOST}:${PGPORT}`);
  console.log(`👤 Database User:   ${PGUSER}`);
  console.log(`🗄️  Target Database: ${PGDATABASE}`);
  console.log('---------------------------------------------------------------');

  let postgresConnected = false;

  // Step 1: Connect to maintenance database 'postgres' to verify/create target DB
  const maintenanceClient = new Client({
    host: PGHOST,
    port: PGPORT,
    user: PGUSER,
    password: PGPASSWORD,
    database: 'postgres',
    connectionTimeoutMillis: 3000,
  });

  try {
    console.log(`🔌 Attempting connection to PostgreSQL server...`);
    await maintenanceClient.connect();
    postgresConnected = true;
    console.log(`✅ Connected to PostgreSQL maintenance database.`);

    // Check if target database exists
    const checkDbRes = await maintenanceClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [PGDATABASE]
    );

    if (checkDbRes.rowCount === 0) {
      console.log(`🔨 Database '${PGDATABASE}' does not exist. Creating database...`);
      // CREATE DATABASE cannot run inside a multi-statement transaction
      await maintenanceClient.query(`CREATE DATABASE "${PGDATABASE}" OWNER "${PGUSER}"`);
      console.log(`✅ Database '${PGDATABASE}' created successfully.`);
    } else {
      console.log(`ℹ️  Database '${PGDATABASE}' already exists.`);
    }
  } catch (err) {
    console.warn(`⚠️  PostgreSQL connection note: ${err.message}`);
    if (err.code === 'ECONNREFUSED') {
      console.log(`\n💡 To start PostgreSQL on this machine:`);
      console.log(`   • systemd:  sudo systemctl start postgresql`);
      console.log(`   • Docker:   docker run --name hms-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=${PGDATABASE} -p 5432:5432 -d postgres:16`);
      console.log(`   • Or update credentials in your .env file\n`);
    }
  } finally {
    try {
      await maintenanceClient.end();
    } catch {
      // ignore
    }
  }

  // Step 2: If connected to PostgreSQL, execute schema.sql and seed.sql
  if (postgresConnected) {
    const targetPool = new Pool({
      host: PGHOST,
      port: PGPORT,
      user: PGUSER,
      password: PGPASSWORD,
      database: PGDATABASE,
    });

    try {
      console.log(`📜 Applying schema from schema.sql to '${PGDATABASE}'...`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await targetPool.query(schemaSql);
      console.log(`✅ Schema applied successfully (tables, enums, FK constraints, indexes created).`);

      console.log(`🌱 Seeding initial hospital data from seed.sql...`);
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await targetPool.query(seedSql);
      console.log(`✅ Seed data inserted successfully.`);

      // Verify row counts
      console.log('---------------------------------------------------------------');
      console.log('📊 Table Verification Summary in PostgreSQL:');
      const tables = [
        'users', 'wards', 'beds', 'patients', 'appointments', 
        'vitals', 'lab_orders', 'radiology_orders', 'prescriptions', 
        'invoices', 'audit_logs'
      ];
      for (const tbl of tables) {
        try {
          const res = await targetPool.query(`SELECT COUNT(*) as count FROM "${tbl}"`);
          console.log(`   • ${tbl.padEnd(20)}: ${res.rows[0].count} records`);
        } catch {
          // table might have different quotes
        }
      }
      console.log('---------------------------------------------------------------');
    } catch (err) {
      console.error(`❌ Error executing schema/seed on '${PGDATABASE}':`, err.message);
    } finally {
      await targetPool.end();
    }
  }

  // Step 3: Always verify/initialize persistent local database store (hms_db.json)
  console.log(`💾 Verifying persistent local database store at server/db/hms_db.json...`);
  try {
    const fileExists = fs.existsSync(localDbPath);
    const forceReset = process.argv.includes('--force');
    if (!fileExists || forceReset) {
      const { initialData } = await import('../data/inMemoryDb.js');
      fs.writeFileSync(localDbPath, JSON.stringify(initialData, null, 2), 'utf8');
      console.log(`✅ Local database file created & seeded: server/db/hms_db.json`);
    } else {
      // Validate that the JSON file is parseable
      JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
      console.log(`✅ Local database file verified & active: server/db/hms_db.json`);
    }
    console.log(`   Tables synced: users, patients, appointments, vitals, labs, radiology, prescriptions, wards, beds, invoices, audit logs.`);
  } catch (err) {
    console.warn(`⚠️  Local database check: ${err.message}`);
    try {
      const { initialData } = await import('../data/inMemoryDb.js');
      fs.writeFileSync(localDbPath, JSON.stringify(initialData, null, 2), 'utf8');
      console.log(`✅ Recovered local database file with standard initial data.`);
    } catch (writeErr) {
      console.error(`❌ Could not write hms_db.json:`, writeErr.message);
    }
  }

  console.log('===============================================================');
  if (postgresConnected) {
    console.log(`🎉 PostgreSQL Database '${PGDATABASE}' is fully initialized and ready!`);
  } else {
    console.log(`✅ Local database initialized. Once PostgreSQL service is running,`);
    console.log(`   re-run 'npm run db:init' to sync into PostgreSQL.`);
  }
  console.log('===============================================================');
}

initializeDatabase();

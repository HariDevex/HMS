import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query, testConnection } from './postgresClient.js';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedSqlPath = path.join(__dirname, 'seed.sql');

async function runSeed() {
  console.log('🌱 Hospital Management System (HMS) — Database Seeder');
  console.log('---------------------------------------------------------');

  const conn = await testConnection();

  if (conn.connected) {
    console.log(`🔌 Connected to PostgreSQL (${conn.database})`);
    try {
      console.log(`📜 Executing SQL seed file: server/db/seed.sql...`);
      const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
      await query(seedSql);
      console.log(`✅ PostgreSQL seeded successfully!`);
    } catch (err) {
      console.error(`❌ Error seeding PostgreSQL:`, err.message);
    } finally {
      await pool.end();
    }
  } else {
    console.log(`ℹ️  PostgreSQL not active (${conn.error || 'offline'}).`);
  }

  // Reset local file database
  console.log(`💾 Re-seeding local database file (server/db/hms_db.json)...`);
  db.resetToDefaults();
  console.log(`✅ Local database re-seeded successfully.`);
  console.log('---------------------------------------------------------');
}

runSeed();

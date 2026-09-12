import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postgresClient, { query as pgQuery, testConnection, getDbStatus } from './postgresClient.js';
import { initialData } from '../data/inMemoryDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, 'hms_db.json');

// Memory storage initialized from local file or default initialData
let store = {};

function loadStore() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf8');
      store = JSON.parse(content);
    } else {
      store = JSON.parse(JSON.stringify(initialData));
      saveStore();
    }
  } catch (err) {
    console.warn(`[Database Engine] Fallback to in-memory defaults: ${err.message}`);
    store = JSON.parse(JSON.stringify(initialData));
  }
}

let saveTimeout = null;
function saveStore() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), 'utf8');
    } catch (err) {
      console.error(`[Database Engine] Error persisting to hms_db.json:`, err.message);
    }
  }, 100);
}

// Initial load
loadStore();

/**
 * Universal Collection Class providing CRUD operations with persistence
 */
class PersistentCollection {
  constructor(name) {
    this.name = name;
    if (!store[name]) {
      store[name] = initialData[name] ? [...initialData[name]] : [];
    }
  }

  get data() {
    if (!store[this.name]) {
      store[this.name] = [];
    }
    return store[this.name];
  }

  find(filterFn) {
    if (!filterFn) return [...this.data];
    return this.data.filter(filterFn);
  }

  findById(id) {
    return this.data.find((item) => item.id === id) || null;
  }

  findOne(filterFn) {
    return this.data.find(filterFn) || null;
  }

  count(filterFn) {
    if (!filterFn) return this.data.length;
    return this.data.filter(filterFn).length;
  }

  create(item) {
    const newItem = {
      ...item,
      id: item.id || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    };
    this.data.unshift(newItem);
    saveStore();
    return newItem;
  }

  update(id, updates) {
    const idx = this.data.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    this.data[idx] = {
      ...this.data[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveStore();
    return this.data[idx];
  }

  delete(id) {
    const idx = this.data.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    saveStore();
    return true;
  }
}

// Master DB interface exported for Express controllers
export const db = {
  users: new PersistentCollection('users'),
  patients: new PersistentCollection('patients'),
  labOrders: new PersistentCollection('labOrders'),
  radiologyOrders: new PersistentCollection('radiologyOrders'),
  appointments: new PersistentCollection('appointments'),
  vitals: new PersistentCollection('vitals'),
  prescriptions: new PersistentCollection('prescriptions'),
  wards: new PersistentCollection('wards'),
  beds: new PersistentCollection('beds'),
  invoices: new PersistentCollection('invoices'),
  auditLogs: new PersistentCollection('auditLogs'),

  // Raw PostgreSQL query execution
  query: pgQuery,
  postgres: postgresClient,
  testConnection,
  getStatus: getDbStatus,

  // Force persist current memory to disk
  syncToFile: () => {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), 'utf8');
  },

  // Reset to default seed dataset
  resetToDefaults: () => {
    store = JSON.parse(JSON.stringify(initialData));
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), 'utf8');
  },
};

export default db;

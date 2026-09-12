/**
 * HMS SQLite Database Client
 * Persistent relational store backed by better-sqlite3.
 * Provides the same Collection-style API used by controllers
 * (find, findById, create, update, delete) while storing data
 * in a real on-disk SQLite database file.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  seedAll,
} from './seedData.js';

// ── Path Setup ────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'hms.db');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// ── Open Connection ───────────────────────────────────────────
const conn = new Database(dbPath);
conn.pragma('journal_mode = WAL');
conn.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────
conn.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL CHECK(role IN ('admin','doctor','nurse','lab','radiology','reception','patient')),
    department TEXT NOT NULL,
    avatarUrl TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    mrn TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    bloodGroup TEXT,
    contactPhone TEXT,
    contactEmail TEXT,
    address TEXT,
    emergencyContact TEXT,
    primaryCondition TEXT,
    chiefComplaint TEXT,
    diagnosis TEXT,
    attendingDoctorId TEXT REFERENCES users(id) ON DELETE SET NULL,
    attendingDoctor TEXT,
    department TEXT,
    wardId TEXT,
    ward TEXT,
    bedId TEXT,
    bed TEXT,
    admissionDate TEXT,
    status TEXT DEFAULT 'Admitted',
    insuranceProvider TEXT,
    policyNumber TEXT,
    allergies TEXT DEFAULT '[]',
    vitals TEXT DEFAULT 'null',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS wards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    floor TEXT NOT NULL,
    totalBeds INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS beds (
    id TEXT PRIMARY KEY,
    wardId TEXT NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
    bedNumber TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN ('Available','Occupied','Reserved','Cleaning','Maintenance')),
    patientId TEXT,
    patientName TEXT,
    assignedAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patientName TEXT NOT NULL,
    patientMrn TEXT,
    doctorId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctorName TEXT NOT NULL,
    department TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    durationMins INTEGER DEFAULT 30,
    type TEXT DEFAULT 'General Consultation',
    status TEXT DEFAULT 'Confirmed' CHECK(status IN ('Confirmed','In Consultation','Completed','Cancelled')),
    tokenNumber TEXT NOT NULL,
    reason TEXT,
    notes TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS labOrders (
    id TEXT PRIMARY KEY,
    orderNumber TEXT UNIQUE NOT NULL,
    patientId TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patientName TEXT NOT NULL,
    patientMrn TEXT,
    age INTEGER,
    gender TEXT,
    orderedBy TEXT,
    orderDate TEXT DEFAULT (datetime('now')),
    priority TEXT NOT NULL DEFAULT 'Routine' CHECK(priority IN ('Routine','Urgent','STAT')),
    department TEXT,
    testName TEXT NOT NULL,
    category TEXT,
    sampleType TEXT DEFAULT 'Venous Blood',
    sampleBarcode TEXT,
    status TEXT DEFAULT 'Ordered' CHECK(status IN ('Ordered','Sample Pending','Processing','Result Ready','Verified','Published')),
    verifiedBy TEXT,
    verifiedAt TEXT,
    technicianComment TEXT,
    parameters TEXT DEFAULT '[]',
    pdfReport TEXT DEFAULT 'null',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS radiologyOrders (
    id TEXT PRIMARY KEY,
    requestNumber TEXT UNIQUE NOT NULL,
    patientId TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patientName TEXT NOT NULL,
    patientMrn TEXT,
    age INTEGER,
    gender TEXT,
    orderedBy TEXT,
    orderDate TEXT DEFAULT (datetime('now')),
    priority TEXT NOT NULL DEFAULT 'Routine' CHECK(priority IN ('Routine','Urgent','STAT')),
    modality TEXT NOT NULL,
    studyCode TEXT NOT NULL,
    studyName TEXT,
    clinicalIndication TEXT NOT NULL,
    status TEXT DEFAULT 'New Requests' CHECK(status IN ('New Requests','Scheduled','Report Draft','Verified','Published')),
    dicomSeries INTEGER DEFAULT 1,
    dicomImages INTEGER DEFAULT 8,
    imageMock TEXT,
    radiologist TEXT,
    reportedAt TEXT,
    findings TEXT,
    impression TEXT,
    pdfReport TEXT DEFAULT 'null',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    rxNumber TEXT UNIQUE NOT NULL,
    patientId TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patientName TEXT NOT NULL,
    prescribedById TEXT REFERENCES users(id) ON DELETE SET NULL,
    prescribedBy TEXT,
    drugName TEXT NOT NULL,
    dosage TEXT NOT NULL,
    route TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    indication TEXT,
    refills INTEGER DEFAULT 0,
    daw INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Active',
    prescribedAt TEXT DEFAULT (datetime('now')),
    lastAdministeredStatus TEXT,
    lastAdministeredAt TEXT,
    lastAdministeredBy TEXT,
    adminNotes TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoiceNumber TEXT UNIQUE NOT NULL,
    patientId TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patientName TEXT NOT NULL,
    patientMrn TEXT,
    billDate TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Paid','Pending','Partially Paid','Overdue')),
    paymentMethod TEXT,
    totalAmount REAL NOT NULL DEFAULT 0,
    insuranceCovered REAL NOT NULL DEFAULT 0,
    patientPayable REAL NOT NULL DEFAULT 0,
    paidAmount REAL NOT NULL DEFAULT 0,
    items TEXT DEFAULT '[]',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS auditLogs (
    id TEXT PRIMARY KEY,
    userId TEXT,
    action TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'Info',
    timestamp TEXT DEFAULT (datetime('now')),
    ipAddress TEXT DEFAULT '127.0.0.1',
    patientName TEXT
  );

  CREATE TABLE IF NOT EXISTS vitals (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recordedBy TEXT,
    recordedAt TEXT DEFAULT (datetime('now')),
    bp TEXT NOT NULL,
    systolic INTEGER NOT NULL,
    diastolic INTEGER NOT NULL,
    heartRate INTEGER NOT NULL,
    temperature REAL NOT NULL,
    tempUnit TEXT DEFAULT 'F',
    respRate INTEGER NOT NULL,
    oxygenSaturation REAL NOT NULL,
    painLevel INTEGER DEFAULT 0,
    weight TEXT,
    height TEXT,
    bmi REAL,
    notes TEXT
  );
`);

// ── Seed Data (only when tables are empty) ────────────────────
function seedIfEmpty() {
  const hasUsers = conn.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (hasUsers > 0) return false;

  const insertMany = conn.transaction(() => {
    // Wards (no FKs)
    const insWard = conn.prepare('INSERT INTO wards (id,name,type,floor,totalBeds) VALUES (?,?,?,?,?)');
    for (const w of seedAll.wards) {
      insWard.run(w.id, w.name, w.type, w.floor, w.totalBeds);
    }

    // Users (no FKs to patients)
    const insUser = conn.prepare('INSERT INTO users (id,name,email,passwordHash,role,department,avatarUrl,isActive,createdAt) VALUES (?,?,?,?,?,?,?,?,?)');
    for (const u of seedAll.users) {
      insUser.run(u.id, u.name, u.email, u.passwordHash, u.role, u.department, u.avatarUrl, u.isActive ? 1 : 0, u.createdAt);
    }

    // Patients (FK: users)
    const insPat = conn.prepare('INSERT INTO patients (id,mrn,name,age,gender,bloodGroup,contactPhone,contactEmail,address,emergencyContact,primaryCondition,chiefComplaint,diagnosis,attendingDoctorId,attendingDoctor,department,wardId,ward,bedId,bed,admissionDate,status,insuranceProvider,policyNumber,allergies,vitals) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const p of seedAll.patients) {
      insPat.run(p.id, p.mrn, p.name, p.age, p.gender, p.bloodGroup, p.contactPhone, p.contactEmail, p.address, p.emergencyContact, p.primaryCondition, p.chiefComplaint, p.diagnosis, p.attendingDoctorId, p.attendingDoctor, p.department, p.wardId, p.ward, p.bedId, p.bed, p.admissionDate, p.status, p.insuranceProvider, p.policyNumber, JSON.stringify(p.allergies || []), JSON.stringify(p.vitals || null));
    }

    // Beds (FK: wards, patients)
    const insBed = conn.prepare('INSERT INTO beds (id,wardId,bedNumber,status,patientId,patientName,assignedAt) VALUES (?,?,?,?,?,?,?)');
    for (const b of seedAll.beds) {
      insBed.run(b.id, b.wardId, b.bedNumber, b.status, b.patientId, b.patientName || null, b.assignedAt || null);
    }

    // Appointments (FK: patients, users)
    const insApt = conn.prepare('INSERT INTO appointments (id,patientId,patientName,patientMrn,doctorId,doctorName,department,date,time,durationMins,type,status,tokenNumber,reason,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const a of seedAll.appointments) {
      insApt.run(a.id, a.patientId, a.patientName, a.patientMrn, a.doctorId, a.doctorName, a.department, a.date, a.time, a.durationMins, a.type, a.status, a.tokenNumber, a.reason, a.notes);
    }

    // Lab Orders (FK: patients)
    const insLab = conn.prepare('INSERT INTO labOrders (id,orderNumber,patientId,patientName,patientMrn,age,gender,orderedBy,orderDate,priority,department,testName,category,sampleType,sampleBarcode,status,verifiedBy,verifiedAt,technicianComment,parameters,pdfReport) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const l of seedAll.labOrders) {
      insLab.run(l.id, l.orderNumber, l.patientId, l.patientName, l.patientMrn, l.age, l.gender, l.orderedBy, l.orderDate, l.priority, l.department, l.testName, l.category, l.sampleType, l.sampleBarcode, l.status, l.verifiedBy, l.verifiedAt, l.technicianComment, JSON.stringify(l.parameters || []), JSON.stringify(l.pdfReport || null));
    }

    // Radiology Orders (FK: patients)
    const insRad = conn.prepare('INSERT INTO radiologyOrders (id,requestNumber,patientId,patientName,patientMrn,age,gender,orderedBy,orderDate,priority,modality,studyCode,studyName,clinicalIndication,status,dicomSeries,dicomImages,imageMock,radiologist,reportedAt,findings,impression,pdfReport) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const r of seedAll.radiologyOrders) {
      insRad.run(r.id, r.requestNumber, r.patientId, r.patientName, r.patientMrn, r.age, r.gender, r.orderedBy, r.orderDate, r.priority, r.modality, r.studyCode, r.studyName || '', r.clinicalIndication, r.status, r.dicomSeries, r.dicomImages, r.imageMock, r.radiologist, r.reportedAt, r.findings, r.impression, JSON.stringify(r.pdfReport || null));
    }

    // Prescriptions (FK: patients, users)
    const insRx = conn.prepare('INSERT INTO prescriptions (id,rxNumber,patientId,patientName,prescribedById,prescribedBy,drugName,dosage,route,frequency,duration,indication,refills,daw,status,prescribedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const rx of seedAll.prescriptions) {
      insRx.run(rx.id, rx.rxNumber, rx.patientId, rx.patientName, rx.prescribedById, rx.prescribedBy, rx.drugName, rx.dosage, rx.route, rx.frequency, rx.duration, rx.indication, rx.refills, rx.daw ? 1 : 0, rx.status, rx.prescribedAt);
    }

    // Invoices (FK: patients)
    const insInv = conn.prepare('INSERT INTO invoices (id,invoiceNumber,patientId,patientName,patientMrn,billDate,dueDate,status,paymentMethod,totalAmount,insuranceCovered,patientPayable,paidAmount,items) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const inv of seedAll.invoices) {
      insInv.run(inv.id, inv.invoiceNumber, inv.patientId, inv.patientName, inv.patientMrn, inv.billDate, inv.dueDate, inv.status, inv.paymentMethod, inv.totalAmount, inv.insuranceCovered, inv.patientPayable, inv.paidAmount, JSON.stringify(inv.items || []));
    }

    // Vitals
    const insVit = conn.prepare('INSERT INTO vitals (id,patientId,recordedBy,recordedAt,bp,systolic,diastolic,heartRate,temperature,tempUnit,respRate,oxygenSaturation,painLevel,weight,height,bmi,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const v of seedAll.vitals) {
      insVit.run(v.id, v.patientId, v.recordedBy, v.recordedAt, v.bp, v.systolic, v.diastolic, v.heartRate, v.temperature, v.tempUnit, v.respRate, v.oxygenSaturation, v.painLevel, v.weight, v.height, v.bmi, v.notes);
    }

    // Audit Logs
    const insLog = conn.prepare('INSERT INTO auditLogs (id,userId,action,details,status,timestamp,ipAddress,patientName) VALUES (?,?,?,?,?,?,?,?)');
    for (const log of seedAll.auditLogs) {
      insLog.run(log.id, log.userId, log.action, log.details, log.status, log.timestamp, log.ipAddress, log.patientName);
    }
  });

  insertMany();
  console.log('🌱 SQLite database seeded with initial data.');
  return true;
}

seedIfEmpty();

// ── Collection Class ──────────────────────────────────────────
// Maps between JS camelCase objects and SQLite tables.

const JSON_FIELDS = {
  patients: ['allergies', 'vitals'],
  labOrders: ['parameters', 'pdfReport'],
  radiologyOrders: ['pdfReport'],
  invoices: ['items'],
};

const BOOL_FIELDS = {
  users: ['isActive'],
  prescriptions: ['daw'],
};

class Collection {
  constructor(tableName) {
    this.tableName = tableName;
    this._jsonFields = JSON_FIELDS[tableName] || [];
    this._boolFields = BOOL_FIELDS[tableName] || [];
    this._columns = new Set(conn.prepare(`PRAGMA table_info("${tableName}")`).all().map((c) => c.name));
  }

  /** Parse JSON text columns back to objects */
  _hydrate(row) {
    if (!row) return null;
    for (const f of this._jsonFields) {
      if (row[f] !== undefined && row[f] !== null) {
        try { row[f] = JSON.parse(row[f]); } catch { /* keep as string */ }
      }
    }
    for (const f of this._boolFields) {
      if (row[f] !== undefined) row[f] = Boolean(row[f]);
    }
    return row;
  }

  /** Serialize JSON fields to text for SQL insert/update */
  _serialize(obj) {
    const copy = { ...obj };
    for (const f of this._jsonFields) {
      if (f in copy && copy[f] !== undefined) {
        copy[f] = typeof copy[f] === 'string' ? copy[f] : JSON.stringify(copy[f]);
      }
    }
    for (const f of this._boolFields) {
      if (f in copy && copy[f] !== undefined) {
        copy[f] = copy[f] ? 1 : 0;
      }
    }
    return copy;
  }

  /** Return all rows, optionally filtered by JS predicate */
  find(filterFn) {
    const all = conn.prepare(`SELECT * FROM "${this.tableName}"`).all().map((r) => this._hydrate({ ...r }));
    if (!filterFn) return all;
    return all.filter(filterFn);
  }

  /** Find single row by id */
  findById(id) {
    const row = conn.prepare(`SELECT * FROM "${this.tableName}" WHERE id = ?`).get(id);
    return row ? this._hydrate({ ...row }) : null;
  }

  /** Insert a new row. Only writes columns that exist on the table. */
  create(item) {
    const obj = { ...item, id: item.id || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}` };
    if (this._columns.has('createdAt')) {
      obj.createdAt = item.createdAt || new Date().toISOString();
    }
    const serialized = this._serialize(obj);
    const keys = Object.keys(serialized).filter((k) => this._columns.has(k));
    const cols = keys.map((k) => `"${k}"`).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const stmt = conn.prepare(`INSERT INTO "${this.tableName}" (${cols}) VALUES (${placeholders})`);
    stmt.run(...keys.map((k) => serialized[k]));
    return this.findById(obj.id);
  }

  /** Update a row by id with partial fields. Returns the updated row. */
  update(id, updates) {
    const serialized = this._serialize(updates);
    const keys = Object.keys(serialized).filter((k) => this._columns.has(k));
    if (keys.length === 0) return this.findById(id);

    const sets = keys.map((k) => `"${k}" = ?`).join(', ');
    const stmt = conn.prepare(`UPDATE "${this.tableName}" SET ${sets} WHERE id = ?`);
    stmt.run(...keys.map((k) => serialized[k]), id);
    return this.findById(id);
  }

  /** Delete a row by id */
  delete(id) {
    const result = conn.prepare(`DELETE FROM "${this.tableName}" WHERE id = ?`).run(id);
    return result.changes > 0;
  }
}

// ── Create Collection Instances ───────────────────────────────
const users = new Collection('users');
const patients = new Collection('patients');
const wards = new Collection('wards');
const beds = new Collection('beds');
const appointments = new Collection('appointments');
const labOrders = new Collection('labOrders');
const radiologyOrders = new Collection('radiologyOrders');
const prescriptions = new Collection('prescriptions');
const invoices = new Collection('invoices');
const auditLogs = new Collection('auditLogs');

// ── vitals – separate table for proper relational design ──────
const vitals = {
  findByPatientId(patientId) {
    return conn.prepare('SELECT * FROM vitals WHERE patientId = ? ORDER BY recordedAt DESC').all(patientId);
  },
  create(record) {
    const obj = { id: record.id || `VIT-${Date.now()}`, ...record };
    const keys = Object.keys(obj);
    const cols = keys.map((k) => `"${k}"`).join(', ');
    const ph = keys.map(() => '?').join(', ');
    conn.prepare(`INSERT INTO vitals (${cols}) VALUES (${ph})`).run(...Object.values(obj));
    return obj;
  },
};

// ── SQL Aggregate Helpers (real DB-powered queries) ──────────
function getWardStats() {
  return conn.prepare(`
    SELECT
      w.*,
      COUNT(b.id) AS totalBedsCount,
      SUM(CASE WHEN b.status = 'Occupied' THEN 1 ELSE 0 END) AS occupiedBeds,
      SUM(CASE WHEN b.status = 'Available' THEN 1 ELSE 0 END) AS availableBeds
    FROM wards w
    LEFT JOIN beds b ON b.wardId = w.id
    GROUP BY w.id
    ORDER BY w.name
  `).all().map((w) => ({
    ...w,
    totalBedsCount: w.totalBedsCount,
    occupiedBeds: w.occupiedBeds || 0,
    availableBeds: w.availableBeds || 0,
    occupancyRate: w.totalBedsCount > 0 ? Math.round(((w.occupiedBeds || 0) / w.totalBedsCount) * 100) : 0,
  }));
}

function getInvoiceSummary() {
  return conn.prepare(`
    SELECT
      COUNT(*) AS count,
      COALESCE(SUM(totalAmount), 0) AS totalBilled,
      COALESCE(SUM(paidAmount), 0) AS totalCollected,
      COALESCE(SUM(CASE WHEN status IN ('Pending','Partially Paid') THEN (patientPayable - paidAmount) ELSE 0 END), 0) AS pendingAmount
    FROM invoices
  `).get();
}

function getReportsSummary() {
  const patientsCount = conn.prepare('SELECT COUNT(*) as c FROM patients').get().c;
  const appointmentsCount = conn.prepare('SELECT COUNT(*) as c FROM appointments').get().c;
  const totalLabs = conn.prepare('SELECT COUNT(*) as c FROM labOrders').get().c;
  const pendingLabs = conn.prepare("SELECT COUNT(*) as c FROM labOrders WHERE status != 'Verified'").get().c;
  const verifiedLabs = conn.prepare("SELECT COUNT(*) as c FROM labOrders WHERE status = 'Verified'").get().c;
  const totalScans = conn.prepare('SELECT COUNT(*) as c FROM radiologyOrders').get().c;
  const totalBeds = conn.prepare('SELECT COUNT(*) as c FROM beds').get().c;
  const occupiedBeds = conn.prepare("SELECT COUNT(*) as c FROM beds WHERE status = 'Occupied'").get().c;
  const totalRevenue = conn.prepare('SELECT COALESCE(SUM(paidAmount), 0) as c FROM invoices').get().c;

  return {
    totalPatients: patientsCount,
    totalAppointments: appointmentsCount,
    totalLabs,
    pendingLabs,
    verifiedLabs,
    totalScans,
    bedOccupancyRate: `${totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0}%`,
    totalRevenue: `₹${totalRevenue.toLocaleString()}`,
  };
}

// ── Expose Single DB Handle ───────────────────────────────────
export const db = {
  users,
  patients,
  wards,
  beds,
  appointments,
  labOrders,
  radiologyOrders,
  prescriptions,
  invoices,
  auditLogs,
  vitals,
  raw: conn,
  getWardStats,
  getInvoiceSummary,
  getReportsSummary,
};

export function getDbStatus() {
  return {
    connected: true,
    engine: 'SQLite (better-sqlite3)',
    path: dbPath,
    tables: Object.keys(seedAll).length + 1, // +1 for vitals
  };
}

export function closeDb() {
  conn.close();
}

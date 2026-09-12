# Hospital Management System (HMS) — Express Backend API

A modular, lightweight, high-performance **Express.js REST API server** engineered to support the HMS clinical frontend.

Currently configured with a **PostgreSQL-Ready In-Memory Database Store**, enabling zero-setup local development and UI testing while preserving strict relational schema compatibility for PostgreSQL.

---

## ⚡ Instant Full-Stack Launch (Single Command)

To run the **entire stack** (Database Initializer + Express REST API Backend + React Vite Frontend) in a single command:

```bash
npm start
# OR
npm run dev:all
# OR
./start.sh
```

This single command automatically:
1. **Checks & Inits Database**: Detects if PostgreSQL is running. If online, verifies `hms_db`, applies `schema.sql`, and seeds initial data. If offline, initializes/verifies persistent local database storage (`server/db/hms_db.json`).
2. **Starts Express Backend**: Boots REST API on `http://localhost:5000` with hot-reload (`node --watch`), JWT auth, and role guards.
3. **Starts Vite Frontend**: Launches React application on `http://localhost:5173` with HMR and automatic `/api` proxy forwarding.

---

## ⚡ Standalone Backend Quick Start

If you wish to run only the Express backend:

### 1. Start the Express API Server
```bash
# Production mode
npm run server

# Development mode with native file auto-reload
npm run server:dev
```
The API server listens by default at: `http://localhost:5000`

### 2. Verify Health & Database Engine Status
```bash
curl http://localhost:5000/api/health
```
**Response:**
```json
{
  "status": "healthy",
  "system": "Hospital Management System (HMS) — Express Backend",
  "database": {
    "status": "online",
    "engine": "PostgreSQL",
    "database": "hms_db",
    "version": "PostgreSQL 16",
    "connected": true
  },
  "timestamp": "2026-09-12T18:00:00.000Z"
}
```
*(Note: If PostgreSQL is stopped, `database.status` will report `"fallback_active"` and seamlessly serve data via the persistent JSON engine `server/db/hms_db.json` without failing).*

---

## 🛡️ Authentication & Authorization Middleware

All protected API endpoints require Bearer token authentication and role verification:

1. **`server/middleware/auth.js` (`authenticate`)**:
   - Validates `Authorization: Bearer hms_jwt_token_<userId>_<timestamp>` header.
   - Looks up the user in `db.users`. Returns HTTP 401 if missing or invalid.
   - Attaches authenticated user object to `req.user`.

2. **`server/middleware/requireRole.js` (`requireRole(allowedRoles)`)**:
   - Validates that `req.user.role` is in the allowed roles array.
   - Returns HTTP 403 Forbidden with clinical boundary error message if unauthorized.
   - Enforces clinical governance (e.g. only licensed physicians can create prescriptions; nurses administer via MAR; administrators manage users/audit logs).

---

## 🗄️ Database Architecture & PostgreSQL Setup

The backend features a **Dual-Mode Hybrid Architecture**:
1. **Live PostgreSQL Database**: Full production relational engine powered by `pg` connection pool (`server/db/postgresClient.js`).
2. **Persistent Local Database (`server/db/hms_db.json`)**: Zero-setup local JSON relational store that persists state changes immediately, enabling full offline operation and seamless UI development even when PostgreSQL is not yet started.

### 1. Automated Database Initialization (`npm run db:init`)
Run the all-in-one database creation script:
```bash
npm run db:init
```
This automated runner:
1. Connects to PostgreSQL server.
2. Creates the database `hms_db` if it doesn't already exist.
3. Applies `server/db/schema.sql` (creates 7 enums, 11 tables, foreign key constraints, and 14 performance indexes).
4. Executes `server/db/seed.sql` to populate high-fidelity clinical and administrative seed records.
5. Synchronizes the persistent local store (`server/db/hms_db.json`).

### 2. Available Database Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run db:init` | Creates `hms_db`, executes `schema.sql`, and inserts `seed.sql` |
| `npm run db:seed` | Re-seeds PostgreSQL and resets local database file |
| `npm run db:reset` | Drops all tables and re-seeds clean hospital records |

### 3. Environment Variables Configuration (`.env`)
Create or update `.env` in the root directory:
```env
PORT=5000
NODE_ENV=development

# PostgreSQL Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hms_db
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=hms_db

CLIENT_URL=http://localhost:5173
```

### 4. Starting PostgreSQL Locally
* **Linux (systemd)**:
  ```bash
  sudo systemctl start postgresql
  ```
* **Docker Container (Alternative)**:
  ```bash
  docker run --name hms-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=hms_db -p 5432:5432 -d postgres:16
  ```

---

## 📡 REST API Endpoint Directory

All endpoints are prefixed with `/api`.

### 1. Authentication & Staff (`/api/auth`)
* `POST /api/auth/login` — Authenticate staff/patient and receive JWT token.
* `GET /api/auth/me` — Retrieve active authenticated user profile.
* `GET /api/auth/users` — Staff directory (filterable by `?role=doctor|nurse|admin|lab|radiology`).
* `POST /api/auth/users` — Register new staff member (Admin).
* `PATCH /api/auth/users/:id` — Update user status/department.

### 2. Patients (`/api/patients`)
* `GET /api/patients` — List patients (supports `?search=`, `?department=`, `?status=`).
* `GET /api/patients/:id` — Detailed patient record with relational labs, scans, and prescriptions.
* `POST /api/patients` — Register new patient (generates MRN `MC-2026-XXXX`).
* `PATCH /api/patients/:id` — Update diagnosis, allergies, or assigned bed.

### 3. Clinical Vitals (`/api/vitals`)
* `GET /api/vitals/:patientId` — Historical vital signs trend data.
* `POST /api/vitals/:patientId` — Record vital signs (BP, Pulse, Temp, SpO2, Pain, BMI).

### 4. Laboratory Module (`/api/labs`)
* `GET /api/labs` — Lab queue (filter by `?status=Ordered|Processing|Verified|Published`).
* `GET /api/labs/:id` — Detailed specimen report with analyte parameters and attached PDF report.
* `POST /api/labs` — Place lab order (auto-generates tube barcode and accession).
* `POST /api/labs/:id/verify` — Record analyte values, comments, attach/generate certified PDF report, and lock record.

### 5. Radiology & Medical Imaging (`/api/radiology`)
* `GET /api/radiology` — Imaging queue (filter by `?modality=X-Ray|CT|MRI|Ultrasound` & `?status=`).
* `GET /api/radiology/:id` — Diagnostic scan details, DICOM series, and radiologist report.
* `POST /api/radiology` — Request imaging scan.
* `POST /api/radiology/:id/verify` — Record findings, impression, attach signed PDF report, and seal study.

### 6. Appointments & Scheduling (`/api/appointments`)
* `GET /api/appointments` — List appointments (filter by `?date=YYYY-MM-DD`, `?doctorId=`, `?status=`).
* `POST /api/appointments` — Book appointment slot with token assignment.
* `PATCH /api/appointments/:id/status` — Update appointment status (`Confirmed`, `In Consultation`, `Completed`).

### 7. Prescriptions & MAR (`/api/prescriptions`)
* `GET /api/prescriptions` — List medications (filter by `?patientId=`, `?status=`).
* `POST /api/prescriptions` — Authorize prescription with automatic allergy contraindication check.
* `POST /api/prescriptions/:id/administer` — Confirm MAR administration (`Given`, `Held`, `Missed`).

### 8. Inpatient Wards & Beds (`/api/wards`)
* `GET /api/wards` — Wards overview with occupancy rates (ICU, General, Surgical, etc.).
* `GET /api/wards/beds` — Bed map (filter by `?wardId=`, `?status=Available|Occupied|Reserved|Cleaning`).
* `POST /api/wards/beds/:bedId/assign` — Admit patient to bed.
* `PATCH /api/wards/beds/:bedId/status` — Update bed status (e.g. transfer or cleaning).

### 9. Billing & Invoicing (`/api/billing`)
* `GET /api/billing` — Financial summary and invoices list (filter by `?status=Paid|Pending|Partially Paid`).
* `GET /api/billing/:id` — Itemized invoice statement.
* `POST /api/billing/:id/payments` — Record payment (Cash, Credit Card, Insurance claim).

### 10. Audit Logs & Reports (`/api/audit-logs`, `/api/reports`)
* `GET /api/audit-logs` — Immutable audit trail of clinical and security actions.
* `POST /api/audit-logs` — Log custom audit entry.
* `GET /api/reports/summary` — Executive hospital KPI metrics, occupancy, and revenue streams.

---

## 🏛️ Project Directory Structure

```text
server/
├── index.js                    # Express app entry point & middleware configuration
├── README.md                   # Backend documentation (this file)
│
├── controllers/                # Request handling & business logic
│   ├── authController.js
│   ├── patientController.js
│   ├── labController.js
│   ├── radiologyController.js
│   ├── appointmentController.js
│   ├── prescriptionController.js
│   ├── vitalsController.js
│   ├── wardController.js
│   ├── billingController.js
│   └── reportsController.js
│
├── middleware/                 # Authentication & authorization guards
│   ├── auth.js                 # JWT Bearer token validation & req.user attachment
│   └── requireRole.js          # Role-based access control (RBAC) & HTTP 403 guard
│
├── routes/                     # Express Router declarations
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── labRoutes.js
│   ├── radiologyRoutes.js
│   ├── appointmentRoutes.js
│   ├── prescriptionRoutes.js
│   ├── vitalsRoutes.js
│   ├── wardRoutes.js
│   ├── billingRoutes.js
│   ├── auditLogRoutes.js
│   └── reportsRoutes.js
│
├── data/
│   └── inMemoryDb.js           # Relational in-memory repository store (PostgreSQL-mapped)
│
└── db/
    ├── schema.sql              # Complete PostgreSQL DDL schema & table definitions
    ├── seed.sql                # Pure SQL seed script for PostgreSQL (11 tables)
    ├── postgresClient.js       # PostgreSQL client adapter with pg.Pool & health checks
    ├── db.js                   # Universal database persistence layer (dual PostgreSQL + local store)
    ├── initDb.js               # Database creation & initialization script (npm run db:init)
    ├── seed.js                 # Standalone seed executor (npm run db:seed)
    ├── resetDb.js              # Database reset utility (npm run db:reset)
    └── hms_db.json             # Persistent local JSON database storage
```

---

## 🔗 Frontend Vite Proxy Configuration

The Vite development server is configured in `vite.config.js` to automatically forward all `/api` calls to the Express server:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

When running `npm run dev` and `npm run server`, the React frontend can fetch directly from `/api/...` without CORS issues.

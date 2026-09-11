# Hospital Management System (HMS) — Express Backend API

A modular, lightweight, high-performance **Express.js REST API server** engineered to support the HMS clinical frontend.

Currently configured with a **PostgreSQL-Ready In-Memory Database Store**, enabling zero-setup local development and UI testing while preserving strict relational schema compatibility for PostgreSQL.

---

## ⚡ Quick Start

### 1. Start the Express API Server
```bash
# Production mode
npm run server

# Development mode with native file auto-reload
npm run server:dev
```
The API server listens by default at: `http://localhost:5000`

### 2. Verify Health
```bash
curl http://localhost:5000/api/health
```
**Response:**
```json
{
  "status": "healthy",
  "system": "Hospital Management System (HMS) — Express Backend",
  "database": "In-Memory Store (PostgreSQL-Ready Schema)",
  "timestamp": "2026-09-11T06:34:49.751Z"
}
```

---

## 🗄️ PostgreSQL Database Integration Guide

When you are ready to connect a live PostgreSQL database:

### 1. Initialize PostgreSQL Database
Create a database in PostgreSQL:
```bash
createdb hms_db
```

### 2. Run the DDL Schema Script
Execute the included schema file located at `server/db/schema.sql`:
```bash
psql -d hms_db -f server/db/schema.sql
```
This initializes all relational tables, enums (`user_role`, `lab_status`, `bed_status`), foreign keys, and indexes:
* `users`
* `patients`
* `appointments`
* `vitals`
* `lab_orders` & `lab_order_parameters`
* `radiology_orders`
* `prescriptions` & `medication_administrations`
* `wards` & `beds`
* `invoices` & `invoice_items`
* `audit_logs` & `clinical_timeline`

### 3. Connect Express to PostgreSQL
1. Install `pg` (node-postgres):
   ```bash
   npm install pg
   ```
2. Create or update your `.env` file:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/hms_db
   ```
3. Activate the connection pool in `server/db/postgresClient.js`.

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
    └── postgresClient.js       # PostgreSQL client adapter ready for live connection
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

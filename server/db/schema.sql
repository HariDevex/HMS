-- ==============================================================================
-- HOSPITAL MANAGEMENT SYSTEM (HMS) — PRODUCTION POSTGRESQL DDL SCHEMA
-- Target Database: PostgreSQL 14+
-- Character Set: UTF-8
-- ==============================================================================

-- Enable UUID extension if UUID primary keys are preferred
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUM TYPES
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'nurse', 'lab', 'radiology', 'reception', 'patient');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('Routine', 'Urgent', 'STAT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('Confirmed', 'In Consultation', 'Completed', 'Cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lab_status AS ENUM ('Ordered', 'Sample Pending', 'Processing', 'Result Ready', 'Verified', 'Published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE radiology_status AS ENUM ('New Requests', 'Scheduled', 'Report Draft', 'Verified', 'Published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE bed_status AS ENUM ('Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('Paid', 'Pending', 'Partially Paid', 'Overdue');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 2. USERS & STAFF
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT '$2b$10$e7x...mockhash',
    role user_role NOT NULL,
    department VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. WARDS & BEDS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS wards (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    floor VARCHAR(20) NOT NULL,
    total_beds INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beds (
    id VARCHAR(64) PRIMARY KEY,
    ward_id VARCHAR(64) NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
    bed_number VARCHAR(20) NOT NULL,
    status bed_status NOT NULL DEFAULT 'Available',
    patient_id VARCHAR(64),
    assigned_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. PATIENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    mrn VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    address TEXT,
    emergency_contact VARCHAR(150),
    primary_condition VARCHAR(150),
    chief_complaint TEXT,
    diagnosis TEXT,
    attending_doctor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    ward_id VARCHAR(64) REFERENCES wards(id) ON DELETE SET NULL,
    bed_id VARCHAR(64) REFERENCES beds(id) ON DELETE SET NULL,
    admission_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'Admitted',
    insurance_provider VARCHAR(100),
    policy_number VARCHAR(100),
    allergies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key back to beds table for circular reference safely
ALTER TABLE beds 
    DROP CONSTRAINT IF EXISTS fk_beds_patient,
    ADD CONSTRAINT fk_beds_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL;

-- ==============================================================================
-- 5. APPOINTMENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_mins INT NOT NULL DEFAULT 30,
    type VARCHAR(50) NOT NULL DEFAULT 'General Consultation',
    department VARCHAR(100) NOT NULL,
    status appointment_status NOT NULL DEFAULT 'Confirmed',
    token_number VARCHAR(20) NOT NULL,
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. CLINICAL VITALS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS vitals (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recorded_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    bp VARCHAR(20) NOT NULL,
    systolic INT NOT NULL,
    diastolic INT NOT NULL,
    heart_rate INT NOT NULL,
    temperature NUMERIC(4,1) NOT NULL,
    temp_unit VARCHAR(5) DEFAULT '°F',
    resp_rate INT NOT NULL,
    oxygen_saturation NUMERIC(4,1) NOT NULL,
    pain_level INT DEFAULT 0,
    weight VARCHAR(20),
    height VARCHAR(20),
    bmi NUMERIC(4,1),
    notes TEXT
);

-- ==============================================================================
-- 7. LABORATORY ORDERS & ANALYTES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS lab_orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    ordered_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    priority priority_level NOT NULL DEFAULT 'Routine',
    department VARCHAR(100) NOT NULL DEFAULT 'Hematology & Clinical Chemistry',
    test_name VARCHAR(150) NOT NULL,
    sample_type VARCHAR(100) NOT NULL DEFAULT 'Venous Blood',
    sample_barcode VARCHAR(50),
    status lab_status NOT NULL DEFAULT 'Ordered',
    verified_by VARCHAR(150),
    verified_at TIMESTAMP WITH TIME ZONE,
    technician_comment TEXT,
    pdf_report JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_order_parameters (
    id SERIAL PRIMARY KEY,
    lab_order_id VARCHAR(64) NOT NULL REFERENCES lab_orders(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    value VARCHAR(50) NOT NULL,
    unit VARCHAR(50),
    ref_range VARCHAR(100),
    flag VARCHAR(50) DEFAULT 'Normal'
);

-- ==============================================================================
-- 8. RADIOLOGY & MEDICAL IMAGING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS radiology_orders (
    id VARCHAR(64) PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    ordered_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    priority priority_level NOT NULL DEFAULT 'Routine',
    modality VARCHAR(50) NOT NULL,
    study_code VARCHAR(50) NOT NULL,
    study_name VARCHAR(150),
    clinical_indication TEXT NOT NULL,
    status radiology_status NOT NULL DEFAULT 'New Requests',
    dicom_series INT DEFAULT 1,
    dicom_images INT DEFAULT 8,
    image_mock VARCHAR(255),
    radiologist VARCHAR(150),
    reported_at TIMESTAMP WITH TIME ZONE,
    findings TEXT,
    impression TEXT,
    pdf_report JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 9. PRESCRIPTIONS & MEDICATION ADMINISTRATION RECORD (MAR)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(64) PRIMARY KEY,
    rx_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    prescribed_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    drug_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    route VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    indication VARCHAR(150),
    refills INT DEFAULT 0,
    daw BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Active',
    prescribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medication_administrations (
    id SERIAL PRIMARY KEY,
    prescription_id VARCHAR(64) NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    administered_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    administered_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) NOT NULL DEFAULT 'Due', -- Due, Given, Held, Missed
    notes TEXT
);

-- ==============================================================================
-- 10. BILLING & INVOICES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'Pending',
    payment_method VARCHAR(50),
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    insurance_covered NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    patient_payable NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(64) NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    service_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);

-- ==============================================================================
-- 11. AUDIT LOGS & CLINICAL TIMELINE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Info',
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    patient_name VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_timeline (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    department VARCHAR(100) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    badge_variant VARCHAR(50) DEFAULT 'primary',
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 12. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_vitals_patient ON vitals(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_status ON lab_orders(status);
CREATE INDEX IF NOT EXISTS idx_rad_orders_patient ON radiology_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_rad_orders_modality ON radiology_orders(modality);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_timeline_patient ON clinical_timeline(patient_id);

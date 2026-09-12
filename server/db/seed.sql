-- ==============================================================================
-- HOSPITAL MANAGEMENT SYSTEM (HMS) — SEED DATA SCRIPT
-- PostgreSQL 14+ Compatible
-- ==============================================================================

-- 1. USERS
INSERT INTO users (id, name, email, password_hash, role, department, avatar_url, is_active)
VALUES
    ('USR-001', 'Dr. Katherine Vance', 'k.vance@medicore.org', '$2b$10$e7xMockHashAdminPass123456789', 'admin', 'Executive Management', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face', TRUE),
    ('USR-002', 'Dr. Sarah Jenkins, MD', 's.jenkins@medicore.org', '$2b$10$e7xMockHashDoctorPass123456789', 'doctor', 'Cardiology', 'https://images.unsplash.com/photo-1594824813589-3549646b9762?w=150&h=150&fit=crop&crop=face', TRUE),
    ('USR-003', 'Nurse Emily Rodriguez, RN', 'e.rodriguez@medicore.org', '$2b$10$e7xMockHashNursePass123456789', 'nurse', 'Critical Care / ICU', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&h=150&fit=crop&crop=face', TRUE),
    ('USR-004', 'Alex Morgan, MLS', 'a.morgan@medicore.org', '$2b$10$e7xMockHashLabPass1234567890', 'lab', 'Clinical Pathology', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face', TRUE),
    ('USR-005', 'Dr. David Miller, MD', 'd.miller@medicore.org', '$2b$10$e7xMockHashRadPass1234567890', 'radiology', 'Diagnostic Radiology', 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=150&h=150&fit=crop&crop=face', TRUE),
    ('USR-006', 'Marcus Chen', 'm.chen@medicore.org', '$2b$10$e7xMockHashReceptPass123456789', 'reception', 'Patient Admissions', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', TRUE),
    ('USR-007', 'James Wilson', 'j.wilson@gmail.com', '$2b$10$e7xMockHashPatientPass1234567', 'patient', 'Outpatient Clinic', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    department = EXCLUDED.department;

-- 2. WARDS
INSERT INTO wards (id, name, type, floor, total_beds)
VALUES
    ('WARD-ICU', 'Intensive Care Unit (ICU)', 'Critical', '3rd Floor, Wing A', 12),
    ('WARD-CARD', 'Cardiology Telemetry Ward', 'Step-Down', '4th Floor, Wing B', 24),
    ('WARD-GEN', 'General Medical Ward', 'Acute', '2nd Floor, Wing C', 36),
    ('WARD-SURG', 'Post-Surgical Recovery', 'Surgical', '5th Floor, Wing A', 20),
    ('WARD-MAT', 'Maternity & Neonatal Unit', 'Specialized', '1st Floor, Wing D', 18)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    floor = EXCLUDED.floor,
    total_beds = EXCLUDED.total_beds;

-- 3. BEDS (Initial unassigned state before patient insertion)
INSERT INTO beds (id, ward_id, bed_number, status, patient_id)
VALUES
    ('BED-C104', 'WARD-CARD', 'C-104', 'Occupied', NULL),
    ('BED-ICU03', 'WARD-ICU', 'ICU-03', 'Occupied', NULL),
    ('BED-S208', 'WARD-SURG', 'S-208', 'Occupied', NULL),
    ('BED-C105', 'WARD-CARD', 'C-105', 'Available', NULL),
    ('BED-C106', 'WARD-CARD', 'C-106', 'Reserved', NULL),
    ('BED-ICU04', 'WARD-ICU', 'ICU-04', 'Cleaning', NULL),
    ('BED-ICU05', 'WARD-ICU', 'ICU-05', 'Available', NULL)
ON CONFLICT (id) DO UPDATE SET
    ward_id = EXCLUDED.ward_id,
    bed_number = EXCLUDED.bed_number,
    status = EXCLUDED.status;

-- 4. PATIENTS
INSERT INTO patients (
    id, mrn, name, age, gender, blood_group, contact_phone, contact_email,
    address, emergency_contact, primary_condition, chief_complaint, diagnosis,
    attending_doctor_id, ward_id, bed_id, admission_date, status,
    insurance_provider, policy_number, allergies
)
VALUES
    (
        'PAT-101', 'MC-2026-0891', 'James Wilson', 58, 'Male', 'O+',
        '+1 (555) 234-8901', 'j.wilson@gmail.com', '742 Evergreen Terrace, Springfield, IL',
        'Sarah Wilson (Spouse) - +1 (555) 234-8902',
        'Acute Coronary Syndrome / NSTEMI',
        'Substernal chest pressure radiating to left jaw, onset 2 hours prior',
        'Non-ST-Elevation Myocardial Infarction (NSTEMI), Hypertensive Heart Disease',
        'USR-002', 'WARD-CARD', 'BED-C104', '2026-09-08 14:32:00+00', 'Admitted',
        'BlueCross BlueShield Premier Gold', 'BCBS-IL-8892019',
        '[{"allergen": "Penicillin", "severity": "Severe", "reaction": "Anaphylaxis, Angioedema"}, {"allergen": "Iodinated Contrast Media", "severity": "Moderate", "reaction": "Urticaria, Pruritus"}]'::jsonb
    ),
    (
        'PAT-102', 'MC-2026-0412', 'Elena Rostova', 34, 'Female', 'A+',
        '+1 (555) 872-1094', 'elena.rostova@techcorp.io', '104 Michigan Avenue, Apt 4B, Chicago, IL',
        'Dmitri Rostov (Brother) - +1 (555) 872-9900',
        'Severe Pneumonia / Hypoxemia',
        'High fevers (103°F), productive cough with rusty sputum, pleuritic chest pain',
        'Right Middle Lobe Community-Acquired Pneumonia, Type 1 Respiratory Failure',
        'USR-002', 'WARD-ICU', 'BED-ICU03', '2026-09-09 03:15:00+00', 'Admitted',
        'Aetna Open Choice PPO', 'AET-99214-X',
        '[{"allergen": "Sulfa Drugs", "severity": "Moderate", "reaction": "Maculopapular rash"}]'::jsonb
    ),
    (
        'PAT-103', 'MC-2026-1189', 'Robert Thorne', 71, 'Male', 'B-',
        '+1 (555) 341-7654', 'r.thorne.retired@att.net', '12 Oak Ridge Lane, Peoria, IL',
        'Mary Thorne (Wife) - +1 (555) 341-7655',
        'Post-Op Total Knee Arthroplasty',
        'Post-operative pain management and physical rehabilitation protocol',
        'Right Knee Osteoarthritis s/p Uncomplicated Total Knee Replacement',
        'USR-002', 'WARD-SURG', 'BED-S208', '2026-09-09 07:00:00+00', 'Post-Op Observation',
        'Medicare Part A & B + Humana Advantage', 'MED-IL-449102-H',
        '[]'::jsonb
    ),
    (
        'PAT-104', 'MC-2026-0923', 'Emily Davis', 29, 'Female', 'AB+',
        '+1 (555) 612-4490', 'emily.davis@designstudio.org', '88 River Street, Evanston, IL',
        'Lucas Davis (Spouse) - +1 (555) 612-4491',
        'Type 1 Diabetes / DKA Monitoring',
        'Nausea, persistent vomiting, blood glucose reading > 420 mg/dL at home',
        'Mild Diabetic Ketoacidosis without Coma, Glycemic Dysregulation',
        'USR-002', NULL, NULL, '2026-09-10 11:20:00+00', 'Outpatient',
        'UnitedHealthcare Choice Plus', 'UHC-IL-772190',
        '[{"allergen": "Latex", "severity": "Mild", "reaction": "Contact dermatitis"}]'::jsonb
    ),
    (
        'PAT-105', 'MC-2026-1502', 'Thomas Miller', 45, 'Male', 'O-',
        '+1 (555) 903-8821', 'thomas.miller@logistics.com', '512 Elmwood Park, Naperville, IL',
        'Karen Miller (Sister) - +1 (555) 903-8822',
        'Acute Pyelonephritis',
        'Left flank pain with radiation to groin, chills, dysuria for 3 days',
        'Acute Left Pyelonephritis secondary to E. coli urinary tract infection',
        'USR-002', NULL, NULL, '2026-09-10 16:45:00+00', 'Admitted',
        'Cigna Open Access Plus', 'CIG-90812-US',
        '[{"allergen": "Ciprofloxacin", "severity": "Severe", "reaction": "Tendinopathy, Rash"}]'::jsonb
    )
ON CONFLICT (id) DO UPDATE SET
    mrn = EXCLUDED.mrn,
    name = EXCLUDED.name,
    age = EXCLUDED.age,
    gender = EXCLUDED.gender,
    primary_condition = EXCLUDED.primary_condition,
    diagnosis = EXCLUDED.diagnosis,
    status = EXCLUDED.status,
    allergies = EXCLUDED.allergies;

-- Update Beds with assigned patients
UPDATE beds SET patient_id = 'PAT-101', assigned_at = '2026-09-08 14:32:00+00' WHERE id = 'BED-C104';
UPDATE beds SET patient_id = 'PAT-102', assigned_at = '2026-09-09 03:15:00+00' WHERE id = 'BED-ICU03';
UPDATE beds SET patient_id = 'PAT-103', assigned_at = '2026-09-09 07:00:00+00' WHERE id = 'BED-S208';

-- 5. APPOINTMENTS
INSERT INTO appointments (
    id, patient_id, doctor_id, appointment_date, appointment_time,
    duration_mins, type, department, status, token_number, reason
)
VALUES
    ('APT-301', 'PAT-101', 'USR-002', '2026-09-11', '09:00:00', 30, 'Consultation', 'Cardiology', 'In Consultation', 'T-01', 'Post-ACS evaluation and coronary angiography review'),
    ('APT-302', 'PAT-102', 'USR-002', '2026-09-11', '09:30:00', 30, 'Follow-up', 'Pulmonology', 'Confirmed', 'T-02', 'ICU step-down review, chest auscultation, ABG follow-up'),
    ('APT-303', 'PAT-103', 'USR-002', '2026-09-11', '10:00:00', 45, 'Procedure', 'Orthopedics', 'Confirmed', 'T-03', 'Joint mobility review & wound dressing change'),
    ('APT-304', 'PAT-104', 'USR-002', '2026-09-11', '10:45:00', 30, 'Consultation', 'Endocrinology', 'Confirmed', 'T-04', 'DKA resolution check & subcutaneous basal insulin adjustment'),
    ('APT-305', 'PAT-105', 'USR-002', '2026-09-11', '11:15:00', 30, 'New Patient', 'Nephrology', 'Confirmed', 'T-05', 'Renal ultrasound follow-up and IV antibiotic transition')
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    reason = EXCLUDED.reason;

-- 6. CLINICAL VITALS
INSERT INTO vitals (
    id, patient_id, recorded_by_id, recorded_at, bp, systolic, diastolic,
    heart_rate, temperature, temp_unit, resp_rate, oxygen_saturation, pain_level, notes
)
VALUES
    ('VIT-001', 'PAT-101', 'USR-003', '2026-09-11 08:30:00+00', '138/88', 138, 88, 76, 98.6, '°F', 16, 98.0, 2, 'Patient resting comfortably in semi-Fowler position. No acute chest pain reported this shift.'),
    ('VIT-002', 'PAT-101', 'USR-003', '2026-09-11 04:00:00+00', '142/90', 142, 90, 82, 98.4, '°F', 18, 97.0, 3, 'Overnight vitals check. Mild diaphoresis, resolved with oral hydration.'),
    ('VIT-003', 'PAT-101', 'USR-003', '2026-09-10 20:00:00+00', '146/92', 146, 92, 88, 99.0, '°F', 18, 96.0, 4, 'Evening vitals. Administered Sublingual Nitroglycerin x1 with relief of mild substernal tightness.'),
    ('VIT-004', 'PAT-102', 'USR-003', '2026-09-11 08:00:00+00', '110/72', 110, 72, 98, 101.4, '°F', 24, 93.0, 4, 'High flow O2 via nasal cannula at 4L. Tachypneic with right lung crackles.'),
    ('VIT-005', 'PAT-103', 'USR-003', '2026-09-11 07:30:00+00', '124/80', 124, 80, 72, 98.2, '°F', 14, 99.0, 5, 'Post-op knee dressing clean and dry. Cryo-cuff active.'),
    ('VIT-006', 'PAT-104', 'USR-003', '2026-09-11 09:00:00+00', '118/76', 118, 76, 84, 98.7, '°F', 16, 99.0, 1, 'Fingerstick glucose 162 mg/dL. Urine ketones negative.')
ON CONFLICT (id) DO NOTHING;

-- 7. LABORATORY ORDERS
INSERT INTO lab_orders (
    id, order_number, patient_id, ordered_by_id, priority, department,
    test_name, sample_type, sample_barcode, status, verified_by,
    verified_at, technician_comment, pdf_report
)
VALUES
    (
        'LAB-901', 'LAB-2026-00412', 'PAT-101', 'USR-002', 'STAT', 'Clinical Biochemistry',
        'Cardiac Biomarkers (hs-cTnI Troponin)', 'Venous Whole Blood (Lithium Heparin)', 'BC-99120481-HEPARIN',
        'Verified', 'Dr. Alistair Finch, MD, FCAP (Chief Pathologist)', '2026-09-08 17:15:00+00',
        'Panic value confirmed on duplicate dilution protocol (Architect i2000SR analyzer, Lot #TN-8821). Attending physician notified via critical phone call log at 17:18.',
        '{
            "attached": true,
            "fileName": "Certified_Lab_Report_LAB-901.pdf",
            "fileSize": "1.4 MB",
            "uploadedAt": "2026-09-08 17:20",
            "uploadedBy": "Dr. Alistair Finch, MD, FCAP",
            "hash": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "verified": true,
            "title": "Clinical Pathology Laboratory Report",
            "labName": "MediCore Central Pathology & Clinical Diagnostic Laboratory",
            "cliaNumber": "CLIA #14D0982314 | CAP Accredited #7182901",
            "sampleId": "SMP-882194-HEPARIN",
            "collectionTime": "2026-09-08 16:15",
            "receivedTime": "2026-09-08 16:35",
            "reportedTime": "2026-09-08 17:15",
            "orderingPhysician": "Dr. Sarah Jenkins, MD (Cardiology)",
            "technician": "Alex Morgan, MLS(ASCP)cm",
            "pathologist": "Dr. Alistair Finch, MD, FCAP (Chief Pathologist)",
            "clinicalNotes": "Acute onset substernal chest pain radiating to left arm. R/O Acute Myocardial Infarction.",
            "pages": 2
        }'::jsonb
    ),
    (
        'LAB-902', 'LAB-2026-00413', 'PAT-101', 'USR-002', 'Urgent', 'Hematology',
        'Complete Blood Count with Automated Differential', 'Whole Blood (K2-EDTA)', 'BC-99120482-EDTA',
        'Verified', 'Dr. Alistair Finch, MD, FCAP (Chief Pathologist)', '2026-09-08 18:00:00+00',
        'CBC parameters within expected reference ranges for age and sex. Platelet count adequate for anticoagulation protocol.',
        '{
            "attached": true,
            "fileName": "Certified_Lab_Report_LAB-902.pdf",
            "fileSize": "980 KB",
            "uploadedAt": "2026-09-08 18:05",
            "uploadedBy": "Dr. Alistair Finch, MD, FCAP",
            "hash": "sha256-a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef",
            "verified": true,
            "title": "Complete Blood Count & Differential Report",
            "labName": "MediCore Central Pathology & Clinical Diagnostic Laboratory",
            "cliaNumber": "CLIA #14D0982314 | CAP Accredited #7182901",
            "sampleId": "SMP-882195-EDTA",
            "collectionTime": "2026-09-08 16:15",
            "receivedTime": "2026-09-08 16:35",
            "reportedTime": "2026-09-08 18:00",
            "orderingPhysician": "Dr. Sarah Jenkins, MD (Cardiology)",
            "technician": "Alex Morgan, MLS(ASCP)cm",
            "pathologist": "Dr. Alistair Finch, MD, FCAP",
            "clinicalNotes": "Baseline hematological profile prior to dual antiplatelet therapy initiation.",
            "pages": 1
        }'::jsonb
    ),
    (
        'LAB-903', 'LAB-2026-00414', 'PAT-101', 'USR-002', 'Routine', 'Clinical Chemistry',
        'Comprehensive Metabolic Panel (CMP-14)', 'Venous Blood (SST Serum)', 'BC-99120483-SST',
        'Processing', NULL, NULL,
        'Specimen currently spinning on auto-analyzer centrifuge.',
        NULL
    )
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    verified_by = EXCLUDED.verified_by,
    verified_at = EXCLUDED.verified_at,
    pdf_report = EXCLUDED.pdf_report;

-- Lab order parameters
INSERT INTO lab_order_parameters (lab_order_id, name, value, unit, ref_range, flag)
VALUES
    ('LAB-901', 'High-Sensitivity Troponin I (hs-cTnI)', '1.42', 'ng/mL', '0.00 - 0.04', 'Critical High'),
    ('LAB-901', 'Creatine Kinase-MB (CK-MB)', '18.6', 'ng/mL', '0.0 - 5.0', 'High'),
    ('LAB-901', 'Myoglobin', '92.4', 'ng/mL', '25.0 - 72.0', 'High'),
    ('LAB-902', 'White Blood Cell Count (WBC)', '8.4', 'K/uL', '4.5 - 11.0', 'Normal'),
    ('LAB-902', 'Red Blood Cell Count (RBC)', '4.82', 'M/uL', '4.30 - 5.90', 'Normal'),
    ('LAB-902', 'Hemoglobin (Hgb)', '14.8', 'g/dL', '13.5 - 17.5', 'Normal'),
    ('LAB-902', 'Hematocrit (Hct)', '43.6', '%', '41.0 - 50.0', 'Normal'),
    ('LAB-902', 'Platelet Count', '248', 'K/uL', '150 - 450', 'Normal');

-- 8. RADIOLOGY ORDERS
INSERT INTO radiology_orders (
    id, request_number, patient_id, ordered_by_id, priority, modality,
    study_code, study_name, clinical_indication, status, dicom_series,
    dicom_images, radiologist, reported_at, findings, impression, pdf_report
)
VALUES
    (
        'RAD-801', 'RAD-2026-00301', 'PAT-101', 'USR-002', 'STAT', 'X-Ray',
        'XR-CHEST-PA-LAT', 'Chest 2-Views (PA and Lateral)',
        'Acute chest pressure radiating to left arm. Evaluate cardiomegaly, pulmonary edema, aortic contour, and pneumothorax.',
        'Verified', 1, 8, 'Dr. Marcus Reynolds, MD, FACR', '2026-09-08 17:45:00+00',
        'Lungs are clear bilaterally without focal consolidation, pneumothorax, or pleural effusion. Cardiothoracic ratio is mildly prominent at 0.52, suggesting borderline left ventricular enlargement. Pulmonary vascularity is within normal limits. Osseous structures demonstrate mild degenerative changes in the thoracic spine. Mediastinal contours and hila appear unremarkable.',
        '1. Mild cardiomegaly without overt congestive pulmonary vascular congestion or interstitial edema. 2. No acute focal infiltrates or pneumothorax.',
        '{
            "attached": true,
            "fileName": "Radiology_Report_RAD-801.pdf",
            "fileSize": "2.1 MB",
            "uploadedAt": "2026-09-08 17:50",
            "uploadedBy": "Dr. Marcus Reynolds, MD, FACR",
            "hash": "sha256-4c90e5f29d8a1768b44955b9e07852c502b489a694119d854e7d454655519890",
            "verified": true,
            "title": "Diagnostic Radiology Examination & DICOM Consultation",
            "imagingCenter": "MediCore Advanced Diagnostic Imaging Center — ACR Accredited",
            "pacsUid": "1.2.840.10008.5.1.4.1.1.7.9921408",
            "modality": "Digital Radiography (X-Ray)",
            "bodyPart": "Thorax / Chest (2 Views)",
            "examTime": "2026-09-08 16:55",
            "reportedTime": "2026-09-08 17:45",
            "referringPhysician": "Dr. Sarah Jenkins, MD (Cardiology)",
            "radiologist": "Dr. Marcus Reynolds, MD, FACR",
            "technologist": "David Chen, RT(R)",
            "contrast": "None administered",
            "radiationDose": "0.02 mSv (ALARA Compliant)",
            "pages": 2
        }'::jsonb
    ),
    (
        'RAD-802', 'RAD-2026-00302', 'PAT-101', 'USR-002', 'Urgent', 'MRI',
        'MRI-CARDIAC', 'Cardiac Magnetic Resonance Imaging (CMR) with Myocardial Viability',
        'Subacute post-infarct myocardial viability and left ventricular ejection fraction assessment.',
        'Scheduled', 4, 32, 'Dr. David Miller, MD', NULL,
        'Exam scheduled in Scanner Bay 3. Patient screened negative for ferromagnetic foreign bodies and pacemaker.',
        'Pending examination completion.',
        NULL
    )
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    radiologist = EXCLUDED.radiologist,
    findings = EXCLUDED.findings,
    impression = EXCLUDED.impression,
    pdf_report = EXCLUDED.pdf_report;

-- 9. PRESCRIPTIONS
INSERT INTO prescriptions (
    id, rx_number, patient_id, prescribed_by_id, drug_name, dosage,
    route, frequency, duration, indication, refills, daw, status
)
VALUES
    ('RX-901', 'RX-2026-00192', 'PAT-101', 'USR-002', 'Aspirin (Enteric Coated)', '81 mg', 'Oral (PO)', 'Once Daily (QD)', '30 Days', 'Secondary cardiovascular antiplatelet prophylaxis post-NSTEMI', 3, TRUE, 'Active'),
    ('RX-902', 'RX-2026-00193', 'PAT-101', 'USR-002', 'Atorvastatin Calcium', '80 mg', 'Oral (PO)', 'At Bedtime (QHS)', '30 Days', 'High-intensity statin therapy for acute coronary plaque stabilization', 3, TRUE, 'Active')
ON CONFLICT (id) DO NOTHING;

-- 10. INVOICES
INSERT INTO invoices (
    id, invoice_number, patient_id, bill_date, due_date, status,
    payment_method, total_amount, insurance_covered, patient_payable, paid_amount
)
VALUES
    ('INV-401', 'INV-2026-8801', 'PAT-101', '2026-09-08', '2026-10-08', 'Paid', 'Insurance + Credit Card', 4850.00, 4200.00, 650.00, 650.00),
    ('INV-402', 'INV-2026-8802', 'PAT-102', '2026-09-09', '2026-10-09', 'Pending', 'Insurance Pending', 12450.00, 10500.00, 1950.00, 0.00),
    ('INV-403', 'INV-2026-8803', 'PAT-103', '2026-09-09', '2026-10-09', 'Partially Paid', 'HSA Debit', 8900.00, 7200.00, 1700.00, 700.00)
ON CONFLICT (id) DO NOTHING;

-- Invoice items
INSERT INTO invoice_items (invoice_id, service_name, category, quantity, unit_price, total_price)
VALUES
    ('INV-401', 'Emergency Department Level 5 Consultation', 'Emergency', 1, 1500.00, 1500.00),
    ('INV-401', 'High-Sensitivity Cardiac Troponin I Panel (STAT)', 'Laboratory', 1, 450.00, 450.00),
    ('INV-401', 'Digital Chest Radiography (PA & Lateral)', 'Radiology', 1, 650.00, 650.00),
    ('INV-401', 'Cardiology Telemetry Inpatient Bed (1 Night)', 'Ward', 1, 2250.00, 2250.00);

-- 11. AUDIT LOGS
INSERT INTO audit_logs (id, action, details, status, ip_address, patient_name)
VALUES
    ('AUD-501', 'User Login', 'Dr. Sarah Jenkins logged in to Cardiology workstation', 'Success', '192.168.1.42', NULL),
    ('AUD-502', 'Diagnostic Result Certified', 'Certified hs-cTnI Troponin for James Wilson (LAB-901)', 'Critical', '192.168.1.18', 'James Wilson'),
    ('AUD-503', 'Radiology Study Published', 'Published Chest 2-Views XR report with attached PDF (RAD-801)', 'Success', '192.168.1.25', 'James Wilson'),
    ('AUD-504', 'Bed Allocation', 'Admitted James Wilson to Cardiology Telemetry Bed C-104', 'Success', '192.168.1.55', 'James Wilson'),
    ('AUD-505', 'Payment Processed', 'Processed copay payment of $650.00 for INV-2026-8801', 'Success', '192.168.1.60', 'James Wilson')
ON CONFLICT (id) DO NOTHING;

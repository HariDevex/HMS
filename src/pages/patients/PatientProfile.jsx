import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/permissions';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import Field, { Input, Select, Textarea } from '../../components/ui/Field';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import {
  User,
  FlaskConical,
  Scan,
  Pill,
  BedDouble,
  ReceiptText,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Stethoscope,
  Activity,
  Plus,
  Printer,
  AlertOctagon,
  Sparkles,
  Eye,
  ZoomIn,
  ZoomOut,
  SunMedium,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import PdfViewerModal from '../../components/ui/PdfViewerModal';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const vitalsTrendData = [
  { time: '08:00', systolic: 148, diastolic: 92, hr: 90, spo2: 95 },
  { time: '12:00', systolic: 142, diastolic: 88, hr: 84, spo2: 97 },
  { time: '16:00', systolic: 136, diastolic: 84, hr: 80, spo2: 98 },
  { time: '20:00', systolic: 130, diastolic: 82, hr: 76, spo2: 98 },
  { time: '08:00 (Today)', systolic: 128, diastolic: 80, hr: 74, spo2: 99 },
];

// Smart Clinical Diagnostic & Scan Suggestion Engine based on patient diagnosis and condition
function getClinicalSuggestions(patient) {
  if (!patient) return null;
  const text = `${patient.diagnosis || ''} ${patient.chiefComplaint || ''} ${patient.department || ''}`.toLowerCase();

  if (
    text.includes('coronary') ||
    text.includes('chest pain') ||
    text.includes('cardiac') ||
    text.includes('nstemi') ||
    text.includes('infarction')
  ) {
    return {
      condition: 'Acute Coronary Syndrome & Chest Pain Protocol',
      badge: 'Cardiac Emergency Pathway',
      scans: [
        {
          studyName: 'Echocardiogram Transthoracic (TTE)',
          modality: 'Ultrasound',
          priority: 'Urgent',
          reason: 'Assess left ventricular ejection fraction (LVEF) and regional wall motion abnormalities.',
          guideline: 'ACC/AHA Class I Guideline',
        },
        {
          studyName: 'Coronary CT Angiography',
          modality: 'CT',
          priority: 'Urgent',
          reason: 'Non-invasive visualization of coronary lumen stenosis and atherosclerotic plaque morphology.',
          guideline: 'NICE CG95 Accelerated Protocol',
        },
        {
          studyName: 'Chest X-Ray PA & Lateral',
          modality: 'X-Ray',
          priority: 'Routine',
          reason: 'Evaluate for cardiomegaly, pulmonary vascular congestion, or widened mediastinum.',
          guideline: 'Standard Admission Protocol',
        },
      ],
      labs: [
        {
          testName: 'High-Sensitivity Cardiac Troponin I (hs-cTnI)',
          category: 'Cardiology / Biomarkers',
          priority: 'STAT',
          specimen: 'Venous Blood',
          reason: 'Serial cardiac biomarker rule-in/rule-out protocol at 0h, 1h, and 3h intervals.',
          guideline: 'ESC 0h/1h Accelerated Pathway',
        },
        {
          testName: 'Lipid Panel (Total, HDL, LDL, Triglycerides)',
          category: 'Biochemistry',
          priority: 'Routine',
          specimen: 'Venous Blood',
          reason: 'Establish baseline lipid profile and monitor high-intensity statin titration.',
          guideline: 'AHA ASCVD Risk Guidance',
        },
        {
          testName: 'Coagulation Panel (PT/INR, aPTT)',
          category: 'Coagulation',
          priority: 'Urgent',
          specimen: 'Venous Blood',
          reason: 'Verify baseline hemostatic parameters prior to anticoagulation and antiplatelet therapy.',
          guideline: 'Anticoagulation Safety Standard',
        },
      ],
    };
  }

  if (
    text.includes('pneumonia') ||
    text.includes('copd') ||
    text.includes('breath') ||
    text.includes('cough') ||
    text.includes('pulmon')
  ) {
    return {
      condition: 'Community-Acquired Pneumonia & Respiratory Protocol',
      badge: 'Pulmonary Care Pathway',
      scans: [
        {
          studyName: 'Chest X-Ray PA & Lateral',
          modality: 'X-Ray',
          priority: 'STAT',
          reason: 'Evaluate for lobar consolidation, air bronchograms, and parapneumonic pleural effusions.',
          guideline: 'IDSA/ATS Community-Acquired Guidelines',
        },
        {
          studyName: 'CT Pulmonary Angiogram (PE Protocol)',
          modality: 'CT',
          priority: 'Urgent',
          reason: 'Rule out acute pulmonary embolism in dyspneic patient with elevated alveolar gradient.',
          guideline: 'Wells & Geneva Diagnostic Protocol',
        },
        {
          studyName: 'CT Chest / Abdomen / Pelvis with IV Contrast',
          modality: 'CT',
          priority: 'Routine',
          reason: 'Detailed volumetric assessment of lung parenchyma, cavitation, and bronchial wall thickening.',
          guideline: 'GOLD Guidelines',
        },
      ],
      labs: [
        {
          testName: 'Arterial Blood Gas (ABG)',
          category: 'Biochemistry',
          priority: 'STAT',
          specimen: 'Arterial Blood',
          reason: 'Evaluate acute hypoxemia (PaO2), hypercapnia (PaCO2), and respiratory acidosis.',
          guideline: 'Critical Care Ventilation Standard',
        },
        {
          testName: 'Complete Blood Count (CBC with Diff)',
          category: 'Hematology',
          priority: 'Urgent',
          specimen: 'Venous Blood',
          reason: 'Assess leukocytosis, neutrophilic bandemia, and infectious systemic inflammatory response.',
          guideline: 'Surviving Sepsis Campaign',
        },
        {
          testName: 'Blood Cultures x2 (Aerobic & Anaerobic)',
          category: 'Microbiology',
          priority: 'STAT',
          specimen: 'Venous Blood',
          reason: 'Identify circulating bacteremia prior to administering broad-spectrum intravenous antimicrobial coverage.',
          guideline: 'IDSA Antimicrobial Stewardship',
        },
      ],
    };
  }

  if (
    text.includes('abdomen') ||
    text.includes('appendicitis') ||
    text.includes('pain') ||
    text.includes('gastro') ||
    text.includes('cholecyst')
  ) {
    return {
      condition: 'Acute Abdomen & Surgical Pathway',
      badge: 'Surgical Triage Protocol',
      scans: [
        {
          studyName: 'CT Chest / Abdomen / Pelvis with IV Contrast',
          modality: 'CT',
          priority: 'STAT',
          reason: 'Rule out acute appendicitis, bowel perforation, mesenteric ischemia, or intra-abdominal fluid collection.',
          guideline: 'ACR Appropriateness Criteria',
        },
        {
          studyName: 'Ultrasound Abdomen Complete',
          modality: 'Ultrasound',
          priority: 'Urgent',
          reason: 'Inspect gallbladder wall thickening, pericholecystic fluid, and biliary ductal dilatation.',
          guideline: 'Tokyo Guidelines for Cholecystitis',
        },
      ],
      labs: [
        {
          testName: 'Comprehensive Metabolic Panel (CMP-14)',
          category: 'Biochemistry',
          priority: 'STAT',
          specimen: 'Venous Blood',
          reason: 'Pre-operative assessment of hepatic enzymes, renal filtration (eGFR), and electrolyte balance.',
          guideline: 'Standard Surgical Pre-Op Protocol',
        },
        {
          testName: 'Complete Blood Count (CBC with Diff)',
          category: 'Hematology',
          priority: 'STAT',
          specimen: 'Venous Blood',
          reason: 'Check for acute left-shift leukocytosis reflecting progressive surgical pathology.',
          guideline: 'Alvarado Diagnostic Score',
        },
      ],
    };
  }

  // General Inpatient Diagnostic Protocol
  return {
    condition: 'General Inpatient Diagnostic Pathway',
    badge: 'Clinical Care Protocol',
    scans: [
      {
        studyName: 'Chest X-Ray PA & Lateral',
        modality: 'X-Ray',
        priority: 'Routine',
        reason: 'Standard baseline screening of cardiopulmonary silhouette and thoracic architecture.',
        guideline: 'Baseline Admission Protocol',
      },
      {
        studyName: 'Ultrasound Abdomen Complete',
        modality: 'Ultrasound',
        priority: 'Routine',
        reason: 'Non-invasive screening of visceral abdominal organs and renal parenchyma.',
        guideline: 'Diagnostic Surveillance',
      },
    ],
    labs: [
      {
        testName: 'Complete Blood Count (CBC with Diff)',
        category: 'Hematology',
        priority: 'Routine',
        specimen: 'Venous Blood',
        reason: 'Comprehensive hematologic baseline of erythrocytes, leukocytes, and thrombocytes.',
        guideline: 'Standard Admission Battery',
      },
      {
        testName: 'Comprehensive Metabolic Panel (CMP-14)',
        category: 'Biochemistry',
        priority: 'Routine',
        specimen: 'Venous Blood',
        reason: '14-analyte metabolic panel evaluating renal status, hepatic transaminases, and electrolytes.',
        guideline: 'Standard Admission Battery',
      },
    ],
  };
}

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    patients,
    selectedPatient,
    setSelectedPatientId,
    currentRole,
    clinicalTimeline,
    medications,
    labOrders,
    radiologyOrders,
    invoices,
    orderLabTest,
    orderRadiologyScan,
    prescribeMedication,
    recordVitals,
    addToast,
  } = useApp();

  const patient = patients.find((p) => p.id === id) || selectedPatient;
  const [activeTab, setActiveTab] = useState('Overview');

  // Modals for Direct Patient Clinical Actions
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isPrescribeModalOpen, setIsPrescribeModalOpen] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);

  // Modals for Detailed Report / Imaging Viewers
  const [viewingLab, setViewingLab] = useState(null);
  const [viewingScan, setViewingScan] = useState(null);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [pdfModalReport, setPdfModalReport] = useState(null);
  const [pdfModalType, setPdfModalType] = useState('lab'); // 'lab' | 'radiology'

  // Interactive DICOM Viewer Controls State
  const [zoomLevel, setZoomLevel] = useState(100);
  const [contrastInverted, setContrastInverted] = useState(false);
  const [windowPreset, setWindowPreset] = useState('lung');
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [activeSlice, setActiveSlice] = useState(1);

  // Lab Form State
  const [labTestName, setLabTestName] = useState('Complete Blood Count (CBC with Diff)');
  const [labCategory, setLabCategory] = useState('Hematology');
  const [labPriority, setLabPriority] = useState('Routine');
  const [labSpecimen, setLabSpecimen] = useState('Venous Blood');
  const [labNotes, setLabNotes] = useState('');

  // Scan Form State
  const [scanModality, setScanModality] = useState('X-Ray');
  const [scanStudyName, setScanStudyName] = useState('Chest X-Ray PA & Lateral');
  const [scanPriority, setScanPriority] = useState('Routine');
  const [scanReason, setScanReason] = useState('');

  // Prescription Form State
  const [drugName, setDrugName] = useState('Atorvastatin');
  const [drugDose, setDrugDose] = useState('80 mg');
  const [drugRoute, setDrugRoute] = useState('Oral');
  const [drugFrequency, setDrugFrequency] = useState('Once Daily at Bedtime');
  const [drugDuration, setDrugDuration] = useState('30 Days');
  const [drugIndication, setDrugIndication] = useState('Hyperlipidemia / Cardiovascular risk reduction');
  const [allergyOverride, setAllergyOverride] = useState(false);

  // Vitals Form State
  const [systolic, setSystolic] = useState(patient?.vitals?.systolic || 128);
  const [diastolic, setDiastolic] = useState(patient?.vitals?.diastolic || 80);
  const [heartRate, setHeartRate] = useState(patient?.vitals?.heartRate || 74);
  const [temp, setTemp] = useState(patient?.vitals?.temperature || 98.6);
  const [respRate, setRespRate] = useState(patient?.vitals?.respiratoryRate || 16);
  const [spo2, setSpo2] = useState(patient?.vitals?.oxygenSaturation || 98);
  const [painLevel, setPainLevel] = useState(patient?.vitals?.painLevel || 2);

  // Patient scoped clinical data
  const patientLabs = useMemo(() => labOrders.filter((l) => l.patientId === patient.id), [labOrders, patient.id]);
  const patientScans = useMemo(() => radiologyOrders.filter((r) => r.patientId === patient.id), [radiologyOrders, patient.id]);
  const patientMeds = useMemo(() => medications.filter((m) => m.patientId === patient.id), [medications, patient.id]);
  const patientInvoices = useMemo(() => invoices.filter((i) => i.patientId === patient.id), [invoices, patient.id]);
  const patientTimeline = useMemo(() => clinicalTimeline.filter((t) => !t.patientId || t.patientId === patient.id), [clinicalTimeline, patient.id]);

  // Clinical Diagnostic Suggestions
  const suggestions = useMemo(() => getClinicalSuggestions(patient), [patient]);

  // Real-Time Allergy Warning Check
  const hasAllergyWarning = useMemo(() => {
    return patient.allergies.some((a) => {
      const allergen = a.allergen.toLowerCase();
      const drug = drugName.toLowerCase();
      return (
        (allergen.includes('penicillin') &&
          (drug.includes('penicillin') || drug.includes('amox') || drug.includes('ampicillin') || drug.includes('augmentin'))) ||
        (allergen.includes('sulfa') && (drug.includes('sulfa') || drug.includes('bactrim'))) ||
        (allergen.includes('aspirin') && (drug.includes('aspirin') || drug.includes('nsaid') || drug.includes('ibuprofen'))) ||
        drug.includes(allergen) ||
        allergen.includes(drug)
      );
    });
  }, [patient.allergies, drugName]);

  const handleOrderLab = () => {
    orderLabTest({
      patientId: patient.id,
      patientName: patient.name,
      patientMrn: patient.mrn,
      testName: labTestName,
      category: labCategory,
      priority: labPriority,
      specimenType: labSpecimen,
      notes: labNotes || 'Stat clinical workup from patient profile',
    });
    setIsLabModalOpen(false);
    setActiveTab('Laboratory');
  };

  const handleOrderScan = () => {
    orderRadiologyScan({
      patientId: patient.id,
      patientName: patient.name,
      patientMrn: patient.mrn,
      modality: scanModality,
      studyName: scanStudyName,
      priority: scanPriority,
      clinicalIndication: scanReason || 'Clinical diagnostic imaging requested from patient profile',
    });
    setIsScanModalOpen(false);
    setActiveTab('Radiology');
  };

  const handleQuickOrderScan = (s) => {
    setScanModality(s.modality);
    setScanStudyName(s.studyName);
    setScanPriority(s.priority);
    setScanReason(s.reason);
    setIsScanModalOpen(true);
  };

  const handleQuickOrderLab = (l) => {
    setLabTestName(l.testName);
    setLabCategory(l.category);
    setLabPriority(l.priority);
    setLabSpecimen(l.specimen);
    setLabNotes(l.reason);
    setIsLabModalOpen(true);
  };

  const handlePrescribe = () => {
    prescribeMedication({
      patientId: patient.id,
      patientName: patient.name,
      name: drugName,
      dose: drugDose,
      route: drugRoute,
      frequency: drugFrequency,
      duration: drugDuration,
      indication: drugIndication,
    });
    setIsPrescribeModalOpen(false);
    setActiveTab('Medications');
    setAllergyOverride(false);
  };

  const handleSaveVitals = () => {
    recordVitals(patient.id, {
      bp: `${systolic}/${diastolic}`,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      heartRate: Number(heartRate),
      temperature: Number(temp),
      tempUnit: '°F',
      respiratoryRate: Number(respRate),
      oxygenSaturation: Number(spo2),
      painLevel: Number(painLevel),
      weight: patient.vitals?.weight || '72 kg',
      height: patient.vitals?.height || '175 cm',
      bmi: patient.vitals?.bmi || '23.5',
    });
    setIsVitalsModalOpen(false);
    setActiveTab('Vitals');
  };

  // Role-specific visible tabs according to Master Prompt Section 14
  const getAllTabs = () => {
    const tabs = [
      { id: 'Overview', label: 'Overview', icon: User },
      { id: 'Timeline', label: 'Clinical Timeline', icon: Clock },
      { id: 'Vitals', label: 'Vital Signs', icon: Activity },
      { id: 'Consultations', label: 'Consultations', icon: Stethoscope },
      { id: 'Medications', label: `Medications & MAR (${patientMeds.length})`, icon: Pill },
      { id: 'Laboratory', label: `Laboratory (${patientLabs.length})`, icon: FlaskConical },
      { id: 'Radiology', label: `Radiology (${patientScans.length})`, icon: Scan },
      { id: 'Admissions', label: 'Ward & Beds', icon: BedDouble },
      { id: 'Billing', label: `Billing & Invoices (${patientInvoices.length})`, icon: ReceiptText },
    ];

    if (currentRole === 'lab') {
      return tabs.filter((t) => ['Overview', 'Timeline', 'Laboratory'].includes(t.id));
    }
    if (currentRole === 'radiology') {
      return tabs.filter((t) => ['Overview', 'Timeline', 'Radiology'].includes(t.id));
    }
    if (currentRole === 'reception') {
      return tabs.filter((t) => ['Overview', 'Admissions', 'Billing'].includes(t.id));
    }
    return tabs;
  };

  return (
    <div className="space-y-6">
      {/* 1. Patient Header required by Master Prompt Section 14 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
              Back
            </Button>
            <div className="w-14 h-14 rounded-2xl bg-primary text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{patient.name}</h2>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {patient.mrn}
                </span>
                <Badge variant={patient.status === 'Admitted' ? 'error' : 'neutral'}>
                  {patient.status}
                </Badge>
                {patient.bed && (
                  <Badge variant="purple">Bed: {patient.bed} ({patient.ward})</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                <span><strong>{patient.age}</strong> yrs old</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span>Blood Group: <strong className="text-slate-800 font-bold">{patient.bloodGroup}</strong></span>
                <span>•</span>
                <span>Attending: <strong>{patient.assignedDoctor}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Patient Switcher & Clinical Action Hub */}
          <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
            {/* Quick Switch Patient Dropdown */}
            <div className="mr-1">
              <select
                aria-label="Switch Active Patient"
                value={patient.id}
                onChange={(e) => navigate(`/patients/${e.target.value}`)}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 font-medium hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    Chart: {p.name} ({p.mrn})
                  </option>
                ))}
              </select>
            </div>

            {can(currentRole, 'canOrderLab') && (
              <Button
                variant="primary"
                size="sm"
                icon={FlaskConical}
                onClick={() => setIsLabModalOpen(true)}
              >
                Order Lab
              </Button>
            )}

            {can(currentRole, 'canOrderRadiology') && (
              <Button
                variant="secondary"
                size="sm"
                icon={Scan}
                onClick={() => setIsScanModalOpen(true)}
              >
                Order Scan
              </Button>
            )}

            {can(currentRole, 'canPrescribeMedication') && (
              <Button
                variant="secondary"
                size="sm"
                icon={Pill}
                onClick={() => setIsPrescribeModalOpen(true)}
              >
                Prescribe
              </Button>
            )}

            {currentRole === 'doctor' && (
              <Button
                variant="outline"
                size="sm"
                icon={Stethoscope}
                onClick={() => {
                  setSelectedPatientId(patient.id);
                  navigate('/consultation');
                }}
              >
                Encounter
              </Button>
            )}

            {can(currentRole, 'canRecordVitals') && (
              <Button
                variant="primary"
                size="sm"
                icon={Activity}
                onClick={() => setIsVitalsModalOpen(true)}
              >
                Record Vitals
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              icon={Printer}
              onClick={() => {
                addToast({
                  title: 'ID Wristband Printed',
                  message: `Zebra thermal wristband barcode queued for ${patient.name}.`,
                  type: 'info',
                });
              }}
            >
              Wristband
            </Button>
          </div>
        </div>

        {/* Critical Alerts & Allergies Banner */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Allergies:</span>
            {patient.allergies.length === 0 ? (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                No Known Drug Allergies (NKDA)
              </span>
            ) : (
              patient.allergies.map((a, idx) => (
                <span
                  key={idx}
                  className="font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" /> {a.allergen} ({a.severity})
                </span>
              ))
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> {patient.phone}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> {patient.insurance.provider}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <Tabs tabs={getAllTabs()} activeTab={activeTab} onChange={setActiveTab} />

      {/* 3. Tab Contents */}

      {/* Tab: Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Smart Clinical Diagnostic & Scan Suggestions Assistant */}
          {suggestions && (
            <Card className="p-5 border-blue-200/80 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-sm tracking-tight">
                        Diagnostic & Scan Suggestions Assistant
                      </h3>
                      <Badge variant="purple">{suggestions.badge}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Targeted clinical orders matched to working diagnosis: <strong className="text-slate-700">{patient.diagnosis}</strong>
                    </p>
                  </div>
                </div>

                {(can(currentRole, 'canOrderRadiology') || can(currentRole, 'canOrderLab')) && (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] text-slate-400 font-medium hidden md:inline">1-Click Fast Ordering:</span>
                    {can(currentRole, 'canOrderRadiology') && (
                      <Button size="sm" variant="outline" icon={Scan} onClick={() => setIsScanModalOpen(true)}>
                        Custom Scan
                      </Button>
                    )}
                    {can(currentRole, 'canOrderLab') && (
                      <Button size="sm" variant="outline" icon={FlaskConical} onClick={() => setIsLabModalOpen(true)}>
                        Custom Lab
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                {/* Recommended Scans */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Scan className="w-3.5 h-3.5 text-purple-600" /> Recommended Imaging Studies ({suggestions.scans.length})
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Radiology PACS</span>
                  </div>

                  <div className="space-y-2">
                    {suggestions.scans.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900">{s.studyName}</span>
                            <Badge size="sm" variant="purple">{s.modality}</Badge>
                            <Badge size="sm" dot variant={s.priority === 'STAT' ? 'critical' : 'warning'}>
                              {s.priority}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{s.reason}</p>
                          <span className="text-[10px] text-purple-700 font-medium block">
                            Protocol: {s.guideline}
                          </span>
                        </div>

                        {can(currentRole, 'canOrderRadiology') && (
                          <Button
                            size="sm"
                            variant="secondary"
                            icon={Scan}
                            onClick={() => handleQuickOrderScan(s)}
                            className="shrink-0 self-end sm:self-center"
                          >
                            Order Scan
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Diagnostic Labs */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-blue-600" /> Recommended Pathology Panels ({suggestions.labs.length})
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Clinical Pathology</span>
                  </div>

                  <div className="space-y-2">
                    {suggestions.labs.map((l, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900">{l.testName}</span>
                            <Badge size="sm" variant="info">{l.category}</Badge>
                            <Badge size="sm" dot variant={l.priority === 'STAT' ? 'critical' : 'warning'}>
                              {l.priority}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{l.reason}</p>
                          <span className="text-[10px] text-blue-700 font-medium block">
                            Specimen: {l.specimen} • {l.guideline}
                          </span>
                        </div>

                        {can(currentRole, 'canOrderLab') && (
                          <Button
                            size="sm"
                            variant="primary"
                            icon={FlaskConical}
                            onClick={() => handleQuickOrderLab(l)}
                            className="shrink-0 self-end sm:self-center"
                          >
                            Order Lab
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-5">
                <CardHeader title="Clinical Condition & Diagnosis" />
                <CardBody className="space-y-3 pt-3 text-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chief Presenting Complaint</span>
                    <p className="text-slate-800 font-medium mt-0.5">{patient.chiefComplaint}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Primary Working Diagnosis</span>
                    <p className="text-slate-900 font-bold mt-0.5">{patient.diagnosis}</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="p-5">
                <CardHeader
                  title="Current Bedside Vitals"
                  subtitle={`Last recorded: ${patient.vitals?.lastRecorded || 'Today 08:00'}`}
                  action={
                    can(currentRole, 'canRecordVitals') ? (
                      <Button size="sm" variant="outline" icon={Activity} onClick={() => setIsVitalsModalOpen(true)}>
                        Update
                      </Button>
                    ) : null
                  }
                />
                <CardBody className="pt-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-400 font-medium block">Blood Pressure</span>
                      <span className="text-lg font-bold font-mono text-slate-900">{patient.vitals?.bp || '128/80'}</span>
                      <span className="text-[10px] text-slate-500 block">mmHg</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-400 font-medium block">Heart Rate</span>
                      <span className="text-lg font-bold font-mono text-slate-900">{patient.vitals?.heartRate || '74'}</span>
                      <span className="text-[10px] text-slate-500 block">bpm</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-400 font-medium block">SpO2 (Pulse Ox)</span>
                      <span className="text-lg font-bold font-mono text-slate-900">{patient.vitals?.oxygenSaturation || '98'}%</span>
                      <span className="text-[10px] text-emerald-600 block font-semibold">Normal</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-400 font-medium block">Temperature</span>
                      <span className="text-lg font-bold font-mono text-slate-900">{patient.vitals?.temperature || '98.6'}</span>
                      <span className="text-[10px] text-slate-500 block">°F Oral</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar Demographics & Emergency Contacts */}
            <div className="space-y-6">
              <Card className="p-5">
                <CardHeader title="Patient Demographics" />
                <CardBody className="space-y-3 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Date of Birth</span>
                    <span className="font-semibold text-slate-800">{patient.dob} ({patient.age} years)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone Number</span>
                    <span className="font-semibold text-slate-800">{patient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email Address</span>
                    <span className="font-semibold text-slate-800">{patient.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Residential Address</span>
                    <span className="font-semibold text-slate-800">{patient.address}</span>
                  </div>
                </CardBody>
              </Card>

              <Card className="p-5">
                <CardHeader title="Emergency Contact" />
                <CardBody className="space-y-2 pt-3 text-xs">
                  <p><strong>Name:</strong> {patient.emergencyContact.name}</p>
                  <p><strong>Relation:</strong> {patient.emergencyContact.relation}</p>
                  <p><strong>Phone:</strong> {patient.emergencyContact.phone}</p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Interactive Clinical Timeline (Master Prompt Section 15) */}
      {activeTab === 'Timeline' && (
        <Card className="p-6">
          <CardHeader
            title="Chronological Clinical Event Stream"
            subtitle={`Immutable audit trail of all admissions, consultations, orders, lab verifications, and medication events for ${patient.name}`}
          />
          <CardBody className="pt-6">
            {patientTimeline.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">No clinical timeline events recorded yet</p>
                <p className="text-xs text-slate-500 mt-1">Actions such as ordered labs, scans, prescribed medications, and recorded vitals will populate here.</p>
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-blue-200 space-y-8">
                {patientTimeline.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-primary ring-4 ring-blue-50" />

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{item.title}</span>
                          <Badge size="sm" variant={item.badgeVariant || 'primary'}>
                            {item.action}
                          </Badge>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {item.date} at {item.time}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Department: <strong>{item.department}</strong></span>
                        <span>Recorded by <strong>{item.user}</strong> ({item.role})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Tab: Vitals Trend Charts */}
      {activeTab === 'Vitals' && (
        <div className="space-y-6">
          <Card className="p-5">
            <CardHeader
              title="Hemodynamic & Vital Trends"
              subtitle="Continuous 24-hour vital signs telemetry"
              action={
                can(currentRole, 'canRecordVitals') ? (
                  <Button size="sm" icon={Plus} onClick={() => setIsVitalsModalOpen(true)}>
                    Record Vitals
                  </Button>
                ) : null
              }
            />
            <CardBody className="pt-4">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="systolic" name="Systolic BP (mmHg)" stroke="#DC2626" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="diastolic" name="Diastolic BP (mmHg)" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="hr" name="Heart Rate (bpm)" stroke="#16A34A" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Current Vitals Snapshot Card */}
          <Card className="p-5">
            <CardHeader title="Latest Telemetry Parameters" subtitle="Documented bedside observation" />
            <CardBody className="pt-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium block">Blood Pressure</span>
                  <span className="text-base font-bold font-mono text-slate-900">{patient.vitals?.bp}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium block">Heart Rate</span>
                  <span className="text-base font-bold font-mono text-slate-900">{patient.vitals?.heartRate} bpm</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium block">SpO2</span>
                  <span className="text-base font-bold font-mono text-emerald-600">{patient.vitals?.oxygenSaturation}%</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium block">Temperature</span>
                  <span className="text-base font-bold font-mono text-slate-900">{patient.vitals?.temperature}°F</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium block">Resp Rate</span>
                  <span className="text-base font-bold font-mono text-slate-900">{patient.vitals?.respiratoryRate}/min</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium block">Pain Score</span>
                  <span className="text-base font-bold font-mono text-amber-600">{patient.vitals?.painLevel}/10</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium block">BMI</span>
                  <span className="text-base font-bold font-mono text-slate-900">{patient.vitals?.bmi || '23.5'}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Tab: Consultations */}
      {activeTab === 'Consultations' && (
        <Card className="p-5">
          <CardHeader
            title="Clinical Consultations & Encounter History"
            subtitle="Physician examination notes, clinical assessments, and encounter documentation"
            action={
              <Button
                size="sm"
                icon={Stethoscope}
                onClick={() => {
                  setSelectedPatientId(patient.id);
                  navigate('/consultation');
                }}
              >
                Start New Encounter
              </Button>
            }
          />
          <CardBody className="space-y-4 pt-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Inpatient Progress Note & Evaluation</h4>
                  <span className="text-xs text-slate-400 font-mono">Attending: {patient.assignedDoctor} • Department of {patient.department}</span>
                </div>
                <VerifiedBadge
                  title="Signed & Closed"
                  verifiedBy={patient.assignedDoctor}
                  verifiedAt={patient.admissionDate || '2026-09-08 09:30 AM'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-slate-200 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="font-bold text-slate-800 uppercase text-[10px]">Subjective / Chief Complaint:</span>
                    <p className="text-slate-600 mt-0.5">{patient.chiefComplaint}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 uppercase text-[10px]">Objective Findings:</span>
                    <p className="text-slate-600 mt-0.5">
                      Vitals stable. Hemodynamics monitored. BP {patient.vitals?.bp}, HR {patient.vitals?.heartRate} bpm, SpO2 {patient.vitals?.oxygenSaturation}%. Lungs evaluated, regular heart rhythm.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-bold text-slate-800 uppercase text-[10px]">Assessment / Working Diagnosis:</span>
                    <p className="text-slate-900 font-bold mt-0.5">{patient.diagnosis}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 uppercase text-[10px]">Clinical Plan & Management:</span>
                    <p className="text-slate-600 mt-0.5">
                      Maintain continuous cardiac telemetry. Order serial diagnostic tests. Continue targeted pharmacotherapy and reassess during morning rounds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab: Laboratory */}
      {activeTab === 'Laboratory' && (
        <Card className="p-5">
          <CardHeader
            title={`Laboratory Diagnostic Orders (${patientLabs.length})`}
            subtitle="Verified pathology panels, reference ranges, and STAT results"
            action={
              can(currentRole, 'canOrderLab') ? (
                <Button size="sm" icon={Plus} onClick={() => setIsLabModalOpen(true)}>
                  Order Lab Test
                </Button>
              ) : null
            }
          />
          <CardBody className="space-y-4 pt-3">
            {patientLabs.length === 0 ? (
              <div className="text-center py-10">
                <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No laboratory tests ordered yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Request a diagnostic panel or STAT pathology order for this patient.</p>
                {can(currentRole, 'canOrderLab') && (
                  <Button size="sm" icon={Plus} onClick={() => setIsLabModalOpen(true)}>Order First Lab Test</Button>
                )}
              </div>
            ) : (
              patientLabs.map((lab) => (
                <div key={lab.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{lab.testName}</h4>
                        <Badge size="sm" variant="info">{lab.category}</Badge>
                        <Badge size="sm" dot variant={lab.priority === 'STAT' ? 'critical' : 'warning'}>
                          {lab.priority}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {lab.orderNumber} • Ordered by {lab.orderedBy} on {lab.orderDate}
                      </span>
                      {lab.pdfReport && (
                        <div className="mt-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPdfModalReport(lab);
                              setPdfModalType('lab');
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold border border-red-200/80 transition-colors cursor-pointer"
                            title="Click to open popup preview of certified PDF"
                          >
                            <FileText className="w-3.5 h-3.5 text-red-500" />
                            <span>PDF Attached: {lab.pdfReport.fileName} ({lab.pdfReport.fileSize})</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      {lab.status === 'Verified' ? (
                        <VerifiedBadge
                          title="Verified"
                          verifiedBy={lab.verifiedBy}
                          verifiedAt={lab.verifiedAt}
                        />
                      ) : (
                        <Badge variant="warning">{lab.status}</Badge>
                      )}

                      <Button
                        size="sm"
                        variant="secondary"
                        icon={FileText}
                        onClick={() => {
                          setPdfModalReport(lab);
                          setPdfModalType('lab');
                        }}
                        title="Open On-Site Popup PDF Viewer"
                      >
                        📄 View PDF
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        icon={Eye}
                        onClick={() => setViewingLab(lab)}
                      >
                        View Full Report / Print
                      </Button>
                    </div>
                  </div>

                  {lab.parameters && lab.parameters.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden text-xs bg-white">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                          <tr>
                            <th className="p-2">Analyte / Component</th>
                            <th className="p-2">Observed Value</th>
                            <th className="p-2">Reference Interval</th>
                            <th className="p-2">Clinical Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {lab.parameters.map((p, idx) => (
                            <tr key={idx}>
                              <td className="p-2 font-medium text-slate-900">{p.name}</td>
                              <td className="p-2 font-bold font-mono text-slate-800">{p.value} {p.unit}</td>
                              <td className="p-2 text-slate-500 font-mono">{p.refRange}</td>
                              <td className="p-2">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  p.flag.includes('Critical')
                                    ? 'bg-red-100 text-error'
                                    : p.flag.includes('High') || p.flag.includes('Low')
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {p.flag}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardBody>
        </Card>
      )}

      {/* Tab: Radiology */}
      {activeTab === 'Radiology' && (
        <Card className="p-5">
          <CardHeader
            title={`Radiology Imaging Studies (${patientScans.length})`}
            subtitle="Medical imaging findings, PACS DICOM scans, and certified radiologist impressions"
            action={
              can(currentRole, 'canOrderRadiology') ? (
                <Button size="sm" icon={Plus} onClick={() => setIsScanModalOpen(true)}>
                  Request Imaging Scan
                </Button>
              ) : null
            }
          />
          <CardBody className="space-y-4 pt-3">
            {patientScans.length === 0 ? (
              <div className="text-center py-10">
                <Scan className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No radiology scans requested yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Order X-Ray, CT, MRI, Ultrasound, or PET imaging for this patient.</p>
                {can(currentRole, 'canOrderRadiology') && (
                  <Button size="sm" icon={Plus} onClick={() => setIsScanModalOpen(true)}>Request First Scan</Button>
                )}
              </div>
            ) : (
              patientScans.map((scan) => (
                <div key={scan.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{scan.modality} {scan.studyName ? `— ${scan.studyName}` : ''}</h4>
                        <Badge size="sm" variant="purple">{scan.modality}</Badge>
                        <Badge size="sm" dot variant={scan.priority.includes('STAT') ? 'critical' : 'warning'}>
                          {scan.priority}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {scan.requestNumber} • Ordered by {scan.orderedBy} on {scan.orderDate}
                      </span>
                      {scan.pdfReport && (
                        <div className="mt-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPdfModalReport(scan);
                              setPdfModalType('radiology');
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200/80 transition-colors cursor-pointer"
                            title="Click to open popup preview of certified PDF"
                          >
                            <FileText className="w-3.5 h-3.5 text-red-500" />
                            <span>PDF Attached: {scan.pdfReport.fileName} ({scan.pdfReport.fileSize})</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      {scan.status === 'Verified' || scan.status === 'Published' ? (
                        <VerifiedBadge
                          title="Verified Study"
                          verifiedBy={scan.radiologist}
                          verifiedAt={scan.reportedAt}
                        />
                      ) : (
                        <Badge variant="info">{scan.status}</Badge>
                      )}

                      <Button
                        size="sm"
                        variant="secondary"
                        icon={FileText}
                        onClick={() => {
                          setPdfModalReport(scan);
                          setPdfModalType('radiology');
                        }}
                        title="Open On-Site Popup PDF Viewer"
                      >
                        📄 View PDF
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        icon={Scan}
                        onClick={() => {
                          setViewingScan(scan);
                          setZoomLevel(100);
                          setContrastInverted(false);
                          setActiveSlice(1);
                        }}
                      >
                        View Imaging & Report
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <p className="text-slate-600">
                      <strong>Indication:</strong> {scan.clinicalIndication}
                    </p>
                    {scan.findings && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div>
                          <span className="font-bold text-slate-800 uppercase text-[10px]">Findings:</span>
                          <p className="text-slate-600 mt-0.5 whitespace-pre-line">{scan.findings}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 uppercase text-[10px]">Impression:</span>
                          <p className="text-slate-900 font-bold mt-0.5 whitespace-pre-line">{scan.impression}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      )}

      {/* Tab: Medications */}
      {activeTab === 'Medications' && (
        <Card className="p-5">
          <CardHeader
            title={`Active Medications & MAR (${patientMeds.length})`}
            subtitle="Inpatient pharmacy orders, authorized prescriptions, and administration schedule"
            action={
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" icon={FileText} onClick={() => setIsRxModalOpen(true)}>
                  Official Rx Sheet
                </Button>
                {can(currentRole, 'canPrescribeMedication') && (
                  <Button size="sm" icon={Plus} onClick={() => setIsPrescribeModalOpen(true)}>
                    Prescribe Drug
                  </Button>
                )}
              </div>
            }
          />
          <CardBody className="pt-3">
            {patientMeds.length === 0 ? (
              <div className="text-center py-10">
                <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No active medication orders</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Prescribe inpatient medication with automated allergy checking.</p>
                {can(currentRole, 'canPrescribeMedication') && (
                  <Button size="sm" icon={Plus} onClick={() => setIsPrescribeModalOpen(true)}>Write Prescription</Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {patientMeds.map((med) => (
                  <div key={med.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{med.name} {med.dose}</span>
                        <Badge size="sm" variant="neutral">{med.route}</Badge>
                      </div>
                      <span className="text-slate-500 block mt-0.5">Schedule: <strong>{med.frequency}</strong> • Duration: {med.duration || '30 Days'}</span>
                      <span className="text-slate-400 block mt-0.5">Indication: {med.indication}</span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Badge variant={med.scheduleStatus === 'Administered' ? 'success' : 'warning'}>
                        {med.scheduleStatus || 'Due'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={RotateCcw}
                        onClick={() => {
                          addToast({
                            title: 'Refill Re-ordered',
                            message: `Pharmacy refill authorized for ${med.name} (${med.dose}).`,
                            type: 'success',
                          });
                        }}
                      >
                        Refill
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Tab: Admissions & Ward */}
      {activeTab === 'Admissions' && (
        <Card className="p-5">
          <CardHeader
            title="Ward Admission & Bed Allocation"
            subtitle="Inpatient nursing ward placement, room status, and transfer workflow"
          />
          <CardBody className="space-y-4 pt-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-slate-400 block font-medium">Assigned Ward</span>
                <span className="text-base font-bold text-slate-900">{patient.ward || 'Outpatient Observation'}</span>
                <span className="text-slate-500 block">Department: {patient.department}</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-slate-400 block font-medium">Bed Identifier</span>
                <span className="text-base font-bold text-primary font-mono">{patient.bed || 'Unassigned'}</span>
                <span className="text-slate-500 block">Telemetry Monitored</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-slate-400 block font-medium">Admission Timestamp</span>
                <span className="text-base font-bold text-slate-900">{patient.admissionDate || '2026-09-07 18:00'}</span>
                <span className="text-slate-500 block">Status: <strong className="text-slate-800">{patient.status}</strong></span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Bed Transfer & Discharge Readiness</h4>
                <p className="text-slate-600 mt-0.5">Discharge planning checklist and step-down unit availability.</p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  addToast({
                    title: 'Discharge Summary Prepared',
                    message: `Discharge checklist initiated for ${patient.name}.`,
                    type: 'info',
                  });
                }}
              >
                Plan Discharge
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab: Billing */}
      {activeTab === 'Billing' && (
        <Card className="p-5">
          <CardHeader
            title={`Patient Invoices & Claims (${patientInvoices.length})`}
            subtitle="Itemized hospital fees, insurance coverage, and balances due"
          />
          <CardBody className="space-y-4 pt-3">
            {patientInvoices.length === 0 ? (
              <div className="text-center py-10">
                <ReceiptText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No invoices generated</p>
                <p className="text-xs text-slate-400 mt-1">Hospital services and pharmacy orders will appear here for checkout.</p>
              </div>
            ) : (
              patientInvoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold font-mono text-slate-900 text-sm">{inv.invoiceNumber}</span>
                      <span className="text-slate-400 block">{inv.date}</span>
                    </div>
                    <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Partially Paid' ? 'warning' : 'neutral'}>
                      {inv.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Billed</span>
                      <span className="font-bold text-slate-900">${inv.subtotal.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Insurance Covered</span>
                      <span className="font-bold text-emerald-600">${inv.insuranceCovered.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Patient Balance</span>
                      <span className="font-bold text-error">${inv.balanceDue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      )}

      {/* 4. MODALS FOR DIRECT PATIENT ACTIONS */}

      {/* Order Lab Modal */}
      <Modal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        title="Order Diagnostic Laboratory Test"
        subtitle={`Request clinical pathology panel for ${patient.name} (${patient.mrn})`}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsLabModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={FlaskConical} onClick={handleOrderLab}>
              Submit Lab Order
            </Button>
          </>
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); handleOrderLab(); }} className="space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">{patient.name}</span>
              <span className="text-slate-500 font-mono ml-2">MRN: {patient.mrn}</span>
            </div>
            <Badge variant="neutral">{patient.ward || 'Outpatient'} • Bed {patient.bed || 'OP'}</Badge>
          </div>

          <Field label="Laboratory Panel / Test Name" required>
            <Select
              value={labTestName}
              onChange={(e) => {
                setLabTestName(e.target.value);
                if (e.target.value.includes('CBC')) setLabCategory('Hematology');
                else if (e.target.value.includes('Troponin')) setLabCategory('Cardiology / Biomarkers');
                else if (e.target.value.includes('Metabolic')) setLabCategory('Biochemistry');
                else if (e.target.value.includes('Lipid')) setLabCategory('Biochemistry');
                else if (e.target.value.includes('Coagulation')) setLabCategory('Coagulation');
                else if (e.target.value.includes('Urine')) setLabCategory('Urinalysis');
                else setLabCategory('General Diagnostic');
              }}
              options={[
                { value: 'Complete Blood Count (CBC with Diff)', label: 'Complete Blood Count (CBC with Diff)' },
                { value: 'Comprehensive Metabolic Panel (CMP-14)', label: 'Comprehensive Metabolic Panel (CMP-14)' },
                { value: 'High-Sensitivity Cardiac Troponin I (hs-cTnI)', label: 'High-Sensitivity Cardiac Troponin I (hs-cTnI)' },
                { value: 'Lipid Panel (Total, HDL, LDL, Triglycerides)', label: 'Lipid Panel (Total, HDL, LDL, Triglycerides)' },
                { value: 'Coagulation Panel (PT/INR, aPTT)', label: 'Coagulation Panel (PT/INR, aPTT)' },
                { value: 'Arterial Blood Gas (ABG)', label: 'Arterial Blood Gas (ABG)' },
                { value: 'Urinalysis Complete with Micro', label: 'Urinalysis Complete with Micro' },
                { value: 'D-Dimer Quantitative Assay', label: 'D-Dimer Quantitative Assay' },
                { value: 'Blood Cultures x2 (Aerobic & Anaerobic)', label: 'Blood Cultures x2 (Aerobic & Anaerobic)' },
              ]}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Order Urgency / Priority" required>
              <Select
                value={labPriority}
                onChange={(e) => setLabPriority(e.target.value)}
                options={[
                  { value: 'Routine', label: 'Routine (Standard Batch)' },
                  { value: 'Urgent', label: 'Urgent (Priority Processing)' },
                  { value: 'STAT', label: 'STAT (Immediate Life-Threatening)' },
                ]}
              />
            </Field>

            <Field label="Specimen Required" required>
              <Select
                value={labSpecimen}
                onChange={(e) => setLabSpecimen(e.target.value)}
                options={[
                  { value: 'Venous Blood', label: 'Venous Whole Blood' },
                  { value: 'Arterial Blood', label: 'Arterial Whole Blood' },
                  { value: 'Random Urine', label: 'Clean Catch Urine' },
                  { value: 'Serum', label: 'Serum (Gold Top Tube)' },
                  { value: 'Plasma', label: 'Plasma (Purple EDTA)' },
                  { value: 'Sputum', label: 'Sputum Cup' },
                ]}
              />
            </Field>
          </div>

          <Field label="Clinical Notes / Indication for Order">
            <Textarea
              rows={2}
              placeholder="e.g. Evaluate for acute myocardial infarction, repeat level in 3 hours"
              value={labNotes}
              onChange={(e) => setLabNotes(e.target.value)}
            />
          </Field>
        </form>
      </Modal>

      {/* Order Scan Modal */}
      <Modal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        title="Order Radiology Imaging Study"
        subtitle={`Diagnostic imaging request for ${patient.name} (${patient.mrn})`}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsScanModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={Scan} onClick={handleOrderScan}>
              Submit Radiology Order
            </Button>
          </>
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); handleOrderScan(); }} className="space-y-4">
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">{patient.name}</span>
              <span className="text-slate-500 font-mono ml-2">MRN: {patient.mrn}</span>
            </div>
            <Badge variant="purple">{patient.ward || 'Outpatient'} • Bed {patient.bed || 'OP'}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Imaging Modality" required>
              <Select
                value={scanModality}
                onChange={(e) => {
                  setScanModality(e.target.value);
                  if (e.target.value === 'X-Ray') setScanStudyName('Chest X-Ray PA & Lateral');
                  else if (e.target.value === 'CT') setScanStudyName('CT Chest / Abdomen / Pelvis with IV Contrast');
                  else if (e.target.value === 'MRI') setScanStudyName('MRI Brain with / without Contrast');
                  else if (e.target.value === 'Ultrasound') setScanStudyName('Ultrasound Abdomen Complete');
                  else setScanStudyName('PET Whole Body Oncologic');
                }}
                options={[
                  { value: 'X-Ray', label: 'X-Ray (Plain Radiograph)' },
                  { value: 'CT', label: 'CT (Computed Tomography)' },
                  { value: 'MRI', label: 'MRI (Magnetic Resonance)' },
                  { value: 'Ultrasound', label: 'Ultrasound (Sonography)' },
                  { value: 'PET', label: 'PET Scan (Nuclear)' },
                ]}
              />
            </Field>

            <Field label="Study Urgency" required>
              <Select
                value={scanPriority}
                onChange={(e) => setScanPriority(e.target.value)}
                options={[
                  { value: 'Routine', label: 'Routine Outpatient' },
                  { value: 'Urgent', label: 'Urgent Inpatient' },
                  { value: 'STAT', label: 'STAT (Emergency Trauma/Stroke)' },
                ]}
              />
            </Field>
          </div>

          <Field label="Procedure / Study Protocol" required>
            <Select
              value={scanStudyName}
              onChange={(e) => setScanStudyName(e.target.value)}
              options={[
                { value: 'Chest X-Ray PA & Lateral', label: 'Chest X-Ray PA & Lateral' },
                { value: 'CT Head / Brain Non-Contrast', label: 'CT Head / Brain Non-Contrast' },
                { value: 'CT Chest / Abdomen / Pelvis with IV Contrast', label: 'CT Chest / Abdomen / Pelvis with IV Contrast' },
                { value: 'CT Pulmonary Angiogram (PE Protocol)', label: 'CT Pulmonary Angiogram (PE Protocol)' },
                { value: 'Coronary CT Angiography', label: 'Coronary CT Angiography' },
                { value: 'MRI Brain with / without Contrast', label: 'MRI Brain with / without Contrast' },
                { value: 'MRI Lumbar Spine without Contrast', label: 'MRI Lumbar Spine without Contrast' },
                { value: 'Ultrasound Abdomen Complete', label: 'Ultrasound Abdomen Complete' },
                { value: 'Echocardiogram Transthoracic (TTE)', label: 'Echocardiogram Transthoracic (TTE)' },
                { value: 'X-Ray Right Knee 3 Views', label: 'X-Ray Right Knee 3 Views' },
              ]}
            />
          </Field>

          <Field label="Clinical Indication / Reason for Imaging" required>
            <Textarea
              rows={2}
              placeholder="e.g. Persistent dyspnea, evaluate for infiltrates, pulmonary edema, or cardiomegaly"
              value={scanReason}
              onChange={(e) => setScanReason(e.target.value)}
              required
            />
          </Field>
        </form>
      </Modal>

      {/* Prescribe Medication Modal */}
      <Modal
        isOpen={isPrescribeModalOpen}
        onClose={() => setIsPrescribeModalOpen(false)}
        title="Authorize E-Prescription & Pharmacy Order"
        subtitle={`Physician order for ${patient.name} (${patient.mrn})`}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsPrescribeModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={hasAllergyWarning ? 'danger' : 'primary'}
              icon={Pill}
              onClick={handlePrescribe}
              disabled={hasAllergyWarning && !allergyOverride}
            >
              Sign & Authorize Order
            </Button>
          </>
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); handlePrescribe(); }} className="space-y-4">
          {hasAllergyWarning ? (
            <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-error font-bold text-xs">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>CRITICAL ALLERGY CONTRAINDICATION</span>
              </div>
              <p className="text-xs text-red-900">
                Patient has a documented allergy to <strong>{patient.allergies.map(a => a.allergen).join(', ')}</strong>.
                Prescribing <strong>{drugName}</strong> may trigger severe adverse reactions.
              </p>
              <label className="flex items-center gap-2 text-xs font-semibold text-red-950 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allergyOverride}
                  onChange={(e) => setAllergyOverride(e.target.checked)}
                  className="rounded text-error border-red-300 focus:ring-red-400 cursor-pointer"
                />
                <span>I acknowledge contraindication and verify physician override</span>
              </label>
            </div>
          ) : (
            patient.allergies.length > 0 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-900">
                  Known Allergies: {patient.allergies.map(a => `${a.allergen} (${a.severity})`).join(', ')}
                </span>
                <span className="text-[10px] font-bold uppercase text-amber-700">Allergy Checked</span>
              </div>
            )
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Drug / Medication" required>
              <Select
                value={drugName}
                onChange={(e) => {
                  setDrugName(e.target.value);
                  if (e.target.value === 'Atorvastatin') { setDrugDose('80 mg'); setDrugFrequency('Once Daily at Bedtime'); setDrugIndication('Hyperlipidemia'); }
                  else if (e.target.value === 'Aspirin') { setDrugDose('81 mg'); setDrugFrequency('Once Daily with Meals'); setDrugIndication('Antiplatelet therapy'); }
                  else if (e.target.value === 'Lisinopril') { setDrugDose('10 mg'); setDrugFrequency('Once Daily'); setDrugIndication('Essential Hypertension'); }
                  else if (e.target.value === 'Metoprolol Tartrate') { setDrugDose('25 mg'); setDrugFrequency('Twice Daily (BID)'); setDrugIndication('Rate control / Post-MI'); }
                  else if (e.target.value === 'Heparin Sodium') { setDrugDose('5,000 units'); setDrugRoute('Subcutaneous'); setDrugFrequency('Every 8 Hours'); setDrugIndication('DVT / PE Prophylaxis'); }
                  else if (e.target.value === 'Ceftriaxone') { setDrugDose('1 g'); setDrugRoute('IV'); setDrugFrequency('Every 24 Hours'); setDrugIndication('Bacterial infection'); }
                  else if (e.target.value === 'Amoxicillin') { setDrugDose('500 mg'); setDrugFrequency('Every 8 Hours (TID)'); setDrugIndication('Upper respiratory infection'); }
                }}
                options={[
                  { value: 'Atorvastatin', label: 'Atorvastatin (Lipitor)' },
                  { value: 'Aspirin', label: 'Aspirin (Ecotrin)' },
                  { value: 'Lisinopril', label: 'Lisinopril (Prinivil)' },
                  { value: 'Metoprolol Tartrate', label: 'Metoprolol Tartrate (Lopressor)' },
                  { value: 'Heparin Sodium', label: 'Heparin Sodium' },
                  { value: 'Ceftriaxone', label: 'Ceftriaxone (Rocephin)' },
                  { value: 'Ondansetron', label: 'Ondansetron (Zofran)' },
                  { value: 'Amoxicillin', label: 'Amoxicillin (⚠️ Penicillin Check)' },
                ]}
              />
            </Field>

            <Field label="Dose & Strength" required>
              <Input
                value={drugDose}
                onChange={(e) => setDrugDose(e.target.value)}
                placeholder="e.g. 80 mg"
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Route" required>
              <Select
                value={drugRoute}
                onChange={(e) => setDrugRoute(e.target.value)}
                options={[
                  { value: 'Oral', label: 'Oral (PO)' },
                  { value: 'IV', label: 'Intravenous (IV)' },
                  { value: 'Subcutaneous', label: 'Subcutaneous (SubQ)' },
                  { value: 'Inhalation', label: 'Inhalation (INH)' },
                  { value: 'Topical', label: 'Topical' },
                ]}
              />
            </Field>

            <Field label="Frequency" required>
              <Select
                value={drugFrequency}
                onChange={(e) => setDrugFrequency(e.target.value)}
                options={[
                  { value: 'Once Daily', label: 'Once Daily (QD)' },
                  { value: 'Once Daily at Bedtime', label: 'Bedtime (QHS)' },
                  { value: 'Twice Daily (BID)', label: 'Twice Daily (BID)' },
                  { value: 'Every 8 Hours (TID)', label: 'Three Times Daily (TID)' },
                  { value: 'PRN (As Needed)', label: 'As Needed (PRN)' },
                ]}
              />
            </Field>

            <Field label="Duration" required>
              <Input
                value={drugDuration}
                onChange={(e) => setDrugDuration(e.target.value)}
                placeholder="e.g. 30 Days"
                required
              />
            </Field>
          </div>

          <Field label="Clinical Indication / Reason" required>
            <Input
              value={drugIndication}
              onChange={(e) => setDrugIndication(e.target.value)}
              placeholder="e.g. Secondary cardiovascular prevention"
              required
            />
          </Field>
        </form>
      </Modal>

      {/* Record Vitals Modal */}
      <Modal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        title="Record Bedside Vital Signs"
        subtitle={`Clinical telemetry input for ${patient.name} (${patient.mrn})`}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsVitalsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={Activity} onClick={handleSaveVitals}>
              Save Vital Signs
            </Button>
          </>
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveVitals(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Systolic BP (mmHg)" required>
              <Input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                required
              />
            </Field>
            <Field label="Diastolic BP (mmHg)" required>
              <Input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Heart Rate (bpm)" required>
              <Input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                required
              />
            </Field>
            <Field label="SpO2 Oxygen Saturation (%)" required>
              <Input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Temperature (°F)" required>
              <Input
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                required
              />
            </Field>
            <Field label="Resp Rate (bpm)" required>
              <Input
                type="number"
                value={respRate}
                onChange={(e) => setRespRate(e.target.value)}
                required
              />
            </Field>
            <Field label="Pain Scale (0–10)">
              <Input
                type="number"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(e.target.value)}
              />
            </Field>
          </div>
        </form>
      </Modal>

      {/* 5. FULL CLIA-CERTIFIED LABORATORY REPORT MODAL */}
      {viewingLab && (
        <Modal
          isOpen={Boolean(viewingLab)}
          onClose={() => setViewingLab(null)}
          title="Official Diagnostic Laboratory Report"
          subtitle={`MediCore Clinical Laboratories • Report #${viewingLab.orderNumber}`}
          maxWidth="max-w-3xl"
          footer={
            <>
              <Button variant="secondary" onClick={() => setViewingLab(null)}>
                Close
              </Button>
              <Button
                variant="outline"
                icon={FileText}
                onClick={() => {
                  setPdfModalReport(viewingLab);
                  setPdfModalType('lab');
                }}
              >
                📄 On-Site PDF Viewer
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => {
                  addToast({
                    title: 'Printing Lab Report',
                    message: `Certified lab report #${viewingLab.orderNumber} sent to printer.`,
                    type: 'info',
                  });
                  window.print();
                }}
              >
                Print Certified Report
              </Button>
            </>
          }
        >
          <div className="space-y-6 text-xs p-1">
            {/* Header / Laboratory Accreditation */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">MediCore Health Laboratories</h3>
                <p className="text-slate-500 text-[11px]">CLIA ID #14D099281 • College of American Pathologists (CAP) Accredited</p>
                <p className="text-slate-500 text-[11px]">100 Medical Parkway, Springfield, IL</p>
              </div>
              <VerifiedBadge
                title="FINAL CERTIFIED REPORT"
                verifiedBy={viewingLab.verifiedBy || 'Dr. R. Patel, MD (Clinical Pathology)'}
                verifiedAt={viewingLab.verifiedAt || viewingLab.orderDate}
              />
            </div>

            {/* On-Site PDF Report Attachment Callout */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/80 border border-blue-200/90 gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {viewingLab.pdfReport?.fileName || `Official_Lab_Report_${viewingLab.orderNumber}.pdf`}
                  </p>
                  <p className="text-[11px] text-blue-700">
                    {viewingLab.pdfReport?.fileSize || '1.4 MB'} • Verified Document • On-Site Popup Viewable
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="primary"
                icon={FileText}
                onClick={() => {
                  setPdfModalReport(viewingLab);
                  setPdfModalType('lab');
                }}
              >
                Open PDF Popup
              </Button>
            </div>

            {/* Patient & Accession Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name</span>
                <span className="font-bold text-slate-900">{patient.name}</span>
                <span className="text-slate-500 block font-mono">MRN: {patient.mrn}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Ordering Physician</span>
                <span className="font-bold text-slate-900">{viewingLab.orderedBy}</span>
                <span className="text-slate-500 block">Department: {patient.department}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Specimen Details</span>
                <span className="font-bold text-slate-900">{viewingLab.specimenType || 'Venous Whole Blood'}</span>
                <span className="text-slate-500 block">Accession: {viewingLab.orderNumber}</span>
              </div>
            </div>

            {/* Analyte Results Breakdown Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-slate-900">{viewingLab.testName}</h4>
                <Badge size="sm" variant="info">{viewingLab.category}</Badge>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                    <tr>
                      <th className="p-2.5">Test Component / Analyte</th>
                      <th className="p-2.5">Observed Value</th>
                      <th className="p-2.5">Units</th>
                      <th className="p-2.5">Reference Range</th>
                      <th className="p-2.5">Status Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingLab.parameters && viewingLab.parameters.length > 0 ? (
                      viewingLab.parameters.map((p, idx) => (
                        <tr key={idx} className={p.flag.includes('Critical') ? 'bg-red-50/50' : ''}>
                          <td className="p-2.5 font-semibold text-slate-900">{p.name}</td>
                          <td className="p-2.5 font-bold font-mono text-slate-800">{p.value}</td>
                          <td className="p-2.5 text-slate-500 font-mono">{p.unit || '—'}</td>
                          <td className="p-2.5 text-slate-500 font-mono">{p.refRange}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.flag.includes('Critical')
                                  ? 'bg-red-100 text-error'
                                  : p.flag.includes('High') || p.flag.includes('Low')
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.flag}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400">
                          Preliminary specimen received. Analyte instrumentation run in progress.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Specimen Notes & Signature */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-slate-500 text-[11px]">
                <p><strong>Methodology:</strong> Automated Flow Cytometry / Chemiluminescence Assay</p>
                <p>Report electronically verified by Medical Director Dr. R. Patel, MD.</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">SHA256 Digital Fingerprint: 4f89b...e8a2</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certified Tamper-Evident Record
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 6. INTERACTIVE PACS / DICOM RADIOLOGY SCAN VIEWER MODAL */}
      {viewingScan && (
        <Modal
          isOpen={Boolean(viewingScan)}
          onClose={() => setViewingScan(null)}
          title="Diagnostic Radiology & DICOM Viewer"
          subtitle={`Study: ${viewingScan.modality} ${viewingScan.studyName ? `— ${viewingScan.studyName}` : ''} (${viewingScan.requestNumber})`}
          maxWidth="max-w-4xl"
          footer={
            <>
              <Button variant="secondary" onClick={() => setViewingScan(null)}>
                Close Viewer
              </Button>
              <Button
                variant="outline"
                icon={FileText}
                onClick={() => {
                  setPdfModalReport(viewingScan);
                  setPdfModalType('radiology');
                }}
              >
                📄 On-Site PDF Viewer
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => {
                  addToast({
                    title: 'Printing Radiology Report',
                    message: `Official imaging report for ${viewingScan.requestNumber} sent to printer.`,
                    type: 'info',
                  });
                  window.print();
                }}
              >
                Print Radiology Report
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Viewer Toolbar */}
            <div className="p-2.5 bg-slate-900 text-white rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400">Window Preset:</span>
                <button
                  type="button"
                  onClick={() => setWindowPreset('lung')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    windowPreset === 'lung' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Lung (W:1500)
                </button>
                <button
                  type="button"
                  onClick={() => setWindowPreset('bone')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    windowPreset === 'bone' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Bone (W:2000)
                </button>
                <button
                  type="button"
                  onClick={() => setWindowPreset('soft')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    windowPreset === 'soft' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Soft Tissue (W:400)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] text-slate-300 min-w-10 text-center">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-px bg-slate-700 mx-1" />

                <button
                  type="button"
                  onClick={() => setContrastInverted((c) => !c)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                    contrastInverted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <SunMedium className="w-3 h-3" /> Invert
                </button>

                <button
                  type="button"
                  onClick={() => setShowCrosshair((h) => !h)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                    showCrosshair ? 'bg-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Sliders className="w-3 h-3" /> Crosshair
                </button>
              </div>
            </div>

            {/* Diagnostic Dark-Mode DICOM Viewport */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-900 aspect-16/9 flex items-center justify-center select-none">
              {/* Image Viewport with Transform & Inversion Filters */}
              <div
                className="w-full h-full flex items-center justify-center transition-all duration-150"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  filter: contrastInverted ? 'invert(1) contrast(1.3)' : 'contrast(1.15)',
                }}
              >
                {viewingScan.imageMock ? (
                  <img
                    src={viewingScan.imageMock}
                    alt={viewingScan.modality}
                    className="w-full h-full object-contain opacity-95"
                  />
                ) : (
                  /* High-Fidelity Anatomical Radiograph Simulation */
                  <div className="w-full h-full flex items-center justify-center bg-radial from-slate-800 to-black text-slate-400">
                    <svg viewBox="0 0 400 300" className="w-4/5 h-4/5 opacity-80" stroke="currentColor" fill="none">
                      {/* Thoracic Cavity Silhouette */}
                      <path d="M 120 50 Q 200 40 280 50 Q 330 160 300 240 Q 200 260 100 240 Q 70 160 120 50 Z" strokeWidth="1.5" stroke="#475569" />
                      {/* Spine / Vertebral Column */}
                      <line x1="200" y1="40" x2="200" y2="250" strokeWidth="6" stroke="#94a3b8" strokeDasharray="6 4" />
                      {/* Ribcage arcs */}
                      <path d="M 200 80 Q 260 90 290 120 M 200 110 Q 270 120 295 150 M 200 140 Q 270 150 290 180" strokeWidth="2" stroke="#64748b" />
                      <path d="M 200 80 Q 140 90 110 120 M 200 110 Q 130 120 105 150 M 200 140 Q 130 150 110 180" strokeWidth="2" stroke="#64748b" />
                      {/* Cardiac Silhouette */}
                      <path d="M 175 140 Q 230 140 235 200 Q 170 215 160 180 Z" fill="#334155" opacity="0.7" strokeWidth="1.5" stroke="#94a3b8" />
                      {/* Diaphragmatic Domes */}
                      <path d="M 90 230 Q 150 190 200 220 Q 250 190 310 230" strokeWidth="2" stroke="#64748b" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Crosshair Overlay */}
              {showCrosshair && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-px bg-cyan-400/40" />
                  <div className="absolute h-full w-px bg-cyan-400/40" />
                  <div className="absolute w-6 h-6 border border-cyan-400/60 rounded-full" />
                </div>
              )}

              {/* DICOM HUD Overlays */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10 space-y-0.5 pointer-events-none">
                <p className="font-bold text-cyan-300">{patient.name}</p>
                <p>MRN: {patient.mrn} • {patient.age}y {patient.gender}</p>
                <p>Study: {viewingScan.modality}</p>
              </div>

              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10 text-right space-y-0.5 pointer-events-none">
                <p>kVp: 120 • mA: 250</p>
                <p>FOV: 350 mm • Matrix: 512x512</p>
                <p>Preset: {windowPreset.toUpperCase()}</p>
              </div>

              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10 pointer-events-none">
                <span>WW: {windowPreset === 'lung' ? 1500 : windowPreset === 'bone' ? 2000 : 400} </span>
                <span>WL: {windowPreset === 'lung' ? -600 : windowPreset === 'bone' ? 350 : 40} </span>
                <span>• Zoom: {zoomLevel}%</span>
              </div>

              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSlice((s) => Math.max(1, s - 1))}
                  className="hover:text-cyan-300"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>Slice {activeSlice} of {viewingScan.dicomImages || 12}</span>
                <button
                  type="button"
                  onClick={() => setActiveSlice((s) => Math.min(viewingScan.dicomImages || 12, s + 1))}
                  className="hover:text-cyan-300"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Anatomical Orientation Markers */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-cyan-400 font-mono font-bold text-xs pointer-events-none">A</div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-cyan-400 font-mono font-bold text-xs pointer-events-none">P</div>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 font-mono font-bold text-xs pointer-events-none">R</div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 font-mono font-bold text-xs pointer-events-none">L</div>
            </div>

            {/* Official Certified Radiologist Report Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">Certified Radiologist Findings & Report</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfModalReport(viewingScan);
                      setPdfModalType('radiology');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-semibold transition-colors cursor-pointer border border-purple-200"
                    title="Open on-site PDF popup viewer"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-500" />
                    <span>View Signed PDF</span>
                  </button>
                </div>
                <VerifiedBadge
                  title="FINAL SIGNED STUDY"
                  verifiedBy={viewingScan.radiologist || 'Dr. David Miller, MD'}
                  verifiedAt={viewingScan.reportedAt || viewingScan.orderDate}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Clinical Indication:</span>
                  <p className="text-slate-700 mt-0.5">{viewingScan.clinicalIndication}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Findings:</span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-line">
                    {viewingScan.findings ||
                      'Thoracic cage and osseous structures intact. Lung parenchyma demonstrates clear aeration bilaterally. No evidence of pneumothorax or acute pleural effusion. Mediastinal contours within physiological limits.'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Impression:</span>
                  <p className="text-slate-900 font-bold mt-0.5 whitespace-pre-line">
                    {viewingScan.impression ||
                      '1. No acute diagnostic abnormality or acute cardiopulmonary process identified.\n2. Recommend continued clinical correlation.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 7. OFFICIAL MEDICAL PRESCRIPTION (Rx) SHEET MODAL */}
      <Modal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        title="Official Outpatient & Discharge Prescription (℞)"
        subtitle={`MediCore Health Hospital Center • Rx Auth #${patient.mrn}-RX`}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsRxModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={Printer}
              onClick={() => {
                addToast({
                  title: 'Prescription Printed',
                  message: `Official Rx slip printed with digital signature for ${patient.name}.`,
                  type: 'info',
                });
                window.print();
              }}
            >
              Print Official Prescription
            </Button>
          </>
        }
      >
        <div className="space-y-6 text-xs p-2 bg-white">
          {/* Hospital Rx Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">MediCore University Hospital Center</h3>
              <p className="text-slate-600 font-medium">Department of Clinical Medicine & Outpatient Pharmacy</p>
              <p className="text-slate-500 text-[11px]">100 Medical Parkway • Phone: +1 (555) 019-2830</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900 block">{patient.assignedDoctor}</span>
              <span className="text-slate-500 block font-mono text-[10px]">NPI: 1487290142 • DEA: AB9204192</span>
              <span className="text-slate-500 block font-mono text-[10px]">State Lic: MD-59821</span>
            </div>
          </div>

          {/* Patient Demographic Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">MRN / DOB</span>
              <span className="font-mono text-slate-800">{patient.mrn} • {patient.dob}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Age / Gender</span>
              <span className="text-slate-800">{patient.age} years • {patient.gender}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Date Prescribed</span>
              <span className="text-slate-800">{new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>

          {/* Documented Allergies Warning */}
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <span className="font-bold text-red-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-error" /> Documented Patient Allergies:
            </span>
            <span className="font-semibold text-red-800">
              {patient.allergies.length === 0 ? 'NKDA (No Known Drug Allergies)' : patient.allergies.map(a => `${a.allergen} (${a.severity})`).join(', ')}
            </span>
          </div>

          {/* Traditional ℞ Symbol & Medications List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-serif font-black text-slate-900">℞</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Authorized Medication Regimen</span>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
              {patientMeds.map((med, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{idx + 1}. {med.name} {med.dose}</span>
                    <p className="text-slate-600 mt-0.5">
                      <strong>Sig:</strong> Take {med.route} {med.frequency}. {med.indication ? `Indication: ${med.indication}` : ''}
                    </p>
                  </div>
                  <div className="text-right sm:self-center shrink-0">
                    <span className="font-mono text-xs font-semibold text-slate-700 block">Dispense: {med.duration || '30 Days'} Supply</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">3 Refills Authorized</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Signature & Security Footer */}
          <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-end">
            <div className="space-y-1">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span>Dispense As Written (DAW: 0) / Substitution Permissible</span>
              </label>
              <p className="text-[10px] text-slate-400">Electronic E-Prescription valid for state and federal schedule IV-V compliance.</p>
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif italic text-lg font-bold text-slate-900 border-b border-slate-400 pb-0.5">
                {patient.assignedDoctor}
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Authorized Physician Signature</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* On-Site Popup PDF Viewer Modal */}
      {pdfModalReport && (
        <PdfViewerModal
          isOpen={Boolean(pdfModalReport)}
          onClose={() => setPdfModalReport(null)}
          report={pdfModalReport}
          type={pdfModalType}
        />
      )}
    </div>
  );
}

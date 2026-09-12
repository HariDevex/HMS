import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/permissions';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import CriticalAlert from '../../components/ui/CriticalAlert';
import Field, { Input, Select, Textarea } from '../../components/ui/Field';
import {
  CheckCircle2, FlaskConical, Scan, Pill, ArrowLeft,
} from 'lucide-react';

export default function ConsultationView() {
  const {
    selectedPatient,
    currentUser,
    currentRole,
    addToast,
    logAuditAction,
  } = useApp();

  const navigate = useNavigate();

  // Consultation state
  const [chiefComplaint, setChiefComplaint] = useState(selectedPatient?.chiefComplaint || 'Substernal chest pressure');
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState(
    'Patient notes intermittent episodes of squeezing retrosternal chest pain occurring with exertion, radiating to the left shoulder. Accompanied by mild diaphoresis and shortness of breath.'
  );
  const [examinationFindings, setExaminationFindings] = useState(
    'Cardiovascular: S1/S2 present, regular rate and rhythm. Mild systolic murmur at apex. No peripheral edema or JVD.\nRespiratory: Clear to auscultation bilaterally, no wheezes or rales.\nAbdomen: Soft, non-tender.'
  );
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('I21.4 - Non-ST elevation myocardial infarction (NSTEMI)');
  const [secondaryDiagnosis, setSecondaryDiagnosis] = useState('I10 - Essential (primary) hypertension');
  const [planNotes, setPlanNotes] = useState(
    'Continue dual antiplatelet therapy. Titrate beta-blocker as BP permits. Repeat STAT troponin panel at 12:00 PM. Transthoracic echocardiogram ordered to quantify ejection fraction.'
  );
  const [followUpDate, setFollowUpDate] = useState('2026-09-17');
  const [saving, setSaving] = useState(false);

  const canSign = can(currentRole, 'canPrescribeMedication');

  const handleCompleteConsultation = (e) => {
    e.preventDefault();
    if (!canSign) {
      addToast({
        title: 'Unauthorized Action',
        message: 'Only licensed attending physicians can sign and finalize clinical consultation notes.',
        type: 'error',
      });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      logAuditAction(
        'Consultation Finalized',
        `Completed clinical note for ${selectedPatient.name}. Primary Dx: ${primaryDiagnosis}`,
        'Success',
        selectedPatient.name
      );
      addToast({
        title: 'Consultation Finalized',
        message: `Clinical documentation saved for ${selectedPatient.name}. Follow-up scheduled for ${followUpDate}.`,
        type: 'success',
      });
      navigate('/doctor');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Patient Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/doctor')}>
            Back
          </Button>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-primary font-bold text-lg flex items-center justify-center shrink-0">
            {selectedPatient.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{selectedPatient.name}</h2>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">{selectedPatient.mrn}</span>
              <Badge variant="primary">{selectedPatient.department}</Badge>
              <Badge variant="purple">Room: {selectedPatient.bed || 'Outpatient 3B'}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {selectedPatient.age} years old • {selectedPatient.gender} • Blood Group: <span className="font-bold text-slate-700">{selectedPatient.bloodGroup}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/patients/${selectedPatient.id}`)}
          >
            Full Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={CheckCircle2}
            loading={saving}
            disabled={!canSign}
            onClick={handleCompleteConsultation}
          >
            Complete & Sign
          </Button>
        </div>
      </div>

      {/* Allergies & Alerts */}
      {selectedPatient.allergies.length > 0 && (
        <CriticalAlert
          title={`Allergy Alert: ${selectedPatient.allergies.map(a => `${a.allergen} (${a.severity})`).join(', ')}`}
          message="Contraindicated in beta-lactam and cephalosporin antibiotic classes. Verify all orders against active allergy profile."
          type="critical"
        />
      )}

      {/* Main Clinical Note Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notes & Diagnoses */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <CardHeader
              title="Subjective & Objective Clinical Examination"
              subtitle="Document patient encounter symptoms and physical exam"
            />
            <CardBody className="space-y-4 pt-4">
              <Field label="Chief Complaint" required>
                <Input
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                />
              </Field>

              <Field label="History of Present Illness (HPI)" required>
                <Textarea
                  rows={3}
                  value={historyOfPresentIllness}
                  onChange={(e) => setHistoryOfPresentIllness(e.target.value)}
                />
              </Field>

              <Field label="Physical Examination & Organ Systems" required>
                <Textarea
                  rows={4}
                  value={examinationFindings}
                  onChange={(e) => setExaminationFindings(e.target.value)}
                />
              </Field>
            </CardBody>
          </Card>

          {/* Diagnosis & Clinical Coding */}
          <Card className="p-5">
            <CardHeader
              title="Assessment & ICD-10 Clinical Coding"
              subtitle="Assign validated diagnostic coding for clinical record and insurance claims"
            />
            <CardBody className="space-y-4 pt-4">
              <Field label="Primary Clinical Diagnosis" required>
                <Select
                  value={primaryDiagnosis}
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  options={[
                    { value: 'I21.4 - Non-ST elevation myocardial infarction (NSTEMI)', label: 'I21.4 - Non-ST elevation myocardial infarction (NSTEMI)' },
                    { value: 'I20.0 - Unstable angina', label: 'I20.0 - Unstable angina' },
                    { value: 'I47.1 - Supraventricular tachycardia', label: 'I47.1 - Supraventricular tachycardia' },
                    { value: 'J18.9 - Pneumonia, unspecified organism', label: 'J18.9 - Pneumonia, unspecified organism' },
                    { value: 'M23.22 - Derangement of meniscus due to old tear, right knee', label: 'M23.22 - Derangement of meniscus, right knee' },
                  ]}
                />
              </Field>

              <Field label="Secondary / Comorbid Diagnoses">
                <Select
                  value={secondaryDiagnosis}
                  onChange={(e) => setSecondaryDiagnosis(e.target.value)}
                  options={[
                    { value: 'I10 - Essential (primary) hypertension', label: 'I10 - Essential (primary) hypertension' },
                    { value: 'E11.9 - Type 2 diabetes mellitus without complications', label: 'E11.9 - Type 2 diabetes mellitus without complications' },
                    { value: 'E78.00 - Pure hypercholesterolemia, unspecified', label: 'E78.00 - Pure hypercholesterolemia' },
                    { value: 'J44.9 - Chronic obstructive pulmonary disease, unspecified', label: 'J44.9 - COPD, unspecified' },
                  ]}
                />
              </Field>

              <Field label="Clinical Plan, Discharge Directives & Orders" required>
                <Textarea
                  rows={4}
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Recommended Follow-up Visit">
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </Field>
                <Field label="Consultant Physician Signature">
                  <Input disabled value={`${currentUser.name} (${currentUser.title || 'Attending Physician'})`} />
                </Field>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Col: Current Vitals & Active Orders Summary */}
        <div className="space-y-6">
          <Card className="p-5">
            <CardHeader
              title="Current Vital Signs"
              subtitle={selectedPatient.vitals.lastRecorded}
            />
            <CardBody className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Pressure</span>
                  <span className="text-base font-bold text-slate-900">{selectedPatient.vitals.bp}</span>
                  <span className="text-slate-500 block text-[10px]">mmHg</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Heart Rate</span>
                  <span className="text-base font-bold text-slate-900">{selectedPatient.vitals.heartRate}</span>
                  <span className="text-slate-500 block text-[10px]">bpm</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SpO2 Oxygen</span>
                  <span className="text-base font-bold text-emerald-600">{selectedPatient.vitals.oxygenSaturation}%</span>
                  <span className="text-slate-500 block text-[10px]">Room Air</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Temperature</span>
                  <span className="text-base font-bold text-slate-900">{selectedPatient.vitals.temperature}°F</span>
                  <span className="text-slate-500 block text-[10px]">Oral</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="p-5">
            <CardHeader
              title="Recent Clinical Orders"
              subtitle="Active orders for this admission"
            />
            <CardBody className="space-y-3 pt-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-start gap-2.5">
                <FlaskConical className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Troponin I (hs-cTnI)</span>
                  <span className="text-slate-600">Result: 0.142 ng/mL (Verified Critical)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-violet-50/60 border border-violet-200 flex items-start gap-2.5">
                <Scan className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Chest X-Ray PA/Lateral</span>
                  <span className="text-slate-600">Borderline cardiomegaly; lungs clear</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-2.5">
                <Pill className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Atorvastatin 80mg PO QHS</span>
                  <span className="text-slate-600">Aspirin 81mg PO QD • Active</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

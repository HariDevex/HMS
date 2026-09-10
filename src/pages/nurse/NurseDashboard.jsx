import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/ui/StatCard';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import CriticalAlert from '../../components/ui/CriticalAlert';
import Modal from '../../components/ui/Modal';
import Field, { Input, Select, Textarea } from '../../components/ui/Field';
import {
  HeartPulse,
  Users,
  Pill,
  CheckCircle2,
  Clock,
  Activity,
  FileText,
  Eye,
} from 'lucide-react';

export default function NurseDashboard() {
  const {
    patients,
    medications,
    nursingTasks,
    recordVitals,
    setSelectedPatientId,
    currentUser,
    addToast,
  } = useApp();

  const navigate = useNavigate();

  // Modals for Nurse Primary Actions
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Vitals form
  const [targetPatientId, setTargetPatientId] = useState('P-1001');
  const [systolic, setSystolic] = useState('130');
  const [diastolic, setDiastolic] = useState('82');
  const [heartRate, setHeartRate] = useState('78');
  const [temp, setTemp] = useState('98.6');
  const [respRate, setRespRate] = useState('16');
  const [spo2, setSpo2] = useState('98');
  const [painLevel, setPainLevel] = useState('2');

  // Note form
  const [noteContent, setNoteContent] = useState('');
  const [shiftType, setShiftType] = useState('Day Shift (07:00 - 19:00)');

  // Inpatient filtering for nurse
  const assignedPatients = patients.filter((p) => p.status === 'Admitted');
  const pendingTasks = nursingTasks.filter((t) => t.status === 'Pending');
  const dueMeds = medications.filter((m) => m.scheduleStatus !== 'Administered');

  const handleSaveVitals = (e) => {
    e.preventDefault();
    const targetPatient = patients.find((p) => p.id === targetPatientId) || patients[0];
    recordVitals(targetPatient.id, {
      bp: `${systolic}/${diastolic}`,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      heartRate: Number(heartRate),
      temperature: Number(temp),
      tempUnit: '°F',
      respiratoryRate: Number(respRate),
      oxygenSaturation: Number(spo2),
      painLevel: Number(painLevel),
      weight: targetPatient.vitals.weight,
      height: targetPatient.vitals.height,
      bmi: targetPatient.vitals.bmi,
    });
    setIsVitalsModalOpen(false);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteContent) return;
    addToast({
      title: 'Nursing Handover Note Recorded',
      message: `Shift note added for patient record. Documented by ${currentUser.name}.`,
      type: 'success',
    });
    setIsNoteModalOpen(false);
    setNoteContent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Nurse Persona Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Nursing Station • {currentUser.name}
            </h2>
            <Badge variant="purple">ICU & Medical Floors</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring <span className="font-bold text-slate-800">{assignedPatients.length} admitted inpatients</span>. {dueMeds.length} medications scheduled for administration this shift.
          </p>
        </div>

        {/* Primary Actions required by Master Prompt Section 9 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            icon={Activity}
            size="sm"
            onClick={() => setIsVitalsModalOpen(true)}
          >
            Record Vitals
          </Button>

          <Button
            variant="secondary"
            icon={FileText}
            size="sm"
            onClick={() => setIsNoteModalOpen(true)}
          >
            Add Nursing Note
          </Button>

          <Button
            variant="secondary"
            icon={Pill}
            size="sm"
            onClick={() => navigate('/nurse-workstation')}
          >
            Medication MAR
          </Button>

          <Button
            variant="secondary"
            icon={Users}
            size="sm"
            onClick={() => navigate('/wards')}
          >
            Inpatient Beds
          </Button>
        </div>
      </div>

      {/* Critical Care Alerts */}
      <CriticalAlert
        title="Active Medication Allergy Alert: Penicillin Anaphylaxis"
        message="Patient James Wilson (ICU-Bed-04) has verified severe allergy to Penicillin. All antibiotic orders require dual-nurse verification before infusion."
        type="critical"
        action={
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setSelectedPatientId('P-1001');
              navigate('/patients/P-1001');
            }}
          >
            View Patient Allergy Chart
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Inpatients"
          value={assignedPatients.length}
          subtitle="ICU & Step-Down"
          icon={Users}
          iconBg="bg-blue-50 text-primary"
        />
        <StatCard
          title="Pending Nursing Tasks"
          value={pendingTasks.length}
          subtitle="Vitals, draws & line checks"
          icon={CheckCircle2}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Medications Due (MAR)"
          value={dueMeds.length}
          subtitle="Next due in 45 mins"
          icon={Pill}
          iconBg="bg-rose-50 text-rose-600"
          onClick={() => navigate('/nurse-workstation')}
        />
        <StatCard
          title="Vital Checks Required"
          value="3"
          subtitle="Q4H Protocol Active"
          icon={HeartPulse}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => setIsVitalsModalOpen(true)}
        />
      </div>

      {/* Main Grid: Assigned Patients & Shift Care Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Inpatients Table */}
        <Card className="lg:col-span-2 p-5">
          <CardHeader
            title="Assigned Inpatients & Bedside Status"
            subtitle="Current vitals, telemetry, and room assignments"
            action={<Badge variant="primary">{assignedPatients.length} Inpatients</Badge>}
          />
          <CardBody className="pt-2">
            <div className="divide-y divide-slate-100">
              {assignedPatients.map((p) => {
                const hasCritical = p.criticalAlerts.length > 0;
                return (
                  <div
                    key={p.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl px-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary font-bold text-xs flex flex-col items-center justify-center shrink-0 border border-blue-200">
                        <span className="text-[9px] text-blue-400 font-mono">BED</span>
                        <span className="text-primary font-extrabold text-[11px] truncate max-w-[36px]">
                          {p.bed ? p.bed.split('-')[1] || p.bed : 'OP'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{p.name}</span>
                          <span className="text-xs text-slate-500 font-mono">{p.mrn}</span>
                          <Badge size="sm" variant={hasCritical ? 'critical' : 'success'}>
                            {p.ward || 'Inpatient'}
                          </Badge>
                          {hasCritical && (
                            <span className="text-[10px] font-bold text-error bg-red-100 px-1.5 py-0.2 rounded">
                              ALERT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          BP: <strong className="text-slate-800">{p.vitals.bp}</strong> • HR: <strong className="text-slate-800">{p.vitals.heartRate} bpm</strong> • SpO2: <strong className="text-emerald-700">{p.vitals.oxygenSaturation}%</strong>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{p.vitals.lastRecorded}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Activity}
                        onClick={() => {
                          setTargetPatientId(p.id);
                          setIsVitalsModalOpen(true);
                        }}
                      >
                        Vitals
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Eye}
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          navigate(`/patients/${p.id}`);
                        }}
                      >
                        Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Nursing Care Worklist */}
        <div className="space-y-6">
          <Card className="p-5">
            <CardHeader
              title="Shift Nursing Tasks"
              subtitle="Scheduled procedures & medication administration"
            />
            <CardBody className="space-y-3 pt-2">
              {nursingTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    t.status === 'Completed'
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">{t.task}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">{t.patientName} • {t.bed}</span>
                      </div>
                    </div>
                    <Badge size="sm" variant={t.priority === 'Urgent' ? 'error' : t.status === 'Completed' ? 'success' : 'warning'}>
                      {t.dueTime}
                    </Badge>
                  </div>
                  {t.status === 'Pending' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="!h-7 !text-xs !px-2.5"
                        onClick={() => {
                          addToast({
                            title: 'Task Completed',
                            message: `Marked '${t.task}' as completed.`,
                            type: 'success',
                          });
                        }}
                      >
                        Mark Done
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Record Vitals Modal */}
      <Modal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        title="Record Clinical Vital Signs"
        subtitle="Document physiological indicators into patient's electronic health record"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsVitalsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveVitals}>Save & Timestamp Vitals</Button>
          </>
        }
      >
        <form onSubmit={handleSaveVitals} className="space-y-4">
          <Field label="Target Inpatient" required>
            <Select
              value={targetPatientId}
              onChange={(e) => setTargetPatientId(e.target.value)}
              options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mrn}) - Bed: ${p.bed || 'Outpatient'}` }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Systolic BP (mmHg)" required>
              <Input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} required />
            </Field>
            <Field label="Diastolic BP (mmHg)" required>
              <Input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} required />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Heart Rate (bpm)" required>
              <Input type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} required />
            </Field>
            <Field label="Oxygen Saturation (% SpO2)" required>
              <Input type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} required />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Body Temperature (°F)" required>
              <Input type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} required />
            </Field>
            <Field label="Respiratory Rate (breaths/min)" required>
              <Input type="number" value={respRate} onChange={(e) => setRespRate(e.target.value)} required />
            </Field>
          </div>

          <Field label="Pain Scale (0 - 10 Visual Analog)">
            <Select
              value={painLevel}
              onChange={(e) => setPainLevel(e.target.value)}
              options={[
                { value: '0', label: '0 - No Pain' },
                { value: '2', label: '2 - Mild (Noticeable)' },
                { value: '4', label: '4 - Moderate (Distracting)' },
                { value: '6', label: '6 - Moderate-Severe' },
                { value: '8', label: '8 - Severe (Disabling)' },
                { value: '10', label: '10 - Worst Pain Imaginable' },
              ]}
            />
          </Field>
        </form>
      </Modal>

      {/* Add Nursing Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Nursing Shift Handover Note"
        subtitle="Document nursing interventions, patient responses, and shift handovers"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveNote}>Sign & Commit Note</Button>
          </>
        }
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <Field label="Target Patient" required>
            <Select
              value={targetPatientId}
              onChange={(e) => setTargetPatientId(e.target.value)}
              options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mrn})` }))}
            />
          </Field>

          <Field label="Shift Period" required>
            <Select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
              options={[
                { value: 'Day Shift (07:00 - 19:00)', label: 'Day Shift (07:00 - 19:00)' },
                { value: 'Night Shift (19:00 - 07:00)', label: 'Night Shift (19:00 - 07:00)' },
                { value: 'Procedure Specific Note', label: 'Procedure Specific Note' },
              ]}
            />
          </Field>

          <Field label="Clinical Note Details" required>
            <Textarea
              rows={5}
              placeholder="e.g. Patient resting comfortably in bed. Telemetry displays normal sinus rhythm without ectopy. IV peripheral line patent in left forearm with normal saline infusing at 75 mL/hr. Patient voiced no acute shortness of breath."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              required
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
}

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
  Calendar,
  Clock, FlaskConical,
  Scan,
  Stethoscope,
  Pill,
  Eye,
} from 'lucide-react';

export default function DoctorDashboard() {
  const {
    currentUser,
    appointments,
    updateAppointmentStatus,
    patients,
    setSelectedPatientId,
    labOrders,
    radiologyOrders,
    orderLabTest,
    orderRadiologyScan,
    prescribeMedication,
    } = useApp();

  const navigate = useNavigate();

  // Modals for Quick Actions
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  // Form states
  const [targetPatientId, setTargetPatientId] = useState(patients[0].id);
  const [testName, setTestName] = useState('High-Sensitivity Cardiac Troponin I');
  const [labPriority, setLabPriority] = useState('STAT / Urgent');
  const [scanModality, setScanModality] = useState('Chest X-Ray');
  const [scanIndication, setScanIndication] = useState('Recurrent substernal pain');
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily (QD)');
  const [indication, setIndication] = useState('');

  // Doctor specific filters
  const myAppointments = appointments.filter(
    (a) => a.doctor.includes(currentUser.name) || currentUser.role !== 'Doctor'
  );
  const waitingPatients = myAppointments.filter((a) => a.status === 'Waiting');
  const currentConsultation = myAppointments.find((a) => a.status === 'In Consultation');
  const pendingLabs = labOrders.filter((l) => l.status !== 'Verified' && l.status !== 'Published');
  const pendingScans = radiologyOrders.filter((r) => r.status !== 'Verified' && r.status !== 'Published');

  const handleStartConsultation = (apt) => {
    updateAppointmentStatus(apt.id, 'In Consultation');
    setSelectedPatientId(apt.patientId);
    navigate('/consultation');
  };

  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId);
    navigate(`/patients/${patientId}`);
  };

  const handleOrderLab = (e) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.id === targetPatientId) || patients[0];
    orderLabTest({
      patientId: p.id,
      patientName: p.name,
      patientMrn: p.mrn,
      age: p.age,
      gender: p.gender,
      testName,
      priority: labPriority,
      department: 'Cardiology / STAT',
    });
    setIsLabModalOpen(false);
  };

  const handleOrderScan = (e) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.id === targetPatientId) || patients[0];
    orderRadiologyScan({
      patientId: p.id,
      patientName: p.name,
      patientMrn: p.mrn,
      age: p.age,
      gender: p.gender,
      modality: scanModality,
      clinicalIndication: scanIndication,
      priority: 'STAT / Urgent',
    });
    setIsScanModalOpen(false);
  };

  const handlePrescribe = (e) => {
    e.preventDefault();
    if (!drugName) return;
    const p = patients.find((pt) => pt.id === targetPatientId) || patients[0];
    prescribeMedication({
      patientId: p.id,
      name: drugName,
      dose: dosage,
      frequency,
      indication,
      route: 'Oral (PO)',
    });
    setIsRxModalOpen(false);
    setDrugName('');
    setDosage('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Good morning, {currentUser.name}
            </h2>
            <Badge variant="primary">{currentUser.department || 'Cardiology'}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            You have <span className="font-bold text-slate-800">{myAppointments.length} appointments</span> scheduled today. {waitingPatients.length} patients currently in waiting room.
          </p>
        </div>

        {/* Primary Action Buttons required by Master Prompt Section 8 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            icon={Stethoscope}
            size="sm"
            onClick={() => {
              if (currentConsultation) {
                navigate('/consultation');
              } else if (waitingPatients.length > 0) {
                handleStartConsultation(waitingPatients[0]);
              } else {
                navigate('/consultation');
              }
            }}
          >
            Start Consultation
          </Button>

          <Button
            variant="secondary"
            icon={FlaskConical}
            size="sm"
            onClick={() => setIsLabModalOpen(true)}
          >
            Order Lab
          </Button>

          <Button
            variant="secondary"
            icon={Scan}
            size="sm"
            onClick={() => setIsScanModalOpen(true)}
          >
            Order Scan
          </Button>

          <Button
            variant="secondary"
            icon={Pill}
            size="sm"
            onClick={() => setIsRxModalOpen(true)}
          >
            Create Prescription
          </Button>
        </div>
      </div>

      {/* Critical Alert */}
      <CriticalAlert
        title="STAT Diagnostic Alert: Elevated Cardiac Markers"
        message="Patient James Wilson (MRN-84920, ICU-Bed-04) hs-cTnI troponin returned at 0.142 ng/mL (Critical High). Immediate cardiology review recommended."
        type="critical"
        action={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="danger" onClick={() => handleViewPatient('P-1001')}>
              Open Inpatient Record
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/laboratory')}>
              View Lab Report
            </Button>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Schedule"
          value={myAppointments.length}
          subtitle="Outpatient & Rounds"
          icon={Calendar}
          iconBg="bg-blue-50 text-primary"
        />
        <StatCard
          title="Waiting Room"
          value={waitingPatients.length}
          subtitle="Avg wait: 12 mins"
          trend="Next: Maria Rodriguez"
          trendType="neutral"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Pending Labs"
          value={pendingLabs.length}
          subtitle="1 Urgent Troponin"
          icon={FlaskConical}
          iconBg="bg-violet-50 text-violet-600"
          onClick={() => navigate('/laboratory')}
        />
        <StatCard
          title="Pending Scans"
          value={pendingScans.length}
          subtitle="1 CT Thorax"
          icon={Scan}
          iconBg="bg-cyan-50 text-cyan-600"
          onClick={() => navigate('/radiology')}
        />
      </div>

      {/* Today's Appointments & In Consultation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Queue */}
        <Card className="lg:col-span-2 p-5">
          <CardHeader
            title="Today's Appointment Queue"
            subtitle="Manage patient flow and start clinical consultations"
            action={<Badge variant="primary">{myAppointments.length} Booked</Badge>}
          />
          <CardBody className="pt-2">
            <div className="divide-y divide-slate-100">
              {myAppointments.map((apt) => {
                const isCurrent = apt.status === 'In Consultation';
                const isWaiting = apt.status === 'Waiting';
                return (
                  <div
                    key={apt.id}
                    className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl px-3 transition-colors ${
                      isCurrent ? 'bg-blue-50/70 border border-blue-200/80' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex flex-col items-center justify-center shrink-0 border border-slate-200">
                        <span className="text-[9px] text-slate-400">TOKEN</span>
                        <span className="text-slate-900 leading-none">{apt.tokenNumber}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{apt.patientName}</span>
                          <span className="text-xs text-slate-500 font-mono">{apt.patientMrn}</span>
                          <Badge
                            size="sm"
                            dot
                            variant={
                              isCurrent
                                ? 'purple'
                                : isWaiting
                                ? 'warning'
                                : apt.status === 'Checked In'
                                ? 'info'
                                : 'neutral'
                            }
                          >
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {apt.time} • {apt.type} • Room: {apt.room}
                        </p>
                        <p className="text-xs text-slate-600 italic mt-0.5 font-sans">
                          "{apt.notes}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Eye}
                        onClick={() => handleViewPatient(apt.patientId)}
                      >
                        Patient
                      </Button>
                      {isWaiting && (
                        <Button
                          size="sm"
                          variant="primary"
                          icon={Stethoscope}
                          onClick={() => handleStartConsultation(apt)}
                        >
                          Start Call
                        </Button>
                      )}
                      {isCurrent && (
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => navigate('/consultation')}
                        >
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Diagnostic Results & Quick Lab Feed */}
        <div className="space-y-6">
          <Card className="p-5">
            <CardHeader
              title="Recent Lab Results"
              subtitle="STAT alerts and abnormal findings"
              action={<Button size="sm" variant="ghost" onClick={() => navigate('/laboratory')}>View All</Button>}
            />
            <CardBody className="space-y-3 pt-2">
              {labOrders.slice(0, 3).map((lab) => (
                <div key={lab.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{lab.testName}</span>
                    <Badge
                      size="sm"
                      variant={lab.status === 'Verified' ? 'success' : lab.status === 'Processing' ? 'info' : 'warning'}
                    >
                      {lab.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Patient: {lab.patientName}</p>
                  {lab.parameters.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-600">{lab.parameters[0].name}:</span>
                      <span className={`font-bold ${lab.parameters[0].flag.includes('Critical') ? 'text-error' : 'text-slate-800'}`}>
                        {lab.parameters[0].value} {lab.parameters[0].unit} ({lab.parameters[0].flag})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          <Card className="p-5">
            <CardHeader
              title="Radiology Studies"
              subtitle="Imaging requests & reports"
              action={<Button size="sm" variant="ghost" onClick={() => navigate('/radiology')}>View All</Button>}
            />
            <CardBody className="space-y-3 pt-2">
              {radiologyOrders.slice(0, 2).map((rad) => (
                <div key={rad.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rad.modality}</span>
                    <Badge size="sm" variant={rad.status === 'Verified' ? 'purple' : 'neutral'}>
                      {rad.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{rad.patientName} • {rad.orderedBy}</p>
                  {rad.findings && (
                    <p className="text-xs text-slate-600 mt-1 truncate">{rad.impression || rad.findings}</p>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Order Lab Test Modal */}
      <Modal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        title="Create Laboratory Order"
        subtitle="Order diagnostic pathology and STAT clinical panels"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsLabModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleOrderLab}>Submit Lab Order</Button>
          </>
        }
      >
        <form onSubmit={handleOrderLab} className="space-y-4">
          <Field label="Select Patient" required>
            <Select
              value={targetPatientId}
              onChange={(e) => setTargetPatientId(e.target.value)}
              options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mrn}) - ${p.diagnosis}` }))}
            />
          </Field>

          <Field label="Diagnostic Test / Panel" required>
            <Select
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              options={[
                { value: 'High-Sensitivity Cardiac Troponin I', label: 'High-Sensitivity Cardiac Troponin I (hs-cTnI)' },
                { value: 'Complete Blood Count with Differential (CBC)', label: 'Complete Blood Count with Differential (CBC)' },
                { value: 'Comprehensive Metabolic Panel (CMP)', label: 'Comprehensive Metabolic Panel (CMP-14)' },
                { value: 'Lipid Panel & HbA1c', label: 'Lipid Panel & Glycated Hemoglobin (HbA1c)' },
                { value: 'Coagulation Profile (PT/INR, aPTT)', label: 'Coagulation Profile (PT/INR, aPTT)' },
                { value: 'Urinalysis with Microscopic Examination', label: 'Urinalysis with Microscopic Examination' },
              ]}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Order Priority" required>
              <Select
                value={labPriority}
                onChange={(e) => setLabPriority(e.target.value)}
                options={[
                  { value: 'STAT / Urgent', label: 'STAT / Emergency' },
                  { value: 'Urgent', label: 'Urgent (Within 2 Hours)' },
                  { value: 'Routine', label: 'Routine (Morning Round)' },
                ]}
              />
            </Field>

            <Field label="Specimen Collection Site">
              <Input placeholder="Peripheral Venous Draw" defaultValue="Venous Blood" />
            </Field>
          </div>
        </form>
      </Modal>

      {/* Order Scan Modal */}
      <Modal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        title="Order Radiology & Imaging Study"
        subtitle="Schedule X-Ray, CT, MRI, or Ultrasound exam"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsScanModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleOrderScan}>Transmit Imaging Request</Button>
          </>
        }
      >
        <form onSubmit={handleOrderScan} className="space-y-4">
          <Field label="Select Patient" required>
            <Select
              value={targetPatientId}
              onChange={(e) => setTargetPatientId(e.target.value)}
              options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mrn})` }))}
            />
          </Field>

          <Field label="Modality & Study" required>
            <Select
              value={scanModality}
              onChange={(e) => setScanModality(e.target.value)}
              options={[
                { value: 'Chest X-Ray', label: 'Chest X-Ray (PA & Lateral)' },
                { value: 'CT Chest (High Resolution)', label: 'CT Chest (Non-Contrast HRCT)' },
                { value: 'Echocardiogram (2D & Doppler)', label: 'Transthoracic Echocardiogram (2D & Doppler)' },
                { value: 'MRI Brain', label: 'MRI Brain with Diffusion & T2 FLAIR' },
                { value: 'Ultrasound Abdomen Complete', label: 'Abdominal Ultrasound (Complete)' },
              ]}
            />
          </Field>

          <Field label="Clinical Indication / Reason for Exam" required>
            <Textarea
              value={scanIndication}
              onChange={(e) => setScanIndication(e.target.value)}
              placeholder="e.g. Substernal chest tightness, evaluate cardiomegaly or pulmonary edema"
            />
          </Field>
        </form>
      </Modal>

      {/* Create Prescription Modal */}
      <Modal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        title="Electronic Prescription (E-Rx)"
        subtitle="Transmit verified prescription to hospital inpatient or outpatient pharmacy"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsRxModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handlePrescribe}>Authorize & Prescribe</Button>
          </>
        }
      >
        <form onSubmit={handlePrescribe} className="space-y-4">
          <Field label="Patient" required>
            <Select
              value={targetPatientId}
              onChange={(e) => setTargetPatientId(e.target.value)}
              options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mrn})` }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Medication Name" required>
              <Input
                placeholder="e.g. Atorvastatin, Lisinopril"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                required
              />
            </Field>

            <Field label="Dosage" required>
              <Input
                placeholder="e.g. 40 mg, 10 mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Dosing Frequency" required>
              <Select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                options={[
                  { value: 'Once daily (QD)', label: 'Once daily (QD)' },
                  { value: 'Twice daily (BID)', label: 'Twice daily (BID)' },
                  { value: 'Three times daily (TID)', label: 'Three times daily (TID)' },
                  { value: 'Every 8 hours (Q8H)', label: 'Every 8 hours (Q8H)' },
                  { value: 'At bedtime (QHS)', label: 'At bedtime (QHS)' },
                  { value: 'As needed (PRN)', label: 'As needed (PRN)' },
                ]}
              />
            </Field>

            <Field label="Clinical Indication">
              <Input
                placeholder="e.g. Secondary prevention post-NSTEMI"
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
              />
            </Field>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <strong>Allergy Barcode Safety Check:</strong> Active patient allergies will be automatically cross-checked against the national RxNorm clinical drug interaction database.
          </div>
        </form>
      </Modal>
    </div>
  );
}

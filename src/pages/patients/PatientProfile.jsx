import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
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
  } from 'lucide-react';
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
    addToast,
  } = useApp();

  const patient = patients.find((p) => p.id === id) || selectedPatient;
  const [activeTab, setActiveTab] = useState('Overview');

  // Role-specific visible tabs according to Master Prompt Section 14
  const getAllTabs = () => {
    const tabs = [
      { id: 'Overview', label: 'Overview', icon: User },
      { id: 'Timeline', label: 'Clinical Timeline', icon: Clock },
      { id: 'Vitals', label: 'Vital Signs', icon: Activity },
      { id: 'Consultations', label: 'Consultations', icon: Stethoscope },
      { id: 'Medications', label: 'Medications & MAR', icon: Pill },
      { id: 'Laboratory', label: 'Laboratory', icon: FlaskConical },
      { id: 'Radiology', label: 'Radiology', icon: Scan },
      { id: 'Admissions', label: 'Ward & Beds', icon: BedDouble },
      { id: 'Billing', label: 'Billing & Invoices', icon: ReceiptText },
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

  const patientLabs = labOrders.filter((l) => l.patientId === patient.id);
  const patientScans = radiologyOrders.filter((r) => r.patientId === patient.id);
  const patientMeds = medications.filter((m) => m.patientId === patient.id);
  const patientInvoices = invoices.filter((i) => i.patientId === patient.id);

  return (
    <div className="space-y-6">
      {/* 1. Patient Header required by Master Prompt Section 14 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

          <div className="flex items-center gap-2 self-end md:self-center">
            {currentRole === 'doctor' && (
              <Button
                variant="primary"
                size="sm"
                icon={Stethoscope}
                onClick={() => {
                  setSelectedPatientId(patient.id);
                  navigate('/consultation');
                }}
              >
                Start Encounter
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                addToast({
                  title: 'ID Wristband Printed',
                  message: `Zebra thermal wristband barcode queued for ${patient.name}.`,
                  type: 'info',
                });
              }}
            >
              Print Wristband
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
              <CardHeader title="Patient Demographics & Insurance" />
              <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Address</span>
                    <span className="text-slate-800 font-medium">{patient.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Emergency Contact</span>
                    <span className="text-slate-800 font-semibold">{patient.emergencyContact.name} ({patient.emergencyContact.relation})</span>
                    <span className="text-slate-500 block">{patient.emergencyContact.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Insurance Payor</span>
                    <span className="text-slate-800 font-semibold">{patient.insurance.provider}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Policy & Group #</span>
                    <span className="font-mono text-slate-800 font-medium">{patient.insurance.policyNumber} • {patient.insurance.groupNumber}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <CardHeader title="Bedside Vitals" subtitle={patient.vitals.lastRecorded} />
              <CardBody className="grid grid-cols-2 gap-3 text-xs pt-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Pressure</span>
                  <span className="text-base font-bold text-slate-900">{patient.vitals.bp}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Heart Rate</span>
                  <span className="text-base font-bold text-slate-900">{patient.vitals.heartRate} bpm</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SpO2 Oxygen</span>
                  <span className="text-base font-bold text-emerald-600">{patient.vitals.oxygenSaturation}%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Temperature</span>
                  <span className="text-base font-bold text-slate-900">{patient.vitals.temperature}°F</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Interactive Clinical Timeline (Master Prompt Section 15) */}
      {activeTab === 'Timeline' && (
        <Card className="p-6">
          <CardHeader
            title="Chronological Clinical Event Stream"
            subtitle="Immutable audit trail of all admissions, consultations, orders, lab verifications, and medication events"
          />
          <CardBody className="pt-6">
            <div className="relative pl-6 border-l-2 border-blue-200 space-y-8">
              {clinicalTimeline.map((item) => (
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
          </CardBody>
        </Card>
      )}

      {/* Tab: Vitals Trend Charts */}
      {activeTab === 'Vitals' && (
        <Card className="p-5">
          <CardHeader
            title="Hemodynamic & Vital Trends"
            subtitle="Continuous 24-hour vital signs telemetry"
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
      )}

      {/* Tab: Laboratory */}
      {activeTab === 'Laboratory' && (
        <Card className="p-5">
          <CardHeader
            title={`Laboratory Diagnostic Orders (${patientLabs.length})`}
            subtitle="Verified pathology panels and STAT results"
          />
          <CardBody className="space-y-4 pt-3">
            {patientLabs.map((lab) => (
              <div key={lab.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{lab.testName}</h4>
                    <span className="text-xs text-slate-400 font-mono">{lab.orderNumber} • Ordered by {lab.orderedBy}</span>
                  </div>
                  {lab.status === 'Verified' ? (
                    <VerifiedBadge
                      title="Verified"
                      verifiedBy={lab.verifiedBy}
                      verifiedAt={lab.verifiedAt}
                    />
                  ) : (
                    <Badge variant="warning">{lab.status}</Badge>
                  )}
                </div>

                {lab.parameters.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs bg-white">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                        <tr>
                          <th className="p-2">Analyte</th>
                          <th className="p-2">Value</th>
                          <th className="p-2">Reference Range</th>
                          <th className="p-2">Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lab.parameters.map((p, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-medium">{p.name}</td>
                            <td className="p-2 font-bold font-mono">{p.value} {p.unit}</td>
                            <td className="p-2 text-slate-500 font-mono">{p.refRange}</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                p.flag.includes('Critical') ? 'bg-red-100 text-error' : 'bg-slate-100 text-slate-700'
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
            ))}
          </CardBody>
        </Card>
      )}

      {/* Tab: Radiology */}
      {activeTab === 'Radiology' && (
        <Card className="p-5">
          <CardHeader
            title={`Radiology Imaging Studies (${patientScans.length})`}
            subtitle="Medical imaging findings and certified radiologist impressions"
          />
          <CardBody className="space-y-4 pt-3">
            {patientScans.map((scan) => (
              <div key={scan.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{scan.modality}</h4>
                    <span className="text-xs text-slate-400 font-mono">{scan.requestNumber}</span>
                  </div>
                  {scan.status === 'Verified' ? (
                    <VerifiedBadge
                      title="Verified Study"
                      verifiedBy={scan.radiologist}
                      verifiedAt={scan.reportedAt}
                    />
                  ) : (
                    <Badge variant="info">{scan.status}</Badge>
                  )}
                </div>

                {scan.findings && (
                  <div className="text-xs space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800 uppercase text-[10px]">Findings:</span>
                      <p className="text-slate-600 mt-0.5 whitespace-pre-line">{scan.findings}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 uppercase text-[10px]">Impression:</span>
                      <p className="text-slate-800 font-semibold mt-0.5 whitespace-pre-line">{scan.impression}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Tab: Medications */}
      {activeTab === 'Medications' && (
        <Card className="p-5">
          <CardHeader
            title={`Active Medications (${patientMeds.length})`}
            subtitle="Inpatient pharmacy orders and administration schedule"
          />
          <CardBody className="pt-3">
            <div className="divide-y divide-slate-100">
              {patientMeds.map((med) => (
                <div key={med.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{med.name} {med.dose}</span>
                    <span className="text-slate-500 block mt-0.5">{med.route} • {med.frequency}</span>
                    <span className="text-slate-400 block mt-0.5">Indication: {med.indication}</span>
                  </div>
                  <Badge variant={med.scheduleStatus === 'Administered' ? 'success' : 'warning'}>
                    {med.scheduleStatus}
                  </Badge>
                </div>
              ))}
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
            {patientInvoices.map((inv) => (
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
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

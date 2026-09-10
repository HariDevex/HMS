import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  Calendar,
  FlaskConical,
  Scan,
  Pill,
  CreditCard,
  FileText,
} from 'lucide-react';

export default function PatientPortalHome() {
  const { currentUser, selectedPatient, appointments, labOrders, radiologyOrders, medications, invoices } = useApp();
  const navigate = useNavigate();

  const patient = selectedPatient;
  const myAppointments = appointments.filter((a) => a.patientId === patient.id);
  const nextAppointment = myAppointments[0] || {
    doctor: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    date: '2026-09-17',
    time: '10:00 AM',
    room: 'Consultation Suite 3B',
    type: 'Cardiology Follow-up',
  };

  const myLabs = labOrders.filter((l) => l.patientId === patient.id);
  const myScans = radiologyOrders.filter((r) => r.patientId === patient.id);
  const myMeds = medications.filter((m) => m.patientId === patient.id);
  const myInvoice = invoices.find((i) => i.patientId === patient.id && i.balanceDue > 0);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Warm Patient Welcome Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg text-white">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs text-blue-100 font-medium">MediCore Health Record</span>
              <h2 className="text-xl font-black tracking-tight">{currentUser.name}</h2>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
            {patient.mrn}
          </span>
        </div>

        <p className="text-xs text-blue-100 leading-relaxed">
          Your personal health dashboard. Access verified test results, manage prescription refills, and review appointments anytime.
        </p>
      </div>

      {/* 1. Next Appointment Card (Master Prompt Section 13) */}
      <Card className="p-5 border-blue-200 bg-blue-50/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Next Scheduled Appointment
          </span>
          <Badge variant="primary">Confirmed</Badge>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-sm">
            <span className="text-[9px] uppercase font-normal">SEP</span>
            <span className="text-base leading-none">17</span>
          </div>

          <div className="grow">
            <h3 className="text-base font-bold text-slate-900">{nextAppointment.doctor}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{nextAppointment.department} • {nextAppointment.type}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Time: <strong>{nextAppointment.time}</strong></span>
              <span>•</span>
              <span>Room: <strong>{nextAppointment.room}</strong></span>
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Need to reschedule?</span>
          <Button size="sm" variant="outline" onClick={() => navigate('/portal/appointments')}>
            View All Visits
          </Button>
        </div>
      </Card>

      {/* 2. Outstanding Balance Card (Master Prompt Section 13) */}
      {myInvoice && (
        <Card className="p-5 border-amber-200 bg-amber-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Outstanding Balance Due</span>
                <span className="text-2xl font-black text-slate-900 font-mono">${myInvoice.balanceDue.toFixed(2)}</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/portal/billing')}
            >
              Pay Online
            </Button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Insurance covered ${myInvoice.insuranceCovered.toFixed(2)}. Due by {myInvoice.dueDate}.
          </p>
        </Card>
      )}

      {/* 3. Prescription Summary (Master Prompt Section 13) */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-600" /> Current Medications ({myMeds.length})
          </h3>
          <Button size="sm" variant="ghost" onClick={() => navigate('/portal/prescriptions')}>
            Details
          </Button>
        </div>

        <div className="space-y-2.5">
          {myMeds.slice(0, 3).map((med) => (
            <div key={med.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{med.name} {med.dose}</span>
                <span className="text-slate-500">{med.frequency}</span>
              </div>
              <Badge size="sm" variant="success">Active</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. Recent Diagnostic Reports */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Recent Test Results
          </h3>
          <Button size="sm" variant="ghost" onClick={() => navigate('/portal/records')}>
            All Results
          </Button>
        </div>

        <div className="space-y-2.5">
          {myLabs.slice(0, 2).map((lab) => (
            <div key={lab.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">{lab.testName}</span>
                  <span className="text-slate-400">{lab.orderDate}</span>
                </div>
              </div>
              <Badge size="sm" variant={lab.status === 'Verified' ? 'success' : 'neutral'}>
                {lab.status}
              </Badge>
            </div>
          ))}

          {myScans.slice(0, 1).map((scan) => (
            <div key={scan.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Scan className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">{scan.modality}</span>
                  <span className="text-slate-400">{scan.orderDate}</span>
                </div>
              </div>
              <Badge size="sm" variant="purple">{scan.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Care Contact Card */}
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-900">
        <div>
          <span className="font-bold block">Medical Emergency Hotline</span>
          <span className="text-red-700">MediCore 24/7 Triage: +1 (555) 911-0000</span>
        </div>
        <a
          href="tel:911"
          className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors"
        >
          Call 911
        </a>
      </div>
    </div>
  );
}

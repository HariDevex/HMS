import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/ui/StatCard';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field, { Input, Select } from '../../components/ui/Field';
import {
  Users,
  Calendar,
  UserPlus,
  ListOrdered,
  CheckCircle2,
  Clock,
  Search,
  ReceiptText,
  Volume2,
} from 'lucide-react';

export default function ReceptionDashboard() {
  const {
    appointments,
    updateAppointmentStatus,
    bookAppointment,
    patients,
    setSelectedPatientId,
    currentUser,
    addToast,
  } = useApp();

  const navigate = useNavigate();

  // New Appointment Modal State
  const [isAptModalOpen, setIsAptModalOpen] = useState(false);
  const [aptPatientId, setAptPatientId] = useState(patients[0].id);
  const [aptDoctor, setAptDoctor] = useState('Dr. Sarah Jenkins');
  const [aptDept, setAptDept] = useState('Cardiology');
  const [aptDate, setAptDate] = useState('2026-09-10');
  const [aptTime, setAptTime] = useState('03:00 PM');
  const [aptType, setAptType] = useState('Consultation');
  const [aptNotes, setAptNotes] = useState('');

  const waitingCount = appointments.filter((a) => a.status === 'Waiting').length;
  const checkedInCount = appointments.filter((a) => a.status === 'Checked In').length;
  const inConsultCount = appointments.filter((a) => a.status === 'In Consultation').length;

  const handleCheckIn = (apt) => {
    updateAppointmentStatus(apt.id, 'Waiting');
    addToast({
      title: 'Patient Checked In',
      message: `${apt.patientName} checked in. Token #${apt.tokenNumber} called to Waiting Area.`,
      type: 'success',
    });
  };

  const handleCallPatient = (apt) => {
    addToast({
      title: `Calling Token #${apt.tokenNumber}`,
      message: `Audio alert transmitted: "${apt.patientName}, please proceed to ${apt.room}."`,
      type: 'info',
    });
  };

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.id === aptPatientId) || patients[0];
    bookAppointment({
      patientId: p.id,
      patientName: p.name,
      patientMrn: p.mrn,
      age: p.age,
      gender: p.gender,
      doctor: aptDoctor,
      department: aptDept,
      date: aptDate,
      time: aptTime,
      type: aptType,
      room: 'Consultation Room 3B',
      notes: aptNotes || 'Standard appointment booking',
    });
    setIsAptModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Reception Desk Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Front Desk & Reception Station
            </h2>
            <Badge variant="primary">Main Lobby Registration</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome, {currentUser.name}. Triage check-in, token queue allocation, and patient intake.
          </p>
        </div>

        {/* Primary Actions required by Master Prompt Section 12 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            icon={UserPlus}
            size="sm"
            onClick={() => navigate('/reception/register')}
          >
            Register Patient
          </Button>

          <Button
            variant="secondary"
            icon={Calendar}
            size="sm"
            onClick={() => setIsAptModalOpen(true)}
          >
            New Appointment
          </Button>

          <Button
            variant="secondary"
            icon={ListOrdered}
            size="sm"
            onClick={() => navigate('/reception/queue')}
          >
            Live Queue Board
          </Button>

          <Button
            variant="secondary"
            icon={ReceiptText}
            size="sm"
            onClick={() => navigate('/billing')}
          >
            Cashier & Invoices
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={appointments.length}
          subtitle="Outpatient Schedule"
          icon={Calendar}
          iconBg="bg-blue-50 text-primary"
        />
        <StatCard
          title="In Waiting Area"
          value={waitingCount}
          subtitle="Avg Wait: 14 mins"
          trend="Next: Maria Rodriguez"
          trendType="neutral"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => navigate('/reception/queue')}
        />
        <StatCard
          title="Arrived / Checked In"
          value={checkedInCount}
          subtitle="Awaiting triage call"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Active In Consultation"
          value={inConsultCount}
          subtitle="Doctors busy in rooms"
          icon={Users}
          iconBg="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Appointment Flow & Check-In Table */}
      <Card className="p-5">
        <CardHeader
          title="Today's Arrival & Check-In Desk"
          subtitle="Manage scheduled arrivals, token dispatch, and doctor consultation rooms"
          action={
            <Button size="sm" variant="ghost" icon={Search} onClick={() => navigate('/patients')}>
              Search Registry
            </Button>
          }
        />
        <CardBody className="pt-2">
          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => {
              const isWaiting = apt.status === 'Waiting';
              const isCheckedIn = apt.status === 'Checked In';
              const isScheduled = apt.status === 'Scheduled' || apt.status === 'Confirmed';
              const isDone = apt.status === 'Completed';

              return (
                <div
                  key={apt.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl px-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-black text-sm flex flex-col items-center justify-center shrink-0 border border-slate-200">
                      <span className="text-[8px] text-slate-400">TOKEN</span>
                      <span className="leading-none">{apt.tokenNumber}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{apt.patientName}</span>
                        <span className="text-xs text-slate-500 font-mono">{apt.patientMrn}</span>
                        <Badge
                          size="sm"
                          dot
                          variant={
                            apt.status === 'In Consultation'
                              ? 'purple'
                              : isWaiting
                              ? 'warning'
                              : isCheckedIn
                              ? 'info'
                              : isDone
                              ? 'success'
                              : 'neutral'
                          }
                        >
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Scheduled: <strong>{apt.time}</strong> • Doctor: <strong>{apt.doctor}</strong> • Room: {apt.room}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{apt.type} • Reason: {apt.notes}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {isScheduled && (
                      <Button
                        size="sm"
                        variant="primary"
                        icon={CheckCircle2}
                        onClick={() => handleCheckIn(apt)}
                      >
                        Check In
                      </Button>
                    )}

                    {isWaiting && (
                      <Button
                        size="sm"
                        variant="soft"
                        icon={Volume2}
                        onClick={() => handleCallPatient(apt)}
                      >
                        Call to Room
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedPatientId(apt.patientId);
                        navigate(`/patients/${apt.patientId}`);
                      }}
                    >
                      Patient Chart
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Book New Appointment Modal */}
      <Modal
        isOpen={isAptModalOpen}
        onClose={() => setIsAptModalOpen(false)}
        title="Schedule Outpatient Appointment"
        subtitle="Book physician slot and issue automated waiting token"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAptModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateAppointment}>Book & Issue Token</Button>
          </>
        }
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <Field label="Select Patient" required>
            <Select
              value={aptPatientId}
              onChange={(e) => setAptPatientId(e.target.value)}
              options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mrn})` }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Specialist Physician" required>
              <Select
                value={aptDoctor}
                onChange={(e) => setAptDoctor(e.target.value)}
                options={[
                  { value: 'Dr. Sarah Jenkins', label: 'Dr. Sarah Jenkins (Cardiology)' },
                  { value: 'Dr. Marcus Vance', label: 'Dr. Marcus Vance (Pulmonology)' },
                  { value: 'Dr. Gregory House', label: 'Dr. Gregory House (Orthopedics)' },
                  { value: 'Dr. Eleanor Vance', label: 'Dr. Eleanor Vance (General Medicine)' },
                ]}
              />
            </Field>

            <Field label="Department" required>
              <Select
                value={aptDept}
                onChange={(e) => setAptDept(e.target.value)}
                options={[
                  { value: 'Cardiology', label: 'Cardiology' },
                  { value: 'Pulmonology', label: 'Pulmonology' },
                  { value: 'Orthopedics', label: 'Orthopedics' },
                  { value: 'General Outpatient', label: 'General Outpatient' },
                ]}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Appointment Date" required>
              <Input type="date" value={aptDate} onChange={(e) => setAptDate(e.target.value)} required />
            </Field>

            <Field label="Appointment Time Slot" required>
              <Select
                value={aptTime}
                onChange={(e) => setAptTime(e.target.value)}
                options={[
                  { value: '09:00 AM', label: '09:00 AM' },
                  { value: '10:00 AM', label: '10:00 AM' },
                  { value: '11:30 AM', label: '11:30 AM' },
                  { value: '02:00 PM', label: '02:00 PM' },
                  { value: '03:30 PM', label: '03:30 PM' },
                  { value: '04:15 PM', label: '04:15 PM' },
                ]}
              />
            </Field>
          </div>

          <Field label="Appointment Type" required>
            <Select
              value={aptType}
              onChange={(e) => setAptType(e.target.value)}
              options={[
                { value: 'New Consultation', label: 'New Patient Consultation' },
                { value: 'Follow-up', label: 'Follow-up Visit' },
                { value: 'Routine Checkup', label: 'Annual Routine Checkup' },
                { value: 'Post-Op Review', label: 'Post-Operative Review' },
              ]}
            />
          </Field>

          <Field label="Clinical Reason / Intake Notes">
            <Input
              placeholder="e.g. Annual echocardiogram review, blood pressure check"
              value={aptNotes}
              onChange={(e) => setAptNotes(e.target.value)}
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card, { CardHeader } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field, { Input, Select, Textarea } from '../../components/ui/Field';
import {
  Clock,
  Search,
  Plus,
  CalendarDays,
  List,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppointmentsList() {
  const {
    appointments,
    updateAppointmentStatus,
    bookAppointment,
    patients,
    setSelectedPatientId,
  } = useApp();

  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');

  // Booking Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedPatientId, setLocalPatientId] = useState(patients[0].id);
  const [doctor, setDoctor] = useState('Dr. Sarah Jenkins');
  const [department, setDepartment] = useState('Cardiology');
  const [date, setDate] = useState('2026-09-10');
  const [time, setTime] = useState('02:00 PM');
  const [type, setType] = useState('Follow-up');
  const [notes, setNotes] = useState('');

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesDoctor = doctorFilter === 'All' || a.doctor === doctorFilter;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.id === selectedPatientId) || patients[0];
    bookAppointment({
      patientId: p.id,
      patientName: p.name,
      patientMrn: p.mrn,
      age: p.age,
      gender: p.gender,
      doctor,
      department,
      date,
      time,
      type,
      room: 'Room 3B',
      notes: notes || 'Scheduled clinic visit',
    });
    setIsBookModalOpen(false);
  };

  const columns = [
    {
      key: 'tokenNumber',
      label: 'Token #',
      sortable: true,
      render: (val) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
          {val}
        </span>
      ),
    },
    {
      key: 'patientName',
      label: 'Patient',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block font-mono">{row.patientMrn}</span>
        </div>
      ),
    },
    {
      key: 'doctor',
      label: 'Physician & Department',
      sortable: true,
      render: (val, row) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-900 block">{val}</span>
          <span className="text-slate-500">{row.department}</span>
        </div>
      ),
    },
    {
      key: 'timing',
      label: 'Schedule Date/Time',
      render: (_, row) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800 block">{row.time}</span>
          <span className="text-slate-400">{row.date}</span>
        </div>
      ),
    },
    {
      key: 'room',
      label: 'Room',
      render: (val) => <span className="text-xs font-medium text-slate-700">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const variants = {
          Scheduled: 'neutral',
          Confirmed: 'primary',
          'Checked In': 'info',
          Waiting: 'warning',
          'In Consultation': 'purple',
          Completed: 'success',
          Cancelled: 'error',
          'No Show': 'error',
        };
        return <Badge dot variant={variants[val] || 'neutral'}>{val}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'Scheduled' && (
            <Button
              size="sm"
              variant="secondary"
              className="!h-7 !text-xs !px-2"
              onClick={() => updateAppointmentStatus(row.id, 'Checked In')}
            >
              Check In
            </Button>
          )}
          {row.status === 'Checked In' && (
            <Button
              size="sm"
              variant="primary"
              className="!h-7 !text-xs !px-2"
              onClick={() => updateAppointmentStatus(row.id, 'Waiting')}
            >
              Send to Queue
            </Button>
          )}
          {row.status === 'Waiting' && (
            <Button
              size="sm"
              variant="soft"
              className="!h-7 !text-xs !px-2"
              onClick={() => {
                setSelectedPatientId(row.patientId);
                navigate('/consultation');
              }}
            >
              Start Consult
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Outpatient Clinic Appointments & Scheduling
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage provider slots, room assignments, check-ins, and consultation queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-xs text-primary' : 'text-slate-500'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-md ${viewMode === 'calendar' ? 'bg-white shadow-xs text-primary' : 'text-slate-500'}`}
              title="Calendar View"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsBookModalOpen(true)}>
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient, physician, or token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Checked In', label: 'Checked In' },
              { value: 'Waiting', label: 'Waiting in Lobby' },
              { value: 'In Consultation', label: 'In Consultation' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />

          <Select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Physicians' },
              { value: 'Dr. Sarah Jenkins', label: 'Dr. Sarah Jenkins' },
              { value: 'Dr. Marcus Vance', label: 'Dr. Marcus Vance' },
              { value: 'Dr. Gregory House', label: 'Dr. Gregory House' },
            ]}
          />
        </div>
      </Card>

      {/* View: List View */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader
            title={`Appointment Worklist (${filteredAppointments.length})`}
            subtitle="Today's chronological clinical encounters"
          />
          <Table
            columns={columns}
            data={filteredAppointments}
            emptyTitle="No appointments found"
            emptyDescription="No appointments match the specified criteria."
          />
        </Card>
      )}

      {/* View: Calendar View (Master Prompt Section 16) */}
      {viewMode === 'calendar' && (
        <Card className="p-6">
          <CardHeader
            title="September 2026 Outpatient Schedule"
            subtitle="Provider time slots and appointment distribution"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
            {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map((slotTime) => {
              const matched = appointments.filter((a) => a.time.includes(slotTime.split(' ')[0]));
              return (
                <div key={slotTime} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> {slotTime}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{matched.length} slots</span>
                  </div>

                  {matched.length === 0 ? (
                    <div className="text-[11px] text-slate-400 py-4 text-center italic">
                      Slot Available
                    </div>
                  ) : (
                    matched.map((apt) => (
                      <div key={apt.id} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs text-slate-900 truncate">{apt.patientName}</span>
                          <span className="text-[9px] font-mono font-bold bg-blue-50 text-primary px-1 rounded">
                            {apt.tokenNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{apt.doctor}</p>
                        <Badge size="sm" variant={apt.status === 'Completed' ? 'success' : 'warning'}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Outpatient Appointment"
        subtitle="Book physician slot and issue automated waiting token"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Confirm & Book Slot</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Select Patient" required>
            <Select
              value={selectedPatientId}
              onChange={(e) => setLocalPatientId(e.target.value)}
              options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.mrn})` }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Attending Physician" required>
              <Select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                options={[
                  { value: 'Dr. Sarah Jenkins', label: 'Dr. Sarah Jenkins' },
                  { value: 'Dr. Marcus Vance', label: 'Dr. Marcus Vance' },
                  { value: 'Dr. Gregory House', label: 'Dr. Gregory House' },
                ]}
              />
            </Field>

            <Field label="Department" required>
              <Select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                options={[
                  { value: 'Cardiology', label: 'Cardiology' },
                  { value: 'Pulmonology', label: 'Pulmonology' },
                  { value: 'Orthopedics', label: 'Orthopedics' },
                ]}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" required>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </Field>
            <Field label="Time Slot" required>
              <Input value={time} onChange={(e) => setTime(e.target.value)} required />
            </Field>
          </div>

          <Field label="Consultation Type">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'Follow-up', label: 'Follow-up' },
                { value: 'New Consultation', label: 'New Consultation' },
                { value: 'Routine Checkup', label: 'Routine Checkup' },
                { value: 'Urgent', label: 'Urgent / Priority' },
              ]}
            />
          </Field>

          <Field label="Appointment Reason / Notes">
            <Textarea
              rows={2}
              placeholder="e.g. Follow-up consultation for echocardiogram results"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field, { Input, Select, Textarea } from '../../components/ui/Field';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';

export default function PatientAppointments() {
  const { appointments, selectedPatient, bookAppointment, addToast } = useApp();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [doctor, setDoctor] = useState('Dr. Sarah Jenkins');
  const [department, setDepartment] = useState('Cardiology');
  const [date, setDate] = useState('2026-09-17');
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');

  const myAppointments = appointments.filter((a) => a.patientId === selectedPatient.id);

  const handleBook = (e) => {
    e.preventDefault();
    bookAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientMrn: selectedPatient.mrn,
      age: selectedPatient.age,
      gender: selectedPatient.gender,
      doctor,
      department,
      date,
      time,
      type: 'Patient Portal Booking',
      room: 'Room 3B',
      notes: reason || 'Scheduled via MediCore Patient Portal',
    });
    setIsBookModalOpen(false);
    setReason('');
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Appointments</h2>
          <p className="text-xs text-slate-500">Scheduled visits, check-ins, and consultation history</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsBookModalOpen(true)}>
          Book Visit
        </Button>
      </div>

      <div className="space-y-3">
        {myAppointments.map((apt) => (
          <Card key={apt.id} className="p-4 border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{apt.doctor}</h4>
                  <p className="text-xs text-slate-500">{apt.department} • {apt.type}</p>
                </div>
              </div>
              <Badge variant={apt.status === 'Completed' ? 'success' : apt.status === 'In Consultation' ? 'purple' : 'primary'}>
                {apt.status}
              </Badge>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Date & Time: <strong>{apt.date} at {apt.time}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location: {apt.room} (MediCore Main Hospital)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                size="sm"
                variant="secondary"
                className="!h-8 !text-xs"
                onClick={() => {
                  addToast({
                    title: 'Appointment Reminder Synced',
                    message: 'Event added to your calendar application.',
                    type: 'info',
                  });
                }}
              >
                Add to Calendar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Book Visit Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Clinic Appointment"
        subtitle="Select doctor, specialty, and preferred time slot"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleBook}>Confirm Booking</Button>
          </>
        }
      >
        <form onSubmit={handleBook} className="space-y-4 text-xs">
          <Field label="Specialty & Clinic" required>
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Cardiology', label: 'Cardiology (Heart & Circulation)' },
                { value: 'Pulmonology', label: 'Pulmonology (Lungs & Respiratory)' },
                { value: 'Orthopedics', label: 'Orthopedics (Bones & Joints)' },
              ]}
            />
          </Field>

          <Field label="Preferred Doctor" required>
            <Select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              options={[
                { value: 'Dr. Sarah Jenkins', label: 'Dr. Sarah Jenkins, MD' },
                { value: 'Dr. Marcus Vance', label: 'Dr. Marcus Vance, MD' },
                { value: 'Dr. Gregory House', label: 'Dr. Gregory House, MD' },
              ]}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" required>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </Field>

            <Field label="Preferred Time" required>
              <Select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                options={[
                  { value: '09:00 AM', label: '09:00 AM' },
                  { value: '10:00 AM', label: '10:00 AM' },
                  { value: '02:00 PM', label: '02:00 PM' },
                  { value: '03:30 PM', label: '03:30 PM' },
                ]}
              />
            </Field>
          </div>

          <Field label="Reason for Appointment">
            <Textarea
              rows={2}
              placeholder="e.g. Routine checkup or symptom follow-up"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
}

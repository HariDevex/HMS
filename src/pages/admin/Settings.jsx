import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/permissions';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Field, { Input, Select } from '../../components/ui/Field';
import Badge from '../../components/ui/Badge';
import { Save } from 'lucide-react';

export default function Settings() {
  const { addToast, currentRole } = useApp();
  const [hospitalName, setHospitalName] = useState('MediCore Central Hospital');
  const [address, setAddress] = useState('100 Medical Parkway, Springfield, IL 62701');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 911-0000');
  const [bedCapacity, setBedCapacity] = useState('84');
  const [sessionTimeout, setSessionTimeout] = useState('15');
  const [mfaEnforced, setMfaEnforced] = useState(true);

  const canEdit = can(currentRole, 'canEditSettings');

  const handleSave = (e) => {
    e.preventDefault();
    if (!canEdit) {
      addToast({
        title: 'Permission Denied',
        message: 'Only system administrators have permission to modify hospital facility settings.',
        type: 'error',
      });
      return;
    }
    addToast({
      title: 'Facility Settings Saved',
      message: 'Hospital configuration and security parameters updated.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Facility & System Settings</h2>
          <p className="text-xs text-slate-500 mt-1">Configure clinical parameters, emergency contacts, and compliance controls.</p>
        </div>
        <Badge variant="success">HIPAA Level 3 Compliant</Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hospital Info */}
        <Card className="p-5">
          <CardHeader title="Hospital Facility Profile" subtitle="General hospital facility details" />
          <CardBody className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Hospital Name" required>
                <Input value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
              </Field>
              <Field label="Emergency Hotline Phone" required>
                <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
              </Field>
            </div>

            <Field label="Hospital Campus Address" required>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Licensed Inpatient Bed Capacity">
                <Input type="number" value={bedCapacity} onChange={(e) => setBedCapacity(e.target.value)} />
              </Field>
              <Field label="Clinical Accreditation ID">
                <Input disabled value="JCAHO-MEDICORE-IL-2026" />
              </Field>
            </div>
          </CardBody>
        </Card>

        {/* Security & Access Controls */}
        <Card className="p-5">
          <CardHeader title="Security & Authentication Controls" subtitle="Staff session timeout and access rules" />
          <CardBody className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Workstation Inactivity Lockout">
                <Select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  options={[
                    { value: '5', label: '5 Minutes (High Security)' },
                    { value: '15', label: '15 Minutes (Standard Hospital)' },
                    { value: '30', label: '30 Minutes' },
                    { value: '60', label: '60 Minutes (Office only)' },
                  ]}
                />
              </Field>
              <Field label="Password Expiration Policy">
                <Select
                  options={[
                    { value: '60', label: 'Every 60 Days' },
                    { value: '90', label: 'Every 90 Days' },
                    { value: '180', label: 'Every 180 Days' },
                  ]}
                />
              </Field>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Enforce Two-Factor Authentication (2FA)</span>
                <span className="text-xs text-slate-500">Require all clinical staff to provide TOTP token at login</span>
              </div>
              <input
                type="checkbox"
                disabled={!canEdit}
                checked={mfaEnforced}
                onChange={(e) => setMfaEnforced(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-blue-400 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </CardBody>
          <CardFooter>
            <div className="text-xs text-slate-500">Last security policy audit: Yesterday by Arthur Vance</div>
            <Button type="submit" variant="primary" icon={Save} disabled={!canEdit}>
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

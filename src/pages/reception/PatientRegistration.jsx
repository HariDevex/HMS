import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Field, { Input, Select, Textarea } from '../../components/ui/Field';
import Badge from '../../components/ui/Badge';
import { Save, ArrowLeft } from 'lucide-react';

export default function PatientRegistration() {
  const { registerPatient } = useApp();
  const navigate = useNavigate();

  // Section 1: Demographics
  const [name, setName] = useState('');
  const [dob, setDob] = useState('1988-06-15');
  const [age, setAge] = useState('38');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('A+');
  // Section 2: Contact
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Section 3: Emergency Contact
  const [emName, setEmName] = useState('');
  const [emRelation, setEmRelation] = useState('Spouse');
  const [emPhone, setEmPhone] = useState('');

  // Section 4: Insurance
  const [insuranceProvider, setInsuranceProvider] = useState('Blue Cross Blue Shield');
  const [policyNumber, setPolicyNumber] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [coveragePercent, setCoveragePercent] = useState('80');

  // Section 5: Clinical Baseline
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Sarah Jenkins');
  const [department, setDepartment] = useState('Cardiology');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const allergies = allergiesText
      ? allergiesText.split(',').map((a) => ({
          allergen: a.trim(),
          severity: 'Moderate',
          reaction: 'Reported upon registration',
        }))
      : [];

    const newPatient = registerPatient({
      name,
      dob,
      age: Number(age) || 35,
      gender,
      bloodGroup,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      address,
      emergencyContact: {
        name: emName || 'Emergency Contact',
        relation: emRelation,
        phone: emPhone || phone,
      },
      insurance: {
        provider: insuranceProvider,
        policyNumber: policyNumber || 'BCBS-100293-A',
        groupNumber: groupNumber || 'GRP-991',
        status: 'Active',
        coveragePercent: Number(coveragePercent) || 80,
      },
      allergies,
      criticalAlerts: [],
      assignedDoctor,
      department,
      ward: 'Outpatient',
      bed: null,
      status: 'Outpatient',
      chiefComplaint: chiefComplaint || 'Routine medical intake registration',
      diagnosis: 'Under Evaluation',
      vitals: {
        bp: '120/80',
        systolic: 120,
        diastolic: 80,
        heartRate: 72,
        temperature: 98.6,
        tempUnit: '°F',
        respiratoryRate: 16,
        oxygenSaturation: 99,
        painLevel: 0,
        weight: '70 kg',
        height: '172 cm',
        bmi: '23.7',
        lastRecorded: 'Baseline intake at registration',
      },
    });

    navigate(`/patients/${newPatient.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/reception')}>
            Back
          </Button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Comprehensive Patient Registration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter patient demographics, insurance eligibility, and emergency contacts.
            </p>
          </div>
        </div>
        <Badge variant="primary">MRN Auto-Assigned</Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Demographics */}
        <Card className="p-5">
          <CardHeader
            title="1. Patient Demographics & Identity"
            subtitle="Legal patient identification"
          />
          <CardBody className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Legal Name" required>
                <Input
                  required
                  placeholder="e.g. Katherine Anne Bishop"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field label="Date of Birth" required>
                <Input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    const birthYear = new Date(e.target.value).getFullYear();
                    if (birthYear) setAge((2026 - birthYear).toString());
                  }}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Age (Years)" required>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </Field>

              <Field label="Gender" required>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={[
                    { value: 'Female', label: 'Female' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
              </Field>

              <Field label="Blood Group" required>
                <Select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  options={[
                    { value: 'O+', label: 'O Positive (O+)' },
                    { value: 'O-', label: 'O Negative (O-)' },
                    { value: 'A+', label: 'A Positive (A+)' },
                    { value: 'A-', label: 'A Negative (A-)' },
                    { value: 'B+', label: 'B Positive (B+)' },
                    { value: 'B-', label: 'B Negative (B-)' },
                    { value: 'AB+', label: 'AB Positive (AB+)' },
                    { value: 'AB-', label: 'AB Negative (AB-)' },
                  ]}
                />
              </Field>
            </div>
          </CardBody>
        </Card>

        {/* Section 2: Contact Info */}
        <Card className="p-5">
          <CardHeader
            title="2. Contact Details & Residential Address"
            subtitle="Communications and patient portal notifications"
          />
          <CardBody className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Primary Phone Number" required>
                <Input
                  type="tel"
                  required
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>

              <Field label="Email Address">
                <Input
                  type="email"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Permanent Residential Address" required>
              <Input
                placeholder="Street address, apartment, city, state, zip code"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Field>
          </CardBody>
        </Card>

        {/* Section 3: Emergency Contact */}
        <Card className="p-5">
          <CardHeader
            title="3. Next of Kin & Emergency Contact"
            subtitle="Designated family member or legal proxy"
          />
          <CardBody className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Emergency Contact Name" required>
                <Input
                  placeholder="e.g. Thomas Bishop"
                  value={emName}
                  onChange={(e) => setEmName(e.target.value)}
                  required
                />
              </Field>

              <Field label="Relationship" required>
                <Select
                  value={emRelation}
                  onChange={(e) => setEmRelation(e.target.value)}
                  options={[
                    { value: 'Spouse', label: 'Spouse' },
                    { value: 'Parent', label: 'Parent' },
                    { value: 'Child', label: 'Child (Adult)' },
                    { value: 'Sibling', label: 'Sibling' },
                    { value: 'Guardian', label: 'Legal Guardian' },
                  ]}
                />
              </Field>

              <Field label="Emergency Phone" required>
                <Input
                  type="tel"
                  placeholder="+1 (555) 019-2835"
                  value={emPhone}
                  onChange={(e) => setEmPhone(e.target.value)}
                  required
                />
              </Field>
            </div>
          </CardBody>
        </Card>

        {/* Section 4: Insurance */}
        <Card className="p-5">
          <CardHeader
            title="4. Health Insurance & Coverage Adjudication"
            subtitle="Payor details for real-time claims and eligibility"
          />
          <CardBody className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Insurance Payor / Carrier" required>
                <Select
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  options={[
                    { value: 'Blue Cross Blue Shield', label: 'Blue Cross Blue Shield' },
                    { value: 'Aetna Health Care', label: 'Aetna Health Care' },
                    { value: 'Medicare Part A & B', label: 'Medicare Part A & B' },
                    { value: 'Cigna Health', label: 'Cigna Health' },
                    { value: 'UnitedHealthcare', label: 'UnitedHealthcare' },
                    { value: 'Self-Pay / Uninsured', label: 'Self-Pay / Cash Account' },
                  ]}
                />
              </Field>

              <Field label="Policy / Member ID" required>
                <Input
                  placeholder="e.g. BCBS-9948210"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Group Plan Number">
                <Input
                  placeholder="e.g. GRP-4820"
                  value={groupNumber}
                  onChange={(e) => setGroupNumber(e.target.value)}
                />
              </Field>

              <Field label="Estimated Coverage Rate (%)">
                <Select
                  value={coveragePercent}
                  onChange={(e) => setCoveragePercent(e.target.value)}
                  options={[
                    { value: '90', label: '90% Coverage (Platinum/Medicare)' },
                    { value: '80', label: '80% Coverage (Standard Commercial)' },
                    { value: '70', label: '70% Coverage (Bronze Plan)' },
                    { value: '0', label: '0% Coverage (Self-Pay)' },
                  ]}
                />
              </Field>
            </div>
          </CardBody>
        </Card>

        {/* Section 5: Clinical Intake Baseline */}
        <Card className="p-5">
          <CardHeader
            title="5. Clinical Triage Baseline"
            subtitle="Chief complaint and known drug allergies"
          />
          <CardBody className="space-y-4 pt-4">
            <Field label="Known Drug Allergies (comma-separated)">
              <Input
                placeholder="e.g. Penicillin, Sulfa, Aspirin (leave blank if None)"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
              />
            </Field>

            <Field label="Chief Presenting Complaint / Intake Symptoms" required>
              <Textarea
                rows={3}
                placeholder="e.g. Patient presents with palpitations and mild shortness of breath upon exertion over past 3 days."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                required
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Assign Initial Attending Physician" required>
                <Select
                  value={assignedDoctor}
                  onChange={(e) => setAssignedDoctor(e.target.value)}
                  options={[
                    { value: 'Dr. Sarah Jenkins', label: 'Dr. Sarah Jenkins (Cardiology)' },
                    { value: 'Dr. Marcus Vance', label: 'Dr. Marcus Vance (Pulmonology)' },
                    { value: 'Dr. Gregory House', label: 'Dr. Gregory House (Orthopedics)' },
                  ]}
                />
              </Field>

              <Field label="Intake Department" required>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  options={[
                    { value: 'Cardiology', label: 'Cardiology' },
                    { value: 'Pulmonology', label: 'Pulmonology' },
                    { value: 'Orthopedics', label: 'Orthopedics' },
                    { value: 'Emergency Services', label: 'Emergency Services' },
                  ]}
                />
              </Field>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="secondary" onClick={() => navigate('/reception')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Save}>
              Complete Registration & Create Chart
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

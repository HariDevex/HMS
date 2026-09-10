import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card, { CardHeader } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Search, UserPlus, Eye, AlertTriangle } from 'lucide-react';

export default function PatientList() {
  const { patients, setSelectedPatientId } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || p.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      label: 'Patient Name / MRN',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-primary font-bold text-xs flex items-center justify-center shrink-0">
            {val.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900">{val}</div>
            <div className="text-xs font-mono text-slate-500">{row.mrn}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'age',
      label: 'Demographics',
      render: (val, row) => (
        <span className="text-xs text-slate-600">
          {val}y • {row.gender} • <strong className="text-slate-800">{row.bloodGroup}</strong>
        </span>
      ),
    },
    {
      key: 'diagnosis',
      label: 'Primary Condition',
      render: (val) => <span className="text-xs font-medium text-slate-800 truncate max-w-xs block">{val}</span>,
    },
    {
      key: 'assignedDoctor',
      label: 'Attending Physician',
      sortable: true,
      render: (val, row) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-900 block">{val}</span>
          <span className="text-slate-400">{row.department}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status / Location',
      render: (val, row) => (
        <div>
          <Badge dot variant={val === 'Admitted' ? 'error' : 'neutral'}>{val}</Badge>
          {row.bed && (
            <span className="text-[11px] text-slate-500 font-mono block mt-0.5">{row.bed}</span>
          )}
        </div>
      ),
    },
    {
      key: 'allergies',
      label: 'Allergies',
      render: (val) =>
        val.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" /> {val[0].allergen}
          </span>
        ) : (
          <span className="text-slate-400 text-xs font-mono">NKDA</span>
        ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button
          size="sm"
          variant="secondary"
          icon={Eye}
          onClick={() => {
            setSelectedPatientId(row.id);
            navigate(`/patients/${row.id}`);
          }}
        >
          View Chart
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Master Patient Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and search electronic medical records across all inpatient wards and outpatient clinics.
          </p>
        </div>

        <Button
          variant="primary"
          icon={UserPlus}
          size="sm"
          onClick={() => navigate('/reception/register')}
        >
          Register New Patient
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, MRN, or clinical condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-10 px-3 text-sm bg-slate-50 rounded-lg border border-slate-300 font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pulmonology">Pulmonology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-sm bg-slate-50 rounded-lg border border-slate-300 font-medium"
          >
            <option value="All">All Admissions</option>
            <option value="Admitted">Admitted Inpatients</option>
            <option value="Outpatient">Outpatient</option>
          </select>
        </div>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader
          title={`Registered Patients (${filteredPatients.length})`}
          subtitle="Showing authorized clinical records"
        />
        <Table
          columns={columns}
          data={filteredPatients}
          onRowClick={(row) => {
            setSelectedPatientId(row.id);
            navigate(`/patients/${row.id}`);
          }}
          emptyTitle="No patients found"
          emptyDescription="No patient records match the specified search parameters."
        />
      </Card>
    </div>
  );
}

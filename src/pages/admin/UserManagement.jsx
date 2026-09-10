import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card, { CardHeader } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field, { Input, Select } from '../../components/ui/Field';
import {
  UserPlus,
  Search,
  Mail,
  Phone,
  Edit2,
} from 'lucide-react';

export default function UserManagement() {
  const { users, addUser, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Doctor');
  const [newUserDept, setNewUserDept] = useState('Cardiology');
  const [newUserPhone, setNewUserPhone] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept,
      phone: newUserPhone || '+1 (555) 000-1122',
    });

    setIsAddModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-primary font-bold text-xs flex items-center justify-center">
            {val.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{val}</div>
            <div className="text-xs text-slate-500 font-mono">{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role & Permissions',
      sortable: true,
      render: (val) => {
        const variants = {
          Administrator: 'error',
          Doctor: 'primary',
          Nurse: 'purple',
          'Lab Technician': 'warning',
          'Radiology Technician': 'info',
          Receptionist: 'neutral',
        };
        return <Badge variant={variants[val] || 'neutral'}>{val}</Badge>;
      },
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700">{val}</span>,
    },
    {
      key: 'email',
      label: 'Contact Info',
      render: (val, row) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Mail className="w-3 h-3 text-slate-400" /> {val}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Phone className="w-3 h-3 text-slate-400" /> {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge
          dot
          variant={val === 'Active' ? 'success' : val === 'Suspended' ? 'error' : 'neutral'}
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last Active',
      render: (val) => <span className="text-xs text-slate-400">{val}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button
          size="sm"
          variant="ghost"
          icon={Edit2}
          onClick={() => {
            addToast({
              title: 'Edit Permissions',
              message: `Opened security permissions editor for ${row.name}.`,
              type: 'info',
            });
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Staff & Access Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage hospital staff accounts, clinical roles, department affiliations, and authentication status.
          </p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setIsAddModalOpen(true)}>
          Add New Staff Member
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Input
              icon={Search}
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'Administrator', label: 'Administrator' },
              { value: 'Doctor', label: 'Doctor' },
              { value: 'Nurse', label: 'Nurse' },
              { value: 'Lab Technician', label: 'Lab Technician' },
              { value: 'Radiology Technician', label: 'Radiology Technician' },
              { value: 'Receptionist', label: 'Receptionist' },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Suspended', label: 'Suspended' },
            ]}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader
          title={`Hospital Staff (${filteredUsers.length})`}
          subtitle="Showing authorized clinical and operational accounts"
        />
        <Table
          columns={columns}
          data={filteredUsers}
          emptyTitle="No staff members found"
          emptyDescription="Try adjusting your search query or filters above."
        />
      </Card>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Hospital Staff"
        subtitle="Provision access credentials and assign role permissions"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateUser}>
              Save & Provision Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Field label="Full Name with Credential" required>
            <Input
              required
              placeholder="e.g. Dr. Eleanor Vance, MD"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </Field>

          <Field label="Hospital Email" required>
            <Input
              type="email"
              required
              placeholder="e.vance@medicore.org"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Hospital Role" required>
              <Select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                options={[
                  { value: 'Doctor', label: 'Doctor (Physician)' },
                  { value: 'Nurse', label: 'Registered Nurse (RN)' },
                  { value: 'Lab Technician', label: 'Lab Technologist' },
                  { value: 'Radiology Technician', label: 'Radiology Specialist' },
                  { value: 'Receptionist', label: 'Front Desk / Cashier' },
                  { value: 'Administrator', label: 'Administrator' },
                ]}
              />
            </Field>

            <Field label="Department" required>
              <Select
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                options={[
                  { value: 'Cardiology', label: 'Cardiology' },
                  { value: 'Pulmonology', label: 'Pulmonology' },
                  { value: 'Orthopedics', label: 'Orthopedics' },
                  { value: 'Intensive Care Unit (ICU)', label: 'Intensive Care Unit (ICU)' },
                  { value: 'Pathology & Laboratory', label: 'Pathology & Laboratory' },
                  { value: 'Diagnostic Imaging', label: 'Diagnostic Imaging' },
                  { value: 'Outpatient Services', label: 'Outpatient Services' },
                  { value: 'Executive Operations', label: 'Executive Operations' },
                ]}
              />
            </Field>
          </div>

          <Field label="Official Contact Phone">
            <Input
              placeholder="+1 (555) 901-2355"
              value={newUserPhone}
              onChange={(e) => setNewUserPhone(e.target.value)}
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
}

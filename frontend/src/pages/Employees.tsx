import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AvatarWithBadge } from '@/components/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { Search, Filter, Download, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: 'admin' | 'employee';
  employmentType: string;
  status: 'present' | 'absent' | 'on-leave';
  joiningDate: string;
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@dayflow.com', employeeId: 'ADM001', department: 'Human Resources', role: 'admin', employmentType: 'Full-time', status: 'present', joiningDate: '2023-01-15' },
  { id: '2', name: 'John Smith', email: 'john.s@dayflow.com', employeeId: 'EMP001', department: 'Engineering', role: 'employee', employmentType: 'Full-time', status: 'present', joiningDate: '2023-03-20' },
  { id: '3', name: 'Emily Davis', email: 'emily.d@dayflow.com', employeeId: 'EMP002', department: 'Design', role: 'employee', employmentType: 'Full-time', status: 'absent', joiningDate: '2023-05-10' },
  { id: '4', name: 'Michael Brown', email: 'michael.b@dayflow.com', employeeId: 'ADM002', department: 'Finance', role: 'admin', employmentType: 'Full-time', status: 'present', joiningDate: '2022-11-01' },
  { id: '5', name: 'Jessica Wilson', email: 'jessica.w@dayflow.com', employeeId: 'EMP003', department: 'Marketing', role: 'employee', employmentType: 'Part-time', status: 'on-leave', joiningDate: '2023-07-15' },
  { id: '6', name: 'David Lee', email: 'david.l@dayflow.com', employeeId: 'EMP004', department: 'Engineering', role: 'employee', employmentType: 'Full-time', status: 'present', joiningDate: '2023-02-28' },
  { id: '7', name: 'Amanda Garcia', email: 'amanda.g@dayflow.com', employeeId: 'EMP005', department: 'Sales', role: 'employee', employmentType: 'Full-time', status: 'present', joiningDate: '2023-04-05' },
  { id: '8', name: 'Robert Martinez', email: 'robert.m@dayflow.com', employeeId: 'EMP006', department: 'Support', role: 'employee', employmentType: 'Contract', status: 'absent', joiningDate: '2023-08-12' },
  { id: '9', name: 'Lisa Anderson', email: 'lisa.a@dayflow.com', employeeId: 'ADM003', department: 'Operations', role: 'admin', employmentType: 'Full-time', status: 'present', joiningDate: '2022-09-20' },
  { id: '10', name: 'Kevin Thomas', email: 'kevin.t@dayflow.com', employeeId: 'EMP007', department: 'Engineering', role: 'employee', employmentType: 'Full-time', status: 'on-leave', joiningDate: '2023-06-01' },
];

const Employees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const navigate = useNavigate();

  const departments = ['all', 'Human Resources', 'Engineering', 'Design', 'Finance', 'Marketing', 'Sales', 'Support', 'Operations'];
  const statuses = ['all', 'present', 'absent', 'on-leave'];
  const roles = ['all', 'admin', 'employee'];

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    const matchesRole = selectedRole === 'all' || emp.role === selectedRole;
    return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
  });

  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(e => e.id));
    }
  };

  const toggleSelectEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setSelectedRole('all');
  };

  const handleRowClick = (employee: Employee) => {
    navigate(employee.role === 'admin' ? '/profile/admin' : '/profile/employee');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Employees" subtitle="Manage your team members" />

      <div className="p-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Employees</h2>
            <p className="text-muted-foreground">Manage your team members</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Departments</option>
                {departments.slice(1).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary capitalize"
              >
                <option value="all">All Status</option>
                {statuses.slice(1).map(status => (
                  <option key={status} value={status} className="capitalize">{status.replace('-', ' ')}</option>
                ))}
              </select>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary capitalize"
              >
                <option value="all">All Roles</option>
                {roles.slice(1).map(role => (
                  <option key={role} value={role} className="capitalize">{role}</option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Employee</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Employee ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Joining Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(employee)}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => toggleSelectEmployee(employee.id)}
                        className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <AvatarWithBadge
                          name={employee.name}
                          role={employee.role}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground font-mono">{employee.employeeId}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{employee.department}</td>
                    <td className="px-4 py-4 text-sm text-foreground capitalize">{employee.role}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{employee.employmentType}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={employee.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {new Date(employee.joiningDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEmployees.length} of {mockEmployees.length} employees
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50" disabled>
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-foreground">1</span>
              <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50" disabled>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;

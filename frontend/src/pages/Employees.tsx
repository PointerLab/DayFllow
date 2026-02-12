import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AvatarWithBadge } from '@/components/Avatar';
import { Search, Download, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '@/api/employees';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  login_id: string;
  role: 'ADMIN' | 'HR' | 'EMP';
  date_of_joining: string;
  is_active: boolean;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const navigate = useNavigate();

  const roles = ['all', 'ADMIN', 'HR', 'EMP'];

  useEffect(() => {
    let isMounted = true;

    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        if (isMounted) {
          setEmployees(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load employees');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEmployees();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name} ${emp.last_name}`.trim().toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.login_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || emp.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(e => e.id));
    }
  };

  const toggleSelectEmployee = (id: number) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
  };

  const handleRowClick = (employee: Employee) => {
    navigate(employee.role === 'EMP' ? '/profile/employee' : '/profile/admin');
  };

  const getRoleBadgeType = (role: Employee['role']) => (role === 'EMP' ? 'employee' : 'admin');
  const getRoleLabel = (role: Employee['role']) => {
    if (role === 'ADMIN') return 'Admin';
    if (role === 'HR') return 'HR';
    return 'Employee';
  };

  const getStatusLabel = (active: boolean) => (active ? 'Active' : 'Inactive');
  const getStatusClass = (active: boolean) =>
    active
      ? 'bg-success text-success-foreground'
      : 'bg-muted text-muted-foreground';

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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Joining Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={7}>
                      Loading employees...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-error" colSpan={7}>
                      {error}
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={7}>
                      No employees yet. Add employees to see them here.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => {
                    const fullName = `${employee.first_name} ${employee.last_name}`.trim() || employee.login_id;
                    return (
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
                              name={fullName}
                              role={getRoleBadgeType(employee.role)}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium text-foreground">{fullName}</p>
                              <p className="text-sm text-muted-foreground">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground font-mono">{employee.login_id}</td>
                        <td className="px-4 py-4 text-sm text-foreground">{getRoleLabel(employee.role)}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(employee.is_active)}`}>
                            {getStatusLabel(employee.is_active)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground">
                          {new Date(employee.date_of_joining).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <MoreVertical size={16} className="text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEmployees.length} of {employees.length} employees
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

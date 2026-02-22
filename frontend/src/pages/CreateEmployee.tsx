import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { createEmployee } from '@/api/employees';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CreateEmployee: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'EMP' | 'INT' | 'HR'>('EMP');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState<{ login_id: string; temporary_password: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const canCreateHr = user?.role === 'ADMIN';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await createEmployee({
        first_name: firstName,
        last_name: lastName,
        email,
        role,
        date_of_joining: dateOfJoining,
        department: department || undefined,
        employment_type: role === 'HR' ? undefined : (employmentType || undefined),
      });

      setCreated({
        login_id: data.login_id,
        temporary_password: data.temporary_password,
      });

      toast({
        title: 'Employee created',
        description: 'Temporary credentials are ready below.',
      });
    } catch (error: any) {
      const message = error?.message || 'Failed to create employee.';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToEmployees = () => {
    navigate('/employees', { state: { refreshKey: Date.now() } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Employees / Create" subtitle="Add a new employee" />

      <div className="p-6">
        <div className="max-w-2xl bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Create Employee</h2>
          <p className="text-muted-foreground mb-6">Fill in the details below. A temporary password will be generated.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => {
                    const nextRole = e.target.value as 'EMP' | 'INT' | 'HR';
                    setRole(nextRole);
                    if (nextRole === 'HR') {
                      setEmploymentType('');
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="EMP">Employee</option>
                  <option value="INT">Intern</option>
                  {canCreateHr && <option value="HR">HR</option>}
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-foreground mb-2">Date of Joining</label>
                <input
                  type="date"
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Engineering"
                />
              </div>
              {role !== 'HR' && (
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-foreground mb-2">Employment Type</label>
                  <input
                    type="text"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Full-time"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Creating...' : 'Create Employee'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/employees')}
                className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {created && (
            <div className="mt-8 rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Temporary Credentials</p>
              <div className="text-sm text-muted-foreground">Login ID: <span className="font-mono text-foreground">{created.login_id}</span></div>
              <div className="text-sm text-muted-foreground">Temp Password: <span className="font-mono text-foreground">{created.temporary_password}</span></div>
              <button
                onClick={handleGoToEmployees}
                className="mt-4 px-4 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-accent transition-colors"
              >
                Go to Employees
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;

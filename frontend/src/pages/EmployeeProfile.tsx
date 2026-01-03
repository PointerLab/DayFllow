import React from 'react';
import { Header } from '@/components/layout/Header';
import { AvatarWithBadge } from '@/components/Avatar';
import { Mail, Phone, MapPin, Calendar, Briefcase, Building2, User, FileText, Clock } from 'lucide-react';

const EmployeeProfile: React.FC = () => {
  const employeeInfo = {
    name: 'John Smith',
    email: 'john.s@dayflow.com',
    mobile: '+1 (555) 987-6543',
    employeeId: 'EMP001',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    manager: 'Lisa Anderson',
    location: 'San Francisco, CA',
    joiningDate: '2023-03-20',
    employmentType: 'Full-time',
    workPhone: '+1 (555) 123-0001',
    dateOfBirth: '1990-05-15',
    emergencyContact: 'Jane Smith - +1 (555) 222-3333',
    address: '123 Tech Street, San Francisco, CA 94102',
  };

  const documents = [
    { name: 'Employment Contract', date: '2023-03-20' },
    { name: 'NDA Agreement', date: '2023-03-20' },
    { name: 'ID Verification', date: '2023-03-18' },
    { name: 'Tax Form W-4', date: '2023-03-22' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Profile" subtitle="Employee Profile" />

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <AvatarWithBadge
                  name={employeeInfo.name}
                  role="employee"
                  size="xl"
                />
                <h2 className="text-xl font-bold text-foreground mt-4">{employeeInfo.name}</h2>
                <p className="text-primary font-medium">{employeeInfo.position}</p>
                <span className="mt-2 px-3 py-1 bg-lavender text-primary text-sm rounded-full">
                  {employeeInfo.department}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Briefcase size={16} className="text-primary" />
                  </div>
                  <span className="text-muted-foreground">Employee ID:</span>
                  <span className="text-foreground font-medium font-mono ml-auto">{employeeInfo.employeeId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Mail size={16} className="text-primary" />
                  </div>
                  <span className="text-foreground">{employeeInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <span className="text-foreground">{employeeInfo.mobile}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Private Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-6">Company Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Building2 size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium text-foreground">{employeeInfo.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <User size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Manager</p>
                    <p className="text-sm font-medium text-foreground">{employeeInfo.manager}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{employeeInfo.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Calendar size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joining Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(employeeInfo.joiningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Briefcase size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Job Title</p>
                    <p className="text-sm font-medium text-foreground">{employeeInfo.position}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Clock size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Employment Type</p>
                    <p className="text-sm font-medium text-foreground">{employeeInfo.employmentType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Work Phone</p>
                    <p className="text-sm font-medium text-foreground">{employeeInfo.workPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Calendar size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(employeeInfo.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency & Address */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-6">Emergency Contact & Address</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Emergency Contact</p>
                    <p className="text-sm font-medium text-foreground">{employeeInfo.emergencyContact}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-lavender rounded-lg">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium text-foreground">{employeeInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-6">Documents</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div 
                    key={doc.name}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-lavender rounded-lg">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AvatarWithBadge } from '@/components/Avatar';
import { Mail, Phone, MapPin, Calendar, Briefcase, Building2, FileText, Award, Heart, Code } from 'lucide-react';

const AdminProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary'>('salary');

  const adminInfo = {
    name: 'Sarah Johnson',
    email: 'sarah.j@dayflow.com',
    mobile: '+1 (555) 123-4567',
    loginId: 'ADM001',
    department: 'Human Resources',
    position: 'HR Director',
    location: 'New York, NY',
    joiningDate: '2023-01-15',
  };

  const salaryInfo = {
    monthly: '$12,500',
    yearly: '$150,000',
    workSchedule: '40 hours/week',
    components: [
      { name: 'Basic Salary', amount: '$9,000' },
      { name: 'Housing Allowance', amount: '$2,000' },
      { name: 'Transport Allowance', amount: '$500' },
      { name: 'Medical Allowance', amount: '$500' },
      { name: 'Performance Bonus', amount: '$500' },
    ],
    deductions: [
      { name: 'Federal Tax', amount: '$2,500' },
      { name: 'State Tax', amount: '$800' },
      { name: 'Social Security', amount: '$775' },
      { name: 'Medicare', amount: '$181' },
      { name: '401(k)', amount: '$625' },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Profile" subtitle="Admin Profile" />

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <AvatarWithBadge
                  name={adminInfo.name}
                  role="admin"
                  size="xl"
                />
                <h2 className="text-xl font-bold text-foreground mt-4">{adminInfo.name}</h2>
                <p className="text-primary font-medium">{adminInfo.position}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Briefcase size={16} className="text-primary" />
                  </div>
                  <span className="text-muted-foreground">Login ID:</span>
                  <span className="text-foreground font-medium ml-auto">{adminInfo.loginId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Mail size={16} className="text-primary" />
                  </div>
                  <span className="text-foreground">{adminInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-lavender rounded-lg">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <span className="text-foreground">{adminInfo.mobile}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {(['resume', 'private', 'salary'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {tab === 'resume' && 'Resume'}
                  {tab === 'private' && 'Private Info'}
                  {tab === 'salary' && 'Salary Info'}
                </button>
              ))}
            </div>

            {/* About Section */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                Passionate HR professional with over 10 years of experience in talent acquisition, 
                employee relations, and organizational development. Dedicated to creating positive 
                workplace cultures and driving strategic HR initiatives.
              </p>
            </div>

            {/* Skills */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Leadership', 'Recruitment', 'Employee Relations', 'HRIS', 'Payroll', 'Compliance'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-lavender text-primary text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Salary Info Banner */}
            {activeTab === 'salary' && (
              <div className="bg-warning/50 border border-warning-foreground/20 rounded-xl px-4 py-3">
                <p className="text-sm text-warning-foreground font-medium">
                  ⚠️ This information should only be visible to Admin
                </p>
              </div>
            )}

            {/* Salary Overview */}
            {activeTab === 'salary' && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">Monthly Wage</p>
                    <p className="text-2xl font-bold text-foreground">{salaryInfo.monthly}</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">Yearly Wage</p>
                    <p className="text-2xl font-bold text-foreground">{salaryInfo.yearly}</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">Work Schedule</p>
                    <p className="text-2xl font-bold text-foreground">{salaryInfo.workSchedule}</p>
                  </div>
                </div>

                {/* Salary Components */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Salary Components</h3>
                  </div>
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Component</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {salaryInfo.components.map((component) => (
                        <tr key={component.name}>
                          <td className="px-6 py-3 text-sm text-foreground">{component.name}</td>
                          <td className="px-6 py-3 text-sm text-foreground text-right font-medium">{component.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tax Deductions */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Tax Deductions & Contributions</h3>
                  </div>
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Deduction</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {salaryInfo.deductions.map((deduction) => (
                        <tr key={deduction.name}>
                          <td className="px-6 py-3 text-sm text-foreground">{deduction.name}</td>
                          <td className="px-6 py-3 text-sm text-destructive text-right font-medium">-{deduction.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Resume Tab */}
            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Award size={18} className="text-primary" />
                    Certifications
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">SHRM-SCP Certified</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">PHR Certification</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">Certified Compensation Professional</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Heart size={18} className="text-primary" />
                    Hobbies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Reading', 'Hiking', 'Photography', 'Yoga', 'Cooking'].map((hobby) => (
                      <span key={hobby} className="px-3 py-1.5 bg-lavender text-primary text-sm rounded-full">
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Private Info Tab */}
            {activeTab === 'private' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-6">Private Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-lavender rounded-lg">
                      <Building2 size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium text-foreground">{adminInfo.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-lavender rounded-lg">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium text-foreground">{adminInfo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-lavender rounded-lg">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Joining Date</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(adminInfo.joiningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

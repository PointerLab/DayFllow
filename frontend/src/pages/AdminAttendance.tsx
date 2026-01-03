import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AvatarWithBadge } from '@/components/Avatar';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const mockAttendance = [
  { id: '1', name: 'Sarah Johnson', role: 'admin' as const, checkIn: '09:00 AM', checkOut: '06:15 PM', workHours: '9h 15m', extra: '+1h 15m' },
  { id: '2', name: 'John Smith', role: 'employee' as const, checkIn: '08:45 AM', checkOut: '05:30 PM', workHours: '8h 45m', extra: '+45m' },
  { id: '3', name: 'Emily Davis', role: 'employee' as const, checkIn: '09:30 AM', checkOut: '05:00 PM', workHours: '7h 30m', extra: '-30m' },
  { id: '4', name: 'Michael Brown', role: 'admin' as const, checkIn: '08:00 AM', checkOut: '06:00 PM', workHours: '10h 00m', extra: '+2h' },
  { id: '5', name: 'Jessica Wilson', role: 'employee' as const, checkIn: '09:15 AM', checkOut: '05:45 PM', workHours: '8h 30m', extra: '+30m' },
  { id: '6', name: 'David Lee', role: 'employee' as const, checkIn: '10:00 AM', checkOut: '05:00 PM', workHours: '7h 00m', extra: '-1h' },
  { id: '7', name: 'Amanda Garcia', role: 'employee' as const, checkIn: '08:30 AM', checkOut: '06:30 PM', workHours: '10h 00m', extra: '+2h' },
  { id: '8', name: 'Robert Martinez', role: 'employee' as const, checkIn: '09:00 AM', checkOut: '05:00 PM', workHours: '8h 00m', extra: '0' },
  { id: '9', name: 'Lisa Anderson', role: 'admin' as const, checkIn: '08:15 AM', checkOut: '05:45 PM', workHours: '9h 30m', extra: '+1h 30m' },
  { id: '10', name: 'Kevin Thomas', role: 'employee' as const, checkIn: '09:45 AM', checkOut: '06:00 PM', workHours: '8h 15m', extra: '+15m' },
];

const AdminAttendance: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Attendance" subtitle="For Admin/HR Officer" />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Attendance List View</h2>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentDate(d => new Date(d.setDate(d.getDate() - 1)))} className="p-2 hover:bg-muted rounded-lg"><ChevronLeft size={18} /></button>
              <span className="font-medium text-foreground">{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <button onClick={() => setCurrentDate(d => new Date(d.setDate(d.getDate() + 1)))} className="p-2 hover:bg-muted rounded-lg"><ChevronRight size={18} /></button>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Work Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Extra Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockAttendance.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><AvatarWithBadge name={emp.name} role={emp.role} size="sm" /><span className="font-medium text-foreground">{emp.name}</span></div></td>
                  <td className="px-4 py-3 text-sm text-foreground">{emp.checkIn}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{emp.checkOut}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{emp.workHours}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${emp.extra.startsWith('+') ? 'text-success-foreground' : emp.extra.startsWith('-') ? 'text-warning-foreground' : 'text-muted-foreground'}`}>{emp.extra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;

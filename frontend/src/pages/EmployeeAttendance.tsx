import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ChevronLeft, ChevronRight, Calendar, Check, Clock } from 'lucide-react';

const myAttendance = [
  { date: '2024-01-15', checkIn: '09:00 AM', checkOut: '06:00 PM', workHours: '9h 00m', extra: '+1h' },
  { date: '2024-01-14', checkIn: '08:45 AM', checkOut: '05:30 PM', workHours: '8h 45m', extra: '+45m' },
  { date: '2024-01-13', checkIn: '09:15 AM', checkOut: '05:45 PM', workHours: '8h 30m', extra: '+30m' },
  { date: '2024-01-12', checkIn: '09:00 AM', checkOut: '05:00 PM', workHours: '8h 00m', extra: '0' },
  { date: '2024-01-11', checkIn: '08:30 AM', checkOut: '06:30 PM', workHours: '10h 00m', extra: '+2h' },
];

const EmployeeAttendance: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Attendance" subtitle="For Employees" />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">My Attendance</h2>
        <div className="bg-lavender rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentDate(d => new Date(d.setMonth(d.getMonth() - 1)))} className="p-2 hover:bg-card rounded-lg"><ChevronLeft size={18} /></button>
              <span className="font-medium text-foreground">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => setCurrentDate(d => new Date(d.setMonth(d.getMonth() + 1)))} className="p-2 hover:bg-card rounded-lg"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl p-4 text-center">
              <Check className="mx-auto mb-2 text-success-foreground" size={24} />
              <p className="text-2xl font-bold text-foreground">20</p>
              <p className="text-sm text-muted-foreground">Days Present</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center">
              <Calendar className="mx-auto mb-2 text-info-foreground" size={24} />
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">Leaves Taken</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center">
              <Clock className="mx-auto mb-2 text-primary" size={24} />
              <p className="text-2xl font-bold text-foreground">22</p>
              <p className="text-sm text-muted-foreground">Total Working Days</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Work Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Extra Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myAttendance.map((day) => (
                <tr key={day.date} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm text-foreground">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{day.checkIn}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{day.checkOut}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{day.workHours}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${day.extra.startsWith('+') ? 'text-success-foreground' : 'text-muted-foreground'}`}>{day.extra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;

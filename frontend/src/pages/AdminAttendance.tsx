import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AvatarWithBadge } from '@/components/Avatar';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { fetchAllAttendance } from '@/api/attendance';

interface AttendanceRecord {
  id: number;
  user: number;
  user_login_id: string;
  user_name: string;
  user_role: 'ADMIN' | 'HR' | 'EMP';
  date: string;
  check_in: string | null;
  check_out: string | null;
  total_hours: number;
  status: 'PRESENT' | 'HALF_DAY' | 'ABSENT' | 'LEAVE';
}

const toLocalDateString = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (value: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatHours = (hours: number) => {
  if (!Number.isFinite(hours)) return '--';
  return `${hours.toFixed(2)}h`;
};

const getRoleBadgeType = (role: AttendanceRecord['user_role']) => (role === 'EMP' ? 'employee' : 'admin');

const statusLabel = (status: AttendanceRecord['status']) => {
  if (status === 'PRESENT') return 'Present';
  if (status === 'HALF_DAY') return 'Half Day';
  if (status === 'LEAVE') return 'Leave';
  return 'Absent';
};

const statusClass = (status: AttendanceRecord['status']) => {
  if (status === 'PRESENT') return 'bg-success text-success-foreground';
  if (status === 'HALF_DAY') return 'bg-info text-info-foreground';
  if (status === 'LEAVE') return 'bg-info text-info-foreground';
  return 'bg-warning text-warning-foreground';
};

const AdminAttendance: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAttendance = async () => {
      try {
        const data = await fetchAllAttendance();
        if (isMounted) {
          setAttendance(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load attendance');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAttendance();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAttendance = useMemo(() => {
    const targetDate = toLocalDateString(currentDate);
    return attendance.filter((record) => {
      const matchesDate = record.date === targetDate;
      const searchValue = searchQuery.trim().toLowerCase();
      if (!searchValue) {
        return matchesDate;
      }
      const name = record.user_name.toLowerCase();
      const loginId = record.user_login_id.toLowerCase();
      return matchesDate && (name.includes(searchValue) || loginId.includes(searchValue));
    });
  }, [attendance, currentDate, searchQuery]);

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
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm"
              />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Work Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={5}>
                    Loading attendance...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-error" colSpan={5}>
                    {error}
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={5}>
                    No attendance data yet.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <AvatarWithBadge name={record.user_name || record.user_login_id} role={getRoleBadgeType(record.user_role)} size="sm" />
                        <div>
                          <span className="font-medium text-foreground">{record.user_name || record.user_login_id}</span>
                          <div className="text-xs text-muted-foreground">{record.user_login_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{formatTime(record.check_in)}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{formatTime(record.check_out)}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{formatHours(record.total_hours)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass(record.status)}`}>
                        {statusLabel(record.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;

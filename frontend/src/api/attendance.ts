import { apiGet } from '@/api/client';

export interface AttendanceRecord {
  id: number;
  user: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  total_hours: number;
  status: 'PRESENT' | 'HALF_DAY' | 'ABSENT' | 'LEAVE';
  created_at: string;
}

export const fetchAllAttendance = async () => {
  return apiGet('/attendance/all/');
};

export const fetchMyAttendance = async () => {
  return apiGet('/attendance/my/') as Promise<AttendanceRecord[]>;
};

import { apiGet, apiPost } from '@/api/client';

export type LeaveType = 'CASUAL' | 'SICK' | 'PAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequestResponse {
  id: number;
  user: number;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  created_at: string;
}

export interface ApplyLeavePayload {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
}

export const fetchMyLeaves = async () => {
  return apiGet('/leave/my/') as Promise<LeaveRequestResponse[]>;
};

export const applyLeaveRequest = async (payload: ApplyLeavePayload) => {
  return apiPost('/leave/apply/', payload);
};

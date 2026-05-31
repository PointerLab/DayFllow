import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { Plus, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeRefresh } from '@/hooks/useRealtimeRefresh';
import {
  applyLeaveRequest,
  fetchMyLeaves,
  type LeaveRequestResponse,
  type LeaveStatus,
  type LeaveType,
} from '@/api/leaves';

const leaveTypeLabel: Record<LeaveType, string> = {
  PAID: 'Paid Leave',
  SICK: 'Sick Leave',
  CASUAL: 'Casual Leave',
};

const toStatusBadge = (status: LeaveStatus) => {
  if (status === 'APPROVED') return 'approved';
  if (status === 'REJECTED') return 'rejected';
  return 'pending';
};

const parseDate = (value: string) => new Date(`${value}T00:00:00`);

const countLeaveDays = (startDate: string, endDate: string) => {
  const start = parseDate(startDate).getTime();
  const end = parseDate(endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const EmployeeLeaves: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'PAID' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });
  const { toast } = useToast();

  const loadRequests = async () => {
    try {
      const data = await fetchMyLeaves();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leave requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  useRealtimeRefresh(() => {
    void loadRequests();
  });

  const handleSubmit = async () => {
    if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason.trim()) {
      toast({
        title: 'Missing details',
        description: 'Please fill start date, end date, and reason.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await applyLeaveRequest({
        leave_type: newRequest.type,
        start_date: newRequest.startDate,
        end_date: newRequest.endDate,
        reason: newRequest.reason.trim(),
      });
      toast({ title: 'Request Submitted', description: 'Your leave request has been sent for approval.' });
      setShowModal(false);
      setNewRequest({ type: 'PAID', startDate: '', endDate: '', reason: '' });
      await loadRequests();
    } catch (err) {
      toast({
        title: 'Unable to submit',
        description: err instanceof Error ? err.message : 'Failed to submit leave request.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const approvedPaidDays = useMemo(
    () => requests
      .filter((req) => req.status === 'APPROVED' && req.leave_type === 'PAID')
      .reduce((total, req) => total + countLeaveDays(req.start_date, req.end_date), 0),
    [requests],
  );

  const approvedSickDays = useMemo(
    () => requests
      .filter((req) => req.status === 'APPROVED' && req.leave_type === 'SICK')
      .reduce((total, req) => total + countLeaveDays(req.start_date, req.end_date), 0),
    [requests],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Leaves" subtitle="For Employees" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">My Time Off</h2>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-orchid-dark transition-colors"><Plus size={18} />New Request</button>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="px-4 py-2 bg-lavender rounded-full text-sm font-medium text-foreground">Paid Leave Approved: {approvedPaidDays} Days</div>
          <div className="px-4 py-2 bg-lavender rounded-full text-sm font-medium text-foreground">Sick Leave Approved: {approvedSickDays} Days</div>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Start Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">End Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={4}>
                    Loading leave requests...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-destructive" colSpan={4}>
                    {error}
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={4}>
                    No leave requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm text-foreground">{parseDate(req.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{parseDate(req.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{leaveTypeLabel[req.leave_type] ?? req.leave_type}</td>
                    <td className="px-4 py-3"><StatusBadge status={toStatusBadge(req.status)} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-medium">
            <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-foreground">New Leave Request</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-lg"><X size={18} /></button></div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select
                  value={newRequest.type}
                  onChange={e => setNewRequest({ ...newRequest, type: e.target.value as LeaveType })}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="PAID">Paid Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-foreground mb-1">Start</label><input type="date" value={newRequest.startDate} onChange={e => setNewRequest({ ...newRequest, startDate: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">End</label><input type="date" value={newRequest.endDate} onChange={e => setNewRequest({ ...newRequest, endDate: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Reason</label>
                <textarea
                  value={newRequest.reason}
                  onChange={e => setNewRequest({ ...newRequest, reason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground resize-none"
                  placeholder="Briefly describe why you need leave"
                />
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Attachment</label><div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground"><Upload size={24} className="mx-auto mb-2" /><span className="text-sm">For sick leave certificates</span></div></div>
              <div className="flex gap-3 pt-2"><button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">Discard</button><button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-orchid-dark transition-colors disabled:opacity-60">{isSubmitting ? 'Submitting...' : 'Submit'}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaves;

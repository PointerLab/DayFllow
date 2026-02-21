import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AvatarWithBadge } from '@/components/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { Check, X, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  fetchAllLeaves,
  reviewLeaveRequest,
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

const AdminLeaves: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequestResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadRequests = async () => {
    try {
      const data = await fetchAllLeaves();
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

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return requests;

    return requests.filter((request) => {
      const name = (request.user_name || `User #${request.user}`).toLowerCase();
      const leaveType = (leaveTypeLabel[request.leave_type] || request.leave_type).toLowerCase();
      const status = request.status.toLowerCase();
      return name.includes(query) || leaveType.includes(query) || status.includes(query);
    });
  }, [requests, searchTerm]);

  const pendingFiltered = filteredRequests.filter((request) => request.status === 'PENDING');
  const paidRequests = requests.filter((request) => request.leave_type === 'PAID').length;
  const sickRequests = requests.filter((request) => request.leave_type === 'SICK').length;

  const handleApprove = () => {
    handleReview('APPROVE');
  };

  const handleReject = () => {
    handleReview('REJECT');
  };

  const handleReview = async (action: 'APPROVE' | 'REJECT') => {
    if (selectedIds.length === 0) return;

    try {
      setIsSubmitting(true);
      const ids = [...selectedIds];
      await Promise.all(ids.map((id) => reviewLeaveRequest(id, action)));
      await loadRequests();
      setSelectedIds([]);
      toast({
        title: action === 'APPROVE' ? 'Approved' : 'Rejected',
        description: `${ids.length} request(s) ${action === 'APPROVE' ? 'approved' : 'rejected'}.`,
        variant: action === 'APPROVE' ? 'default' : 'destructive',
      });
    } catch (err) {
      toast({
        title: 'Action failed',
        description: err instanceof Error ? err.message : 'Failed to update leave request.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const allPendingSelected = pendingFiltered.length > 0 && selectedIds.length === pendingFiltered.length;

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Leaves" subtitle="For Admin & HR Officer" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Time Off Requests</h2>
            <p className="text-muted-foreground">Approve or reject employee leave requests</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              className="p-3 bg-error rounded-full hover:opacity-80 transition-opacity disabled:opacity-60"
              disabled={selectedIds.length === 0 || isSubmitting}
            >
              <X size={18} className="text-error-foreground" />
            </button>
            <button
              onClick={handleApprove}
              className="p-3 bg-success rounded-full hover:opacity-80 transition-opacity disabled:opacity-60"
              disabled={selectedIds.length === 0 || isSubmitting}
            >
              <Check size={18} className="text-success-foreground" />
            </button>
          </div>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex gap-4"><span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">Paid Requests: {paidRequests}</span><span className="px-3 py-1 bg-info text-info-foreground rounded-full text-sm">Sick Requests: {sickRequests}</span></div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm"
                />
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={() =>
                        setSelectedIds(
                          allPendingSelected ? [] : pendingFiltered.map((request) => request.id)
                        )
                      }
                      checked={allPendingSelected}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Employee</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Start</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">End</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={6}>
                      Loading leave requests...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-destructive" colSpan={6}>
                      {error}
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={6}>
                      No matching leave requests.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        {req.status === 'PENDING' && (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(req.id)}
                            onChange={() => toggleSelect(req.id)}
                            className="w-4 h-4 rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <AvatarWithBadge
                            name={req.user_name || `User #${req.user}`}
                            role={req.user_role === 'ADMIN' || req.user_role === 'HR' ? 'admin' : 'employee'}
                            size="sm"
                          />
                          <span className="font-medium text-foreground">{req.user_name || `User #${req.user}`}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {parseDate(req.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {parseDate(req.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{leaveTypeLabel[req.leave_type] ?? req.leave_type}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={toStatusBadge(req.status)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-info/30 rounded-xl p-6 h-fit">
            <p className="text-sm text-info-foreground">Employees can view only their own time off records, while Admins and HR Officers can view time off records & approve/reject them for all employees.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaves;

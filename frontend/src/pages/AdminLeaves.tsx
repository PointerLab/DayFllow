import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AvatarWithBadge } from '@/components/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { Check, X, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest { id: string; name: string; role: 'admin' | 'employee'; startDate: string; endDate: string; type: string; status: 'pending' | 'approved' | 'rejected'; }

const AdminLeaves: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handleApprove = () => {
    if (selectedIds.length === 0) return;
    setRequests(prev => prev.map(r => selectedIds.includes(r.id) && r.status === 'pending' ? { ...r, status: 'approved' } : r));
    toast({ title: 'Approved', description: `${selectedIds.length} request(s) approved.` });
    setSelectedIds([]);
  };

  const handleReject = () => {
    if (selectedIds.length === 0) return;
    setRequests(prev => prev.map(r => selectedIds.includes(r.id) && r.status === 'pending' ? { ...r, status: 'rejected' } : r));
    toast({ title: 'Rejected', description: `${selectedIds.length} request(s) rejected.`, variant: 'destructive' });
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

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
            <button onClick={handleReject} className="p-3 bg-error rounded-full hover:opacity-80 transition-opacity" disabled={selectedIds.length === 0}><X size={18} className="text-error-foreground" /></button>
            <button onClick={handleApprove} className="p-3 bg-success rounded-full hover:opacity-80 transition-opacity" disabled={selectedIds.length === 0}><Check size={18} className="text-success-foreground" /></button>
          </div>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex gap-4"><span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">Paid: 24 Days</span><span className="px-3 py-1 bg-info text-info-foreground rounded-full text-sm">Sick: 07 Days</span></div>
              <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm" /></div>
            </div>
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left"><input type="checkbox" onChange={() => setSelectedIds(selectedIds.length === requests.filter(r => r.status === 'pending').length ? [] : requests.filter(r => r.status === 'pending').map(r => r.id))} checked={selectedIds.length === requests.filter(r => r.status === 'pending').length && selectedIds.length > 0} className="w-4 h-4 rounded" /></th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Employee</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Start</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">End</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={6}>
                      No leave requests yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        {req.status === 'pending' && (
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
                          <AvatarWithBadge name={req.name} role={req.role} size="sm" />
                          <span className="font-medium text-foreground">{req.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{req.type}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} />
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

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { Plus, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest { id: string; startDate: string; endDate: string; type: string; status: 'pending' | 'approved' | 'rejected'; }

const initialRequests: LeaveRequest[] = [
  { id: '1', startDate: '2024-01-20', endDate: '2024-01-22', type: 'Paid Time Off', status: 'pending' },
  { id: '2', startDate: '2024-01-10', endDate: '2024-01-11', type: 'Sick Leave', status: 'approved' },
  { id: '3', startDate: '2024-01-05', endDate: '2024-01-05', type: 'Paid Time Off', status: 'rejected' },
];

const EmployeeLeaves: React.FC = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ type: 'Paid Time Off', startDate: '', endDate: '', days: '1' });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newRequest.startDate || !newRequest.endDate) return;
    setRequests(prev => [...prev, { id: Date.now().toString(), ...newRequest, status: 'pending' }]);
    toast({ title: 'Request Submitted', description: 'Your leave request has been sent for approval.' });
    setShowModal(false);
    setNewRequest({ type: 'Paid Time Off', startDate: '', endDate: '', days: '1' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="Leaves" subtitle="For Employees" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">My Time Off</h2>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-orchid-dark transition-colors"><Plus size={18} />New Request</button>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="px-4 py-2 bg-lavender rounded-full text-sm font-medium text-foreground">Paid Time Off: 26 Days</div>
          <div className="px-4 py-2 bg-lavender rounded-full text-sm font-medium text-foreground">Sick Leave: 07 Days</div>
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
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm text-foreground">{new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{req.type}</td>
                  <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-medium">
            <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-foreground">New Leave Request</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-lg"><X size={18} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Type</label><select value={newRequest.type} onChange={e => setNewRequest({ ...newRequest, type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"><option>Paid Time Off</option><option>Sick Leave</option><option>Unpaid Leave</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-foreground mb-1">Start</label><input type="date" value={newRequest.startDate} onChange={e => setNewRequest({ ...newRequest, startDate: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">End</label><input type="date" value={newRequest.endDate} onChange={e => setNewRequest({ ...newRequest, endDate: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" /></div>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Attachment</label><div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground"><Upload size={24} className="mx-auto mb-2" /><span className="text-sm">For sick leave certificates</span></div></div>
              <div className="flex gap-3 pt-2"><button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">Discard</button><button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-orchid-dark transition-colors">Submit</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaves;

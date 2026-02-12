import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { fetchPendingHr, approveHr } from "@/api/hrApproval";

interface HrRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  login_id: string;
  date_of_joining: string;
  department: string;
  employment_type: string;
}

const HrApprovals: React.FC = () => {
  const [requests, setRequests] = useState<HrRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadRequests = async () => {
    try {
      const data = await fetchPendingHr();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveHr(id);
      setRequests((prev) => prev.filter((req) => req.id !== id));
      toast({
        title: "Approved",
        description: "HR account approved.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to approve.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumb="HR Approvals" subtitle="Approve HR signups" />
      <div className="p-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Pending HR Requests</h2>
            <p className="text-sm text-muted-foreground">
              Approve HR accounts before they can log in.
            </p>
          </div>

          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="p-6 text-sm text-destructive">{error}</div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No pending HR requests.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Login ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Employment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req) => {
                  const name = `${req.first_name} ${req.last_name}`.trim() || req.email;
                  return (
                    <tr key={req.id}>
                      <td className="px-4 py-3 text-sm text-foreground">{name}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{req.email}</td>
                      <td className="px-4 py-3 text-sm text-foreground font-mono">{req.login_id}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{req.department || "--"}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{req.employment_type || "--"}</td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-success text-success-foreground text-sm font-medium"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrApprovals;

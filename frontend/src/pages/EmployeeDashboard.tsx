import React, { useCallback, useEffect, useState } from "react";
import { fetchEmployeeDashboard } from "@/api/dashboard";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeRefresh } from "@/hooks/useRealtimeRefresh";

interface EmployeeDashboardStats {
  today_status: string;
  today_check_in: string | null;
  today_check_out: string | null;
  present_days: number;
  leave_days: number;
  pending_leaves: number;
  payroll_status: "PENDING" | "PAID";
}

const statusLabel = (status: string, checkIn: string | null, checkOut: string | null) => {
  const normalized = status?.toUpperCase();
  if (checkOut) return "Check Out";
  if (checkIn) return "Check In";
  if (normalized === "LEAVE") return "On Leave";
  if (normalized === "PENDING" || normalized === "ABSENT") return "Pending";
  return "Pending";
};

const EmployeeDashboard: React.FC = () => {
  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      const data = await fetchEmployeeDashboard();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard(true);
  }, [loadDashboard]);

  useRealtimeRefresh(() => {
    void loadDashboard(false);
  });

  return (
    <div className="p-6 space-y-6">
      <Header breadcrumb="Dashboard" subtitle="Employee Overview" />

      {error && (
        <div className="bg-card border border-border rounded-xl p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {loading ? "—" : statusLabel(
                stats?.today_status || "",
                stats?.today_check_in ?? null,
                stats?.today_check_out ?? null,
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Present Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {loading ? "—" : stats?.present_days ?? 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leave Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {loading ? "—" : stats?.leave_days ?? 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {loading ? "—" : stats?.pending_leaves ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payroll Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {loading ? "—" : stats?.payroll_status ?? "PENDING"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Current month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

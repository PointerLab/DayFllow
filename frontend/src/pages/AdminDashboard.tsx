import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminDashboard } from "@/api/dashboard";
import {
  DashboardNotification,
  NotificationPanel,
} from "@/components/dashboard/NotificationPanel";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface AdminDashboardStats {
  total_employees: number;
  present_today: number;
  absent_today: number;
  on_leave_today: number;
  pending_leaves: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN" || user?.role === "HR";
  const notifications: DashboardNotification[] = [
    {
      id: "admin-pending-leaves",
      title: "Pending leave requests",
      message: "3 leave requests are waiting for your approval.",
      time: "10 minutes ago",
      tone: "warning",
      read: false,
    },
    {
      id: "admin-new-employee",
      title: "New employee onboarding",
      message: "A new employee profile was created and is ready for review.",
      time: "1 hour ago",
      tone: "info",
      read: false,
    },
    {
      id: "admin-attendance-closed",
      title: "Attendance synced",
      message: "Today's attendance sheet has been processed successfully.",
      time: "Today, 9:15 AM",
      tone: "success",
      read: true,
    },
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchAdminDashboard();
        if (mounted) {
          setStats(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Header breadcrumb="Dashboard" subtitle="Admin & HR Overview" />
        <div className="mt-6 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground">Access restricted</h2>
          <p className="text-sm text-muted-foreground mt-2">
            This dashboard is available only to HR and Admin users.
          </p>
          <button
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
            onClick={() => navigate("/dashboard/employee")}
          >
            Go to Employee Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Header breadcrumb="Dashboard" subtitle="Admin & HR Overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {loading ? "—" : stats?.total_employees ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {loading ? "—" : stats?.present_today ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Absent Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {loading ? "—" : stats?.absent_today ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>On Leave Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {loading ? "—" : stats?.on_leave_today ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-4xl font-bold text-foreground">
                {loading ? "—" : stats?.pending_leaves ?? 0}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Review and act on leave requests from employees.
            </p>
            <button
              className="mt-4 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium"
              onClick={() => navigate("/leaves/admin")}
            >
              Review Leaves
            </button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
              onClick={() => navigate("/employees/new")}
            >
              Create Employee
            </button>
            <button
              className="w-full px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium"
              onClick={() => navigate("/employees")}
            >
              View Employees
            </button>
            <button
              className="w-full px-4 py-2 rounded-lg bg-muted text-foreground font-medium"
              onClick={() => navigate("/attendance/admin")}
            >
              Attendance Summary
            </button>
          </CardContent>
        </Card>
      </div>

      <NotificationPanel title="Admin Notifications" items={notifications} />
    </div>
  );
};

export default AdminDashboard;

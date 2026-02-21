import { apiGet } from "./client";

export const fetchAdminDashboard = async () => {
  return apiGet("/dashboard/admin/");
};

export const fetchEmployeeDashboard = async () => {
  return apiGet("/dashboard/employee/");
};

export type NotificationTone = "info" | "success" | "warning";

export interface DashboardNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  tone: NotificationTone;
  read: boolean;
}

export interface DashboardNotificationsResponse {
  items: DashboardNotificationItem[];
}

export const fetchDashboardNotifications = async () => {
  return apiGet("/dashboard/notifications/") as Promise<DashboardNotificationsResponse>;
};

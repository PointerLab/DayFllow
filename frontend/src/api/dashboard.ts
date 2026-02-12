import { apiGet } from "./client";

export const fetchAdminDashboard = async () => {
  return apiGet("/dashboard/admin/");
};

export const fetchEmployeeDashboard = async () => {
  return apiGet("/dashboard/employee/");
};

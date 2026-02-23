import { apiGet, apiPost } from "@/api/client";

export const fetchEmployees = async (scope?: "non_admin" | "employees_only") => {
  const query = scope ? `?scope=${scope}` : "";
  return apiGet(`/accounts/employees/${query}`);
};

export const createEmployee = async (payload: {
  first_name: string;
  last_name: string;
  email: string;
  role: "EMP" | "INT" | "HR";
  date_of_joining: string;
  department?: string;
  employment_type?: string;
}) => {
  return apiPost("/auth/create-employee/", payload);
};

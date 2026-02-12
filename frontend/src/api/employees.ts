import { apiGet, apiPost } from "@/api/client";

export const fetchEmployees = async () => {
  return apiGet("/accounts/employees/");
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

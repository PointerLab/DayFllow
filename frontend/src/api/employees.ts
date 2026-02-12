import { apiGet } from "@/api/client";

export const fetchEmployees = async () => {
  return apiGet("/accounts/employees/");
};

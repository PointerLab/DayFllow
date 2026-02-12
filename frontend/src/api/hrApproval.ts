import { apiGet, apiPost } from "@/api/client";

export const fetchPendingHr = async () => {
  return apiGet("/accounts/hr-requests/");
};

export const approveHr = async (id: number) => {
  return apiPost(`/accounts/hr-requests/${id}/approve/`, {});
};

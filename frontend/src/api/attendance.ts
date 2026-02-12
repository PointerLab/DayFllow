import { apiGet } from "@/api/client";

export const fetchAllAttendance = async () => {
  return apiGet("/attendance/all/");
};

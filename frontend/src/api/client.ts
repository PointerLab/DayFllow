const BASE_URL = "/api";

const getAuthHeaders = () => {
  const raw = localStorage.getItem("dayflow_auth_tokens");
  if (!raw) {
    return {};
  }

  try {
    const tokens = JSON.parse(raw);
    if (tokens?.access) {
      return { Authorization: `Bearer ${tokens.access}` };
    }
  } catch {
    return {};
  }

  return {};
};

const parseError = async (response: Response) => {
  try {
    const data = await response.json();
    const message =
      (data?.detail as string) ||
      Object.values(data || {}).flat().join(" ") ||
      response.statusText;
    return message || "Request failed";
  } catch {
    return response.statusText || "Request failed";
  }
};

export const apiGet = async (path: string) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

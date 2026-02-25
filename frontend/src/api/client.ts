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

export const apiPost = async (path: string, body: unknown) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const apiPut = async (path: string, body: unknown) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const apiDownload = async (path: string) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="([^"]+)"/i);
  const filename = match?.[1] || "download";
  return { blob, filename };
};

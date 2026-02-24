export const API = import.meta.env.VITE_API_URL;

function joinUrl(base, path) {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

function getErrorMessage(result) {
  if (typeof result === "string") return result;
  return result.error || result.message || JSON.stringify(result);
}

export async function apiRequest(
  resource,
  options = {},
  { token, isFormData } = {},
) {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(joinUrl(API, resource), {
    ...options,
    headers,
  });

  const isJson = /json/.test(response.headers.get("Content-Type") || "");
  const result = isJson ? await response.json() : await response.text();

  if (!response.ok) throw new Error(getErrorMessage(result));
  return result;
}

import axios, { type AxiosResponse } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function parseApiBlobError(error: unknown): Promise<string> {
  if (!axios.isAxiosError(error) || !error.response?.data) {
    return error instanceof Error ? error.message : "An unexpected error occurred.";
  }

  const data = error.response.data;
  if (data instanceof Blob) {
    const errorText = await data.text();
    try {
      const errorJson = JSON.parse(errorText) as { detail?: string };
      return errorJson.detail || "Request failed";
    } catch {
      return "Request failed";
    }
  }

  if (typeof data === "object" && data !== null && "detail" in data) {
    return String((data as { detail: unknown }).detail);
  }

  return "Request failed";
}

export function getFilenameFromResponse(
  response: AxiosResponse<Blob>,
  fallback: string
): string {
  const contentDisposition = response.headers["content-disposition"];
  if (!contentDisposition) return fallback;

  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
  if (filenameMatch?.[1]) return filenameMatch[1];
  return fallback;
}

export async function postJsonFromApi<T>(endpoint: string, formData: FormData): Promise<T> {
  const response = await axios.post(`${API_URL}${endpoint}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data as T;
}

export async function postUrlEncodedFromApi<T>(endpoint: string, data: Record<string, string>): Promise<T> {
  const body = new URLSearchParams(data);
  const response = await axios.post(`${API_URL}${endpoint}`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data as T;
}
export async function downloadBlobFromApi(
  endpoint: string,
  formData: FormData,
  fallbackFilename: string
): Promise<void> {
  const response = await axios.post(`${API_URL}${endpoint}`, formData, {
    responseType: "blob",
    headers: { "Content-Type": "multipart/form-data" },
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", getFilenameFromResponse(response, fallbackFilename));
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}

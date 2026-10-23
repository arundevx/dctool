/** Normalize NEXT_PUBLIC_API_URL whether or not it ends with `/api`. */

function stripTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

/** Origin only, e.g. `http://localhost:8000` */
export function getApiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const trimmed = stripTrailingSlashes(raw);
  return trimmed.replace(/\/api$/i, "") || "http://localhost:8000";
}

/** FastAPI mount, e.g. `http://localhost:8000/api` */
export function getApiBaseUrl(): string {
  return `${getApiOrigin()}/api`;
}

export type ApiError = {
  status: number;
  message: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    let errorMessage = response.statusText;

    if (isJson) {
      try {
        const data = (await response.json()) as any;
        errorMessage = data.message ?? errorMessage;
      } catch {
        // ignore parse error
      }
    }

    throw { status: response.status, message: errorMessage } satisfies ApiError;
  }

  if (!isJson) {
    // @ts-expect-error - caller expects T but API returned non-JSON
    return undefined;
  }

  return (await response.json()) as T;
}

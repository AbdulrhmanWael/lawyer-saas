// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiFetch<T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });

  if (res.status === 401) {
    const refreshed = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (refreshed.ok) {
      const data = await refreshed.json();
      document.cookie = `token=${data.access_token}; path=/; SameSite=Lax`;
      return apiFetch<T>(input, init);
    } else {
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return res.json() as Promise<T>;
}

export async function getAccessToken(): Promise<string | null> {
  if (typeof document !== "undefined") {
    const match = /(^| )token=([^;]+)/.exec(document.cookie);
    return match ? match[2] : null;
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

export const apiClient = {
  get: <T>(url: string, params?: Record<string, string | number>) => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return apiFetch<T>(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}${qs}`);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(url: string, body?: any, headers?: HeadersInit) =>
    apiFetch<T>(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers:
        body instanceof FormData
          ? headers
          : { "Content-Type": "application/json", ...(headers || {}) },
    }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T>(url: string, body?: any, headers?: HeadersInit) =>
    apiFetch<T>(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers:
        body instanceof FormData
          ? headers
          : { "Content-Type": "application/json", ...(headers || {}) },
    }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: <T>(url: string, body?: any, headers?: HeadersInit) =>
    apiFetch<T>(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers:
        body instanceof FormData
          ? headers
          : { "Content-Type": "application/json", ...(headers || {}) },
    }),
  delete: <T>(url: string) =>
    apiFetch<T>(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
      method: "DELETE",
    }),
};

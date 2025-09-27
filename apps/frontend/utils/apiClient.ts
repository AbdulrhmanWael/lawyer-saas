import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiFetch<T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const isServer = typeof window === "undefined";

  let headers: HeadersInit = init?.headers || {};

  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    if (cookieString) {
      headers = {
        ...headers,
        Cookie: cookieString,
      };
    }
  }

  const res = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshed = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers,
      }
    );

    if (refreshed.ok) {
      return apiFetch<T>(input, init);
    } else {
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  if (
    init?.method &&
    ["POST", "PUT", "PATCH"].includes(init.method.toUpperCase())
  ) {
    toast.success("Request successful!");
  }

  return res.json() as Promise<T>;
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

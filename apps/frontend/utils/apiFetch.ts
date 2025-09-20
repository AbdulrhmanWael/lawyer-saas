import { NextRequest } from "next/server";

export async function apiFetchEdge<T = unknown>(
  req: NextRequest,
  url: string,
  triedRefresh = false
): Promise<T> {
  let cookieHeader = req.headers.get("cookie") || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    headers: { cookie: cookieHeader },
    credentials: "include",
  });

  if (res.status === 401 && !triedRefresh) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { cookie: cookieHeader },
        credentials: "include",
      }
    );

    if (!refreshRes.ok) throw new Error("Unauthorized");

    const setCookies = refreshRes.headers.getSetCookie?.()
      ?? refreshRes.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/)
      ?? [];

    const cookies = setCookies
      .map(c => c.split(";")[0])
      .join("; ");

    cookieHeader = cookies;

    const retryRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`,
      {
        headers: { cookie: cookieHeader },
        credentials: "include",
      }
    );

    if (!retryRes.ok) throw new Error(`Retry failed: ${retryRes.status}`);

    return retryRes.json() as Promise<T>;
  }

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return res.json() as Promise<T>;
}

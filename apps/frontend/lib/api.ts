export async function apiFetch(endpoint: string, options?: RequestInit) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
    options
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

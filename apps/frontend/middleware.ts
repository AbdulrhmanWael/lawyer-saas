import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiFetchEdge } from "./utils/apiFetch";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const locale = req.nextUrl.pathname.split("/")[1] || routing.defaultLocale;
  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname.startsWith(`/${locale}/admin/login`);
  const isAdminRoute = pathname.startsWith(`/${locale}/admin`);

  if (isAdminRoute && !isLoginPage) {
    try {
      const user = await apiFetchEdge<{ role: string }>(req, "/auth/me");

      const roles = await apiFetchEdge<{ name: string }[]>(req, "/roles");
      const allowedRoles = roles.map((r) => r.name);

      if (!allowedRoles.includes(user.role)) {
        const referer = req.headers.get("referer");
        const fallback = `/${locale}`;
        let redirectTo = fallback;

        if (referer) {
          const refUrl = new URL(referer, req.url);
          redirectTo = `/${locale}${refUrl.pathname}`;
        }

        return NextResponse.redirect(redirectTo);
      }

      return res;
    } catch (err) {
      console.error("middleware error:", err);
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

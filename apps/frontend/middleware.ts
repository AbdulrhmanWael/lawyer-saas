import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const locale = req.nextUrl.pathname.split("/")[1] || routing.defaultLocale;
  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname.startsWith(`/${locale}/admin/login`);
  const isAdminRoute = pathname.startsWith(`/${locale}/admin`);

  if (isAdminRoute && !isLoginPage) {
    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        {
          headers: { cookie: req.headers.get("cookie") || "" },
          credentials: "include",
        }
      );

      if (!apiRes.ok) {
        return NextResponse.redirect(
          new URL(`/${locale}/admin/login`, req.url)
        );
      }

      const user = await apiRes.json();

      if (user.role !== "admin") {
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
    } catch {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

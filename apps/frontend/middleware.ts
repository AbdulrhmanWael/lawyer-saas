import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const token = req.cookies.get("token")?.value;

  const locale = req.nextUrl.pathname.split("/")[1] || routing.defaultLocale;

  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname.startsWith(`/${locale}/admin/login`);
  const isAdminRoute = pathname.startsWith(`/${locale}/admin`);

  if (!token && isAdminRoute && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

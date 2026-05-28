import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

function isProtectedPath(pathname: string) {
  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return false;
  }

  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

function isValidBasicAuth(header: string | null) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const username = process.env.ADMIN_USERNAME || "admin";
  if (!header?.startsWith("Basic ")) return false;

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separator = decoded.indexOf(":");
    const user = decoded.slice(0, separator);
    const pass = decoded.slice(separator + 1);

    return user === username && pass === password;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  if (!isProtectedPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await verifyAdminSession(session)) {
    return NextResponse.next();
  }

  if (isValidBasicAuth(req.headers.get("authorization"))) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { ok: false, message: "Acesso administrativo necessário." },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

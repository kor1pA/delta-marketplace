import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match as matchLocale } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { i18n } from "@/i18n/config" // Make sure this file exports a valid object with locales and defaultLocale
import { getToken } from "next-auth/jwt";

// Define a type for the i18n object
interface I18nConfig {
  locales: string[];
  defaultLocale: string;
}

// Cast the imported i18n object to I18nConfig type
const i18nTyped = i18n as I18nConfig;

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
  // @ts-ignore locales are readonly
  const locales: string[] = i18nTyped.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return matchLocale(languages, locales, i18nTyped.defaultLocale)
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip static files, API, auth routes etc.
  const isStaticFile = /\.(jpg|jpeg|png|gif|svg|ico|css|js)$/i.test(pathname)
  const isApiRoute = pathname.startsWith("/api/")
  const isPublicRoute = pathname.startsWith("/_next") || pathname === "/favicon.ico"

  if (isStaticFile || isApiRoute || isPublicRoute) {
    const response = NextResponse.next()
    addSecurityHeaders(response)
    return response
  }

  // Ensure that locales is defined; if not, use a fallback.
  if (!i18nTyped.locales || !Array.isArray(i18nTyped.locales)) {
    console.warn("i18nTyped.locales is undefined or invalid. Skipping locale check.");
    return NextResponse.next();
  }

  const pathnameHasLocale = i18nTyped.locales.some(
    (locale: string) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    const response = NextResponse.next()
    addSecurityHeaders(response)
    return response
  }

  // Redirect to a URL with the detected locale.
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
  request.nextUrl.searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value)
  })
  const response = NextResponse.redirect(newUrl)
  addSecurityHeaders(response)
  return response
}

// Security headers function (unchanged)
function addSecurityHeaders(response: NextResponse) {
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'self'; object-src 'none';",
  )
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")
  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

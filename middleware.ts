import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, Locale } from "@/lib/i18n/config";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      url.pathname = "/admin/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Redirect authenticated user from /admin/login to /admin dashboard
  if (pathname === "/admin/login" && user) {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Skip static files, api, admin, sitemap, robots
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return response;
  }

  // 2. Locale Redirection Check
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value as Locale;
    let locale: Locale = DEFAULT_LOCALE;

    if (LOCALES.includes(cookieLocale)) {
      locale = cookieLocale;
    } else {
      try {
        const { data: settings } = await supabase
          .from("business_settings")
          .select("default_locale")
          .limit(1)
          .single();

        const dbDefault = (settings?.default_locale as Locale) || DEFAULT_LOCALE;
        locale = LOCALES.includes(dbDefault) ? dbDefault : DEFAULT_LOCALE;
      } catch {
        locale = DEFAULT_LOCALE;
      }
    }

    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

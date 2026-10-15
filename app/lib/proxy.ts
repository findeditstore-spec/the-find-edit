import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isAdministrator(claims: Record<string, unknown> | undefined) {
  if (!claims) return false;

  const appMetadata = claims.app_metadata as Record<string, unknown> | undefined;
  if (appMetadata?.role === "admin") return true;

  const email = typeof claims.email === "string" ? claims.email.trim().toLowerCase() : "";
  const allowedEmails = (process.env.TFE_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && allowedEmails.includes(email));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Let the public admin login page render even when Supabase configuration is
  // missing, so a deployment configuration issue does not become a blank page.
  if (!supabaseUrl || !supabaseKey) {
    return request.nextUrl.pathname === "/admin/login"
      ? response
      : NextResponse.redirect(new URL("/admin/login?error=configuration", request.url));
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as Record<string, unknown> | undefined;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const signedIn = Boolean(claims);
  const administrator = isAdministrator(claims);

  if (isAdminRoute && !isLoginPage && !signedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdminRoute && !isLoginPage && signedIn && !administrator) {
    return NextResponse.redirect(new URL("/admin/login?error=admin_required", request.url));
  }

  return response;
}

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

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase configuration missing" },
      { status: 500 }
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as Record<string, unknown> | undefined;

  if (!isAdministrator(claims)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { names } = body as { names: string[] };

    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json(
        { error: "Invalid names array" },
        { status: 400 }
      );
    }

    // Query all products and filter in-memory for case-insensitive matching
    // Avoids PostgreSQL's case-sensitive .in() operator
    const { data: allProducts, error } = await supabase
      .from("products")
      .select("name");

    if (error) {
      console.error("Error checking duplicates:", error);
      return NextResponse.json(
        { error: "Failed to check duplicates" },
        { status: 500 }
      );
    }

    // Normalize all product names for case-insensitive comparison
    const existingNames = new Set<string>();
    for (const product of allProducts ?? []) {
      existingNames.add((product.name as string).toLowerCase().trim());
    }

    // Normalize input names and find duplicates
    const normalizedInputNames = names.map((n) => n.toLowerCase().trim());
    const duplicates = normalizedInputNames.filter((name) => existingNames.has(name));

    return NextResponse.json({ existingNames: duplicates });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

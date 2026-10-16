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
            // Enforce a strict 500 KiB request-body limit.
    const MAX_BODY_BYTES = 500 * 1024;
    const contentLength = request.headers.get("content-length");

    if (contentLength !== null) {
      if (!/^\d+$/.test(contentLength)) {
        return NextResponse.json(
          { error: "Invalid Content-Length header" },
          { status: 400 }
        );
      }

      if (Number(contentLength) > MAX_BODY_BYTES) {
        return NextResponse.json(
          { error: "Request too large (max 500KB)" },
          { status: 413 }
        );
      }
    }

    const reader = request.body?.getReader();

    if (!reader) {
      return NextResponse.json(
        { error: "Request body is missing" },
        { status: 400 }
      );
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        totalBytes += value.byteLength;

        if (totalBytes > MAX_BODY_BYTES) {
          await reader.cancel().catch(() => {});
          return NextResponse.json(
            { error: "Request too large (max 500KB)" },
            { status: 413 }
          );
        }

        chunks.push(value);
      }
    } catch {
      return NextResponse.json(
        { error: "Could not read request body" },
        { status: 400 }
      );
    }

    const bodyBytes = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of chunks) {
      bodyBytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    let body: unknown;

    try {
      const bodyText = new TextDecoder("utf-8", { fatal: true }).decode(bodyBytes);
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON or UTF-8 in request body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || !("names" in body)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const names = (body as { names: unknown }).names;

    if (
      !Array.isArray(names) ||
      names.length === 0 ||
      names.length > 25 ||
      !names.every(
        (name): name is string =>
          typeof name === "string" &&
          name.trim().length > 0 &&
          name.length <= 500
      )
    ) {
      return NextResponse.json(
        { error: "Provide 1-25 valid product names" },
        { status: 400 }
      );
    }

    // Query products in batches using safe pagination
    // Avoids exceeding Supabase response limit (1000 rows default)
    const existingNames = new Set<string>();
    const pageSize = 1000;
    let pageIndex = 0;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const { data: pageProducts, error } = await supabase
          .from("products")
.select("name")
.order("id", { ascending: true })
.range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);

        if (error) {
          console.error(`Error checking page ${pageIndex}:`, error);
          return NextResponse.json(
            { error: "Failed to check duplicates" },
            { status: 500 }
          );
        }

        // If we get fewer results than requested, we've reached the end
        if (!pageProducts || pageProducts.length < pageSize) {
          hasMorePages = false;
        }

        // Process this page's products
        for (const product of pageProducts ?? []) {
          existingNames.add((product.name as string).toLowerCase().trim());
        }

        pageIndex++;
      } catch (err) {
        console.error("Pagination error:", err);
        return NextResponse.json(
          { error: "Failed to check duplicates" },
          { status: 500 }
        );
      }
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

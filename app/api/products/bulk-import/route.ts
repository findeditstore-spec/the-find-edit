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

interface ClientProduct {
  rowNumber: number;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  store: string;
  affiliate_link?: string;
  image?: string;
  errors: string[];
}

interface ImportDetail {
  rowNumber: number;
  name: string;
  status: "created" | "skipped" | "failed";
  message: string;
}

/**
 * Normalize affiliate URLs for duplicate detection
 * Removes tracking parameters while preserving destination semantics
 * Keeps affiliate IDs as they determine commission routing
 *
 * IMPORTANT: Only lowercase the hostname, preserve case in path/query/hash
 */
function normalizeAffiliateURL(url: string): string {
  if (!url || typeof url !== "string") return "";

  try {
    const parsed = new URL(url.trim());

    // Preserve: affiliate IDs, partner codes, tracking IDs that determine commission routing
    // Remove: utm_*, fbclid, gclid, other analytics-only params that don't affect destination
    const keepParams = new Set([
      "aff_id",
      "affiliate_id",
      "partner_id",
      "ref",
      "referral",
      "tracking_id",
      "campaign",
      "source",
      // Domain-specific affiliate parameters (add as needed)
    ]);

    const cleanedParams = new URLSearchParams();
    for (const [key, value] of parsed.searchParams) {
      if (keepParams.has(key.toLowerCase())) {
        // Preserve case in parameter values (they may be case-sensitive)
        cleanedParams.append(key, value);
      }
    }

    parsed.search = cleanedParams.toString();

    // Only lowercase hostname for normalization; preserve case in path/query/hash
    // URLs are case-sensitive per RFC 3986 for path components
    const normalized = `${parsed.protocol}//${parsed.hostname?.toLowerCase()}${parsed.pathname}${parsed.search ? "?" + parsed.search : ""}${parsed.hash}`;
    return normalized;
  } catch {
    // If URL is invalid, return empty to catch it in validation
    return "";
  }
}

/**
 * Validate a single product field
 */
function validateProductField(
  field: string,
  value: unknown,
  fieldName: string
): string | null {
  // Check type
  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  const trimmed = value.trim();

  // Check required fields
  if (!trimmed) {
    return `${fieldName} is required`;
  }

  // Validate field-specific constraints
  switch (field) {
    case "name":
      if (trimmed.length > 255) return "Product name must be 255 characters or less";
      if (trimmed.length < 3) return "Product name must be at least 3 characters";
      break;

    case "description":
      if (trimmed.length > 2000) return "Description must be 2000 characters or less";
      if (trimmed.length < 10) return "Description must be at least 10 characters";
      break;

    case "category":
    case "subcategory":
      if (trimmed.length > 100) return `${fieldName} must be 100 characters or less`;
      break;

    case "price":
      // Accept various price formats: "From R299", "R299-R599", "Call for price", etc.
      if (trimmed.length > 50) return "Price must be 50 characters or less";
      break;

    case "store":
      if (trimmed.length > 100) return "Store name must be 100 characters or less";
      break;

    case "affiliate_link":
      if (trimmed.length > 2048) return "Affiliate link must be 2048 characters or less";
      // Validate URL format
      try {
        new URL(trimmed);
      } catch {
        return "Affiliate link must be a valid URL";
      }
      break;

    case "image":
      if (trimmed.length > 2048) return "Image URL must be 2048 characters or less";
      // Validate URL format
      try {
        new URL(trimmed);
      } catch {
        return "Image URL must be a valid URL";
      }
      break;
  }

  return null;
}

/**
 * Server-side validation of product data
 * Never trusts client-provided errors or computed fields
 */
function validateProduct(product: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!product || typeof product !== "object") {
    return { valid: false, errors: ["Invalid product object"] };
  }

  const p = product as Record<string, unknown>;

  // Validate rowNumber exists
  if (typeof p.rowNumber !== "number") {
    return { valid: false, errors: ["Missing row number"] };
  }

  // Validate required fields
  const requiredFields = ["name", "description", "category", "subcategory", "price", "store"];
  for (const field of requiredFields) {
    const error = validateProductField(field, p[field], field);
    if (error) errors.push(error);
  }

  // Validate optional fields
  if (p.affiliate_link !== undefined && p.affiliate_link !== null) {
    const error = validateProductField("affiliate_link", p.affiliate_link, "Affiliate link");
    if (error) errors.push(error);
  }

  if (p.image !== undefined && p.image !== null) {
    const error = validateProductField("image", p.image, "Image URL");
    if (error) errors.push(error);
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
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
        // Enforce a strict 500 KiB request-body limit while reading the stream.
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

    // Combine the bounded chunks and decode the JSON.
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

    // Validate body structure
    if (!body || typeof body !== "object" || !Array.isArray((body as Record<string, unknown>).products)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { products } = body as { products: unknown[] };

    // Validate product count
    if (products.length === 0 || products.length > 25) {
      return NextResponse.json(
        { error: "Must provide 1-25 products" },
        { status: 400 }
      );
    }

    const details: ImportDetail[] = [];

    // Server-side validation of ALL products
    // Never trust client-provided errors field
    const validatedProducts: Array<ClientProduct & { validationErrors: string[] }> = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const validation = validateProduct(product);

      if (!validation.valid) {
        details.push({
          rowNumber: (product as Record<string, unknown>).rowNumber as number || i + 2,
          name: ((product as Record<string, unknown>).name as string) || `Row ${i + 2}`,
          status: "failed",
          message: validation.errors.join("; "),
        });
      } else {
        validatedProducts.push({
          ...(product as ClientProduct),
          validationErrors: validation.errors,
        });
      }
    }

    if (validatedProducts.length === 0) {
      return NextResponse.json({
        created: 0,
        skipped: 0,
        failed: products.length,
        details,
      });
    }

    // Check for duplicates WITHIN this batch first (case-insensitive)
    const batchNames = new Set<string>();
    const batchAffiliateURLs = new Map<string, string>(); // normalized URL -> original name

    for (const product of validatedProducts) {
      const nameLower = product.name.toLowerCase().trim();

      if (batchNames.has(nameLower)) {
        details.push({
          rowNumber: product.rowNumber,
          name: product.name,
          status: "failed",
          message: "Duplicate product name within this batch",
        });
        validatedProducts.splice(validatedProducts.indexOf(product), 1);
        continue;
      }

      batchNames.add(nameLower);

      // Check affiliate URL duplicates within batch
      if (product.affiliate_link) {
        const normalized = normalizeAffiliateURL(product.affiliate_link);
        if (normalized && batchAffiliateURLs.has(normalized)) {
          details.push({
            rowNumber: product.rowNumber,
            name: product.name,
            status: "failed",
            message: `Duplicate affiliate link (same as "${batchAffiliateURLs.get(normalized)}")`,
          });
          validatedProducts.splice(validatedProducts.indexOf(product), 1);
          continue;
        }
        if (normalized) {
          batchAffiliateURLs.set(normalized, product.name);
        }
      }
    }

    if (validatedProducts.length === 0) {
      return NextResponse.json({
        created: 0,
        skipped: 0,
        failed: details.length,
        details,
      });
    }

    // Check for existing products in database using safe pagination
    // Query products in batches to stay within Supabase response limit (1000 rows default)
    const existingNames = new Set<string>();
    const existingAffiliateURLs = new Set<string>();
    const pageSize = 1000;
    let pageIndex = 0;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const { data: pageProducts, error: checkError } = await supabase
          .from("products")
.select("id, name, affiliate_link")
.order("id", { ascending: true })
.range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);
        if (checkError) {
          console.error(`Error checking page ${pageIndex}:`, checkError);
          return NextResponse.json(
            { error: "Failed to check for duplicates" },
            { status: 500 }
          );
        }

        // If we get fewer results than requested, we've reached the end
        if (!pageProducts || pageProducts.length < pageSize) {
          hasMorePages = false;
        }

        // Process this page's products
        for (const existing of pageProducts ?? []) {
          existingNames.add((existing.name as string).toLowerCase().trim());

          if (existing.affiliate_link) {
            const normalized = normalizeAffiliateURL(existing.affiliate_link as string);
            if (normalized) {
              existingAffiliateURLs.add(normalized);
            }
          }
        }

        pageIndex++;
      } catch (err) {
        console.error("Pagination error:", err);
        return NextResponse.json(
          { error: "Failed to check for duplicates" },
          { status: 500 }
        );
      }
    }

    // Filter products: skip existing, fail on affiliate URL duplicates
    const productsToInsert: Array<ClientProduct & { index: number }> = [];

    for (let i = 0; i < validatedProducts.length; i++) {
      const product = validatedProducts[i];
      const nameLower = product.name.toLowerCase().trim();

      if (existingNames.has(nameLower)) {
        details.push({
          rowNumber: product.rowNumber,
          name: product.name,
          status: "skipped",
          message: "Product already exists in database",
        });
        continue;
      }

      // Check affiliate link against existing products
      if (product.affiliate_link) {
        const normalized = normalizeAffiliateURL(product.affiliate_link);
        if (normalized && existingAffiliateURLs.has(normalized)) {
          details.push({
            rowNumber: product.rowNumber,
            name: product.name,
            status: "skipped",
            message: "This affiliate link is already in use",
          });
          continue;
        }
      }

      productsToInsert.push({ ...product, index: i });
    }

    if (productsToInsert.length === 0) {
      return NextResponse.json({
        created: 0,
        skipped: details.filter((d) => d.status === "skipped").length,
        failed: details.filter((d) => d.status === "failed").length,
        details,
      });
    }

    // Insert products with per-row error tracking
    let created = 0;

    for (const product of productsToInsert) {
      try {
        const slug = product.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const id = `${product.category
          .toLowerCase()
          .replace(/\s+/g, "-")}-${crypto.randomUUID()}`;

        const { error: insertError } = await supabase.from("products").insert({
          id,
          slug,
          name: product.name,
          description: product.description,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          store: product.store,
          image: product.image || null,
          images: product.image ? [product.image] : [],
          affiliate_link: product.affiliate_link || null,
          status: "draft",
          featured: false,
        });

        if (insertError) {
          console.error(`Error inserting product "${product.name}":`, insertError);
          details.push({
            rowNumber: product.rowNumber,
            name: product.name,
            status: "failed",
            message: insertError.message || "Insert failed",
          });
        } else {
          created++;
          details.push({
            rowNumber: product.rowNumber,
            name: product.name,
            status: "created",
            message: "Product created successfully",
          });
        }
      } catch (err) {
        console.error(`Unexpected error for product "${product.name}":`, err);
        details.push({
          rowNumber: product.rowNumber,
          name: product.name,
          status: "failed",
          message: "Unexpected error during insert",
        });
      }
    }

    const skipped = details.filter((d) => d.status === "skipped").length;
    const failed = details.filter((d) => d.status === "failed").length;

    return NextResponse.json({
      created,
      skipped,
      failed,
      details: details.sort((a, b) => a.rowNumber - b.rowNumber),
    });
  } catch (err) {
    console.error("Bulk import error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

import { getSupabaseServerClient } from "../lib/supabase-server";
import { PageLayout, Container, Section, SectionHeader } from "../components/layout";
import StandardProductCard from "../components/product-cards/StandardProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  price: string;
  store: string;
  category: string;
  subcategory: string;
  featured?: boolean;
  created_at: string;
}

async function getTrendingData() {
  const supabase = await getSupabaseServerClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(16);

  return {
    products: products || [],
  };
}

export default async function TrendingPage() {
  const { products } = await getTrendingData();

  return (
    <PageLayout>
      {/* Hero Section */}
      <Section background="cream" padding="xl">
        <Container maxWidth="xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-3">
              Trending Finds
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium text-[#1F2937] tracking-tight leading-[1.1] mb-6">
              What shoppers are finding right now.
            </h1>
            <p className="text-base sm:text-lg text-[#5B6470] max-w-2xl leading-relaxed">
              A curated collection of items gaining attention across fashion, tech, home, and lifestyle on The Find Edit.
            </p>
          </div>
        </Container>
      </Section>

      {/* Trending Products Grid */}
      <Section background="sand" padding="lg" className="border-t border-[#EAE6DF]">
        <Container maxWidth="xl">
          {products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <p className="text-xs uppercase tracking-wider text-[#7A827D] font-medium">
                  {products.length} {products.length === 1 ? "find" : "finds"} trending
                </p>

                <Link
                  href="/finds"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  <span>Explore all finds</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {products.map((product: Product) => (
                  <StandardProductCard key={product.id} product={product} showBadge={product.featured} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-sm text-[#7A827D] mb-4">
                No trending finds right now. Check back soon.
              </p>
              <Link
                href="/finds"
                className="inline-block px-6 py-3 bg-[#176B6B] text-white rounded-full text-sm font-medium"
              >
                Browse All Finds
              </Link>
            </div>
          )}
        </Container>
      </Section>
    </PageLayout>
  );
}

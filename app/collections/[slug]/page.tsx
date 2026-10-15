import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "../../lib/supabase-server";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import StandardProductCard from "../../components/product-cards/StandardProductCard";
import Link from "next/link";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getCollectionData(slug: string) {
  const supabase = await getSupabaseServerClient();

  // Get collection
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (collectionError || !collection) {
    return null;
  }

  // Get products in this collection
  const { data: collectionProducts } = await supabase
    .from('collection_products')
    .select('product_id')
    .eq('collection_id', collection.id);

  const productIds = collectionProducts?.map(cp => cp.product_id) || [];

  if (productIds.length === 0) {
    return { collection, products: [] };
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('status', 'active');

  return { collection, products: products || [] };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const data = await getCollectionData(slug);

  if (!data) {
    notFound();
  }

  const { collection, products } = data;

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 bg-[#F4F0E9] border-b border-[#EAE6DF]">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-3">
              Curated Collection
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium text-[#1F2937] mb-4 tracking-tight">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-lg text-[#5B6470] max-w-2xl mx-auto leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>
        </section>

        {/* Products */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-[#F4F0E9] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[#7A827D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
                    Coming Soon
                  </h3>
                  <p className="text-[#5B6470] mb-8">
                    We're currently curating products for this collection. Check back soon!
                  </p>
                  <Link
                    href="/collections"
                    className="inline-block px-8 py-4 bg-[#176B6B] text-white rounded-full font-medium hover:bg-[#125858] transition-colors"
                  >
                    View All Collections
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-sm text-[#7A827D]">
                    {products.length} {products.length === 1 ? 'find' : 'finds'} in this collection
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {products.map((product: any) => (
                    <StandardProductCard
                      key={product.id}
                      product={product}
                      showBadge={product.featured}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-20 bg-[#176B6B] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-4 tracking-tight">
              Discover More Collections
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto text-sm sm:text-base">
              Explore other curated collections handpicked by The Find Edit team.
            </p>
            <Link
              href="/collections"
              className="inline-block px-8 py-3.5 bg-white text-[#176B6B] rounded-full text-sm font-medium hover:bg-[#F4F0E9] transition-colors shadow-sm"
            >
              View All Collections →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

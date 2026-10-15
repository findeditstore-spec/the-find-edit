import { getSupabaseServerClient } from '../lib/supabase-server';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import EditorialProductCard from '../components/product-cards/EditorialProductCard';
import Badge from '../components/ui/Badge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: string;
  store: string;
  category: string;
  subcategory?: string;
  featured?: boolean;
}

async function getTFEEditData() {
  const supabase = await getSupabaseServerClient();

  // Try getting explicitly featured products first
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  let products = featuredProducts || [];

  // If no products are flagged as featured in the database, curate premier active finds from real catalogue data
  if (products.length === 0) {
    const { data: activeProducts } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(12);
    products = activeProducts || [];
  }

  return { products };
}

export default async function TFEEditPage() {
  const { products } = await getTFEEditData();

  // Group products by category for editorial presentation
  const productsByCategory = products.reduce((acc: Record<string, Product[]>, product: Product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Editorial Hero */}
        <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24 border-b border-[#EAE6DF]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="tfe-pick">TFE Editorial</Badge>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-[#1F2937] mb-6 tracking-tight">
              THE TFE EDIT
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#5B6470] max-w-2xl mx-auto leading-relaxed mb-4">
              Our editors' carefully selected finds. Each product has been chosen for its quality, style, and exceptional value.
            </p>

            <p className="text-xs font-semibold text-[#176B6B] uppercase tracking-[0.25em]">
              Curated by The Find Edit Team
            </p>
          </div>
        </section>

        {/* Editorial Note */}
        <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 bg-[#F4F0E9] border-b border-[#EAE6DF]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-[#EAE6DF] rounded-2xl p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-3">
                About The Edit
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1F2937] mb-4">
                Why we choose what we choose
              </h2>
              <p className="text-sm sm:text-base text-[#5B6470] leading-relaxed">
                Not every product makes it into The TFE Edit. Our team reviews finds across fashion, tech, home, and lifestyle, selecting only those that stand out for their design, quality, functionality, and genuine value. When you see a find here, you know it's been vetted with care.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grouped by Category */}
        {products.length === 0 ? (
          <section className="px-4 sm:px-6 md:px-12 py-20">
            <div className="max-w-md mx-auto text-center">
              <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
                The Edit Is Coming Soon
              </h3>
              <p className="text-sm text-[#5B6470] mb-6">
                Our editors are currently curating the first collection of TFE Picks. Check back soon!
              </p>
              <Link
                href="/finds"
                className="inline-block px-6 py-3 bg-[#176B6B] text-white rounded-full text-sm font-medium"
              >
                Explore All Finds
              </Link>
            </div>
          </section>
        ) : (
          <div>
            {(Object.entries(productsByCategory) as [string, Product[]][]).map(([category, categoryProducts]) => (
              <section key={category} className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 odd:bg-[#FFFDF9] even:bg-[#F4F0E9] border-b border-[#EAE6DF]">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-end justify-between mb-8 sm:mb-10">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-2">
                        {category} Edit
                      </p>
                      <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1F2937] tracking-tight">
                        {category} Picks
                      </h2>
                    </div>

                    <Link
                      href={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                    >
                      <span>Explore all {category}</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {categoryProducts.map((product) => (
                      <EditorialProductCard
                        key={product.id}
                        product={product}
                        whyWeLoveIt={
                          product.description ||
                          `This ${category.toLowerCase()} find combines quality, style, and value in a way that caught our attention immediately.`
                        }
                      />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Editorial Closing Banner */}
        <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24 bg-[#176B6B] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-4 tracking-tight">
              More finds worth discovering
            </h2>
            <p className="text-base text-white/90 mb-8 leading-relaxed">
              The TFE Edit represents our curated best, but there is always more to explore across all categories and collections.
            </p>
            <Link
              href="/finds"
              className="inline-block px-8 py-4 bg-white text-[#176B6B] rounded-full text-sm font-medium hover:bg-[#F4F0E9] transition-colors shadow-sm"
            >
              Explore All Finds →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import { getSupabaseServerClient } from '../lib/supabase-server';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import EditorialProductCard from '../components/product-cards/EditorialProductCard';
import Badge from '../components/ui/Badge';

export const dynamic = 'force-dynamic';

async function getTFEEditData() {
  const supabase = await getSupabaseServerClient();

  // Get all featured products (TFE Picks)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  return { products: products || [] };
}

export default async function TFEEditPage() {
  const { products } = await getTFEEditData();

  // Group products by category for editorial presentation
  const productsByCategory = products.reduce((acc: any, product: any) => {
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
        {/* Hero */}
        <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-[#1F2937] to-[#2D3748] text-white">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="tfe-pick">TFE Pick</Badge>
            </div>

            <h1 className="font-serif text-6xl md:text-8xl font-medium mb-8 tracking-tight">
              THE TFE EDIT
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
              Our editors' carefully selected finds. Each product has been chosen for its quality, style, and exceptional value.
            </p>

            <p className="text-sm text-[#C9A86A] uppercase tracking-widest">
              Curated by The Find Edit Team
            </p>
          </div>
        </section>

        {/* Editorial Note */}
        <section className="px-6 md:px-12 py-16 border-b border-[#EAE6DF]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#F4F0E9] rounded-2xl p-8 md:p-12">
              <p className="text-xs font-medium uppercase tracking-widest text-[#176B6B] mb-4">
                About The Edit
              </p>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                Why we choose what we choose
              </h2>
              <p className="text-lg text-[#5B6470] leading-relaxed">
                Not every product makes it into The TFE Edit. Our team reviews hundreds of finds across categories, selecting only those that stand out for their design, quality, functionality, and value. When you see the TFE Pick badge, you know it's been vetted by someone who cares about getting it right.
              </p>
            </div>
          </div>
        </section>

        {/* Products by Category */}
        {products.length === 0 ? (
          <section className="px-6 md:px-12 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-[#F4F0E9] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#7A827D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
                The Edit Is Coming Soon
              </h3>
              <p className="text-[#5B6470]">
                Our editors are currently curating the first collection of TFE Picks. Check back soon!
              </p>
            </div>
          </section>
        ) : (
          <>
            {Object.entries(productsByCategory).map(([category, categoryProducts]: [string, any]) => (
              <section key={category} className="px-6 md:px-12 py-16 odd:bg-[#FFFDF9] even:bg-[#F4F0E9]">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-12">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-3">
                      {category} Edit
                    </p>
                    <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1F2937]">
                      {category} Picks
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryProducts.map((product: any) => (
                      <EditorialProductCard
                        key={product.id}
                        product={product}
                        whyWeLoveIt={`This ${category.toLowerCase()} find combines quality, style, and value in a way that caught our attention immediately.`}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </>
        )}

        {/* Final CTA */}
        <section className="px-6 md:px-12 py-20 bg-[#176B6B] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6">
              More finds worth discovering
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              The TFE Edit represents our best, but there's so much more to explore across all categories.
            </p>
            <a
              href="/finds"
              className="inline-block px-8 py-4 bg-white text-[#176B6B] rounded-full font-medium hover:bg-[#F4F0E9] transition-colors"
            >
              Explore All Finds
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { getSupabaseServerClient } from '../lib/supabase-server';
import EnhancedProductSearch from '../components/EnhancedProductSearch';

export const dynamic = 'force-dynamic';

async function getFindsPageData() {
  const supabase = await getSupabaseServerClient();

  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('status', 'active')
      .order('name')
  ]);

  return {
    products: productsResult.data || [],
    categories: categoriesResult.data || []
  };
}

export default async function FindsPage() {
  const { products, categories } = await getFindsPageData();

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-4">
                All Finds
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-medium text-[#1F2937] mb-6 tracking-tight">
                Find something worth finding.
              </h1>
              <p className="text-lg text-[#5B6470] max-w-2xl leading-relaxed">
                Explore everything currently featured on The Find Edit.
              </p>
            </div>

            <EnhancedProductSearch products={products} categories={categories} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

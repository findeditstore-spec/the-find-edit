import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { getSupabaseServerClient } from './lib/supabase-server';
import Link from 'next/link';
import StandardProductCard from './components/product-cards/StandardProductCard';
import FeaturedProductCard from './components/product-cards/FeaturedProductCard';

export const dynamic = 'force-dynamic';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
}

async function getHomePageData() {
  const supabase = await getSupabaseServerClient();

  const [
    featuredResult,
    latestResult,
    fashionResult,
    techResult,
    categoriesResult,
    collectionsResult
  ] = await Promise.all([
    supabase.from('products').select('*').eq('status', 'active').eq('featured', true).limit(1).maybeSingle(),
    supabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(8),
    supabase.from('products').select('*').eq('status', 'active').eq('category', 'Fashion').order('created_at', { ascending: false }).limit(4),
    supabase.from('products').select('*').eq('status', 'active').eq('category', 'Creator Tech').order('created_at', { ascending: false }).limit(4),
    supabase.from('categories').select('*').eq('status', 'active').order('name'),
    supabase.from('collections').select('*').eq('status', 'active').order('name').limit(4)
  ]);

  let featuredProduct = featuredResult.data;
  // If no product is explicitly flagged as featured, use the latest premier active product from real catalogue data
  if (!featuredProduct && latestResult.data && latestResult.data.length > 0) {
    featuredProduct = latestResult.data[0];
  }

  return {
    featured: featuredProduct,
    latest: latestResult.data || [],
    fashion: fashionResult.data || [],
    tech: techResult.data || [],
    categories: categoriesResult.data || [],
    collections: collectionsResult.data || []
  };
}

export default async function HomePage() {
  const data = await getHomePageData();

  // If featured product was taken from latest, avoid immediate duplicate in trending row
  const trendingList = data.featured
    ? data.latest.filter(p => p.id !== data.featured?.id).slice(0, 4)
    : data.latest.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Editorial Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 md:px-12 py-16 sm:py-24 overflow-hidden">
          {/* Subtle Texture Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #176B6B 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto w-full">
            <div className="text-center mb-12 sm:mb-16">
              {/* Brand Tagline */}
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-[#176B6B] mb-5 sm:mb-6">
                Discover • Compare • Shop Smarter
              </p>

              {/* Editorial Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-[#1F2937] mb-6 sm:mb-8 tracking-tight leading-[1.08]">
                GOOD FINDS.<br />
                <span className="text-[#176B6B]">A BETTER YOU.</span>
              </h1>

              {/* Supporting Statement */}
              <p className="text-base sm:text-lg md:text-xl text-[#5B6470] max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 font-normal">
                Discover, compare and shop curated finds across fashion, tech, home, lifestyle and more.
              </p>

              {/* Editorial CTAs */}
              <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center">
                <Link
                  href="/finds"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#176B6B] text-white rounded-full text-sm font-medium hover:bg-[#125858] transition-colors shadow-sm"
                >
                  Explore The Finds
                </Link>
                <Link
                  href="/collections"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-[#176B6B] text-[#176B6B] rounded-full text-sm font-medium hover:bg-[#176B6B] hover:text-white transition-colors"
                >
                  Browse Collections
                </Link>
              </div>
            </div>

            {/* Curated Categories Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {data.categories.slice(0, 4).map((category: Category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="group bg-white/90 border border-[#EAE6DF] rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-[#176B6B]/60 hover:shadow-sm transition-all"
                >
                  <p className="text-[0.65rem] uppercase tracking-wider text-[#7A827D] mb-1">
                    Explore
                  </p>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#1F2937] group-hover:text-[#176B6B] transition-colors leading-snug">
                    {category.name}
                  </h3>
                  <span className="text-xs font-medium text-[#176B6B] mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View</span>
                    <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Find Spotlight (Real Catalogue Data) */}
        {data.featured && (
          <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 bg-[#F4F0E9] border-y border-[#EAE6DF]">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 sm:mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-2">
                  Editorial Spotlight
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1F2937] tracking-tight">
                  This Week's Featured Find
                </h2>
              </div>

              <FeaturedProductCard
                product={data.featured}
                editorial={
                  data.featured.description ||
                  "Handpicked by our editorial team for its exceptional quality, thoughtful design, and value."
                }
              />
            </div>
          </section>
        )}

        {/* Trending Now */}
        {trendingList.length > 0 && (
          <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8 sm:mb-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-2">
                    Latest Finds
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1F2937] tracking-tight">
                    Trending Now
                  </h2>
                </div>
                <Link
                  href="/trending"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  <span>View All Trending</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {trendingList.map((product: Product) => (
                  <StandardProductCard key={product.id} product={product} showBadge={product.featured} />
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/trending"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  <span>View All Trending</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Fashion Edit */}
        {data.fashion.length > 0 && (
          <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24 bg-[#F4F0E9] border-y border-[#EAE6DF]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8 sm:mb-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-2">
                    Curated Selection
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1F2937] tracking-tight">
                    Fashion Edit
                  </h2>
                </div>
                <Link
                  href="/fashion"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  <span>Explore Fashion</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {data.fashion.map((product: Product) => (
                  <StandardProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/fashion"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  <span>Explore Fashion</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Tech Worth Knowing */}
        {data.tech.length > 0 && (
          <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8 sm:mb-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-2">
                    Curated Tech
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1F2937] tracking-tight">
                    Tech Worth Knowing
                  </h2>
                </div>
                <Link
                  href="/creator-tech"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  <span>Explore Creator Tech</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {data.tech.map((product: Product) => (
                  <StandardProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/creator-tech"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  <span>Explore Creator Tech</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Curated Collections Showcase */}
        {data.collections.length > 0 && (
          <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24 bg-[#F4F0E9] border-y border-[#EAE6DF]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 sm:mb-14">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A86A] mb-3">
                  Curated For You
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1F2937] tracking-tight">
                  Discover By Collection
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#5B6470] max-w-xl mx-auto">
                  Finds brought together around themes, lifestyles, and occasions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {data.collections.map((collection: Collection) => (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.slug}`}
                    className="group bg-white border border-[#EAE6DF] rounded-xl sm:rounded-2xl p-6 sm:p-7 hover:border-[#176B6B] hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#176B6B] mb-2">
                        Collection
                      </p>
                      <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1F2937] mb-2.5 group-hover:text-[#176B6B] transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5B6470] leading-relaxed line-clamp-2 mb-4">
                        {collection.description || 'Explore this curated collection of finds.'}
                      </p>
                    </div>

                    <span className="text-xs font-medium text-[#176B6B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore Collection</span>
                      <span>→</span>
                    </span>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10 sm:mt-12">
                <Link
                  href="/collections"
                  className="inline-block px-8 py-3.5 border border-[#176B6B] text-[#176B6B] rounded-full text-sm font-medium hover:bg-[#176B6B] hover:text-white transition-colors"
                >
                  View All Collections
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* How It Works — Core Journey */}
        <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-4">
              How It Works
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1F2937] mb-4 tracking-tight">
              Your Shopping Journey
            </h2>
            <p className="text-sm sm:text-base text-[#5B6470] max-w-xl mx-auto mb-14 sm:mb-16">
              A smarter way to discover, evaluate, and purchase quality finds.
            </p>

            <div className="grid md:grid-cols-3 gap-8 sm:gap-12 text-left">
              <div className="bg-white border border-[#EAE6DF] rounded-2xl p-7 sm:p-8">
                <div className="w-12 h-12 bg-[#176B6B] rounded-full flex items-center justify-center text-white text-lg font-bold mb-6">
                  1
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-3">
                  Discover
                </h3>
                <p className="text-sm text-[#5B6470] leading-relaxed">
                  Browse handpicked products across fashion, creator tech, lifestyle and home—selected for design and value.
                </p>
              </div>

              <div className="bg-white border border-[#EAE6DF] rounded-2xl p-7 sm:p-8">
                <div className="w-12 h-12 bg-[#176B6B] rounded-full flex items-center justify-center text-white text-lg font-bold mb-6">
                  2
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-3">
                  Compare & Save
                </h3>
                <p className="text-sm text-[#5B6470] leading-relaxed">
                  Save your favourites to your wishlist and compare features, prices, and retailers side-by-side.
                </p>
              </div>

              <div className="bg-white border border-[#EAE6DF] rounded-2xl p-7 sm:p-8">
                <div className="w-12 h-12 bg-[#176B6B] rounded-full flex items-center justify-center text-white text-lg font-bold mb-6">
                  3
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-3">
                  Shop Confidently
                </h3>
                <p className="text-sm text-[#5B6470] leading-relaxed">
                  Click through directly to trusted partner retailers to complete your purchase with zero markup.
                </p>
              </div>
            </div>

            <div className="mt-12 sm:mt-14">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
              >
                <span>Learn More About TFE</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

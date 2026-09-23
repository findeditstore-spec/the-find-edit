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
    supabase.from('products').select('*').eq('status', 'active').eq('featured', true).limit(1).single(),
    supabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(6),
    supabase.from('products').select('*').eq('status', 'active').eq('category', 'Fashion').order('created_at', { ascending: false }).limit(4),
    supabase.from('products').select('*').eq('status', 'active').eq('category', 'Creator Tech').order('created_at', { ascending: false }).limit(4),
    supabase.from('categories').select('*').eq('status', 'active').order('name'),
    supabase.from('collections').select('*').eq('status', 'active').order('name').limit(4)
  ]);

  return {
    featured: featuredResult.data,
    latest: latestResult.data || [],
    fashion: fashionResult.data || [],
    tech: techResult.data || [],
    categories: categoriesResult.data || [],
    collections: collectionsResult.data || []
  };
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 md:px-12 py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, #176B6B 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              {/* Tagline */}
              <p className="text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-[#176B6B] mb-6">
                Discover • Compare • Shop Smarter
              </p>

              {/* Main Headline */}
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-[#1F2937] mb-8 tracking-tight">
                GOOD FINDS.<br />
                <span className="text-[#176B6B]">A BETTER YOU.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg md:text-xl text-[#5B6470] max-w-2xl mx-auto leading-relaxed mb-12">
                Discover, compare and shop curated finds across fashion, tech, home, lifestyle and more.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/finds"
                  className="inline-block px-8 py-4 bg-[#176B6B] text-white rounded-full font-medium hover:bg-[#125858] transition-colors"
                >
                  Explore The Finds
                </Link>
                <Link
                  href="/collections"
                  className="inline-block px-8 py-4 border-2 border-[#176B6B] text-[#176B6B] rounded-full font-medium hover:bg-[#176B6B] hover:text-white transition-colors"
                >
                  Browse Collections
                </Link>
              </div>
            </div>

            {/* Floating Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {data.categories.slice(0, 4).map((category: Category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="group relative bg-white border border-[#EAE6DF] rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <h3 className="font-serif text-xl font-medium text-[#1F2937] group-hover:text-[#176B6B] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#7A827D] mt-2">Explore →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Product */}
        {data.featured && (
          <section className="px-6 md:px-12 py-16 bg-[#F4F0E9]">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-3">
                  TFE Pick
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1F2937]">
                  This Week's Featured Find
                </h2>
              </div>

              <FeaturedProductCard
                product={data.featured}
                editorial="Handpicked by our editorial team for its exceptional quality, style, and value."
              />
            </div>
          </section>
        )}

        {/* Trending Now */}
        {data.latest.length > 0 && (
          <section className="px-6 md:px-12 py-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-3">
                    Latest Finds
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1F2937]">
                    Trending Now
                  </h2>
                </div>
                <Link
                  href="/finds"
                  className="hidden md:block text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.latest.slice(0, 4).map((product: Product) => (
                  <StandardProductCard key={product.id} product={product} showBadge={product.featured} />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/finds"
                  className="inline-block text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  View All →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Fashion Edit */}
        {data.fashion.length > 0 && (
          <section className="px-6 md:px-12 py-20 bg-[#F4F0E9]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-3">
                    Curated Selection
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1F2937]">
                    Fashion Edit
                  </h2>
                </div>
                <Link
                  href="/fashion"
                  className="hidden md:block text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  Explore Fashion →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data.fashion.map((product: Product) => (
                  <StandardProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/fashion"
                  className="inline-block text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  Explore Fashion →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Tech Worth Knowing */}
        {data.tech.length > 0 && (
          <section className="px-6 md:px-12 py-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-3">
                    Tech Finds
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1F2937]">
                    Tech Worth Knowing
                  </h2>
                </div>
                <Link
                  href="/creator-tech"
                  className="hidden md:block text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  Explore Tech →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data.tech.map((product: Product) => (
                  <StandardProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/creator-tech"
                  className="inline-block text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  Explore Tech →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Collections */}
        {data.collections.length > 0 && (
          <section className="px-6 md:px-12 py-20 bg-[#1F2937] text-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C9A86A] mb-3">
                  Curated For You
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-medium">
                  Discover By Collection
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.collections.map((collection: Collection) => (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.slug}`}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
                  >
                    <h3 className="font-serif text-2xl font-medium mb-3 group-hover:text-[#C9A86A] transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {collection.description || 'Explore this curated collection'}
                    </p>
                    <span className="text-sm font-medium text-[#C9A86A]">
                      Explore →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/collections"
                  className="inline-block px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-[#1F2937] transition-colors"
                >
                  View All Collections
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="px-6 md:px-12 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-6">
              How It Works
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1F2937] mb-16">
              Your Shopping Journey
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="w-16 h-16 bg-[#176B6B] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
                  Discover
                </h3>
                <p className="text-[#5B6470] leading-relaxed">
                  Browse curated finds across categories, handpicked for quality and value.
                </p>
              </div>

              <div>
                <div className="w-16 h-16 bg-[#176B6B] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
                  Compare
                </h3>
                <p className="text-[#5B6470] leading-relaxed">
                  Understand product details, read our editorial notes, and make informed choices.
                </p>
              </div>

              <div>
                <div className="w-16 h-16 bg-[#176B6B] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
                  Shop
                </h3>
                <p className="text-[#5B6470] leading-relaxed">
                  Click through to our partner retailers and shop with confidence.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <Link
                href="/how-it-works"
                className="inline-block text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
              >
                Learn More About TFE →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "../../lib/products";
import { getSupabaseServerClient } from "../../lib/supabase-server";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ProductImageGallery from "../../components/ProductImageGallery";
import ShopButton from "../../components/ShopButton";
import StandardProductCard from "../../components/product-cards/StandardProductCard";
import Badge from "../../components/ui/Badge";
import Link from "next/link";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get similar products from same category
  const supabase = await getSupabaseServerClient();
  const { data: similarProducts } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4);

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-[#EAE6DF]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
            <nav className="flex items-center gap-2 text-sm text-[#7A827D]">
              <Link href="/" className="hover:text-[#176B6B] transition-colors">
                Home
              </Link>
              <span>→</span>
              <Link href={`/${categorySlug}`} className="hover:text-[#176B6B] transition-colors">
                {product.category}
              </Link>
              <span>→</span>
              <span className="text-[#1F2937]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Image Gallery */}
              <div>
                <ProductImageGallery
                  images={
                    product.images?.length
                      ? product.images
                      : product.image
                        ? [product.image]
                        : []
                  }
                  alt={product.name}
                />
              </div>

              {/* Product Info */}
              <div>
                {/* Category & Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs uppercase tracking-wider text-[#7A827D]">
                    {product.category} · {product.subcategory}
                  </span>
                  {product.featured && <Badge variant="tfe-pick">TFE Pick</Badge>}
                </div>

                {/* Title */}
                <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#1F2937] mb-6 tracking-tight">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-lg text-[#5B6470] leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Why We Found It Section */}
                <div className="bg-[#F4F0E9] rounded-2xl p-6 mb-8">
                  <h2 className="text-xs font-medium uppercase tracking-widest text-[#176B6B] mb-3">
                    Why It Caught Our Eye
                  </h2>
                  <p className="text-[#5B6470] leading-relaxed">
                    This {product.category.toLowerCase()} find stood out for its quality, style, and value.
                    Perfect for those seeking {product.subcategory?.toLowerCase() || 'great finds'}.
                  </p>
                </div>

                {/* Price & Store */}
                <div className="border-t border-[#EAE6DF] pt-6 mb-6">
                  <div className="flex items-baseline gap-4 mb-2">
                    <p className="text-3xl font-semibold text-[#176B6B]">
                      {product.price}
                    </p>
                    <p className="text-sm text-[#7A827D]">
                      ZAR
                    </p>
                  </div>
                  <p className="text-sm text-[#5B6470]">
                    Available at <span className="font-medium text-[#1F2937]">{product.store}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-4 mb-6">
                  <ShopButton
                    productId={product.id}
                    productName={product.name}
                    store={product.store}
                    affiliateLink={product.affiliate_link}
                  />
                </div>

                {/* Affiliate Disclosure */}
                <div className="bg-[#FFFDF9] border border-[#EAE6DF] rounded-lg p-4">
                  <p className="text-xs text-[#7A827D] leading-relaxed">
                    <strong className="text-[#5B6470]">Affiliate Disclosure:</strong> We may earn a commission from qualifying purchases at no extra cost to you. This helps support The Find Edit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Finds */}
        {similarProducts && similarProducts.length > 0 && (
          <section className="px-6 md:px-12 py-16 bg-[#F4F0E9]">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-3">
                  More Like This
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#1F2937]">
                  Similar Finds
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct: any) => (
                  <StandardProductCard
                    key={similarProduct.id}
                    product={similarProduct}
                    showBadge={similarProduct.featured}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href={`/${categorySlug}`}
                  className="inline-block text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  Explore More {product.category} →
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

import { notFound } from "next/navigation";
import { products } from "../../data/products";
import { getProductBySlug } from "../../lib/products";
import ShopButton from "../../components/ShopButton";
import ProductImageGallery from "../../components/ProductImageGallery";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const supabaseProduct = await getProductBySlug(slug);

const staticProduct = products.find(
  (item) => item.slug === slug
);

const product = supabaseProduct ?? staticProduct;

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-12">

        <a
          href={`/${product.category
            .toLowerCase()
            .replace(" ", "-")}`}
          className="text-sm text-[#176B6B] hover:underline"
        >
          ← Back
        </a>

        <div className="mt-12 grid gap-12 md:grid-cols-2">

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

          <div className="flex flex-col justify-center">

            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#176B6B]">
              {product.category} · {product.subcategory}
            </p>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-6 text-lg leading-8 text-[#5B6470]">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="text-2xl font-medium text-[#176B6B]">
                {product.price}
              </p>

              <p className="mt-2 text-sm text-[#6B7280]">
                Available at {product.store}
              </p>
            </div>

            <ShopButton
  productId={product.id}
  productName={product.name}
  store={product.store}
  affiliateLink={product.affiliate_link}
/>

            <p className="mt-5 text-xs leading-5 text-[#8A8F89]">
              We may earn a commission from qualifying purchases,
              at no extra cost to you.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}
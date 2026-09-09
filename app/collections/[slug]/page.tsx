"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CollectionPage() {
  const [collection, setCollection] = useState<{
    id: string;
    name: string;
    description: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [productIds, setProductIds] = useState<string[]>([]);
const [collectionProducts, setCollectionProducts] = useState<
  {
    id: string;
    name: string;
    category: string;
    image: string | null;
    price: string;
    slug: string;
  }[]
>([]);

  useEffect(() => {
    async function loadCollection() {
      const slug = window.location.pathname.split("/")[2];

      const { data, error } = await supabase
        .from("collections")
        .select("id, name, description")
        .eq("slug", slug)
        .eq("status", "active")
        .maybeSingle();

      if (error) {
        console.error("Error loading collection:", error);
        setLoading(false);
        return;
      }

      setCollection(data);

if (data) {
  const { data: collectionProducts, error: productsError } =
    await supabase
      .from("collection_products")
      .select("product_id")
      .eq("collection_id", data.id);

  if (productsError) {
    console.error(
      "Error loading collection products:",
      productsError
    );
    setLoading(false);
    return;
  }

  const ids =
  collectionProducts?.map((item) => item.product_id) ?? [];

setProductIds(ids);

if (ids.length > 0) {
  const { data: products, error: productError } =
    await supabase
      .from("products")
      .select("id, name, category, image, price, slug")
      .in("id", ids)
      .eq("status", "active");

  if (productError) {
    console.error(
      "Error loading collection product details:",
      productError
    );
    setLoading(false);
    return;
  }

  setCollectionProducts(products ?? []);
}
}

setLoading(false);
    }

    loadCollection();
  }, []);
  return (
    <main className="min-h-screen bg-[#FFFDF9] px-6 py-10 text-[#1F2937] md:px-10">
      <div className="mx-auto max-w-6xl">
        <a
          href="/"
          className="text-sm font-medium transition hover:text-[#176B6B]"
        >
          ← Back to The Find Edit
        </a>

        <h1 className="mt-8 text-3xl font-semibold">
  {loading ? "Loading..." : collection?.name ?? "Collection not found"}
</h1>

<p className="mt-2 text-sm text-[#6B7280]">
  {collection?.description ||
    "Curated finds from The Find Edit."}
</p>

        <section className="mt-10">
  {collectionProducts.length === 0 ? (
    <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8">
      <p className="text-sm text-[#6B7280]">
        No products have been added to this collection yet.
      </p>
    </div>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {collectionProducts.map((product) => (
        <div
          key={product.id}
          className="overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white"
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full object-cover"
            />
          )}

          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-[#6B7280]">
              {product.category}
            </p>

            <h2 className="mt-2 font-medium">
              {product.name}
            </h2>

            <p className="mt-2 text-sm text-[#6B7280]">
              {product.price}
            </p>

            <a
              href={`/products/${product.slug}`}
              className="mt-5 inline-block text-sm font-medium transition hover:text-[#176B6B]"
            >
              View find →
            </a>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
      </div>
    </main>
  );
}
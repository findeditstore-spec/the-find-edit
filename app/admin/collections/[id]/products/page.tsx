"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function ManageCollectionProductsPage() {
  const [collectionName, setCollectionName] = useState("");
const [products, setProducts] = useState<
  {
    id: string;
    name: string;
    category: string;
    image: string | null;
  }[]
>([]);
const [loading, setLoading] = useState(true);
const [assignedProductIds, setAssignedProductIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadCollection() {
      const id = window.location.pathname.split("/")[3];

      const { data, error } = await supabase
        .from("collections")
        .select("name")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error loading collection:", error);
        setLoading(false);
        return;
      }

      setCollectionName(data?.name ?? "");

      const { data: productData, error: productError } = await supabase
  .from("products")
  .select("id, name, category, image")
  .order("created_at", { ascending: false });

if (productError) {
  console.error("Error loading products:", productError);
  setLoading(false);
  return;
}

setProducts(productData ?? []);

const { data: assignedProducts, error: assignedError } = await supabase
  .from("collection_products")
  .select("product_id")
  .eq("collection_id", id);

if (assignedError) {
  console.error(
    "Error loading assigned products:",
    assignedError
  );
  setLoading(false);
  return;
}

setAssignedProductIds(
  assignedProducts?.map((item) => item.product_id) ?? []
);

      setLoading(false);
    }

    loadCollection();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFDF9] px-6 py-10 text-[#1F2937] md:px-10">
      <div className="mx-auto max-w-6xl">
        <a
          href="/admin/collections"
          className="text-sm font-medium transition hover:text-[#176B6B]"
        >
          ← Back to collections
        </a>

        <h1 className="mt-6 text-3xl font-semibold">
          Manage products
        </h1>

        <p className="mt-2 text-sm text-[#6B7280]">
          {loading
            ? "Loading collection..."
            : collectionName
              ? `Choose products for ${collectionName}.`
              : "Collection not found."}
        </p>

        <section className="mt-10 rounded-2xl border border-[#EAE6DF] bg-white p-8">
  <div>
  <h2 className="text-lg font-medium">
    Select products
  </h2>

  <p className="mt-1 text-sm text-[#6B7280]">
    Add or remove products from this collection.
  </p>

  <p className="mt-2 text-sm font-medium text-[#176B6B]">
    {assignedProductIds.length}{" "}
    {assignedProductIds.length === 1
      ? "product"
      : "products"}{" "}
    added
  </p>
</div>

  <div className="mt-6 space-y-3">
    {products.map((product) => (
      <div
        key={product.id}
        className="flex items-center justify-between rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-5 py-4"
      >
        <div>
          <p className="font-medium">
            {product.name}
          </p>

          <p className="mt-1 text-sm text-[#6B7280]">
            {product.category}
          </p>
        </div>

        {assignedProductIds.includes(product.id) ? (
  <button
  type="button"
  onClick={async () => {
    const id = window.location.pathname.split("/")[3];

    const { error } = await supabase
      .from("collection_products")
      .delete()
      .eq("collection_id", id)
      .eq("product_id", product.id);

    if (error) {
      console.error(
        "Error removing product from collection:",
        error
      );
      return;
    }

    setAssignedProductIds((current) =>
      current.filter((productId) => productId !== product.id)
    );
  }}
  className="rounded-full bg-[#E7F2EF] px-4 py-2 text-sm font-medium text-[#176B6B] transition hover:opacity-70"
>
  Remove
</button>
) : (
  <button
  type="button"
  onClick={async () => {
    const id = window.location.pathname.split("/")[3];

    const { error } = await supabase
      .from("collection_products")
      .insert({
        collection_id: id,
        product_id: product.id,
      });

    if (error) {
      console.error("Error adding product to collection:", error);
      return;
    }

    setAssignedProductIds((current) => [
      ...current,
      product.id,
    ]);
  }}
  className="rounded-full border border-[#EAE6DF] px-4 py-2 text-sm font-medium transition hover:border-[#176B6B] hover:text-[#176B6B]"
>
  Add
</button>
)}
      </div>
    ))}

    {products.length === 0 && !loading && (
      <p className="text-sm text-[#6B7280]">
        No products found.
      </p>
    )}
  </div>
</section>
      </div>
    </main>
  );
}
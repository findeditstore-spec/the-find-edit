"use client";

import AdminLayout from "../../../_components/AdminLayout";
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
      store: string | null;
      price: string | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [assignedProductIds, setAssignedProductIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

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
        .select("id, name, category, image, store, price")
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
        console.error("Error loading assigned products:", assignedError);
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

  const filteredProducts = products.filter((product) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      (product.store && product.store.toLowerCase().includes(term))
    );
  });

  return (
    <AdminLayout
      currentSection="collections"
      title="Collection products"
      description="Choose products for this curated collection."
    >
      <div className="space-y-6">
        <div>
          <a
            href="/admin/collections"
            className="text-sm font-semibold text-[#176B6B] transition hover:underline"
          >
            ← Back to collections
          </a>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Manage products
          </h1>

          <p className="mt-2 text-sm text-[#687572]">
            {loading
              ? "Loading collection..."
              : collectionName
                ? `Choose products for “${collectionName}”.`
                : "Collection not found."}
          </p>
        </div>

        <section className="rounded-xl border border-[#EAE6DF] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <label className="sr-only">Search catalogue</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, category or merchant…"
                className="w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-[#E5F3EC] px-4 py-3 text-sm font-semibold text-[#23684A]">
                {assignedProductIds.length}{" "}
                {assignedProductIds.length === 1 ? "product" : "products"} added
              </span>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#EAE6DF] bg-white">
          {loading ? (
            <p className="px-6 py-16 text-center text-sm text-[#687572]">
              Loading catalogue products…
            </p>
          ) : filteredProducts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-serif text-2xl">No products found</p>
              <p className="mt-2 text-sm text-[#687572]">
                Try another search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-[#EAE6DF] bg-[#FAF8F4] text-xs uppercase tracking-wide text-[#7A827D]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Category / Store</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF0EB]">
                  {filteredProducts.map((product) => {
                    const isAssigned = assignedProductIds.includes(product.id);
                    const isBusy = actionBusyId === product.id;

                    return (
                      <tr key={product.id} className="align-middle hover:bg-[#FFFDF9]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt=""
                                className="h-12 w-12 rounded-lg bg-[#F4F0E9] object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-[#F4F0E9]" />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-[#18302F]">
                                {product.name}
                              </p>
                              <p className="mt-0.5 text-xs text-[#7A827D]">
                                ID: {product.id.slice(0, 8)}…
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p>{product.category || "Uncategorised"}</p>
                          <p className="mt-0.5 text-xs text-[#7A827D]">
                            {product.store || "No merchant"}
                          </p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {product.price || "—"}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          {isAssigned ? (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={async () => {
                                const id = window.location.pathname.split("/")[3];
                                setActionBusyId(product.id);

                                const { error } = await supabase
                                  .from("collection_products")
                                  .delete()
                                  .eq("collection_id", id)
                                  .eq("product_id", product.id);

                                if (error) {
                                  console.error("Error removing product from collection:", error);
                                  setActionBusyId(null);
                                  return;
                                }

                                setAssignedProductIds((current) =>
                                  current.filter((productId) => productId !== product.id)
                                );
                                setActionBusyId(null);
                              }}
                              className="rounded-lg bg-[#F0F1EF] px-4 py-2 text-xs font-semibold text-[#687572] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                              {isBusy ? "Removing…" : "Remove"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={async () => {
                                const id = window.location.pathname.split("/")[3];
                                setActionBusyId(product.id);

                                const { error } = await supabase
                                  .from("collection_products")
                                  .insert({
                                    collection_id: id,
                                    product_id: product.id,
                                  });

                                if (error) {
                                  console.error("Error adding product to collection:", error);
                                  setActionBusyId(null);
                                  return;
                                }

                                setAssignedProductIds((current) => [
                                  ...current,
                                  product.id,
                                ]);
                                setActionBusyId(null);
                              }}
                              className="rounded-lg bg-[#176B6B] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#125858] disabled:opacity-50"
                            >
                              {isBusy ? "Adding…" : "+ Add"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

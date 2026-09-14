"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { getAllProducts, Product } from "../lib/products";

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
  await supabase.auth.signOut();
  router.push("/admin/login");
}

const [linkClicks, setLinkClicks] = useState(0);
const [recentProducts, setRecentProducts] = useState<Product[]>([]);
const [productClicks, setProductClicks] = useState<Record<string, number>>({});
const [storeClicks, setStoreClicks] = useState<Record<string, number>>({});
const [liveProducts, setLiveProducts] = useState(0);
const [draftProducts, setDraftProducts] = useState(0);
const [collectionCount, setCollectionCount] = useState(0);

useEffect(() => {
  async function loadLinkClicks() {
  const { data, error } = await supabase
    .from("product_clicks")
    .select("id");

  if (error) {
    console.error("Error loading link clicks:", error);
    return;
  }

  setLinkClicks(data?.length ?? 0);
}

  loadLinkClicks();
}, []);

useEffect(() => {
  async function loadRecentProducts() {
    const data = await getAllProducts();

    const recent = data.slice(0, 3);

    setRecentProducts(recent);

    setLiveProducts(
  data.filter((product) => product.status === "active").length
);

setDraftProducts(
  data.filter((product) => product.status !== "active").length
);

const { data: collections, error: collectionsError } = await supabase
  .from("collections")
  .select("id");

if (collectionsError) {
  console.error("Error loading collections:", collectionsError);
} else {
  setCollectionCount(collections?.length ?? 0);
}

    const { data: clicks, error } = await supabase
      .from("product_clicks")
      .select("product_id, store");

    if (error) {
      console.error("Error loading product clicks:", error);
      return;
    }

    const counts: Record<string, number> = {};

    clicks?.forEach((click) => {
      counts[click.product_id] =
        (counts[click.product_id] || 0) + 1;
    });

    setProductClicks(counts);

    const storeCounts: Record<string, number> = {};

clicks?.forEach((click) => {
  if (click.store) {
    storeCounts[click.store] =
      (storeCounts[click.store] || 0) + 1;
  }
});

setStoreClicks(storeCounts);

  }

  loadRecentProducts();
}, []);
  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#EAE6DF] px-6 py-5 md:px-10">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            The Find Edit
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            Admin
          </h1>
        </div>

        <button
  type="button"
  onClick={handleLogout}
  className="flex items-center gap-3 rounded-full border border-[#EAE6DF] px-4 py-2 text-sm transition hover:bg-[#F4F0E9]"
>
  Logout
</button>

      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

        {/* Navigation */}
        <nav className="mb-12 flex flex-wrap gap-x-8 gap-y-3 border-b border-[#EAE6DF] pb-5 text-sm text-[#5B6470]">

          <a
            href="/admin"
            className="font-medium text-[#176B6B]"
          >
            Overview
          </a>

          <a
            href="/admin/products"
            className="transition hover:text-[#176B6B]"
          >
            Products
          </a>

          <a
            href="/admin/collections"
            className="transition hover:text-[#176B6B]"
          >
            Collections
          </a>

          <a
            href="/admin/categories"
            className="transition hover:text-[#176B6B]"
          >
            Categories
          </a>

          <a
            href="/admin/analytics"
            className="transition hover:text-[#176B6B]"
          >
            Analytics
          </a>

          <a
            href="/admin/settings"
            className="transition hover:text-[#176B6B]"
          >
            Settings
          </a>

        </nav>

        {/* Welcome */}
        <section>

          <p className="text-sm text-[#176B6B]">
            Good morning
          </p>

          <h2 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            Your control room.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5B6470]">
            Manage your products, collections and discoveries from one place.
          </p>

        </section>

        {/* Statistics */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6">
            <p className="text-3xl font-semibold">
              {liveProducts}
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Products live
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6">
            <p className="text-3xl font-semibold">
              {draftProducts}
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Drafts
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6">
            <p className="text-3xl font-semibold">
              {collectionCount}
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Collections
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6">
            <p className="text-3xl font-semibold">
              {linkClicks}
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Link clicks
            </p>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="mt-12">

          <h3 className="text-lg font-semibold">
            Quick actions
          </h3>

          <div className="mt-5 flex flex-wrap gap-4">

           <a
  href="/admin/products/new"
  className="rounded-full bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
>
  + Add a product
</a>
            <a
  href="/admin/collections"
  className="inline-block rounded-full border border-[#EAE6DF] bg-white px-6 py-3 text-sm font-medium transition hover:bg-[#F4F0E9]"
>
  + Create collection
</a>

            <a
              href="/"
              className="rounded-full border border-[#EAE6DF] bg-white px-6 py-3 text-sm font-medium transition hover:bg-[#F4F0E9]"
            >
              View website
            </a>

          </div>

        </section>

        {/* Recent Products */}
        <section className="mt-12">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-semibold">
              Recent products
            </h3>

            <a
              href="/admin/products"
              className="text-sm text-[#176B6B] hover:underline"
            >
              View all
            </a>

          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left text-sm">

                <thead className="border-b border-[#EAE6DF] bg-[#FAF8F4]">

                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Product
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Category
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Store
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Clicks
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {recentProducts.map((product) => (
  <tr
    key={product.id}
    className="border-b border-[#EAE6DF]"
  >
    <td className="px-6 py-5">
      {product.name}
    </td>

    <td className="px-6 py-5 text-[#6B7280]">
      {product.category}
    </td>

    <td className="px-6 py-5 text-[#6B7280]">
      {product.store}
    </td>

    <td className="px-6 py-5">
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          product.status === "active"
            ? "bg-[#E7F2EF] text-[#176B6B]"
            : "bg-[#F4F0E9] text-[#6B7280]"
        }`}
      >
        {product.status === "active" ? "Live" : "Draft"}
      </span>
    </td>

    <td className="px-6 py-5">
  {productClicks[product.id] || 0}
</td>
  </tr>
))}

                </tbody>

              </table>

            </div>

          </div>

        </section>

        <section className="mt-10">
  <div className="mb-5">
    <h2 className="text-xl font-semibold">
      Performance
    </h2>
    <p className="mt-1 text-sm text-[#6B7280]">
      See where your affiliate clicks are coming from.
    </p>
  </div>

  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6">
    <h3 className="text-base font-medium">
      Clicks by Store
    </h3>

    <div className="mt-5 space-y-4">
      {Object.entries(storeClicks).map(([store, clicks]) => (
        <div
          key={store}
          className="flex items-center justify-between"
        >
          <span className="text-sm text-[#6B7280]">
            {store}
          </span>

          <span className="text-sm font-medium">
            {clicks}
          </span>
        </div>
      ))}

      {Object.keys(storeClicks).length === 0 && (
        <p className="text-sm text-[#6B7280]">
          No clicks recorded yet.
        </p>
      )}
    </div>
  </div>
</section>

      </div>

    </main>
  );
}

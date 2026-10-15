"use client";

import AdminLayout from "./_components/AdminLayout";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { Product } from "../lib/products";

type ClickRow = {
  id: string | number;
  product_id: string | null;
  product_name: string | null;
  store: string | null;
  clicked_at: string;
};

type StoreCount = { store: string; clicks: number };

const panelClass = "rounded-lg border border-[#EAE6DF] bg-white p-5 sm:p-6";

function MetricCard({
  label,
  value,
  note,
  href,
}: {
  label: string;
  value: string | number;
  note: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className={`${panelClass} block transition hover:-translate-y-0.5 hover:border-[#B7D0C8] hover:shadow-sm`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A827D]">{label}</p>
      <p className="mt-4 font-serif text-4xl text-[#18302F]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#687572]">{note}</p>
    </a>
  );
}

function statusLabel(status?: string | null) {
  if (status === "active") return "Live";
  if (status === "archived") return "Archived";
  return "Draft";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [clicks, setClicks] = useState<ClickRow[]>([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const [productsResult, clicksResult, categoriesResult, collectionsResult] =
      await Promise.all([
        supabase
          .from("products")
          .select("id,slug,name,description,image,images,price,store,category,subcategory,affiliate_link,status,featured,collection,created_at,updated_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("product_clicks")
          .select("id,product_id,product_name,store,clicked_at")
          .order("clicked_at", { ascending: false }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("collections").select("id", { count: "exact", head: true }),
      ]);

    const failures = [productsResult.error, clicksResult.error, categoriesResult.error, collectionsResult.error].filter(Boolean);
    if (failures.length) {
      console.error("Unable to load all TFE dashboard data:", failures);
      setError("Some dashboard data could not be loaded. Check administrator permissions and try again.");
    }

    setProducts((productsResult.data ?? []) as Product[]);
    setClicks((clicksResult.data ?? []) as ClickRow[]);
    setCategoryCount(categoriesResult.count ?? 0);
    setCollectionCount(collectionsResult.count ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const liveProducts = products.filter((product) => product.status === "active");
  const draftProducts = products.filter((product) => !product.status || product.status === "draft");
  const archivedProducts = products.filter((product) => product.status === "archived");
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentClicks = clicks.filter((click) => new Date(click.clicked_at).getTime() >= sevenDaysAgo);
  const storeCounts: StoreCount[] = Object.entries(
    recentClicks.reduce<Record<string, number>>((counts, click) => {
      const store = click.store?.trim() || "Unspecified store";
      counts[store] = (counts[store] || 0) + 1;
      return counts;
    }, {}),
  )
    .map(([store, count]) => ({ store, clicks: count }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
  const maxStoreClicks = Math.max(1, ...storeCounts.map((item) => item.clicks));
  const recentProducts = products.slice(0, 5);

  return (
    <AdminLayout
      currentSection="overview"
      title="Good finds start here."
      description="Manage the catalogue, keep collections current, and see how shoppers are discovering products."
    >
      <div className="space-y-8">
        {error && (
          <div role="alert" className="flex flex-col gap-3 rounded-lg border border-[#E8D5B8] bg-[#FFF6E8] p-4 text-sm text-[#76511D] sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>
            <button type="button" onClick={() => void loadDashboard()} className="self-start font-semibold underline underline-offset-4 sm:self-auto">Retry</button>
          </div>
        )}

        <section aria-label="Catalogue and engagement summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Live finds" value={loading ? "—" : liveProducts.length} note="Visible in the public catalogue" href="/admin/products" />
          <MetricCard label="Drafts" value={loading ? "—" : draftProducts.length} note="Still being prepared" href="/admin/products" />
          <MetricCard label="Categories" value={loading ? "—" : categoryCount} note="Organise the discovery journey" href="/admin/categories" />
          <MetricCard label="Collections" value={loading ? "—" : collectionCount} note="Curated shopping edits" href="/admin/collections" />
          <MetricCard label="Outbound clicks" value={loading ? "—" : clicks.length.toLocaleString()} note={`${loading ? "—" : recentClicks.length.toLocaleString()} in the last 7 days`} href="/admin/analytics" />
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <a href="/admin/products/new" className="rounded-lg bg-[#176B6B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125858]">＋ Add a find</a>
          <a href="/admin/analytics" className="rounded-lg border border-[#D9E0D9] bg-white px-5 py-3 text-sm font-semibold text-[#18302F] transition hover:border-[#176B6B]">View analytics →</a>
        </div>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
          <div className={panelClass}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A827D]">Catalogue pulse</p>
                <h2 className="mt-2 font-serif text-2xl">Recently added finds</h2>
              </div>
              <a href="/admin/products" className="text-sm font-semibold text-[#176B6B] hover:underline">Manage catalogue →</a>
            </div>
            {loading ? (
              <p className="py-12 text-sm text-[#687572]">Loading catalogue…</p>
            ) : recentProducts.length ? (
              <div className="mt-5 divide-y divide-[#EEF0EB]">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    {product.image ? <img src={product.image} alt="" className="h-12 w-12 shrink-0 rounded-lg bg-[#F4F0E9] object-cover" /> : <div aria-hidden="true" className="h-12 w-12 shrink-0 rounded-lg bg-[#F4F0E9]" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#18302F]">{product.name}</p>
                      <p className="mt-1 truncate text-xs text-[#7A827D]">{product.category || "Uncategorised"} · {product.store || "No merchant set"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${product.status === "active" ? "bg-[#E5F3EC] text-[#23684A]" : product.status === "archived" ? "bg-[#F0F1EF] text-[#687572]" : "bg-[#FFF1D8] text-[#8B5B12]"}`}>{statusLabel(product.status)}</span>
                    <a href={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`} className="shrink-0 text-sm font-semibold text-[#176B6B] hover:underline">Edit</a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center"><p className="font-serif text-xl">Your catalogue is ready for its first find.</p><p className="mt-2 text-sm text-[#687572]">Add a product to start building your edit.</p><a href="/admin/products/new" className="mt-4 inline-flex rounded-lg bg-[#176B6B] px-4 py-2 text-sm font-semibold text-white">Add a find</a></div>
            )}
            {!loading && archivedProducts.length > 0 && <p className="mt-5 border-t border-[#EEF0EB] pt-4 text-xs text-[#7A827D]">{archivedProducts.length} archived {archivedProducts.length === 1 ? "product" : "products"} excluded from the live catalogue.</p>}
          </div>

          <div className={panelClass}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A827D]">Shopper activity</p>
                <h2 className="mt-2 font-serif text-2xl">Clicks by merchant</h2>
                <p className="mt-1 text-sm text-[#687572]">Outbound product clicks over the last 7 days.</p>
              </div>
              <a href="/admin/analytics" className="text-sm font-semibold text-[#176B6B] hover:underline">Full report →</a>
            </div>
            {loading ? <p className="py-12 text-sm text-[#687572]">Loading activity…</p> : storeCounts.length ? (
              <div className="mt-7 space-y-5">
                {storeCounts.map((item) => (
                  <div key={item.store}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="truncate text-[#18302F]">{item.store}</span><span className="font-semibold tabular-nums">{item.clicks.toLocaleString()}</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#EEF1EC]"><div className="h-full rounded-full bg-[#176B6B] transition-all" style={{ width: `${Math.max(3, (item.clicks / maxStoreClicks) * 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center"><p className="font-serif text-xl">No outbound clicks yet</p><p className="mt-2 text-sm leading-6 text-[#687572]">When shoppers follow merchant links, their activity will appear here.</p></div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-[#DCE6DE] bg-[#EEF4EF] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#176B6B]">Keep the edit moving</p><h2 className="mt-2 font-serif text-2xl">What would you like to work on?</h2><p className="mt-2 text-sm leading-6 text-[#687572]">Make a quick update or review what is working for your shoppers.</p></div>
            <div className="flex flex-wrap gap-2"><a href="/admin/products/new" className="rounded-lg bg-[#176B6B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125858]">Add product</a><a href="/admin/collections" className="rounded-lg border border-[#C8D7CE] bg-white px-4 py-2.5 text-sm font-semibold hover:border-[#176B6B]">Curate collections</a><a href="/admin/settings" className="rounded-lg border border-[#C8D7CE] bg-white px-4 py-2.5 text-sm font-semibold hover:border-[#176B6B]">Site settings</a></div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

"use client";

import AdminLayout from "../_components/AdminLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllProducts, updateProduct, type Product } from "../../lib/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !term || [product.name, product.slug, product.category, product.subcategory, product.store]
        .some((value) => String(value ?? "").toLowerCase().includes(term));
      const matchesStatus = statusFilter === "all"
        || (statusFilter === "draft" ? !product.status || product.status === "draft" : product.status === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  async function archiveProduct(product: Product) {
    const confirmed = window.confirm(`Archive “${product.name}”? It will no longer appear in the public catalogue.`);
    if (!confirmed) return;

    setBusyId(product.id);
    setMessage("");
    setError("");
    const result = await updateProduct(product.id, { status: "archived" });
    if (!result.success) {
      setError(`Product could not be archived: ${result.error || "Please try again."}`);
      setBusyId(null);
      return;
    }

    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: "archived" } : item));
    setMessage(`“${product.name}” was archived. Its record and click history have been retained.`);
    setBusyId(null);
  }

  return (
    <AdminLayout
      currentSection="products"
      title="Product catalogue"
      description="Keep product details, merchant links, images and publishing status up to date."
    >
      <div className="space-y-6">
        <a href="/admin/products/new" className="inline-flex rounded-lg bg-[#176B6B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125858]">＋ Add a find</a>

        <section className="rounded-lg border border-[#EAE6DF] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="flex-1"><span className="sr-only">Search catalogue</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, category, slug or merchant…" className="w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-[#176B6B]" /></label>
            <label className="md:w-52"><span className="sr-only">Filter by status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-[#176B6B]"><option value="all">All statuses</option><option value="active">Live</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
            <button type="button" onClick={() => void loadProducts()} className="rounded-xl border border-[#E6E8E2] px-4 py-3 text-sm font-semibold hover:border-[#176B6B]">Refresh</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#687572]"><span><strong className="text-[#18302F]">{products.length}</strong> total</span><span><strong className="text-[#18302F]">{products.filter((p) => p.status === "active").length}</strong> live</span><span><strong className="text-[#18302F]">{products.filter((p) => !p.status || p.status === "draft").length}</strong> drafts</span><span><strong className="text-[#18302F]">{products.filter((p) => p.status === "archived").length}</strong> archived</span><span className="ml-auto">Showing {filteredProducts.length}</span></div>
        </section>

        {message && <p role="status" className="rounded-lg border border-[#CFE1D4] bg-[#EEF4EF] px-4 py-3 text-sm text-[#23684A]">{message}</p>}
        {error && <p role="alert" className="rounded-lg border border-[#E8D5B8] bg-[#FFF6E8] px-4 py-3 text-sm text-[#76511D]">{error}</p>}

        <section className="overflow-hidden rounded-lg border border-[#EAE6DF] bg-white">
          {loading ? <p className="px-6 py-16 text-center text-sm text-[#687572]">Loading catalogue…</p> : filteredProducts.length === 0 ? <div className="px-6 py-16 text-center"><p className="font-serif text-2xl">No matching products</p><p className="mt-2 text-sm text-[#687572]">Try another search or add a new find.</p></div> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-[#EAE6DF] bg-[#FAF8F4] text-xs uppercase tracking-wide text-[#7A827D]"><tr><th className="px-5 py-4 font-semibold">Product</th><th className="px-5 py-4 font-semibold">Category / merchant</th><th className="px-5 py-4 font-semibold">Price</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Featured</th><th className="px-5 py-4 text-right font-semibold">Actions</th></tr></thead>
              <tbody className="divide-y divide-[#EEF0EB]">{filteredProducts.map((product) => <tr key={product.id} className="align-middle hover:bg-[#FFFDF9]">
                <td className="px-5 py-4"><div className="flex items-center gap-3">{product.image ? <img src={product.image} alt="" className="h-12 w-12 rounded-lg bg-[#F4F0E9] object-cover" /> : <div className="h-12 w-12 rounded-lg bg-[#F4F0E9]" />}<div className="min-w-0"><a href={`/admin/products/${product.id}/edit`} className="font-semibold text-[#18302F] hover:text-[#176B6B]">{product.name}</a><p className="mt-1 max-w-[260px] truncate text-xs text-[#7A827D]">{product.slug}</p></div></div></td>
                <td className="px-5 py-4"><p>{product.category || "Uncategorised"}</p><p className="mt-1 text-xs text-[#7A827D]">{product.store || "No merchant"}{product.subcategory ? ` · ${product.subcategory}` : ""}</p></td>
                <td className="px-5 py-4 whitespace-nowrap">{product.price || "—"}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${product.status === "active" ? "bg-[#E5F3EC] text-[#23684A]" : product.status === "archived" ? "bg-[#F0F1EF] text-[#687572]" : "bg-[#FFF1D8] text-[#8B5B12]"}`}>{product.status === "active" ? "Live" : product.status === "archived" ? "Archived" : "Draft"}</span></td>
                <td className="px-5 py-4">{product.featured ? <span className="text-[#176B6B]">Featured</span> : <span className="text-[#A3AAA5]">—</span>}</td>
                <td className="px-5 py-4 text-right whitespace-nowrap"><a href={`/admin/products/${product.id}/edit`} className="mr-4 font-semibold text-[#176B6B] hover:underline">Edit</a>{product.status !== "archived" && <button type="button" disabled={busyId === product.id} onClick={() => void archiveProduct(product)} className="font-semibold text-[#8B5B12] hover:underline disabled:opacity-50">{busyId === product.id ? "Archiving…" : "Archive"}</button>}</td>
              </tr>)}</tbody>
            </table></div>
          )}
        </section>
        <p className="text-xs leading-6 text-[#7A827D]">Archiving is reversible from the product editor and preserves historical click records. It is safer than permanently deleting a find.</p>
      </div>
    </AdminLayout>
  );
}

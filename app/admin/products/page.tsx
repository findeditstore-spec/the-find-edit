"use client";

import { useEffect, useState } from "react";
import {
  deleteProduct,
  getAllProducts,
  Product,
} from "../../lib/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

    useEffect(() => {
    async function loadProducts() {
      const data = await getAllProducts();

console.log("ADMIN PRODUCTS:", data);

setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []);

    async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const result = await deleteProduct(id);

    if (!result.success) {
      setMessage(`Product could not be deleted: ${result.error}`);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );

    setMessage("Product deleted successfully.");
  }

    if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <p className="text-sm text-[#6B7280]">
          Loading products...
        </p>
      </main>
    );
  }

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

        <a
          href="/admin"
          className="rounded-full border border-[#EAE6DF] px-4 py-2 text-sm transition hover:bg-[#F4F0E9]"
        >
          Dashboard
        </a>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        {/* Page heading */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-[#176B6B]">
              Product management
            </p>

            <h2 className="mt-2 text-4xl font-semibold tracking-tight">
              Products
            </h2>

            <p className="mt-3 text-[#5B6470]">
              Manage the finds displayed across The Find Edit.
            </p>
          </div>

          <a
  href="/admin/products/new"
  className="w-fit rounded-full bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
>
  + Add a product
</a>
        </div>

        <div className="mt-10">
  <p className="text-sm text-[#6B7280]">
    {products.length} products
  </p>

  {message && (
    <p className="mt-4 rounded-xl bg-[#F4F0E9] px-4 py-3 text-sm text-[#176B6B]">
      {message}
    </p>
  )}
</div>

        {/* Products table */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-[#EAE6DF] bg-[#FAF8F4]">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Product
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Category
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Subcategory
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Store
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Price
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#EAE6DF] last:border-b-0"
                  >
                    <td className="px-6 py-5 font-medium">
  <a
    href={`/admin/products/${product.id}/edit`}
    className="transition hover:text-[#176B6B]"
  >
    {product.name}
  </a>
</td>

                    <td className="px-6 py-5 text-[#6B7280]">
                      {product.category}
                    </td>

                    <td className="px-6 py-5 text-[#6B7280]">
                      {product.subcategory}
                    </td>

                    <td className="px-6 py-5 text-[#6B7280]">
                      {product.store}
                    </td>

                    <td className="px-6 py-5">
                      {product.price}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-[#E7F2EF] px-3 py-1 text-xs font-medium text-[#176B6B]">
                        {product.status ?? "active"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
  <button
    type="button"
    onClick={() => handleDelete(product.id, product.name)}
    className="text-sm text-red-600 transition hover:text-red-800"
  >
    Delete
  </button>
</td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-[#6B7280]"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
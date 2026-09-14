"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProductImageGallery from "./ProductImageGallery";

type Product = {
  id: string;
  slug: string;
  name: string;
  store: string;
  price: string;
  image: string;
  images: string[];
  category: string;
};

type ProductSearchProps = {
  products: Product[];
};

export default function ProductSearch({
  products,
}: ProductSearchProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .eq("status", "active")
      .order("name");

    if (error) {
      console.error("Error loading categories:", error);
      return;
    }

    setCategories(data?.map((item) => item.name) ?? []);
  }

  loadCategories();
}, []);

  const filteredProducts = products.filter((product) => {
  const matchesSearch = `${product.name} ${product.store}`
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" || product.category === category;

  return matchesSearch && matchesCategory;
});

const sortedProducts = [...filteredProducts].sort((a, b) => {
  if (sortBy === "Name: A–Z") {
    return a.name.localeCompare(b.name);
  }

  if (sortBy === "Price: Low to High") {
    return (
      parseFloat(a.price.replace(/[^0-9.]/g, "")) -
      parseFloat(b.price.replace(/[^0-9.]/g, ""))
    );
  }

  if (sortBy === "Price: High to Low") {
    return (
      parseFloat(b.price.replace(/[^0-9.]/g, "")) -
      parseFloat(a.price.replace(/[^0-9.]/g, ""))
    );
  }

  return 0;
});

  return (

    <>
    <div className="mt-10 flex flex-wrap gap-3">
  {["All", ...categories].map((item) => (
      <button
        key={item}
        type="button"
        onClick={() => setCategory(item)}
        className={`rounded-full border px-5 py-2.5 text-sm transition ${
          category === item
            ? "border-[#176B6B] bg-[#176B6B] text-white"
            : "border-[#EAE6DF] bg-white text-[#5B6470] hover:border-[#176B6B] hover:text-[#176B6B]"
        }`}
      >
        {item}
      </button>
    )
  )}
</div>

      <div className="mt-10 max-w-2xl">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search finds..."
          className="w-full rounded-full border border-[#EAE6DF] bg-white px-6 py-4 text-sm outline-none transition placeholder:text-[#9A9F9B] focus:border-[#176B6B]"
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
  <p className="text-sm text-[#7A827D]">
    {sortedProducts.length} finds
  </p>

  <select
    value={sortBy}
    onChange={(event) => setSortBy(event.target.value)}
    className="rounded-full border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-2 text-sm text-[#5B6470] outline-none transition focus:border-[#176B6B]"
  >
    <option value="Newest">Sort by: Newest</option>
    <option value="Name: A–Z">Name: A–Z</option>
    <option value="Price: Low to High">Price: Low to High</option>
    <option value="Price: High to Low">Price: High to Low</option>
  </select>
</div>

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {sortedProducts.map((product) => (
          <a
            key={product.id}
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white transition hover:-translate-y-1"
          >
           <ProductImageGallery
  images={product.images?.length ? product.images : [product.image]}
  alt={product.name}
/>

            <div className="p-4">
              <p className="text-sm text-[#7A827D]">
                {product.store}
              </p>

              <h2 className="mt-2 font-medium">
                {product.name}
              </h2>

              <p className="mt-2 text-sm text-[#5B6470]">
                {product.price}
              </p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
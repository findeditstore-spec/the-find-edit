"use client";

import { useState } from "react";
import NavigationMenu from "./NavigationMenu";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: string;
  store: string;
  category: string;
  subcategory: string;
};

type CategoryPageProps = {
  title: string;
  description: string;
  filters: string[];
  products: Product[];
};

export default function CategoryPage({
  title,
  description,
  filters,
  products,
}: CategoryPageProps) {
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
const [menuOpen, setMenuOpen] = useState(false);
const [sortBy, setSortBy] = useState("Newest");

const filteredProducts =
  selectedFilter === "All"
    ? products
    : products.filter(
        (product) => product.subcategory === selectedFilter
      );

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
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <a
          href="/"
          className="text-xl font-semibold tracking-wide"
        >
          The Find Edit
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EAE6DF]"
          aria-label="Open menu"
        >
          <span className="text-xl">☰</span>
        </button>
      </header>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:px-12 md:pt-24">
        <a
          href="/"
          className="text-sm text-[#176B6B] transition hover:opacity-70"
        >
          ← Back
        </a>

        <div className="mt-10 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            The Edit
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
            {title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5B6470]">
            {description}
          </p>
        </div>
      </section>

      {/* Filters */}
<section className="mx-auto max-w-6xl px-6 md:px-12">
  <div className="flex flex-wrap gap-3 border-b border-[#EAE6DF] pb-8">
    {filters.map((filter) => (
      <button
        key={filter}
        type="button"
        onClick={() => setSelectedFilter(filter)}
        className={
          selectedFilter === filter
            ? "rounded-full bg-[#176B6B] px-5 py-2.5 text-sm text-white"
            : "rounded-full border border-[#EAE6DF] px-5 py-2.5 text-sm text-[#5B6470] transition hover:bg-[#F4F0E9]"
        }
      >
        {filter}
      </button>
    ))}
  </div>

  <div className="flex items-center justify-between py-6">
    <p className="text-sm text-[#7A827D]">
      {filteredProducts.length} finds
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
</section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

          {sortedProducts.map((product) => (
            <article key={product.name} className="group">

              <div className="aspect-square overflow-hidden rounded-3xl bg-[#F2EFE9]">
  <img
    src={product.image}
    alt={product.name}
    className="h-full w-full object-cover"
  />
</div>

              <div className="pt-5">
                <h2 className="text-lg font-medium">
                  {product.name}
                </h2>

                <p className="mt-2 text-sm text-[#176B6B]">
                  {product.price}
                </p>

                <p className="mt-1 text-sm text-[#7A827D]">
                  {product.store}
                </p>

                <a
  href={`/products/${product.slug}`}
  className="mt-5 inline-block text-sm font-medium text-[#1F2937] transition hover:text-[#176B6B]"
>
  View find →
</a>
              </div>

            </article>
          ))}

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAE6DF] px-6 py-8 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#7A827D]">
            © 2026 The Find Edit
          </p>

          <div className="flex gap-5 text-sm text-[#5B6470]">
            <a href="#">About</a>
            <a href="#">How it works</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>

      <NavigationMenu
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
/>
    </main>
  );
}
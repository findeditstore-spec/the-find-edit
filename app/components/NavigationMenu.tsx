"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type NavigationMenuProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

export default function NavigationMenu({
  menuOpen,
  setMenuOpen,
}: NavigationMenuProps) {
  const [categories, setCategories] = useState<
    {
      id: string;
      name: string;
      slug: string;
    }[]
  >([]);

  const [collections, setCollections] = useState<
  {
    id: string;
    name: string;
    slug: string;
  }[]
>([]);

const [displayCollections, setDisplayCollections] = useState<
  {
    id: string;
    name: string;
    slug: string;
  }[]
>([]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("status", "active")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading categories:", error);
        return;
      }

      setCategories(data ?? []);
    }

    loadCategories();
  }, []);

  useEffect(() => {
  async function loadCollections() {
    const { data, error } = await supabase
      .from("collections")
      .select("id, name, slug")
      .eq("status", "active")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading collections:", error);
      return;
    }

    setCollections(data ?? []);
  }

  loadCollections();
}, []);

useEffect(() => {
  if (collections.length === 0) {
    setDisplayCollections([]);
    return;
  }

  const today = new Date();
  const dayNumber = Math.floor(
    today.getTime() / (1000 * 60 * 60 * 24)
  );

  const startIndex = dayNumber % collections.length;

  const rotatedCollections = [
    ...collections.slice(startIndex),
    ...collections.slice(0, startIndex),
  ];

  setDisplayCollections(rotatedCollections.slice(0, 4));
}, [collections]);

  return (
    <div
  className={`fixed inset-0 z-50 h-screen overflow-hidden bg-[#FFFDF9] transition-all duration-500 ${
        menuOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      {/* Menu Header */}
      <div className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="text-xl font-semibold tracking-wide">
          The Find Edit
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EAE6DF] transition hover:bg-[#F4F0E9]"
          aria-label="Close menu"
        >
          <span className="text-2xl font-light">×</span>
        </button>
      </div>

      {/* Menu Content */}
<div className="h-[calc(100vh-96px)] overflow-y-auto overscroll-contain px-8 py-10 pb-20 md:px-12 md:py-16">        <p className="mb-8 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
          Explore
        </p>

        <nav className="space-y-2">
  {categories.map((category) => (
    <a
      key={category.id}
      href={`/${category.slug}`}
      onClick={() => setMenuOpen(false)}
      className="group flex items-center justify-between border-b border-[#EAE6DF] py-5 text-3xl font-medium transition hover:text-[#176B6B] md:text-5xl"
    >
      {category.name}

      <span className="text-xl font-light transition-transform group-hover:translate-x-2">
        →
      </span>
    </a>
  ))}
</nav>

        {/* Discover */}
<div className="mt-12">
  <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
    Discover
  </p>

  <div className="grid gap-4 text-lg text-[#5B6470] md:grid-cols-2">
    {displayCollections.map((collection) => (
      <a
        key={collection.id}
        href={`/collections/${collection.slug}`}
        onClick={() => setMenuOpen(false)}
        className="rounded-xl border border-[#EAE6DF] px-5 py-4 transition hover:bg-[#F4F0E9] hover:text-[#176B6B]"
      >
        {collection.name}
      </a>
    ))}
  </div>
</div>

        {/* More */}
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-[#5B6470]">
          <a
  href="/trending"
  onClick={() => setMenuOpen(false)}
  className="transition hover:text-[#176B6B]"
>
  Trending Finds
</a>

          <a
            href="/collections"
            onClick={() => setMenuOpen(false)}
            className="transition hover:text-[#176B6B]"
          >
            Curated Collections
          </a>

          <a
            href="/how-it-works"
            onClick={() => setMenuOpen(false)}
            className="transition hover:text-[#176B6B]"
          >
            How It Works
          </a>

          <a
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="transition hover:text-[#176B6B]"
          >
            About
          </a>

<a
  href="/admin/login"
  onClick={() => setMenuOpen(false)}
  className="transition hover:text-[#176B6B]"
>
  Admin
</a>

        </div>
      </div>
    </div>
  );
}
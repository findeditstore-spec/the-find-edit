"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [homepageHeadline, setHomepageHeadline] = useState(
  "Find your next favourite thing."
);
const [homepageSubheadline, setHomepageSubheadline] = useState(
  "We do the searching. You do the finding."
);

const [homepageCtaText, setHomepageCtaText] = useState(
  "Start Exploring"
);
const [homepageCtaLink, setHomepageCtaLink] = useState("/finds");
const [instagramUrl, setInstagramUrl] = useState("");
const [tiktokUrl, setTiktokUrl] = useState("");

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
  async function loadLatestProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error loading latest products:", error);
      return;
    }

    setLatestProducts(data ?? []);
  }

  loadLatestProducts();
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

useEffect(() => {
  async function loadHomepageSettings() {
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("headline, subheadline, cta_text, cta_link")
      .limit(1)
      .single();

    if (error) {
      console.error("Error loading homepage settings:", error);
      return;
    }

    setHomepageHeadline(data.headline);
setHomepageSubheadline(data.subheadline);
setHomepageCtaText(data.cta_text);
setHomepageCtaLink(data.cta_link);
  }

  loadHomepageSettings();
}, []);

useEffect(() => {
  async function loadSocialSettings() {
    const { data, error } = await supabase
      .from("social_settings")
      .select("instagram_url, tiktok_url")
      .limit(1)
      .single();

    if (error) {
      console.error("Error loading social settings:", error);
      return;
    }

    setInstagramUrl(data.instagram_url ?? "");
    setTiktokUrl(data.tiktok_url ?? "");
  }

  loadSocialSettings();
}, []);

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center">
  <img
    src="/tfe-logo.png"
    alt="The Find Edit"
    className="h-20
     w-auto"
  />
</div>

        <button
  type="button"
  onClick={() => setMenuOpen(true)}
  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EAE6DF] transition hover:bg-[#F4F0E9]"
  aria-label="Open menu"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-5 w-5"
  >
    <path
      d="M5 8.5h14l-1 11H6l-1-11Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 8.5V7a3 3 0 0 1 6 0v1.5"
      strokeLinecap="round"
    />
  </svg>
</button>
      </header>

      {/* Hero */}
{/* Hero */}
<section className="flex min-h-[calc(100vh-100px)] items-center overflow-hidden px-6 md:px-12">
  <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-4 sm:gap-8 lg:gap-16">
    
    <div className="text-left">
      <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-[#176B6B]">
        The Find Edit
      </p>

      <h1 className="font-serif text-3xl font-medium leading-[0.95] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
        {homepageHeadline}
      </h1>

      <p className="mt-7 max-w-xl text-lg leading-8 text-[#5B6470] md:text-xl">
        {homepageSubheadline}
      </p>

      <button
        type="button"
        onClick={() => {
  window.location.href = homepageCtaLink;
}}
        className="mt-10 rounded-full bg-[#176B6B] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#125858]"
      >
        {homepageCtaText}
      </button>
    </div>

    <div className="flex justify-center lg:justify-end">
      <img
        src="/find-edit-bag.png"
        alt="The Find Edit shopping bag"
        className="w-[140px] sm:w-[220px] md:w-[300px] lg:w-[420px]"
      />
    </div>

  </div>

  <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-sm text-[#7A827D]">
  <span>Scroll to discover</span>
  <span className="text-lg">↓</span>
</div>
</section>

{/* Latest Finds */}
<section className="px-6 py-24 md:px-12 md:py-32">
  <div className="mx-auto max-w-6xl">
    <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
          Latest Finds
        </p>

        <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          A few things worth finding.
        </h2>
      </div>

      <a
        href="/finds"
        className="text-sm font-medium text-[#176B6B] transition hover:opacity-70"
      >
        Explore All Finds →
      </a>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
  {latestProducts.map((product) => (
    <a
      key={product.id}
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white transition hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-[#F4F0E9]">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="p-5">
        <p className="text-sm text-[#7A827D]">
          {product.store}
        </p>

        <h3 className="mt-2 font-medium">
          {product.name}
        </h3>

        <p className="mt-2 text-sm text-[#5B6470]">
          {product.price}
        </p>
      </div>
    </a>
  ))}
</div>
  </div>
</section>

      {/* Footer */}
<footer className="border-t border-[#EAE6DF] px-6 py-12 md:px-12 md:py-16">
  <div className="mx-auto max-w-6xl">

    {/* Affiliate Disclosure */}
    <div className="border-b border-[#EAE6DF] pb-10">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
        Affiliate Disclosure
      </p>

      <p className="max-w-3xl text-sm leading-7 text-[#5B6470]">
        Some links on The Find Edit are affiliate links. If you purchase
        something through one of these links, we may earn a commission at no
        additional cost to you. These commissions help support The Find Edit
        and the work that goes into finding and curating products.
      </p>
    </div>

    {/* Footer Links */}
    <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-[#7A827D]">
        © 2026 The Find Edit
      </p>

      <nav className="flex flex-wrap gap-5 text-sm text-[#5B6470]">
        <a
  href={instagramUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  Instagram
</a>

<a
  href={tiktokUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  TikTok
</a>
        <a href="/about">About</a>
        <a href="/how-it-works">How it works</a>
        <a href="/affiliate-disclosure">Affiliate disclosure</a>
        <a href="/privacy">Privacy</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>

  </div>
</footer>

      {/* Navigation Menu */}
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
<div className="h-[calc(100vh-96px)] overflow-y-auto overscroll-contain px-8 py-10 pb-20 md:px-12 md:py-16">          <p className="mb-8 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
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
    </main>
  );
}
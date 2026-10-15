"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/app/lib/supabase-client";
import { useWishlist } from "@/app/lib/wishlist-context";
import { useComparison } from "@/app/lib/comparison-context";

interface Category {
  id: string;
  name: string;
  slug: string;
  status: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [mounted, setMounted] = useState(false);

  const { savedProducts } = useWishlist();
  const { comparedProducts } = useComparison();

  const savedCount = savedProducts.length;
  const comparedCount = comparedProducts.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      loadNavigationData();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function loadNavigationData() {
    if (categories.length > 0 && collections.length > 0) return;
    const supabase = getSupabaseBrowserClient();

    const [categoriesResult, collectionsResult] = await Promise.all([
      supabase.from("categories").select("*").eq("status", "active").order("name"),
      supabase.from("collections").select("*").eq("status", "active").order("name").limit(8),
    ]);

    if (categoriesResult.data) setCategories(categoriesResult.data);
    if (collectionsResult.data) setCollections(collectionsResult.data);
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-sm border-b border-[#EAE6DF] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex flex-col group py-1 shrink-0">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#176B6B] transition-colors group-hover:text-[#125858]">
                TFE
              </span>
              <span className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] uppercase text-[#7A827D] font-medium">
                The Find Edit
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              <Link
                href="/finds"
                className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors tracking-wide"
              >
                Shop
              </Link>
              <Link
                href="/collections"
                className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors tracking-wide"
              >
                Collections
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors tracking-wide"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors tracking-wide"
              >
                About
              </Link>
            </nav>

            {/* Desktop Utility Controls */}
            <div className="hidden md:flex items-center gap-5">
              {/* Search */}
              <Link
                href="/finds"
                className="p-2 text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full hover:bg-[#F4F0E9]"
                aria-label="Search finds"
                title="Search finds"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full hover:bg-[#F4F0E9]"
                aria-label={`Wishlist (${mounted ? savedCount : 0} items)`}
                title="Saved Finds"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {mounted && savedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#176B6B] px-1 text-[0.625rem] font-semibold text-white">
                    {savedCount}
                  </span>
                )}
              </Link>

              {/* Compare */}
              <Link
                href="/compare"
                className="relative p-2 text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full hover:bg-[#F4F0E9]"
                aria-label={`Compare (${mounted ? comparedCount : 0} items)`}
                title="Product Comparison"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {mounted && comparedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#C9A86A] px-1 text-[0.625rem] font-semibold text-[#1F2937]">
                    {comparedCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#5B6470] hover:text-[#176B6B] transition-colors py-1.5 px-3 rounded-full border border-[#EAE6DF] hover:border-[#176B6B]"
                title="Account / Sign In"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Account</span>
              </Link>

              {/* Editorial Menu Trigger */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-2 p-2 text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full hover:bg-[#F4F0E9]"
                aria-label="Open editorial menu"
                title="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Utility Controls (Simplified, compact hierarchy) */}
            <div className="flex md:hidden items-center gap-1 sm:gap-2">
              {/* Search */}
              <Link
                href="/finds"
                className="p-2 text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full"
                aria-label={`Wishlist (${mounted ? savedCount : 0})`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {mounted && savedCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-[#176B6B] px-0.5 text-[0.55rem] font-semibold text-white">
                    {savedCount}
                  </span>
                )}
              </Link>

              {/* Compare */}
              <Link
                href="/compare"
                className="relative p-2 text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full"
                aria-label={`Compare (${mounted ? comparedCount : 0})`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {mounted && comparedCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-[#C9A86A] px-0.5 text-[0.55rem] font-semibold text-[#1F2937]">
                    {comparedCount}
                  </span>
                )}
              </Link>

              {/* Menu */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Editorial Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#FFFDF9] animate-fade-in flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Editorial Navigation Menu"
        >
          {/* Menu Header Bar */}
          <div className="border-b border-[#EAE6DF] shrink-0 bg-[#FFFDF9]">
            <div className="container mx-auto px-4 sm:px-6 md:px-12">
              <div className="flex items-center justify-between h-20">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex flex-col group py-1">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#176B6B]">TFE</span>
                  <span className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] uppercase text-[#7A827D] font-medium">
                    The Find Edit
                  </span>
                </Link>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#5B6470] hover:text-[#176B6B] transition-colors rounded-full border border-[#EAE6DF] hover:border-[#176B6B]"
                  aria-label="Close menu"
                >
                  <span className="text-xs uppercase tracking-wider font-medium">Close</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Menu Scrollable Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-14">
                {/* 1. DISCOVER */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-5">
                    Discover
                  </p>
                  <nav className="space-y-3.5">
                    <Link
                      href="/finds"
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-serif text-2xl text-[#1F2937] hover:text-[#176B6B] transition-colors tracking-tight"
                    >
                      Shop All Finds
                    </Link>
                    <Link
                      href="/trending"
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-serif text-2xl text-[#1F2937] hover:text-[#176B6B] transition-colors tracking-tight"
                    >
                      Trending Now
                    </Link>
                    <Link
                      href="/tfe-edit"
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-serif text-2xl text-[#1F2937] hover:text-[#176B6B] transition-colors tracking-tight"
                    >
                      The TFE Edit
                    </Link>
                    <Link
                      href="/collections"
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-serif text-2xl text-[#1F2937] hover:text-[#176B6B] transition-colors tracking-tight"
                    >
                      Curated Collections
                    </Link>
                  </nav>

                  <div className="mt-8 pt-6 border-t border-[#EAE6DF] space-y-2">
                    <Link
                      href="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between text-sm text-[#5B6470] hover:text-[#176B6B] transition-colors"
                    >
                      <span>Saved Finds</span>
                      {mounted && savedCount > 0 && (
                        <span className="rounded-full bg-[#176B6B] px-2 py-0.5 text-xs text-white">
                          {savedCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/compare"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between text-sm text-[#5B6470] hover:text-[#176B6B] transition-colors"
                    >
                      <span>Product Comparison</span>
                      {mounted && comparedCount > 0 && (
                        <span className="rounded-full bg-[#C9A86A] px-2 py-0.5 text-xs text-[#1F2937]">
                          {comparedCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                {/* 2. CATEGORIES */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-5">
                    Categories
                  </p>
                  <nav className="space-y-2.5">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/${category.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-base text-[#5B6470] hover:text-[#176B6B] hover:translate-x-1 transition-all"
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link
                          href="/fashion"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                        >
                          Fashion
                        </Link>
                        <Link
                          href="/beauty"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                        >
                          Beauty
                        </Link>
                        <Link
                          href="/creator-tech"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                        >
                          Creator Tech
                        </Link>
                      </>
                    )}
                  </nav>
                </div>

                {/* 3. FEATURED COLLECTIONS */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-5">
                    Featured Collections
                  </p>
                  <nav className="space-y-2.5">
                    {collections.length > 0 ? (
                      collections.map((collection) => (
                        <Link
                          key={collection.id}
                          href={`/collections/${collection.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-base text-[#5B6470] hover:text-[#176B6B] hover:translate-x-1 transition-all"
                        >
                          {collection.name}
                        </Link>
                      ))
                    ) : (
                      <Link
                        href="/collections"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                      >
                        Explore All Collections â†’
                      </Link>
                    )}
                  </nav>
                </div>

                {/* 4. ABOUT TFE & ADMIN */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-5">
                    About TFE
                  </p>
                  <nav className="space-y-2.5">
                    <Link
                      href="/how-it-works"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                    >
                      How It Works
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                    >
                      Our Story
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/affiliate-disclosure"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                    >
                      Affiliate Disclosure
                    </Link>
                    <Link
                      href="/privacy"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base text-[#5B6470] hover:text-[#176B6B] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </nav>

                  {/* 5. ADMIN ACCESS */}
                  <div className="mt-8 pt-6 border-t border-[#EAE6DF]">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7A827D] mb-3">
                      Platform Access
                    </p>
                    <Link
                      href="/admin/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-flex items-center gap-2 text-sm text-[#5B6470] hover:text-[#176B6B] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>Admin Access</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Editorial Footer Note inside Menu */}
              <div className="mt-16 pt-8 border-t border-[#EAE6DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A827D]">
                <p>Good finds. A better you.</p>
                <p>DISCOVER â€¢ COMPARE â€¢ SHOP SMARTER</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

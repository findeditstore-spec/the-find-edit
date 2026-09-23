"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/app/lib/supabase-client';

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

  useEffect(() => {
    if (isMenuOpen) {
      loadNavigationData();
    }
  }, [isMenuOpen]);

  async function loadNavigationData() {
    const supabase = getSupabaseBrowserClient();

    const [categoriesResult, collectionsResult] = await Promise.all([
      supabase.from('categories').select('*').eq('status', 'active').order('name'),
      supabase.from('collections').select('*').eq('status', 'active').order('name').limit(6)
    ]);

    if (categoriesResult.data) setCategories(categoriesResult.data);
    if (collectionsResult.data) setCollections(collectionsResult.data);
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFFDF9] border-b border-[#EAE6DF]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#176B6B]">TFE</span>
              <span className="text-[0.65rem] tracking-widest uppercase text-[#7A827D]">The Find Edit</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/finds" className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors">
                Shop
              </Link>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors"
              >
                Categories
              </button>
              <Link href="/collections" className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors">
                Collections
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors">
                How It Works
              </Link>
              <Link href="/about" className="text-sm font-medium text-[#5B6470] hover:text-[#176B6B] transition-colors">
                About
              </Link>
            </nav>

            {/* Utilities */}
            <div className="flex items-center gap-4">
              <Link
                href="/finds"
                className="text-[#5B6470] hover:text-[#176B6B] transition-colors"
                aria-label="Search products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-[#5B6470] hover:text-[#176B6B] transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FFFDF9]">
          <div className="container mx-auto px-6 md:px-12 h-full overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between h-20 border-b border-[#EAE6DF]">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#176B6B]">TFE</span>
                <span className="text-[0.65rem] tracking-widest uppercase text-[#7A827D]">The Find Edit</span>
              </Link>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-[#5B6470] hover:text-[#176B6B] transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <div className="py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Main Navigation */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest text-[#176B6B] mb-6">
                  Discover
                </h3>
                <nav className="space-y-4">
                  <Link
                    href="/finds"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-2xl font-serif text-[#1F2937] hover:text-[#176B6B] transition-colors"
                  >
                    Shop All Finds
                  </Link>
                  <Link
                    href="/trending"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-2xl font-serif text-[#1F2937] hover:text-[#176B6B] transition-colors"
                  >
                    Trending Now
                  </Link>
                  <Link
                    href="/collections"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-2xl font-serif text-[#1F2937] hover:text-[#176B6B] transition-colors"
                  >
                    Collections
                  </Link>
                </nav>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-widest text-[#176B6B] mb-6">
                    Categories
                  </h3>
                  <nav className="space-y-3">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-lg text-[#5B6470] hover:text-[#176B6B] transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* Featured Collections */}
              {collections.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-widest text-[#176B6B] mb-6">
                    Featured Collections
                  </h3>
                  <nav className="space-y-3">
                    {collections.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/collections/${collection.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-lg text-[#5B6470] hover:text-[#176B6B] transition-colors"
                      >
                        {collection.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* About */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest text-[#176B6B] mb-6">
                  About TFE
                </h3>
                <nav className="space-y-3">
                  <Link
                    href="/how-it-works"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg text-[#5B6470] hover:text-[#176B6B] transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg text-[#5B6470] hover:text-[#176B6B] transition-colors"
                  >
                    Our Story
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg text-[#5B6470] hover:text-[#176B6B] transition-colors"
                  >
                    Contact
                  </Link>
                </nav>

                {/* Admin Access - Discreet but discoverable */}
                <div className="mt-8 pt-6 border-t border-[#EAE6DF]">
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-center gap-2 text-sm text-[#5B6470] hover:text-[#176B6B] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Admin Access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

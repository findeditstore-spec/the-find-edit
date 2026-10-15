"use client";

import { useEffect, useState } from 'react';
import { useWishlist } from '../lib/wishlist-context';
import { getSupabaseBrowserClient } from '../lib/supabase-client';
import StandardProductCard from './product-cards/StandardProductCard';
import Link from 'next/link';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  price: string;
  store: string;
  category: string;
  subcategory: string;
  featured?: boolean;
}

export default function WishlistContent() {
  const { savedProducts, toggleSaved, clearAll } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (savedProducts.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', savedProducts);

      if (error) {
        console.error('Error loading wishlist products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    loadWishlistProducts();
  }, [savedProducts]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#176B6B]"></div>
        <p className="mt-4 text-[#7A827D]">Loading your saved finds...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-[#F4F0E9] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#7A827D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
            Your wishlist is empty
          </h3>
          <p className="text-[#5B6470] mb-8">
            Start saving products you love and they'll appear here.
          </p>
          <Link
            href="/finds"
            className="inline-block px-8 py-4 bg-[#176B6B] text-white rounded-full font-medium hover:bg-[#125858] transition-colors"
          >
            Explore Finds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-[#7A827D]">
          {products.length} {products.length === 1 ? 'item' : 'items'} saved
        </p>
        {products.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <StandardProductCard
            key={product.id}
            product={product}
            onSave={toggleSaved}
            isSaved={true}
            showBadge={product.featured}
          />
        ))}
      </div>
    </div>
  );
}

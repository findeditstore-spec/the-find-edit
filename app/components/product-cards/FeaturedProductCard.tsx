"use client";

import Link from 'next/link';
import Badge from '@/app/components/ui/Badge';
import { useState } from 'react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image: string;
  images?: string[];
  price: string;
  store: string;
  category: string;
  subcategory?: string;
  featured?: boolean;
}

interface FeaturedProductCardProps {
  product: Product;
  editorial?: string;
  onSave?: (productId: string) => void;
  isSaved?: boolean;
}

export default function FeaturedProductCard({
  product,
  editorial,
  onSave,
  isSaved = false
}: FeaturedProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-white border-2 border-[#176B6B] rounded-2xl overflow-hidden transition-all hover:shadow-xl">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden bg-[#F4F0E9]">
            <img
              src={imageError ? 'https://placehold.co/800x800/F4F0E9/7A827D?text=No+Image' : product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />

            <div className="absolute top-4 left-4">
              <Badge variant="tfe-pick">TFE Pick</Badge>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-widest text-[#176B6B] mb-3">
            {product.category}
          </p>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#1F2937] mb-4 group-hover:text-[#176B6B] transition-colors">
              {product.name}
            </h3>
          </Link>

          {editorial && (
            <p className="text-[#5B6470] leading-relaxed mb-6">
              {editorial}
            </p>
          )}

          <div className="flex items-center justify-between mb-6">
            <p className="text-2xl font-semibold text-[#176B6B]">
              {product.price}
            </p>
            <p className="text-sm text-[#7A827D]">
              at {product.store}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 text-center px-6 py-3 bg-[#176B6B] text-white rounded-full font-medium hover:bg-[#125858] transition-colors"
            >
              Explore This Find →
            </Link>

            {onSave && (
              <button
                onClick={() => onSave(product.id)}
                className="p-3 border-2 border-[#176B6B] rounded-full hover:bg-[#176B6B] hover:text-white transition-colors group/btn"
                aria-label="Save product"
              >
                <svg
                  className={`w-5 h-5 ${isSaved ? 'fill-[#176B6B] group-hover/btn:fill-white' : ''}`}
                  fill={isSaved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  featured?: boolean | null;
  status?: string;
}

interface StandardProductCardProps {
  product: Product;
  onSave?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  isSaved?: boolean;
  showBadge?: boolean;
}

export default function StandardProductCard({
  product,
  onSave,
  onCompare,
  isSaved = false,
  showBadge = true
}: StandardProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-white border border-[#EAE6DF] rounded-2xl overflow-hidden transition-all hover:shadow-md">
      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-[#F4F0E9]">
          <img
            src={imageError ? 'https://placehold.co/600x600/F4F0E9/7A827D?text=No+Image' : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />

          {/* Badge */}
          {showBadge && product.featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="tfe-pick">TFE Pick</Badge>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSave(product.id);
                }}
                className="p-2 bg-white rounded-full shadow-md hover:bg-[#FFFDF9] transition-colors"
                aria-label="Save product"
              >
                <svg
                  className={`w-5 h-5 ${isSaved ? 'fill-[#176B6B] text-[#176B6B]' : 'text-[#5B6470]'}`}
                  fill={isSaved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}

            {onCompare && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onCompare(product.id);
                }}
                className="p-2 bg-white rounded-full shadow-md hover:bg-[#FFFDF9] transition-colors"
                aria-label="Add to comparison"
              >
                <svg className="w-5 h-5 text-[#5B6470]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs uppercase tracking-wider text-[#7A827D] mb-2">
          {product.category}
        </p>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-[#1F2937] mb-2 line-clamp-2 group-hover:text-[#176B6B] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price & Store */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-[#176B6B]">
            {product.price}
          </p>
          <p className="text-sm text-[#7A827D]">
            {product.store}
          </p>
        </div>
      </div>
    </div>
  );
}

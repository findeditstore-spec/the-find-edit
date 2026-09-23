"use client";

import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: string;
  store: string;
  category: string;
}

interface CompactProductCardProps {
  product: Product;
}

export default function CompactProductCard({ product }: CompactProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group flex items-center gap-4 p-4 bg-white border border-[#EAE6DF] rounded-xl hover:shadow-md transition-all">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#F4F0E9]">
          <img
            src={imageError ? 'https://placehold.co/200x200/F4F0E9/7A827D?text=No+Image' : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-[#7A827D] mb-1">
            {product.category}
          </p>
          <h4 className="font-medium text-sm text-[#1F2937] mb-1 line-clamp-2 group-hover:text-[#176B6B] transition-colors">
            {product.name}
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#176B6B]">
              {product.price}
            </p>
            <p className="text-xs text-[#7A827D]">
              {product.store}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

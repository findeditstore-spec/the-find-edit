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
  price: string;
  store: string;
  category: string;
}

interface EditorialProductCardProps {
  product: Product;
  whyWeLoveIt: string;
}

export default function EditorialProductCard({ product, whyWeLoveIt }: EditorialProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-[#F4F0E9] rounded-2xl overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-[4/3] relative overflow-hidden bg-white">
          <img
            src={imageError ? 'https://placehold.co/800x600/F4F0E9/7A827D?text=No+Image' : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <p className="text-xs uppercase tracking-wider text-[#7A827D]">
            {product.category}
          </p>
          <Badge variant="tfe-pick">Editor's Pick</Badge>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-xl font-medium text-[#1F2937] mb-3 group-hover:text-[#176B6B] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mb-4 pb-4 border-b border-[#EAE6DF]">
          <p className="text-xs font-medium uppercase tracking-wider text-[#176B6B] mb-2">
            Why We Love It
          </p>
          <p className="text-sm text-[#5B6470] leading-relaxed">
            {whyWeLoveIt}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-[#176B6B]">
            {product.price}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-medium text-[#176B6B] hover:text-[#125858] transition-colors"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
}

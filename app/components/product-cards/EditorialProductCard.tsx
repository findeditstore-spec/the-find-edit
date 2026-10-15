"use client";

import Link from "next/link";
import Badge from "@/app/components/ui/Badge";
import { useState } from "react";
import { useWishlist } from "@/app/lib/wishlist-context";
import { useComparison } from "@/app/lib/comparison-context";

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
  const { isSaved: checkSaved, toggleSaved } = useWishlist();
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();

  const isSaved = checkSaved(product.id);
  const isCompared = isInComparison(product.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleSaved(product.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCompared) {
      removeFromComparison(product.id);
    } else {
      addToComparison({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        store: product.store,
        category: product.category,
      });
    }
  };

  return (
    <div className="group bg-[#F4F0E9] border border-[#EAE6DF] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between">
      <div>
        <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-white">
          <img
            src={imageError ? "https://placehold.co/800x600/F4F0E9/7A827D?text=No+Image" : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />

          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={handleSaveClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isSaved
                  ? "bg-[#176B6B] text-white"
                  : "bg-white/90 text-[#5B6470] hover:bg-white hover:text-[#176B6B]"
              }`}
              aria-label={isSaved ? "Saved" : "Save find"}
              title={isSaved ? "Saved" : "Save Find"}
            >
              <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleCompareClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isCompared
                  ? "bg-[#C9A86A] text-[#1F2937]"
                  : "bg-white/90 text-[#5B6470] hover:bg-white hover:text-[#176B6B]"
              }`}
              aria-label={isCompared ? "In comparison" : "Add to comparison"}
              title={isCompared ? "In Comparison" : "Compare"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </Link>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#7A827D]">
              {product.category}
            </p>
            <Badge variant="tfe-pick">Editor's Pick</Badge>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1F2937] mb-3 group-hover:text-[#176B6B] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="mb-4 pb-4 border-b border-[#EAE6DF]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#176B6B] mb-2">
              Why We Love It
            </p>
            <p className="text-sm text-[#5B6470] leading-relaxed">
              {whyWeLoveIt}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-0 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-[#176B6B]">
            {product.price}
          </p>
          <p className="text-xs text-[#7A827D]">
            at {product.store}
          </p>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#176B6B] text-white text-xs font-medium rounded-full hover:bg-[#125858] transition-colors"
        >
          <span>Explore Find</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

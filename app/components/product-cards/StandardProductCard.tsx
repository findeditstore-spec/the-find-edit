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
  images?: string[];
  price: string;
  store: string;
  category: string;
  subcategory?: string;
  featured?: boolean | null;
  status?: string;
  affiliate_link?: string | null;
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
  isSaved: isSavedProp,
  showBadge = true,
}: StandardProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { isSaved: checkSaved, toggleSaved } = useWishlist();
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();

  const isSaved = typeof isSavedProp === "boolean" ? isSavedProp : checkSaved(product.id);
  const isCompared = isInComparison(product.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(product.id);
    } else {
      toggleSaved(product.id);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) {
      onCompare(product.id);
    } else {
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
    }
  };

  return (
    <div className="group relative bg-white border border-[#EAE6DF] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#176B6B]/40 hover:shadow-md flex flex-col h-full">
      {/* Product Image Box */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[#F4F0E9] shrink-0">
        <img
          src={imageError ? "https://placehold.co/600x600/F4F0E9/7A827D?text=No+Image" : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Editorial Badge */}
        {showBadge && product.featured && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant="tfe-pick">TFE Pick</Badge>
          </div>
        )}

        {/* Quick Action Overlay (Always visible on touch, reveals on desktop hover or when active) */}
        <div
          className={`absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 transition-opacity duration-200 ${
            isSaved || isCompared
              ? "opacity-100"
              : "opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
          }`}
        >
          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveClick}
            className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all ${
              isSaved
                ? "bg-[#176B6B] text-white"
                : "bg-white/90 text-[#5B6470] hover:bg-white hover:text-[#176B6B]"
            }`}
            aria-label={isSaved ? "Remove from saved finds" : "Save this find"}
            title={isSaved ? "Saved" : "Save Find"}
          >
            <svg
              className="w-4 h-4"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Compare Button */}
          <button
            type="button"
            onClick={handleCompareClick}
            className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all ${
              isCompared
                ? "bg-[#C9A86A] text-[#1F2937]"
                : "bg-white/90 text-[#5B6470] hover:bg-white hover:text-[#176B6B]"
            }`}
            aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
            title={isCompared ? "In Comparison" : "Compare"}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
        </div>
      </Link>

      {/* Editorial Content */}
      <div className="p-3.5 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-[#7A827D] mb-1.5 truncate">
            {product.category}
          </p>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-medium text-sm sm:text-base text-[#1F2937] line-clamp-2 group-hover:text-[#176B6B] transition-colors leading-snug mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price & Retailer */}
          <div className="flex items-baseline justify-between gap-2 mt-2">
            <p className="text-base sm:text-lg font-semibold text-[#176B6B]">
              {product.price}
            </p>
            <p className="text-xs text-[#7A827D] truncate text-right">
              {product.store}
            </p>
          </div>

          {/* Editorial Action Bar */}
          <div className="mt-3 pt-2.5 border-t border-[#EAE6DF] flex items-center justify-between text-xs">
            <Link
              href={`/products/${product.slug}`}
              className="text-[#176B6B] font-medium hover:text-[#125858] transition-colors flex items-center gap-1 group/link"
            >
              <span>Explore Find</span>
              <span className="transition-transform group-hover/link:translate-x-0.5">→</span>
            </Link>

            <span className="text-[0.6875rem] text-[#7A827D] uppercase tracking-wider">
              Curated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

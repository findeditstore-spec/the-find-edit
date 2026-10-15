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
}

interface FeaturedProductCardProps {
  product: Product;
  editorial?: string;
  onSave?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  isSaved?: boolean;
}

export default function FeaturedProductCard({
  product,
  editorial,
  onSave,
  onCompare,
  isSaved: isSavedProp,
}: FeaturedProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { isSaved: checkSaved, toggleSaved } = useWishlist();
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();

  const isSaved = typeof isSavedProp === "boolean" ? isSavedProp : checkSaved(product.id);
  const isCompared = isInComparison(product.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(product.id);
    } else {
      toggleSaved(product.id);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="group relative bg-[#FFFDF9] border border-[#EAE6DF] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="grid md:grid-cols-2 gap-0 md:gap-8">
        {/* Visual Showcase */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square md:aspect-auto md:h-full overflow-hidden bg-[#F4F0E9]">
          <img
            src={imageError ? "https://placehold.co/800x800/F4F0E9/7A827D?text=No+Image" : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() => setImageError(true)}
          />

          <div className="absolute top-4 left-4 z-10">
            <Badge variant="tfe-pick">TFE Pick</Badge>
          </div>
        </Link>

        {/* Editorial Story */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
                {product.category} {product.subcategory ? `• ${product.subcategory}` : ""}
              </span>
              <span className="text-xs text-[#7A827D]">Curated Spotlight</span>
            </div>

            <Link href={`/products/${product.slug}`}>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#1F2937] mb-4 group-hover:text-[#176B6B] transition-colors leading-tight">
                {product.name}
              </h3>
            </Link>

            <p className="text-sm sm:text-base text-[#5B6470] leading-relaxed mb-6 font-normal">
              {editorial || product.description || "A standout find selected for its exceptional quality, thoughtful design, and value."}
            </p>
          </div>

          <div className="pt-6 border-t border-[#EAE6DF]">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-xs text-[#7A827D] uppercase tracking-wider block mb-0.5">Price</span>
                <span className="text-2xl sm:text-3xl font-semibold text-[#176B6B]">{product.price}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#7A827D] uppercase tracking-wider block mb-0.5">Retailer</span>
                <span className="text-sm font-medium text-[#1F2937]">{product.store}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/products/${product.slug}`}
                className="flex-1 text-center px-6 py-3.5 bg-[#176B6B] text-white rounded-full text-sm font-medium hover:bg-[#125858] transition-colors"
              >
                Explore This Find →
              </Link>

              <button
                type="button"
                onClick={handleSaveClick}
                className={`p-3 rounded-full border transition-colors ${
                  isSaved
                    ? "bg-[#176B6B] text-white border-[#176B6B]"
                    : "border-[#EAE6DF] text-[#5B6470] hover:border-[#176B6B] hover:text-[#176B6B] bg-white"
                }`}
                aria-label={isSaved ? "Saved to wishlist" : "Save to wishlist"}
                title={isSaved ? "Saved" : "Save Find"}
              >
                <svg
                  className="w-5 h-5"
                  fill={isSaved ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleCompareClick}
                className={`p-3 rounded-full border transition-colors ${
                  isCompared
                    ? "bg-[#C9A86A] text-[#1F2937] border-[#C9A86A]"
                    : "border-[#EAE6DF] text-[#5B6470] hover:border-[#176B6B] hover:text-[#176B6B] bg-white"
                }`}
                aria-label={isCompared ? "In comparison" : "Add to comparison"}
                title={isCompared ? "In Comparison" : "Compare"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

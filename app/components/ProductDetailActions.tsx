"use client";

import { useWishlist } from "@/app/lib/wishlist-context";
import { useComparison } from "@/app/lib/comparison-context";
import ShopButton from "./ShopButton";

interface ProductDetailActionsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: string;
    store: string;
    category: string;
    affiliate_link?: string | null;
  };
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { isSaved, toggleSaved } = useWishlist();
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();

  const saved = isSaved(product.id);
  const compared = isInComparison(product.id);

  const handleCompare = () => {
    if (compared) {
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
    <div className="space-y-4 pt-2">
      {/* Editorial Journey Actions: SAVE & COMPARE */}
      <div className="grid grid-cols-2 gap-3">
        {/* SAVE */}
        <button
          type="button"
          onClick={() => toggleSaved(product.id)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs sm:text-sm font-medium border transition-all ${
            saved
              ? "bg-[#176B6B] text-white border-[#176B6B]"
              : "bg-white text-[#1F2937] border-[#EAE6DF] hover:border-[#176B6B] hover:text-[#176B6B]"
          }`}
          aria-label={saved ? "Saved in wishlist" : "Save this find"}
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill={saved ? "currentColor" : "none"}
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
          <span className="truncate">{saved ? "Saved" : "Save Find"}</span>
        </button>

        {/* COMPARE */}
        <button
          type="button"
          onClick={handleCompare}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs sm:text-sm font-medium border transition-all ${
            compared
              ? "bg-[#C9A86A] text-[#1F2937] border-[#C9A86A]"
              : "bg-white text-[#1F2937] border-[#EAE6DF] hover:border-[#176B6B] hover:text-[#176B6B]"
          }`}
          aria-label={compared ? "In comparison" : "Compare product"}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="truncate">{compared ? "Comparing" : "Compare"}</span>
        </button>
      </div>

      {/* Primary Action: SHOP AT RETAILER */}
      <div>
        <ShopButton
          productId={product.id}
          productName={product.name}
          store={product.store}
          affiliateLink={product.affiliate_link}
        />
      </div>
    </div>
  );
}

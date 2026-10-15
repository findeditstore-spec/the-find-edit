"use client";

import { supabase } from "../lib/supabase";

type ShopButtonProps = {
  productId: string;
  productName: string;
  store: string;
  affiliateLink?: string | null;
  className?: string;
};

export default function ShopButton({
  productId,
  productName,
  store,
  affiliateLink,
  className = "",
}: ShopButtonProps) {
  async function handleClick() {
    await supabase.from("product_clicks").insert({
      product_id: productId,
      product_name: productName,
      store,
    });

    if (affiliateLink) {
      window.location.href = affiliateLink;
    }
  }

  const defaultClasses =
    "w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#176B6B] px-8 py-3.5 sm:py-4 text-sm sm:text-base font-medium text-white shadow-sm transition-all hover:bg-[#125858]";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || defaultClasses}
    >
      <span>Shop at {store}</span>
      <span className="text-base font-normal">↗</span>
    </button>
  );
}
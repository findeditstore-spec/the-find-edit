"use client";

import { supabase } from "../lib/supabase";

type ShopButtonProps = {
  productId: string;
  productName: string;
  store: string;
  affiliateLink?: string | null;
};

export default function ShopButton({
  productId,
  productName,
  store,
  affiliateLink,
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

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-8 inline-flex w-fit rounded-full bg-[#176B6B] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
    >
      Shop at {store} ↗
    </button>
  );
}
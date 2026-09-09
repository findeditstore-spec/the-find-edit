"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SupabaseTestPage() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("products")
        .select("id")
        .limit(1);

      if (error) {
        setStatus(`Connected to Supabase, but the products table is not ready yet.`);
        return;
      }

      setStatus("Supabase connection is working.");
    }

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFDF9] px-6">
      <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
          The Find Edit
        </p>

        <h1 className="mt-3 text-2xl font-semibold">
          Supabase Test
        </h1>

        <p className="mt-4 text-[#5B6470]">
          {status}
        </p>
      </div>
    </main>
  );
}
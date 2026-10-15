"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/supabase-client";

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        window.location.replace("/login");
        return;
      }

      setEmail(data.user.email ?? "");
      setName(
        typeof data.user.user_metadata?.display_name === "string"
          ? data.user.user_metadata.display_name
          : ""
      );
      setLoading(false);
    }

    void loadAccount();

    return () => {
      active = false;
    };
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        data: { display_name: name.trim() },
      });

      if (error) throw error;
      setMessage("Your profile has been updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.assign("/");
  }

  if (loading) {
    return <main className="min-h-[60vh] bg-[#FFFDF9] px-4 py-20 text-center text-[#5B6470]">Loading your account...</main>;
  }

  return (
    <main className="min-h-[70vh] bg-[#FFFDF9] px-4 py-14 sm:py-20">
      <section className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B]">Your space</p>
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-serif text-4xl text-[#1F2937] sm:text-5xl">My TFE account</h1>
            <p className="mt-3 text-sm text-[#5B6470]">{email}</p>
          </div>
          <button onClick={signOut} className="rounded-full border border-[#EAE6DF] px-5 py-2.5 text-sm font-medium text-[#5B6470] hover:border-[#176B6B] hover:text-[#176B6B]">
            Sign out
          </button>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <Link href="/wishlist" className="rounded-2xl border border-[#EAE6DF] bg-white p-6 transition hover:border-[#176B6B]">
            <h2 className="font-serif text-2xl text-[#1F2937]">Saved Finds</h2>
            <p className="mt-2 text-sm text-[#5B6470]">Return to the products you have saved on this device.</p>
            <span className="mt-4 inline-block text-sm font-semibold text-[#176B6B]">View saved finds →</span>
          </Link>
          <Link href="/compare" className="rounded-2xl border border-[#EAE6DF] bg-white p-6 transition hover:border-[#176B6B]">
            <h2 className="font-serif text-2xl text-[#1F2937]">Compare finds</h2>
            <p className="mt-2 text-sm text-[#5B6470]">Compare products before deciding what suits you.</p>
            <span className="mt-4 inline-block text-sm font-semibold text-[#176B6B]">Open comparison →</span>
          </Link>
        </div>

        <form onSubmit={saveProfile} className="mt-8 rounded-2xl border border-[#EAE6DF] bg-white p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-[#1F2937]">Profile details</h2>
          <label htmlFor="display-name" className="mb-2 mt-6 block text-sm font-medium text-[#1F2937]">Display name</label>
          <input id="display-name" value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-lg border border-[#EAE6DF] px-4 py-3 outline-none focus:border-[#176B6B]" />
          {message && <p role="status" className="mt-4 text-sm text-[#5B6470]">{message}</p>}
          <button disabled={saving} className="mt-5 rounded-full bg-[#176B6B] px-6 py-3 text-sm font-medium text-white hover:bg-[#125858] disabled:opacity-60">
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#7A827D]">
          Your saved finds and comparison list currently use this browser. Cross-device syncing has not been enabled.
        </p>
      </section>
    </main>
  );
}

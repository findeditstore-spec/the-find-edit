"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/supabase-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    if (password.length < 8) {
      setMessage("Choose a password with at least 8 characters.");
      setBusy(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });

      if (error) throw error;

      if (data.session) {
        window.location.assign("/account");
        return;
      }

      setMessage("Your registration was received. Check your email to confirm your account before signing in.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create your account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#FFFDF9] px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-[#EAE6DF] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B]">Discover more</p>
        <h1 className="mt-3 font-serif text-4xl text-[#1F2937]">Join The Find Edit</h1>
        <p className="mt-3 text-sm leading-6 text-[#5B6470]">Create your account to manage your TFE profile.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#1F2937]">Your name</label>
            <input id="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-[#EAE6DF] px-4 py-3 outline-none focus:border-[#176B6B]" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1F2937]">Email address</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-[#EAE6DF] px-4 py-3 outline-none focus:border-[#176B6B]" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#1F2937]">Password</label>
            <input id="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-[#EAE6DF] px-4 py-3 outline-none focus:border-[#176B6B]" />
            <p className="mt-1 text-xs text-[#7A827D]">Use at least 8 characters.</p>
          </div>
          {message && <p role="status" className="text-sm text-[#5B6470]">{message}</p>}
          <button disabled={busy} className="w-full rounded-full bg-[#176B6B] px-5 py-3 font-medium text-white transition hover:bg-[#125858] disabled:opacity-60">
            {busy ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#5B6470]">
          Already registered? <Link href="/login" className="font-semibold text-[#176B6B]">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      window.location.assign("/account");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`,
      });

      if (error) throw error;
      setMessage("If password recovery is enabled, check your email for the reset link.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to request a reset.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#FFFDF9] px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-[#EAE6DF] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B]">Welcome back</p>
        <h1 className="mt-3 font-serif text-4xl text-[#1F2937]">Your TFE account</h1>
        <p className="mt-3 text-sm leading-6 text-[#5B6470]">Sign in to manage your profile and explore your saved finds.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1F2937]">Email address</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-[#EAE6DF] px-4 py-3 outline-none focus:border-[#176B6B]" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#1F2937]">Password</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-[#EAE6DF] px-4 py-3 outline-none focus:border-[#176B6B]" />
          </div>
          {message && <p role="status" className="text-sm text-[#5B6470]">{message}</p>}
          <button disabled={busy} className="w-full rounded-full bg-[#176B6B] px-5 py-3 font-medium text-white transition hover:bg-[#125858] disabled:opacity-60">
            {busy ? "Please wait..." : "Sign in"}
          </button>
          <button type="button" disabled={busy} onClick={resetPassword} className="w-full text-sm text-[#176B6B] underline underline-offset-4 disabled:opacity-60">
            Forgot your password?
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#5B6470]">
          New to TFE? <Link href="/register" className="font-semibold text-[#176B6B]">Create an account</Link>
        </p>
        <p className="mt-5 text-center text-xs text-[#7A827D]">
          Looking for platform administration? <Link href="/admin/login" className="underline">Admin access</Link>
        </p>
      </section>
    </main>
  );
}

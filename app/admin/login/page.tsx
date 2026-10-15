"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get("error");
    if (reason === "admin_required") {
      setMessage("This account can sign in, but it has not been granted TFE administrator access.");
    } else if (reason === "configuration") {
      setMessage("The sign-in service is not configured yet. Please check the deployment environment variables.");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // The server-side route gate checks administrator access after the session
    // cookie is written. It redirects non-admin users back with an explanation.
    window.location.href = "/admin";
  }

  return (
    <main className="min-h-[70vh] bg-[#FFFDF9] px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-[#EAE6DF] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B]">Welcome back</p>
        <h1 className="mt-3 font-serif text-4xl text-[#1F2937]">Admin workspace</h1>
        <p className="mt-3 text-sm leading-6 text-[#5B6470]">Sign in to your admin workspace.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1F2937]">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#EAE6DF] px-4 py-3 outline-none focus:border-[#176B6B]"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#1F2937]">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-[#EAE6DF] px-4 py-3 outline-none focus:border-[#176B6B]"
            />
          </div>
          {message && <p role="status" className="text-sm text-[#5B6470]">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#176B6B] px-5 py-3 font-medium text-white transition hover:bg-[#125858] disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-[#7A827D]">
          Not an administrator? <Link href="/" className="underline">Return to The Find Edit</Link>
        </p>
      </section>
    </main>
  );
}
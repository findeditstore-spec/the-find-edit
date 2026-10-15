"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Section = "overview" | "products" | "categories" | "collections" | "analytics" | "settings";

const navigationItems: { label: string; href: string; key: Section }[] = [
  { label: "Overview", href: "/admin", key: "overview" },
  { label: "Products", href: "/admin/products", key: "products" },
  { label: "Categories", href: "/admin/categories", key: "categories" },
  { label: "Collections", href: "/admin/collections", key: "collections" },
  { label: "Analytics", href: "/admin/analytics", key: "analytics" },
  { label: "Settings", href: "/admin/settings", key: "settings" },
];

interface AdminLayoutProps {
  children: ReactNode;
  currentSection: Section;
  title?: string;
  description?: string;
}

export default function AdminLayout({
  children,
  currentSection,
  title,
  description,
}: AdminLayoutProps) {
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        setSigningOut(false);
        return;
      }
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Unexpected sign out error:", err);
      setSigningOut(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FFFDF9]">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-[#EAE6DF] bg-white p-6 flex flex-col">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            The Find Edit
          </p>
          <h1 className="mt-2 text-lg font-semibold text-[#1F2937]">
            Admin workspace
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            const isActive = item.key === currentSection;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#176B6B] text-white"
                    : "text-[#687572] hover:bg-[#F4F0E9] hover:text-[#176B6B]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-[#EAE6DF] pt-4">
          <Link
            href="/"
            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#687572] transition hover:bg-[#F4F0E9] hover:text-[#176B6B]"
          >
            ← View website
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-[#DC2626] transition hover:bg-[#FEE2E2] disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-[#EAE6DF] bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h2 className="font-serif text-3xl font-semibold text-[#1F2937]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-2 text-sm text-[#687572]">
                  {description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { ReactNode, useState, useEffect } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change or screen resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll lock & Escape key handling for mobile drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

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

  const sidebarContent = (
    <div className="flex h-full flex-col p-6 bg-white">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            The Find Edit
          </p>
          <h1 className="mt-2 text-lg font-semibold text-[#1F2937]">
            Admin workspace
          </h1>
        </div>
        {/* Close button on mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="rounded-lg p-2 text-[#687572] hover:bg-[#F4F0E9] md:hidden"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
        {navigationItems.map((item) => {
          const isActive = item.key === currentSection;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
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

      <div className="space-y-2 border-t border-[#EAE6DF] pt-4 mt-4">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
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
    </div>
  );

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#FFFDF9]">
      {/* Desktop Sidebar - Fixed height and position */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-[#EAE6DF] bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Main Content Container - Offset by sidebar width on desktop (md:pl-64), full width on mobile */}
      <div className="flex flex-1 flex-col md:pl-64 h-[100dvh] overflow-hidden">
        {/* Header - Fixed at top of main content */}
        <header className="flex-none border-b border-[#EAE6DF] bg-white px-4 sm:px-8 py-4 sm:py-6 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg border border-[#EAE6DF] bg-white p-2 text-[#18302F] shadow-sm transition hover:bg-[#F4F0E9] md:hidden"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div>
                {title && (
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F2937]">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#687572]">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Independently scrollable */}
        <main className="flex-1 overflow-y-auto bg-[#FFFDF9]">
          <div className="p-4 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

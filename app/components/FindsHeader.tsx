"use client";

import { useState } from "react";
import NavigationMenu from "./NavigationMenu";

export default function FindsHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-[#EAE6DF] px-6 py-6 md:px-12">
        <a
          href="/"
          className="text-xl font-semibold tracking-wide"
        >
          The Find Edit
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EAE6DF] transition hover:bg-[#F4F0E9]"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
          >
            <path
              d="M5 8.5h14l-1 11H6l-1-11Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 8.5V7a3 3 0 0 1 6 0v1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <NavigationMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </>
  );
}
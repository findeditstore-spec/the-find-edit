"use client";

import { useState } from "react";
import NavigationMenu from "../components/NavigationMenu";

export default function AboutPage() {
      const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      
      {/* Header */}
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

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
          About The Find Edit
        </p>

        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          Too much choice makes finding harder.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#5B6470] md:text-xl">
          The internet has no shortage of products. Sometimes, it has too many.
          The Find Edit was created to make discovering products simpler —
          bringing interesting, useful and affordable finds together in one
          clean, curated space.
        </p>
            </section>

      {/* Why The Find Edit Exists */}
      <section className="border-t border-[#EAE6DF]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
                Why we exist
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Too much choice can make finding harder.
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-8 text-[#5B6470]">
              <p>
                There are incredible online stores with thousands upon
                thousands of products. But sometimes, that is exactly the
                problem.
              </p>

              <p>
                When there is too much on the screen, too many recommendations
                and too much information competing for your attention, finding
                one thing can become surprisingly difficult.
              </p>

              <p>
                We have experienced that ourselves. You might know exactly
                what you are looking for, but after scrolling, searching and
                jumping between products, you can lose interest before you
                ever find it.
              </p>

              <p>
                The Find Edit was created to change that. Instead of putting
                everything in front of you, we aim to bring the interesting
                stuff closer.
              </p>
            </div>
          </div>
        </div>
            </section>

      {/* The Idea */}
      <section className="bg-[#F4F0E9]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
              The idea
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              We do the searching. You do the finding.
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-8 text-[#5B6470]">
              <p>
                We search across online retailers to discover products that
                people may actually want — from fashion and beauty to
                technology, stationery, home and decor, lifestyle products
                and whatever else catches our attention.
              </p>

              <p>
                We then organise those discoveries into a cleaner,
                easier-to-navigate experience.
              </p>

              <p>
                Because you shouldn&apos;t have to search through thousands of
                products just to find the few that are worth looking at.
              </p>
            </div>
          </div>
        </div>
            </section>

      {/* Affordable & Valuable Finds */}
      <section className="border-t border-[#EAE6DF]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-20">
            <div className="space-y-6 text-lg leading-8 text-[#5B6470]">
              <p>
                Finding affordable products online can take time. You often
                have to compare different stores, search through countless
                listings and work out which products are actually worth
                considering.
              </p>

              <p>
                We do that work so you don&apos;t always have to. We search,
                compare and curate products that we believe are worth
                discovering, helping bring options that fit different needs,
                styles and budgets closer to you.
              </p>

              <p>
                Affordable doesn&apos;t have to mean difficult to find. It
                should be possible to discover something useful, interesting
                or exciting without spending hours looking for it.
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
                The Edit
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Affordable doesn&apos;t have to mean difficult to find.
              </h2>
            </div>
          </div>
        </div>
            </section>

      {/* There Isn't One Type of Find */}
      <section className="bg-[#F4F0E9]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
          <div className="max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
              More than one category
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              There isn&apos;t one type of Find.
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#5B6470]">
              A fashion piece. A beauty essential. A new gadget. Something for
              your room. A stationery find. Or something you didn&apos;t even
              know you needed until you saw it.
            </p>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5B6470]">
              The Find Edit isn&apos;t limited to one category. We&apos;re
              interested in what&apos;s useful, interesting, affordable and in
              demand — wherever the next great Find happens to be.
            </p>
          </div>
        </div>
            </section>

      {/* How It Works */}
      <section className="border-t border-[#EAE6DF]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
              How it works
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Discover. Find. Shop.
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <div className="border-t border-[#EAE6DF] pt-6">
              <p className="text-sm font-medium text-[#176B6B]">
                01
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                Discover
              </h3>

              <p className="mt-3 text-base leading-7 text-[#5B6470]">
                Explore curated products, categories and collections built
                around things worth discovering.
              </p>
            </div>

            <div className="border-t border-[#EAE6DF] pt-6">
              <p className="text-sm font-medium text-[#176B6B]">
                02
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                Find
              </h3>

              <p className="mt-3 text-base leading-7 text-[#5B6470]">
                Browse a cleaner selection without having to navigate through
                thousands of listings yourself.
              </p>
            </div>

            <div className="border-t border-[#EAE6DF] pt-6">
              <p className="text-sm font-medium text-[#176B6B]">
                03
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                Shop
              </h3>

              <p className="mt-3 text-base leading-7 text-[#5B6470]">
                Found something you like? We send you directly to the retailer
                where you can view the product and complete your purchase.
              </p>
            </div>
          </div>

          <p className="mt-12 max-w-3xl text-sm leading-7 text-[#7A827D]">
            The Find Edit does not currently process payments or fulfil orders.
            Purchases are completed directly with the retailer.
          </p>
        </div>
            </section>

      {/* Behind The Find Edit */}
      <section className="bg-[#F4F0E9]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-start md:gap-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
                Behind The Find Edit
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Created with a simple idea.
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-8 text-[#5B6470]">
              <p>
                The Find Edit began with a simple frustration: finding things
                online shouldn&apos;t be so complicated.
              </p>

              <p>
                While exploring online stores, Rasebokeng noticed how easy it
                was to get lost among endless products, recommendations and
                information. Even when you knew what you wanted, finding it
                could become tiring enough to make you give up.
              </p>

              <p>
                At the same time, he was exploring affiliate marketing and
                began thinking about a different approach — rather than simply
                sharing affiliate links, why not create a place people would
                actually want to visit?
              </p>

              <p>
                A place that looked good. A place that was easy to navigate. A
                place that made discovering products feel enjoyable.
              </p>

              <p>
                And that&apos;s where The Find Edit began.
              </p>

              <p className="pt-2 text-base font-medium text-[#1F2937]">
                — Rasebokeng Seth Thethe
              </p>
            </div>
          </div>
        </div>
            </section>

      {/* The Bigger Vision */}
      <section className="border-t border-[#EAE6DF]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
          <div className="max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
              The bigger vision
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              More than a website.
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-8 text-[#5B6470]">
              <p>
                Today, The Find Edit is a product discovery platform. But the
                vision is bigger.
              </p>

              <p>
                We want The Find Edit to become a place people naturally think
                of when they&apos;re looking for something to buy online — a
                destination for discovering products, exploring ideas and
                finding things worth having.
              </p>

              <p>
                Over time, that vision can grow beyond affiliate discovery
                into something much bigger: a platform that can connect people
                with products through both The Find Edit and other retailers.
              </p>

              <p>
                The goal isn&apos;t simply to build another online store.
              </p>

              <p className="text-xl font-medium text-[#1F2937] md:text-2xl">
                It&apos;s to build a destination people trust to help them find
                what they&apos;re looking for.
              </p>
            </div>
          </div>
        </div>
            </section>

      {/* Affiliate Transparency */}
      <section className="bg-[#F4F0E9]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
              A note about our links
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              How we make The Find Edit possible.
            </h2>

            <p className="mt-5 text-base leading-7 text-[#5B6470]">
              Some links on The Find Edit are affiliate links. This means that
              when you click through to certain retailers and make a purchase,
              we may earn a commission at no additional cost to you.
            </p>

            <p className="mt-4 text-base leading-7 text-[#5B6470]">
              Affiliate partnerships help us continue building and improving
              The Find Edit while keeping product discovery accessible to
              everyone.
            </p>
          </div>
        </div>
            </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:px-12 md:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            The Find Edit
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            So, what are you looking for?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#5B6470]">
            You might just find it here.
          </p>

          <a
            href="/"
            className="mt-8 inline-flex rounded-full bg-[#176B6B] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Explore The Finds →
          </a>
        </div>
            </section>

      <NavigationMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </main>
  );
}
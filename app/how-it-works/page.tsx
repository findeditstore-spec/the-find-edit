export default function HowItWorksPage() {
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

        <a
          href="/"
          className="text-sm text-[#5B6470] transition hover:text-[#176B6B]"
        >
          Back to home
        </a>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            How It Works
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-tight tracking-tight md:text-7xl">
            Discover. Find. Shop.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5B6470] md:text-xl">
            We make discovering products simpler by bringing interesting,
            useful and affordable finds together in one place.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-y border-[#EAE6DF] bg-[#F4F0E9] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-[#176B6B]">01</p>

            <h2 className="mt-5 font-serif text-3xl font-medium">
              Discover
            </h2>

            <p className="mt-5 leading-7 text-[#5B6470]">
              Browse The Find Edit and discover products across different
              categories, styles, needs and budgets.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-[#176B6B]">02</p>

            <h2 className="mt-5 font-serif text-3xl font-medium">
              Find
            </h2>

            <p className="mt-5 leading-7 text-[#5B6470]">
              Search, filter and explore curated products without having to
              sort through endless online listings yourself.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-[#176B6B]">03</p>

            <h2 className="mt-5 font-serif text-3xl font-medium">
              Shop
            </h2>

            <p className="mt-5 leading-7 text-[#5B6470]">
              When you find something you like, we send you to the original
              retailer to complete your purchase.
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            Shopping elsewhere
          </p>

          <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
            We help you find it. The retailer handles the rest.
          </h2>

          <div className="mt-8 space-y-5 text-lg leading-8 text-[#5B6470]">
            <p>
              The Find Edit does not process your payment or fulfil your
              order.
            </p>

            <p>
              When you choose a product, you are taken to the retailer's
              website to complete your purchase directly with them.
            </p>

            <p>
              Delivery, payment, returns and customer service are handled by
              the retailer you purchase from.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#176B6B] px-6 py-24 text-center text-white md:px-12 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-4xl font-medium md:text-5xl">
            Ready to find something?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
            Explore the finds and see where your next favourite thing takes
            you.
          </p>

          <a
            href="/finds"
            className="mt-10 inline-block rounded-full bg-white px-8 py-4 text-sm font-medium text-[#176B6B] transition hover:bg-[#F4F0E9]"
          >
            Explore The Finds →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAE6DF] px-6 py-8 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#7A827D]">
            © 2026 The Find Edit
          </p>

          <div className="flex flex-wrap gap-5 text-sm text-[#5B6470]">
            <a href="/about">About</a>
            <a href="/how-it-works">How it works</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

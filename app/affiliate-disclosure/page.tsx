export default function AffiliateDisclosurePage() {
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
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            Affiliate Disclosure
          </p>

          <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl">
            How The Find Edit makes money.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5B6470] md:text-xl">
            The Find Edit may earn a commission when you purchase a product
            through some of the links on our website.
          </p>
        </div>
      </section>

      {/* Disclosure */}
      <section className="border-y border-[#EAE6DF] bg-[#F4F0E9] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-4xl space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-medium">
              What are affiliate links?
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              Some of the links on The Find Edit are affiliate links. This
              means that if you click a link and make a purchase from the
              retailer, we may receive a commission at no additional cost to
              you.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              Does this affect the price you pay?
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              No. Using an affiliate link does not add an additional cost to
              your purchase. The price you pay is determined by the retailer.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              Why do we use affiliate links?
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              Affiliate commissions help support the work behind The Find
              Edit, including researching products, creating collections,
              maintaining the website and making product discovery easier.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              Our approach to recommendations
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              Our goal is to curate products that we believe are interesting,
              useful, valuable or worth discovering. An affiliate relationship
              does not guarantee that a product will be featured or
              recommended.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              Where does the purchase happen?
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              The Find Edit does not process your payment or fulfil your order.
              When you choose to shop for a product, you are taken to the
              original retailer's website, where the purchase is completed
              directly with them.
            </p>
          </div>
        </div>
      </section>

      {/* Final note */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-lg leading-8 text-[#5B6470]">
            We believe transparency matters. If you have any questions about
            how affiliate links work on The Find Edit, please get in touch.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAE6DF] px-6 py-8 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#7A827D]">© 2026 The Find Edit</p>

          <div className="flex flex-wrap gap-5 text-sm text-[#5B6470]">
            <a href="/about">About</a>
            <a href="/how-it-works">How it works</a>
            <a href="/affiliate-disclosure">Affiliate disclosure</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

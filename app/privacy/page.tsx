export default function PrivacyPage() {
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
            Privacy
          </p>

          <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl">
            Your privacy matters.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5B6470] md:text-xl">
            We believe finding great products should not mean giving up more
            personal information than necessary.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="border-y border-[#EAE6DF] bg-[#F4F0E9] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-4xl space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-medium">
              Information we collect
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              The Find Edit is designed to work without requiring you to create
              an account or provide personal information simply to browse the
              website.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              Product links and clicks
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              When you click a product link, we may record information about
              that click, such as the product selected and the retailer being
              visited. This helps us understand which products are being
              discovered and improve The Find Edit.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              Third-party retailers
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              When you leave The Find Edit and visit a retailer's website, that
              retailer's own privacy policy and terms apply. We do not process
              your payment or manage your order.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              Cookies and similar technologies
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              The Find Edit may use cookies or similar technologies where
              necessary to operate the website, understand usage and support
              affiliate links.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              How we use information
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              Information collected through the website may be used to operate,
              maintain and improve The Find Edit, understand how visitors use
              the site and improve product discovery.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-medium">
              Changes to this policy
            </h2>

            <p className="mt-5 leading-8 text-[#5B6470]">
              We may update this Privacy Policy as The Find Edit develops or
              as our services and technology change. Any updated version will
              be published on this page.
            </p>
          </div>
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
            <a href="/affiliate-disclosure">Affiliate disclosure</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function TrendingPage() {
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
            Trending Finds
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-tight tracking-tight md:text-7xl">
            What people are finding right now.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5B6470] md:text-xl">
            A collection of products gaining attention across The Find Edit.
          </p>
        </div>
      </section>

      {/* Coming soon */}
      <section className="border-y border-[#EAE6DF] bg-[#F4F0E9] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[#7A827D]">
            Trending products will appear here as The Find Edit grows.
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
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

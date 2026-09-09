export default function ContactPage() {
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
            Contact
          </p>

          <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl">
            Have something to say?
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5B6470] md:text-xl">
            Whether you have a question, a product suggestion, a collaboration
            idea or simply want to say hello, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="border-y border-[#EAE6DF] bg-[#F4F0E9] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
              Get in touch
            </p>

            <h2 className="mt-5 font-serif text-3xl font-medium md:text-4xl">
              We'd love to hear from you.
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-[#5B6470]">
              For general enquiries, product suggestions, partnerships or
              other questions about The Find Edit, send us an email.
            </p>

            <a
              href="findedit.store@gmail.com"
              className="mt-8 inline-block rounded-full bg-[#176B6B] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#125858]"
            >
              Email The Find Edit →
            </a>
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
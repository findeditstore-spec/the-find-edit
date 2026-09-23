import { PageLayout, Container, Section, SectionHeader } from "../components/layout";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <Section background="cream" padding="xl">
        <Container maxWidth="lg">
          <SectionHeader
            label="How It Works"
            title="Discover. Find. Shop."
            description="We make discovering products simpler by bringing interesting, useful and affordable finds together in one place."
          />
        </Container>
      </Section>

      {/* Steps */}
      <Section background="sand" padding="xl">
        <Container maxWidth="lg">
          <div className="grid gap-12 md:grid-cols-3">
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
        </Container>
      </Section>

      {/* What Happens Next */}
      <Section background="cream" padding="xl">
        <Container maxWidth="md">
          <SectionHeader
            label="Shopping elsewhere"
            title="We help you find it. The retailer handles the rest."
          />

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
        </Container>
      </Section>

      {/* CTA */}
      <Section background="teal" padding="xl">
        <Container maxWidth="md">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Ready to find something?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
              Explore the finds and see where your next favourite thing takes
              you.
            </p>
            <Link
              href="/finds"
              className="mt-10 inline-block rounded-full bg-white px-8 py-4 text-sm font-medium text-[#176B6B] transition hover:bg-[#F4F0E9]"
            >
              Explore The Finds →
            </Link>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
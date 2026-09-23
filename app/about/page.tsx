import { PageLayout, Container, Section, SectionHeader } from "../components/layout";

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <Section background="cream" padding="xl">
        <Container maxWidth="lg">
          <SectionHeader
            label="About"
            title="Good finds. A better you."
            description="The Find Edit is a curated shopping discovery platform for South African shoppers who want to find interesting, useful products without the noise."
          />
        </Container>
      </Section>

      {/* Story */}
      <Section background="sand" padding="xl">
        <Container maxWidth="md">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
              Our Story
            </h2>

            <p className="text-[#5B6470] leading-relaxed mb-6">
              The Find Edit started as a simple idea: shopping for interesting products shouldn't feel like searching through endless, overwhelming online marketplaces.
            </p>

            <p className="text-[#5B6470] leading-relaxed mb-6">
              We believe in the joy of discovering something new – a tool that makes your life easier, a piece that completes your style, or a gadget that solves a problem you didn't know you had.
            </p>

            <p className="text-[#5B6470] leading-relaxed">
              That's why we curate. Every product on The Find Edit has been chosen because it offers something worth finding – whether that's great value, clever design, or simply something that caught our eye.
            </p>
          </div>
        </Container>
      </Section>

      {/* Mission */}
      <Section background="cream" padding="xl">
        <Container maxWidth="md">
          <SectionHeader
            title="Our Mission"
            description="To make product discovery feel intentional, not overwhelming."
          />

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1F2937] mb-4">
                Discover
              </h3>
              <p className="text-[#5B6470] leading-relaxed">
                Find products you wouldn't have found otherwise, across categories that matter to your life.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-[#1F2937] mb-4">
                Compare
              </h3>
              <p className="text-[#5B6470] leading-relaxed">
                Understand what makes each product special and how it fits into your needs and budget.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-[#1F2937] mb-4">
                Shop Smarter
              </h3>
              <p className="text-[#5B6470] leading-relaxed">
                Make confident purchasing decisions with products that have been thoughtfully selected.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-[#1F2937] mb-4">
                Stay Inspired
              </h3>
              <p className="text-[#5B6470] leading-relaxed">
                Discover new brands, trends, and products that align with your evolving lifestyle.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Founder */}
      <Section background="sand" padding="xl">
        <Container maxWidth="sm">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-6">
              Founder
            </p>
            <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-4">
              Rasebokeng Seth Thethe
            </h2>
            <p className="text-lg text-[#5B6470] leading-relaxed">
              "I started The Find Edit because I wanted shopping to feel more intentional. Instead of getting lost in endless product listings, I wanted to create a space where every product has been chosen for a reason – and where that reason is clear to you as the shopper."
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section background="teal" padding="lg">
        <Container maxWidth="md">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-[#176B6B] rounded-full font-medium hover:bg-[#F4F0E9] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
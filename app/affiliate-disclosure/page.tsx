import { PageLayout, Container, Section, SectionHeader } from "../components/layout";

export default function AffiliateDisclosurePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <Section background="cream" padding="xl">
        <Container maxWidth="lg">
          <SectionHeader
            label="Affiliate Disclosure"
            title="How The Find Edit makes money."
            description="The Find Edit may earn a commission when you purchase a product through some of the links on our website."
          />
        </Container>
      </Section>

      {/* Disclosure */}
      <Section background="sand" padding="xl">
        <Container maxWidth="md">
          <div className="space-y-12 prose prose-lg max-w-none">
            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                What are affiliate links?
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                Some of the links on The Find Edit are affiliate links. This
                means that if you click a link and make a purchase from the
                retailer, we may receive a commission at no additional cost to
                you.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                How this works
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                When you click on certain product links, a small tracking code
                lets the retailer know that you came from The Find Edit. If you
                make a purchase, they may pay us a small percentage as a thank
                you for the referral.
              </p>
              <p className="text-[#5B6470] leading-relaxed">
                This does not increase the price you pay for the product. The
                commission comes from the retailer's marketing budget, not from
                your pocket.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                Our commitment
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                Affiliate commissions do not influence which products we feature
                or how we describe them. We only feature products that we
                believe are worth your attention, regardless of whether they
                generate income for us.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                Why we use affiliate links
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                These commissions help support The Find Edit and allow us to
                keep the website free for you to use. They help cover the costs
                of maintaining the website and continuing to curate products.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                Transparency
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                We are committed to transparency about how The Find Edit operates.
                If you have questions about affiliate links or how we select
                products, please contact us at{" "}
                <a
                  href="mailto:findedit.store@gmail.com"
                  className="text-[#176B6B] hover:text-[#125858] transition-colors"
                >
                  findedit.store@gmail.com
                </a>
                .
              </p>
            </div>

            <div className="border-t border-[#EAE6DF] pt-8">
              <p className="text-sm text-[#7A827D]">
                Last updated: September 2026
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
import { PageLayout, Container, Section, SectionHeader } from "../components/layout";

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <Section background="cream" padding="xl">
        <Container maxWidth="lg">
          <SectionHeader
            label="Privacy"
            title="Your privacy matters."
            description="We believe finding great products should not mean giving up more personal information than necessary."
          />
        </Container>
      </Section>

      {/* Privacy Content */}
      <Section background="sand" padding="xl">
        <Container maxWidth="md">
          <div className="space-y-12 prose prose-lg max-w-none">
            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                Information we collect
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                The Find Edit is designed to work without requiring you to create
                an account or provide personal information simply to browse the
                website.
              </p>
              <p className="text-[#5B6470] leading-relaxed">
                We collect basic website analytics to understand how visitors use
                the site, which helps us improve the experience for everyone.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                How we use your information
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                Any information collected is used solely to improve The Find Edit
                and provide you with a better product discovery experience.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                Third-party services
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                When you click on product links, you are taken to external
                retailer websites. These sites have their own privacy policies
                and terms of service that govern your interaction with them.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-[#1F2937] mb-6">
                Contact us
              </h2>
              <p className="text-[#5B6470] leading-relaxed">
                If you have questions about this privacy policy, please contact
                us at{" "}
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
import { PageLayout, Container, Section, SectionHeader } from "../components/layout";
import { Card } from "../components/ui";

export default function ContactPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <Section background="cream" padding="xl">
        <Container maxWidth="lg">
          <SectionHeader
            label="Contact"
            title="Have something to say?"
            description="Whether you have a question, a product suggestion, a collaboration idea or simply want to say hello, we'd love to hear from you."
          />
        </Container>
      </Section>

      {/* Contact */}
      <Section background="sand" padding="xl">
        <Container maxWidth="md">
          <Card className="p-8 md:p-12">
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
              href="mailto:findedit.store@gmail.com"
              className="mt-8 inline-block rounded-full bg-[#176B6B] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#125858]"
            >
              Email The Find Edit →
            </a>
          </Card>
        </Container>
      </Section>

      {/* Additional Contact Info */}
      <Section background="cream" padding="lg">
        <Container maxWidth="md">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1F2937] mb-4">
                Business Enquiries
              </h3>
              <p className="text-[#5B6470] leading-relaxed mb-4">
                Interested in partnerships, collaborations, or featuring your products on The Find Edit?
              </p>
              <p className="text-sm text-[#7A827D]">
                We'll get back to you within 2-3 business days.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-[#1F2937] mb-4">
                Product Suggestions
              </h3>
              <p className="text-[#5B6470] leading-relaxed mb-4">
                Found something amazing we should feature? We love hearing about great finds from our community.
              </p>
              <p className="text-sm text-[#7A827D]">
                Include the product link and why you think it's worth featuring.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
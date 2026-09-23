import { getProductsByCategory } from "../lib/products";
import { PageLayout, Container, Section, SectionHeader } from "../components/layout";
import EnhancedProductSearch from "../components/EnhancedProductSearch";

export const dynamic = "force-dynamic";

export default async function CreatorTechPage() {
  const creatorProducts = await getProductsByCategory("Creator Tech");

  // Create categories array for the enhanced search
  const categories = [
    { id: "creator-tech", name: "Creator Tech", slug: "creator-tech" }
  ];

  return (
    <PageLayout>
      <Section background="sand" padding="lg">
        <Container maxWidth="xl">
          <SectionHeader
            label="Tech Category"
            title="Creator Tech"
            description="Affordable tools to make your content look and sound better."
          />
        </Container>
      </Section>

      <Section background="cream" padding="lg">
        <Container maxWidth="xl">
          <EnhancedProductSearch
            products={creatorProducts}
            categories={categories}
          />
        </Container>
      </Section>
    </PageLayout>
  );
}
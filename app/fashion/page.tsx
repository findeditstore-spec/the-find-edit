import { getProductsByCategory } from "../lib/products";
import { PageLayout, Container, Section, SectionHeader } from "../components/layout";
import EnhancedProductSearch from "../components/EnhancedProductSearch";

export const dynamic = "force-dynamic";

export default async function FashionPage() {
  const fashionProducts = await getProductsByCategory("Fashion");

  // Create categories array for the enhanced search
  const categories = [
    { id: "fashion", name: "Fashion", slug: "fashion" }
  ];

  return (
    <PageLayout>
      <Section background="sand" padding="lg">
        <Container maxWidth="xl">
          <SectionHeader
            label="Fashion Category"
            title="Fashion Finds"
            description="Affordable pieces selected for your next look."
          />
        </Container>
      </Section>

      <Section background="cream" padding="lg">
        <Container maxWidth="xl">
          <EnhancedProductSearch
            products={fashionProducts}
            categories={categories}
          />
        </Container>
      </Section>
    </PageLayout>
  );
}

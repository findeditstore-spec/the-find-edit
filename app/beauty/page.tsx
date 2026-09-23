import { getProductsByCategory } from "../lib/products";
import { PageLayout, Container, Section, SectionHeader } from "../components/layout";
import EnhancedProductSearch from "../components/EnhancedProductSearch";

export const dynamic = "force-dynamic";

export default async function BeautyPage() {
  const beautyProducts = await getProductsByCategory("Beauty");

  // Create categories array for the enhanced search
  const categories = [
    { id: "beauty", name: "Beauty", slug: "beauty" }
  ];

  return (
    <PageLayout>
      <Section background="sand" padding="lg">
        <Container maxWidth="xl">
          <SectionHeader
            label="Beauty Category"
            title="Beauty Finds"
            description="Simple beauty tools and accessories worth discovering."
          />
        </Container>
      </Section>

      <Section background="cream" padding="lg">
        <Container maxWidth="xl">
          <EnhancedProductSearch
            products={beautyProducts}
            categories={categories}
          />
        </Container>
      </Section>
    </PageLayout>
  );
}
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "../lib/supabase-server";
import { PageLayout, Container, Section, SectionHeader } from "../components/layout";
import EnhancedProductSearch from "../components/EnhancedProductSearch";

export const dynamic = "force-dynamic";

type CategoryRouteProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function DynamicCategoryPage({ params }: CategoryRouteProps) {
  const { category: slug } = await params;
  const supabase = await getSupabaseServerClient();

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (categoryError || !category) {
    notFound();
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", category.name)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const categories = [
    { id: category.id, name: category.name, slug: category.slug }
  ];

  return (
    <PageLayout>
      <Section background="sand" padding="lg">
        <Container maxWidth="xl">
          <SectionHeader
            label="Curated Category"
            title={category.name}
            description={
              category.description ||
              `Curated ${category.name.toLowerCase()} finds selected for quality, design, and value.`
            }
          />
        </Container>
      </Section>

      <Section background="cream" padding="lg">
        <Container maxWidth="xl">
          <EnhancedProductSearch
            products={products ?? []}
            categories={categories}
          />
        </Container>
      </Section>
    </PageLayout>
  );
}
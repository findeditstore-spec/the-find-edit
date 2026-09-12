import CategoryPage from "../components/CategoryPage";
import { getProductsByCategory } from "../lib/products";
export const dynamic = "force-dynamic";

export default async function CreatorTechPage() {
  const creatorProducts = await getProductsByCategory("Creator Tech");

  return (
    <CategoryPage
      title="Creator Tech"
      description="Affordable tools to make your content look and sound better."
      filters={[
  "All",
  ...Array.from(
    new Set(
      creatorProducts
        .map((product) => product.subcategory)
        .filter(Boolean)
    )
  ),
]}
      products={creatorProducts}
    />
  );
}
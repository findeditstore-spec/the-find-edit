import CategoryPage from "../components/CategoryPage";
import { getProductsByCategory } from "../lib/products";

export default async function CreatorTechPage() {
  const creatorProducts = await getProductsByCategory("Creator Tech");

  return (
    <CategoryPage
      title="Creator Tech"
      description="Affordable tools to make your content look and sound better."
      filters={[
        "All",
        "Ring Lights",
        "Tripods",
        "Phone Stands",
        "Microphones",
        "Desk Setup",
      ]}
      products={creatorProducts}
    />
  );
}
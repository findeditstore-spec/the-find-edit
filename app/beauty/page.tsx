import CategoryPage from "../components/CategoryPage";
import { getProductsByCategory } from "../lib/products";
export const dynamic = "force-dynamic";

export default async function BeautyPage() {
  const beautyProducts = await getProductsByCategory("Beauty");

  return (
    <CategoryPage
      title="Beauty Finds"
      description="Simple beauty tools and accessories worth discovering."
      filters={[
        "All",
        "Makeup Tools",
        "Hair",
        "Nails",
        "Skincare Tools",
        "Organisers",
      ]}
      products={beautyProducts}
    />
  );
}
import CategoryPage from "../components/CategoryPage";
import { getProductsByCategory } from "../lib/products";
export const dynamic = "force-dynamic";

export default async function FashionPage() {
  const fashionProducts = await getProductsByCategory("Fashion");

  return (
    <CategoryPage
      title="Fashion Finds"
      description="Affordable pieces selected for your next look."
      filters={[
        "All",
        "Clothing",
        "Shoes",
        "Bags",
        "Accessories",
      ]}
      products={fashionProducts}
    />
  );
}
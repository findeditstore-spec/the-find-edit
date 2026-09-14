"use client";

import { useEffect, useState } from "react";
import CategoryPage from "../components/CategoryPage";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  price: string;
  store: string;
  category: string;
  subcategory: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type CategoryRouteProps = {
  params: Promise<{
    category: string;
  }>;
};

export default function DynamicCategoryPage({
  params,
}: CategoryRouteProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      const { category: slug } = await params;

      const { data: categoryData, error: categoryError } =
        await supabase
          .from("categories")
          .select("id, name, slug, description")
          .eq("slug", slug)
          .eq("status", "active")
          .maybeSingle();

      if (categoryError) {
        console.error(
          "Error loading category:",
          categoryError
        );
        setLoading(false);
        return;
      }

      if (!categoryData) {
        setLoading(false);
        return;
      }

      setCategory(categoryData);

      const { data: productData, error: productError } =
        await supabase
          .from("products")
          .select(
  "id, slug, name, description, image, images, price, store, category, subcategory"
)
          .eq("category", categoryData.name)
          .eq("status", "active")
          .order("created_at", { ascending: false });

      if (productError) {
        console.error(
          "Error loading category products:",
          productError
        );
        setLoading(false);
        return;
      }

      setProducts(
        (productData ?? []).map((product) => ({
          ...product,
          image: product.image ?? "",
          images: product.images ?? [],
          description: product.description ?? "",
          price: product.price ?? "",
          store: product.store ?? "",
          subcategory: product.subcategory ?? "",
        }))
      );

      setLoading(false);
    }

    loadCategory();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFFDF9] px-6 py-10 text-[#1F2937] md:px-12">
        <p className="text-sm text-[#6B7280]">
          Loading category...
        </p>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-[#FFFDF9] px-6 py-10 text-[#1F2937] md:px-12">
        <div className="mx-auto max-w-6xl">
          <a
            href="/"
            className="text-sm font-medium transition hover:text-[#176B6B]"
          >
            ← Back to The Find Edit
          </a>

          <h1 className="mt-8 text-3xl font-semibold">
            Category not found
          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">
            This category does not exist or is not currently
            active.
          </p>
        </div>
      </main>
    );
  }

  const subcategories = Array.from(
    new Set(
      products
        .map((product) => product.subcategory)
        .filter(Boolean)
    )
  );

  const filters = ["All", ...subcategories];

  return (
    <CategoryPage
      title={category.name}
      description={
        category.description ||
        `Affordable ${category.name.toLowerCase()} finds selected for you.`
      }
      filters={filters}
      products={products}
    />
  );
}
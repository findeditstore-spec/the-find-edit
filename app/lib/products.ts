import { supabase } from "./supabase";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: string;
  store: string;
  category: string;
  subcategory: string;
  affiliate_link?: string | null;
  status?: string | null;
  featured?: boolean | null;
  collection?: string | null;
  created_at?: string;
  updated_at?: string;
};

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading products:", error);
    return [];
  }

  return data ?? [];
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading all products:", error);
    return [];
  }

  return data ?? [];
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading products by category:", error);
    return [];
  }

  return data ?? [];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("Error loading product:", error);
    return null;
  }

  return data;
}

export async function getProductById(
  id: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error loading product by ID:", error);
    return null;
  }

  return data;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

export async function deleteProduct(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("image")
    .eq("id", id)
    .maybeSingle();

  if (productError) {
    console.error("Error finding product image:", productError);

    return {
      success: false,
      error: productError.message,
    };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  if (product?.image) {
    const marker = "/storage/v1/object/public/product-images/";

    if (product.image.includes(marker)) {
      const filePath = product.image.split(marker)[1];

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove([filePath]);

        if (storageError) {
          console.error(
            "Product deleted, but image could not be removed:",
            storageError
          );
        }
      }
    }
  }

  return {
    success: true,
  };
}
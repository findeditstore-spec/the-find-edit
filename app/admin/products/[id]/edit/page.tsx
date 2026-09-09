"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { supabase } from "../../../../lib/supabase";
import { Product } from "../../../../lib/products";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditProductPage({
  params,
}: EditProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState("");
const [uploadingImage, setUploadingImage] = useState(false);
const [imageUrl, setImageUrl] = useState("");
const [customStore, setCustomStore] = useState("");
const [selectedStore, setSelectedStore] = useState("");
const [categories, setCategories] = useState<
  {
    id: string;
    name: string;
    slug: string;
  }[]
>([]);

 useEffect(() => {
    async function loadProduct() {
      const { id } = await params;

      const { data: categoryData, error: categoryError } = await supabase
  .from("categories")
  .select("id, name, slug")
  .eq("status", "active")
  .order("name", { ascending: true });

if (categoryError) {
  console.error("Error loading categories:", categoryError);
} else {
  setCategories(categoryData ?? []);
}

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setMessage(`Could not load product: ${error.message}`);
        setLoading(false);
        return;
      }

      setProduct(data);     

const standardStores = [
  "SHEIN",
  "Temu",
  "Amazon",
  "Takealot",
  "Superbalist",
];

if (data?.store) {
  const isStandardStore = standardStores.includes(data.store);

  setSelectedStore(isStandardStore ? data.store : "Other");
}

if (data?.store && !standardStores.includes(data.store)) {
  setCustomStore(data.store);
}

setLoading(false);
    }

    loadProduct();
    }, [params]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
}

async function uploadImage() {
  if (!imageFile) {
    setMessage("Please choose an image first.");
    return;
  }

  setUploadingImage(true);
  setMessage("");

  const fileExtension = imageFile.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, imageFile);

  if (error) {
    setMessage(`Image upload failed: ${error.message}`);
    setUploadingImage(false);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  setImageUrl(publicUrl);

  setMessage("New image uploaded successfully.");
  setUploadingImage(false);
}

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!product) {
  return;
}

  setMessage("");

  const form = event.currentTarget;
  const formData = new FormData(form);

  const name = formData.get("name")?.toString().trim() || "";
  const description =
    formData.get("description")?.toString().trim() || "";
  const image =
  imageUrl || formData.get("image")?.toString().trim() || "";
  const category = formData.get("category")?.toString() || "";
  const subcategory =
    formData.get("subcategory")?.toString().trim() || "";
  const price = formData.get("price")?.toString().trim() || "";
  const selectedStoreValue =
  formData.get("store")?.toString() || "";

const customStoreName =
  formData.get("custom_store")?.toString().trim() || "";

const store =
  selectedStoreValue === "Other"
    ? customStoreName
    : selectedStoreValue;
  const affiliateLink =
    formData.get("affiliate_link")?.toString().trim() || "";
  const status = formData.get("status")?.toString() || "active";
  const featured = formData.get("featured") === "on";

  if (!name || !category) {
    setMessage("Please complete the required fields.");
    return;
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      image,
      category,
      subcategory,
      price,
      store,
      affiliate_link: affiliateLink || null,
      status,
      featured,
    })
    .eq("id", product.id);

  if (error) {
    setMessage(`Product could not be updated: ${error.message}`);
    return;
  }

  setProduct((currentProduct) => {
  if (!currentProduct) {
    return currentProduct;
  }

  return {
    ...currentProduct,
    name,
    description,
    image,
    category,
    subcategory,
    price,
    store,
    affiliate_link: affiliateLink || null,
    status,
    featured,
  };
});

  setMessage("Product updated successfully.");
}

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <p className="text-sm text-[#6B7280]">
          Loading product...
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFDF9] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Product not found
          </h1>

          <a
            href="/admin/products"
            className="mt-5 inline-block rounded-full border border-[#EAE6DF] px-5 py-3 text-sm transition hover:bg-[#F4F0E9]"
          >
            Back to products
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      <header className="flex items-center justify-between border-b border-[#EAE6DF] px-6 py-5 md:px-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            The Find Edit
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            Edit Product
          </h1>
        </div>

        <a
          href="/admin/products"
          className="rounded-full border border-[#EAE6DF] px-4 py-2 text-sm transition hover:bg-[#F4F0E9]"
        >
          Back to products
        </a>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
        <div>
          <p className="text-sm text-[#176B6B]">
            Product management
          </p>

          <h2 className="mt-2 text-4xl font-semibold tracking-tight">
            Edit Product
          </h2>

          <p className="mt-3 text-[#5B6470]">
            Update the details for {product.name}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-2xl border border-[#EAE6DF] bg-white p-6 md:p-8"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium"
            >
              Product name
            </label>

            <input
              id="name"
              name="name"
              defaultValue={product.name}
              required
              className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              rows={5}
              required
              className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
            />
          </div>

          <div>
  <label
    htmlFor="image"
    className="block text-sm font-medium"
  >
    Image URL
  </label>

  <input
    id="image"
    name="image"
    type="url"
    defaultValue={product.image}
    className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
  />

  <div className="mt-4 rounded-xl border border-dashed border-[#D8D2C8] bg-[#FFFDF9] p-5">
    <label
      htmlFor="new-image"
      className="block text-sm font-medium"
    >
      Replace image
    </label>

    <input
      id="new-image"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={handleImageChange}
      className="mt-3 block w-full text-sm text-[#5B6470]"
    />

    <p className="mt-2 text-xs text-[#6B7280]">
      Choose a new PNG, JPG or WebP image.
    </p>
  </div>

  {imagePreview && (
    <div className="mt-5">
      <p className="mb-3 text-sm font-medium">
        New image preview
      </p>

      <div className="overflow-hidden rounded-2xl border border-[#EAE6DF] bg-[#F4F0E9]">
        <img
          src={imagePreview}
          alt="New product preview"
          className="h-72 w-full object-contain"
        />
      </div>
    </div>
  )}

  {imageFile && (
    <button
      type="button"
      onClick={uploadImage}
      disabled={uploadingImage}
      className="mt-4 rounded-full border border-[#176B6B] px-6 py-3 text-sm font-medium text-[#176B6B] transition hover:bg-[#F4F0E9] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {uploadingImage ? "Uploading..." : "Upload new image"}
    </button>
  )}
</div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium"
              >
                Category
              </label>

              <select
  id="category"
  name="category"
  defaultValue={product.category}
  required
  className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
>
  <option value="" disabled>
    Select category
  </option>

  {categories.map((category) => (
    <option key={category.id} value={category.name}>
      {category.name}
    </option>
  ))}
</select>
            </div>

            <div>
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium"
              >
                Subcategory
              </label>

              <input
                id="subcategory"
                name="subcategory"
                defaultValue={product.subcategory || ""}
                className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium"
              >
                Price
              </label>

              <input
                id="price"
                name="price"
                defaultValue={product.price || ""}
                className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
              />
            </div>

            <div>
              <label
                htmlFor="store"
                className="block text-sm font-medium"
              >
                Store
              </label>

              <select
  id="store"
  name="store"
  value={selectedStore}
  onChange={(event) => {
    const value = event.target.value;

    setSelectedStore(value);

    if (value !== "Other") {
      setCustomStore("");
    }
  }}
  className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
>
  <option value="">Select store</option>
  <option value="SHEIN">SHEIN</option>
  <option value="Temu">Temu</option>
  <option value="Amazon">Amazon</option>
  <option value="Takealot">Takealot</option>
  <option value="Superbalist">Superbalist</option>
  <option value="Other">Other</option>
</select>

{selectedStore === "Other" && (
  <input
    type="text"
    name="custom_store"
    value={customStore}
    onChange={(event) => setCustomStore(event.target.value)}
    placeholder="Enter store name"
    className="mt-3 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
  />
)}
            </div>
          </div>

          <div>
            <label
              htmlFor="affiliate_link"
              className="block text-sm font-medium"
            >
              Affiliate link
            </label>

            <input
              id="affiliate_link"
              name="affiliate_link"
              type="url"
              defaultValue={product.affiliate_link || ""}
              className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={product.status || "active"}
                className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
              >
                <option value="draft">Draft</option>
                <option value="active">Publish</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                defaultChecked={product.featured ?? false}
                className="h-4 w-4 rounded border-[#EAE6DF]"
              />

              <label
                htmlFor="featured"
                className="text-sm"
              >
                Feature this product
              </label>
            </div>
          </div>

          <div className="border-t border-[#EAE6DF] pt-6">
            <button
              type="submit"
              className="rounded-full bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Update product
            </button>
          </div>

          {message && (
            <p className="rounded-xl bg-[#F4F0E9] px-4 py-3 text-sm text-[#176B6B]">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
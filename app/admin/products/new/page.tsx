"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AddProductPage() {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState("");
const [uploadingImage, setUploadingImage] = useState(false);
const [imageUrl, setImageUrl] = useState("");
const [store, setStore] = useState("");
const [categories, setCategories] = useState<
  {
    id: string;
    name: string;
    slug: string;
  }[]
>([]);

useEffect(() => {
  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("status", "active")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading categories:", error);
      return;
    }

    setCategories(data ?? []);
  }

  loadCategories();
}, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setMessage("");

  const form = event.currentTarget;
  const formData = new FormData(form);

  const name = formData.get("name")?.toString().trim() || "";
  const description =
    formData.get("description")?.toString().trim() || "";
  const category = formData.get("category")?.toString() || "";
  const subcategory =
    formData.get("subcategory")?.toString().trim() || "";
  const price = formData.get("price")?.toString().trim() || "";
  const selectedStore = formData.get("store")?.toString() || "";
const customStore =
  formData.get("custom_store")?.toString().trim() || "";

const store =
  selectedStore === "Other" ? customStore : selectedStore;
  const affiliateLink =
    formData.get("affiliate_link")?.toString().trim() || "";
  const status = formData.get("status")?.toString() || "draft";
  const featured = formData.get("featured") === "on";

  if (
    !name ||
    !description ||
    !category ||
    !subcategory ||
    !price ||
    !store ||
    !imageUrl
  ) {
    setMessage(
      "Please complete all required fields and upload an image."
    );
    return;
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const id = `${category
    .toLowerCase()
    .replace(/\s+/g, "-")}-${crypto.randomUUID()}`;

  const { error } = await supabase.from("products").insert({
    id,
    slug,
    name,
    description,
    image: imageUrl,
    price,
    store,
    category,
    subcategory,
    affiliate_link: affiliateLink || null,
    status,
    featured,
  });

  if (error) {
    setMessage(`Product could not be saved: ${error.message}`);
    return;
  }

  setMessage("Product saved successfully.");
  form.reset();
  setImageFile(null);
  setImagePreview("");
  setImageUrl("");
}

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

  setMessage("Image uploaded successfully.");
  setUploadingImage(false);
}

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#EAE6DF] px-6 py-5 md:px-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            The Find Edit
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            Admin
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
        {/* Heading */}
        <div>
          <p className="text-sm text-[#176B6B]">
            Product management
          </p>

          <h2 className="mt-2 text-4xl font-semibold tracking-tight">
            Add a product
          </h2>

          <p className="mt-3 max-w-2xl text-[#5B6470]">
            Add a new find to The Find Edit.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8 rounded-2xl border border-[#EAE6DF] bg-white p-6 md:p-8"
        >
          {/* Product name */}
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
              type="text"
              placeholder="e.g. Mini Shoulder Bag"
              className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium"
            >
              Short description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe why this find is worth discovering."
              className="mt-2 w-full resize-none rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
            />
          </div>

          {/* Product Image */}
<div>
  <label
    htmlFor="image"
    className="block text-sm font-medium"
  >
    Product image
  </label>

  <div className="mt-2 rounded-xl border border-dashed border-[#D8D2C8] bg-[#FFFDF9] p-6">
    <input
      id="image"
      name="image"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={handleImageChange}
      className="block w-full text-sm text-[#5B6470]"
    />

    <p className="mt-2 text-xs text-[#6B7280]">
      PNG, JPG or WebP. Choose a clear product image.
    </p>
  </div>

  {imagePreview && (
    <div className="mt-5">
      <p className="mb-3 text-sm font-medium">
        Preview
      </p>

      <div className="overflow-hidden rounded-2xl border border-[#EAE6DF] bg-[#F4F0E9]">
        <img
          src={imagePreview}
          alt="Product preview"
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
      {uploadingImage ? "Uploading..." : "Upload image"}
    </button>
  )}
</div>

          {/* Category / Subcategory */}
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
                defaultValue=""
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
                type="text"
                placeholder="e.g. Bags"
                className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
              />
            </div>
          </div>

          {/* Price / Store */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium"
              >
                Price shown
              </label>

              <input
                id="price"
                name="price"
                type="text"
                placeholder="From R299"
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
  value={store}
onChange={(event) => setStore(event.target.value)}
  className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
>
  <option value="" disabled>
    Select store
  </option>

  <option value="SHEIN">
    SHEIN
  </option>

  <option value="Temu">
    Temu
  </option>

  <option value="Amazon">
    Amazon
  </option>

  <option value="Takealot">
    Takealot
  </option>

  <option value="Superbalist">
    Superbalist
  </option>

  <option value="Other">
    Other
  </option>
</select>

{store === "Other" && (
  <input
    type="text"
    name="custom_store"
    placeholder="Enter store name"
    className="mt-3 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
  />
)}
            </div>
          </div>

          {/* Affiliate link */}
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
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
            />
          </div>

          {/* Options */}
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
                defaultValue="draft"
                className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="active">
                  Publish
                </option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                id="featured"
                name="featured"
                type="checkbox"
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

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 border-t border-[#EAE6DF] pt-6">
            <button
              type="submit"
              className="rounded-full bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Save product
            </button>

            <a
              href="/admin/products"
              className="rounded-full border border-[#EAE6DF] px-6 py-3 text-sm font-medium transition hover:bg-[#F4F0E9]"
            >
              Cancel
            </a>
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
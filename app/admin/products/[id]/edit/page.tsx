"use client";

import AdminLayout from "../../../_components/AdminLayout";
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
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([
    "",
    "",
    "",
  ]);
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
        setMessageType("error");
        setLoading(false);
        return;
      }

      setProduct(data);

      const existingImages =
        data?.images?.length
          ? data.images.slice(0, 3)
          : data?.image
            ? [data.image]
            : [];

      setImageUrls([
        existingImages[0] ?? "",
        existingImages[1] ?? "",
        existingImages[2] ?? "",
      ]);

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

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const preview = URL.createObjectURL(file);

    setImageFiles((current) => {
      const updated = [...current];
      updated[index] = file;
      return updated;
    });

    setImagePreviews((current) => {
      const updated = [...current];
      updated[index] = preview;
      return updated;
    });
  }

  async function uploadImages() {
    const filesToUpload = imageFiles.filter(
      (file): file is File => file !== null
    );

    if (filesToUpload.length === 0) {
      setMessage("Please choose at least one image first.");
      setMessageType("error");
      return;
    }

    setUploadingImages(true);
    setMessage("");
    setMessageType("");

    const uploadedUrls = [...imageUrls];

    for (let index = 0; index < imageFiles.length; index++) {
      const file = imageFiles[index];

      if (!file) {
        continue;
      }

      const fileExtension = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (error) {
        setMessage(`Image upload failed: ${error.message}`);
        setMessageType("error");
        setUploadingImages(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedUrls[index] = publicUrl;
    }

    setImageUrls(uploadedUrls);
    setMessage("Images uploaded successfully.");
    setMessageType("success");
    setUploadingImages(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) {
      return;
    }

    setMessage("");
    setMessageType("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const image = imageUrls[0] || formData.get("image")?.toString().trim() || "";
    const images = imageUrls.filter(Boolean).slice(0, 3);
    const category = formData.get("category")?.toString() || "";
    const subcategory = formData.get("subcategory")?.toString().trim() || "";
    const price = formData.get("price")?.toString().trim() || "";
    const selectedStoreValue = formData.get("store")?.toString() || "";
    const customStoreName = formData.get("custom_store")?.toString().trim() || "";

    const store =
      selectedStoreValue === "Other"
        ? customStoreName
        : selectedStoreValue;
    const affiliateLink = formData.get("affiliate_link")?.toString().trim() || "";
    const status = formData.get("status")?.toString() || "active";
    const featured = formData.get("featured") === "on";

    if (!name || !category) {
      setMessage("Please complete the required fields.");
      setMessageType("error");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        image,
        images,
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
      setMessageType("error");
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
        images,
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
    setMessageType("success");
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
    <AdminLayout
      currentSection="products"
      title="Edit product"
      description={`Update details for ${product.name}.`}
    >
      <div className="space-y-6 max-w-5xl">
        <div>
          <a
            href="/admin/products"
            className="text-sm font-semibold text-[#176B6B] transition hover:underline"
          >
            ← Back to products
          </a>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Edit product
          </h1>

          <p className="mt-2 text-sm text-[#687572]">
            Keep product details, merchant links, images and publishing status up to date.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-xl border border-[#EAE6DF] bg-white p-6 sm:p-8"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#18302F]">
              Product name *
            </label>
            <input
              id="name"
              name="name"
              defaultValue={product.name}
              required
              className="mt-2 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#18302F]">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              rows={4}
              required
              className="mt-2 w-full resize-none rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
            />
          </div>

          <div className="border-t border-[#EAE6DF] pt-8">
            <div>
              <p className="text-sm font-medium text-[#18302F]">Product images</p>
              <p className="mt-1 text-xs text-[#687572]">
                Add up to 3 images. Image 1 is the main product image.
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] p-4">
                  <p className="text-xs font-semibold text-[#18302F]">Image {index + 1}</p>
                  {imageUrls[index] && !imagePreviews[index] && (
                    <img
                      src={imageUrls[index]}
                      alt={`Product ${index + 1}`}
                      className="mt-3 h-32 w-full rounded-lg object-cover bg-[#F4F0E9]"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => handleImageChange(event, index)}
                    className="mt-3 block w-full text-xs text-[#687572]"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label htmlFor="image" className="block text-xs font-medium text-[#7A827D]">
                Main image URL (fallback or direct link)
              </label>
              <input
                id="image"
                name="image"
                type="url"
                defaultValue={product.image || ""}
                className="mt-1.5 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-2.5 text-sm outline-none transition focus:border-[#176B6B]"
              />
            </div>

            {imagePreviews.some(Boolean) && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-[#18302F]">New image previews</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {imagePreviews.map(
                    (preview, index) =>
                      preview && (
                        <div key={index} className="overflow-hidden rounded-xl border border-[#EAE6DF] bg-[#F4F0E9]">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-40 w-full object-cover"
                          />
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

            {imageFiles.some(Boolean) && (
              <button
                type="button"
                onClick={uploadImages}
                disabled={uploadingImages}
                className="mt-4 rounded-xl border border-[#176B6B] px-5 py-2.5 text-sm font-semibold text-[#176B6B] transition hover:bg-[#F4F0E9] disabled:opacity-60"
              >
                {uploadingImages ? "Uploading images…" : "Upload selected images"}
              </button>
            )}
          </div>

          <div className="border-t border-[#EAE6DF] pt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#18302F]">
                Category *
              </label>
              <select
                id="category"
                name="category"
                defaultValue={product.category}
                required
                className="mt-2 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
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
              <label htmlFor="subcategory" className="block text-sm font-medium text-[#18302F]">
                Subcategory
              </label>
              <input
                id="subcategory"
                name="subcategory"
                defaultValue={product.subcategory || ""}
                className="mt-2 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#18302F]">
                Price *
              </label>
              <input
                id="price"
                name="price"
                defaultValue={product.price || ""}
                required
                className="mt-2 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
              />
            </div>

            <div>
              <label htmlFor="store" className="block text-sm font-medium text-[#18302F]">
                Store / Merchant *
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
                required
                className="mt-2 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
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
                  required
                  className="mt-3 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
                />
              )}
            </div>
          </div>

          <div>
            <label htmlFor="affiliate_link" className="block text-sm font-medium text-[#18302F]">
              Affiliate link
            </label>
            <input
              id="affiliate_link"
              name="affiliate_link"
              type="url"
              defaultValue={product.affiliate_link || ""}
              className="mt-2 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
            />
          </div>

          <div className="border-t border-[#EAE6DF] pt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[#18302F]">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={product.status || "active"}
                className="mt-2 w-full rounded-xl border border-[#E6E8E2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
              >
                <option value="draft">Draft</option>
                <option value="active">Live</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                defaultChecked={product.featured ?? false}
                className="h-4 w-4 rounded border-[#EAE6DF] accent-[#176B6B]"
              />
              <label htmlFor="featured" className="text-sm font-medium text-[#18302F]">
                Feature this product
              </label>
            </div>
          </div>

          <div className="border-t border-[#EAE6DF] pt-6 flex items-center gap-4">
            <button
              type="submit"
              className="rounded-xl bg-[#176B6B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#125858]"
            >
              Update product
            </button>
            <a
              href="/admin/products"
              className="rounded-xl border border-[#EAE6DF] px-6 py-3 text-sm font-semibold transition hover:bg-[#F4F0E9]"
            >
              Cancel
            </a>
          </div>

          {message && (
            <p
              role="status"
              className={`rounded-xl px-4 py-3 text-sm ${
                messageType === "success"
                  ? "border border-[#CFE1D4] bg-[#EEF4EF] text-[#23684A]"
                  : "border border-[#E8D5B8] bg-[#FFF6E8] text-[#76511D]"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}

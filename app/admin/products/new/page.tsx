"use client";

import AdminLayout from "../../_components/AdminLayout";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AddProductPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(["", "", ""]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(["", "", ""]);
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
    setMessageType("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const category = formData.get("category")?.toString() || "";
    const subcategory = formData.get("subcategory")?.toString().trim() || "";
    const price = formData.get("price")?.toString().trim() || "";
    const selectedStore = formData.get("store")?.toString() || "";
    const customStore = formData.get("custom_store")?.toString().trim() || "";

    const storeValue = selectedStore === "Other" ? customStore : selectedStore;
    const affiliateLink = formData.get("affiliate_link")?.toString().trim() || "";
    const status = formData.get("status")?.toString() || "draft";
    const featured = formData.get("featured") === "on";

    if (
      !name ||
      !description ||
      !category ||
      !subcategory ||
      !price ||
      !storeValue ||
      !imageUrls[0]
    ) {
      setMessage("Please complete all required fields and upload an image.");
      setMessageType("error");
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
      image: imageUrls[0],
      images: imageUrls.filter(Boolean),
      price,
      store: storeValue,
      category,
      subcategory,
      affiliate_link: affiliateLink || null,
      status,
      featured,
    });

    if (error) {
      setMessage(`Product could not be saved: ${error.message}`);
      setMessageType("error");
      return;
    }

    setMessage("Product saved successfully.");
    setMessageType("success");
    form.reset();
    setImageFiles([null, null, null]);
    setImagePreviews(["", "", ""]);
    setImageUrls(["", "", ""]);
  }

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

  return (
    <AdminLayout
      currentSection="products"
      title="Add a find"
      description="Add a new product to The Find Edit catalogue."
    >
      <div className="max-w-6xl">{/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-[#EAE6DF] bg-white p-6 md:p-8"
        >
          {/* Product name - wider field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Product name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Mini Shoulder Bag"
              required
              className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
            />
          </div>

          {/* First row: Product name (full width) */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium"
            >
              Short description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe why this find is worth discovering."
              required
              className="mt-2 w-full resize-none rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
            />
          </div>

          {/* Product Images Section */}
          <div className="border-t border-[#EAE6DF] pt-8">
            <div>
              <p className="text-sm font-medium">Product images *</p>
              <p className="mt-1 text-xs text-[#6B7280]">
                Add up to 3 images. Image 1 is the main product image.
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-dashed border-[#D8D2C8] bg-[#FFFDF9] p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <label key={index} className="block cursor-pointer">
                    <input
                      name={`image-${index + 1}`}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => handleImageChange(event, index)}
                      className="sr-only"
                    />
                    <div className="rounded-lg border-2 border-dashed border-[#D8D2C8] bg-white p-4 text-center transition hover:border-[#176B6B]">
                      <p className="text-xs font-medium text-[#5B6470]">
                        Image {index + 1}
                      </p>
                      <p className="mt-1 text-xs text-[#A3AAA5]">
                        Click to add
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#6B7280]">
                PNG, JPG or WebP. Choose clear product images.
              </p>
            </div>

            {imagePreviews.some(Boolean) && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium">Preview</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {imagePreviews.map(
                    (preview, index) =>
                      preview && (
                        <div
                          key={index}
                          className="overflow-hidden rounded-lg border border-[#EAE6DF] bg-[#F4F0E9]"
                        >
                          <img
                            src={preview}
                            alt={`Product preview ${index + 1}`}
                            className="h-48 w-full object-contain"
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
                className="mt-4 rounded-lg border border-[#176B6B] px-6 py-2.5 text-sm font-medium text-[#176B6B] transition hover:bg-[#F4F0E9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingImages ? "Uploading..." : "Upload images"}
              </button>
            )}
          </div>

          {/* Product Details Grid */}
          <div className="border-t border-[#EAE6DF] pt-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue=""
                  required
                  className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
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
                  Subcategory *
                </label>
                <input
                  id="subcategory"
                  name="subcategory"
                  type="text"
                  placeholder="e.g. Bags"
                  required
                  className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium"
                >
                  Price shown *
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="From R299"
                  required
                  className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
                />
              </div>

              <div>
                <label
                  htmlFor="store"
                  className="block text-sm font-medium"
                >
                  Store *
                </label>
                <select
                  id="store"
                  name="store"
                  value={store}
                  onChange={(event) => setStore(event.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
                >
                  <option value="" disabled>
                    Select store
                  </option>
                  <option value="SHEIN">SHEIN</option>
                  <option value="Temu">Temu</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Takealot">Takealot</option>
                  <option value="Superbalist">Superbalist</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {store === "Other" && (
              <div>
                <input
                  type="text"
                  name="custom_store"
                  placeholder="Enter store name"
                  required
                  className="w-full rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
                />
              </div>
            )}
          </div>

          {/* Affiliate link */}
          <div className="border-t border-[#EAE6DF] pt-8">
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
              className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
            />
          </div>

          {/* Status and Featured */}
          <div className="border-t border-[#EAE6DF] pt-8">
            <div className="grid gap-6 sm:grid-cols-2">
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
                  className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
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
                  className="h-5 w-5 rounded border border-[#EAE6DF] accent-[#176B6B]"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Feature this product
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 border-t border-[#EAE6DF] pt-8">
            <button
              type="submit"
              className="rounded-lg bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#125858] focus:outline-none focus:ring-2 focus:ring-[#176B6B] focus:ring-offset-2"
            >
              Save product
            </button>

            <a
              href="/admin/products"
              className="rounded-lg border border-[#EAE6DF] px-6 py-3 text-sm font-medium transition hover:bg-[#F4F0E9] hover:border-[#176B6B]"
            >
              Cancel
            </a>
          </div>

          {/* Status Messages */}
          {message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                messageType === "success"
                  ? "bg-[#E5F3EC] text-[#23684A] border border-[#CFE1D4]"
                  : "bg-[#FFF6E8] text-[#76511D] border border-[#E8D5B8]"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
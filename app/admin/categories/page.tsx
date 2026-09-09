"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: string | null;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [message, setMessage] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
  null
);
const [editName, setEditName] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading categories:", error);
        return;
      }

      setCategories(data ?? []);
    }

    loadCategories();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFDF9] px-6 py-10 text-[#1F2937] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7280]">
              The Find Edit
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Categories
            </h1>

            <p className="mt-2 text-sm text-[#6B7280]">
              Create and manage your product categories.
            </p>
          </div>

          <a
            href="/admin"
            className="text-sm font-medium transition hover:text-[#176B6B]"
          >
            Back to dashboard
          </a>
        </div>

        <section className="mt-10 rounded-2xl border border-[#EAE6DF] bg-white p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium">
              Your categories
            </h2>

            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="rounded-full bg-[#176B6B] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Add category
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6 rounded-2xl border border-[#EAE6DF] bg-[#FFFDF9] p-6">
              <h3 className="text-base font-medium">
                Add category
              </h3>

              <div className="mt-5">
                <label
                  htmlFor="category-name"
                  className="text-sm font-medium"
                >
                  Category name
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(event) =>
                    setCategoryName(event.target.value)
                  }
                  placeholder="e.g. Home & Living"
                  className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-white px-4 py-3 outline-none transition focus:border-[#176B6B]"
                />
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={savingCategory}
                  onClick={async () => {
                    const name = categoryName.trim();

                    if (!name) {
                      setMessage("Please enter a category name.");
                      return;
                    }

                    setSavingCategory(true);
                    setMessage("");

                    const slug = name
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");

                    const { error } = await supabase
                      .from("categories")
                      .insert({
                        name,
                        slug,
                        status: "active",
                      });

                    if (error) {
                      console.error(
                        "Error creating category:",
                        error
                      );

                      setMessage(
                        error.message ||
                          "Unable to create category."
                      );

                      setSavingCategory(false);
                      return;
                    }

                    setCategoryName("");
                    setShowCreateForm(false);
                    setSavingCategory(false);
                    setMessage(
                      "Category created successfully."
                    );

                    const { data } = await supabase
                      .from("categories")
                      .select("*")
                      .order("created_at", {
                        ascending: false,
                      });

                    setCategories(data ?? []);
                  }}
                  className="rounded-full bg-[#176B6B] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {savingCategory
                    ? "Saving..."
                    : "Save category"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setMessage("");
                  }}
                  className="rounded-full border border-[#EAE6DF] px-5 py-2.5 text-sm font-medium transition hover:border-[#176B6B]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className="mb-5 text-sm text-[#176B6B]">
              {message}
            </p>
          )}

          {categories.length === 0 ? (
            <p className="mt-2 text-sm text-[#6B7280]">
              No categories created yet.
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
  <div
    key={category.id}
    className="rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-5 py-4"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">
          {category.name}
        </p>

        <p className="mt-1 text-sm text-[#6B7280]">
          {category.slug}
        </p>
      </div>

      <div className="flex items-center gap-3">
<a
  href={`/${category.slug}`}
  className="text-sm font-medium transition hover:text-[#176B6B]"
>
  View
</a>

        <button
          type="button"
          onClick={() => {
            setEditingCategoryId(category.id);
            setEditName(category.name);
            setMessage("");
          }}
          className="text-sm font-medium transition hover:text-[#176B6B]"
        >
          Edit
        </button>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            category.status === "active"
              ? "bg-[#E7F2EF] text-[#176B6B]"
              : "bg-[#F4F0E9] text-[#6B7280]"
          }`}
        >
          {category.status === "active"
            ? "Active"
            : "Draft"}
        </span>

        <button
          type="button"
          onClick={async () => {
            const confirmed = window.confirm(
              `Delete "${category.name}"?`
            );

            if (!confirmed) {
              return;
            }

            const { error } = await supabase
              .from("categories")
              .delete()
              .eq("id", category.id);

            if (error) {
              console.error(
                "Error deleting category:",
                error
              );
              setMessage(error.message);
              return;
            }

            setCategories((current) =>
              current.filter(
                (item) => item.id !== category.id
              )
            );

            setMessage(
              "Category deleted successfully."
            );
          }}
          className="text-sm font-medium text-red-600 transition hover:opacity-70"
        >
          Delete
        </button>
      </div>
    </div>

    {editingCategoryId === category.id && (
      <div className="mt-5 rounded-2xl border border-[#EAE6DF] bg-white p-6">
        <h3 className="text-base font-medium">
          Edit category
        </h3>

        <div className="mt-5">
          <label
            htmlFor={`edit-category-${category.id}`}
            className="text-sm font-medium"
          >
            Category name
          </label>

          <input
            id={`edit-category-${category.id}`}
            type="text"
            value={editName}
            onChange={(event) =>
              setEditName(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#176B6B]"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={async () => {
              const name = editName.trim();

              if (!name) {
                setMessage(
                  "Please enter a category name."
                );
                return;
              }

              const slug = name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

              const { error } = await supabase
                .from("categories")
                .update({
                  name,
                  slug,
                })
                .eq("id", category.id);

              if (error) {
                console.error(
                  "Error updating category:",
                  error
                );
                setMessage(error.message);
                return;
              }

              setCategories((current) =>
                current.map((item) =>
                  item.id === category.id
                    ? {
                        ...item,
                        name,
                        slug,
                      }
                    : item
                )
              );

              setEditingCategoryId(null);
              setMessage(
                "Category updated successfully."
              );
            }}
            className="rounded-full bg-[#176B6B] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Save changes
          </button>

          <button
            type="button"
            onClick={() =>
              setEditingCategoryId(null)
            }
            className="rounded-full border border-[#EAE6DF] px-5 py-2.5 text-sm font-medium transition hover:border-[#176B6B]"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
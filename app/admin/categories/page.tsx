"use client";

import AdminLayout from "../_components/AdminLayout";
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
    <AdminLayout
      currentSection="categories"
      title="Categories"
      description="Create and manage your product categories."
    >
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-[#176B6B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125858]"
        >
          Add category
        </button>

        <section className="rounded-lg border border-[#EAE6DF] bg-white p-6">
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
            <div className="mb-6 rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] p-6">
              <h3 className="text-base font-semibold text-[#18302F]">
                Add category
              </h3>

              <div className="mt-4">
                <label
                  htmlFor="category-name"
                  className="block text-sm font-medium text-[#18302F]"
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
                  className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
                />
              </div>

              <div className="mt-4 flex gap-3">
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
                  className="rounded-lg bg-[#176B6B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#125858] disabled:opacity-50"
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
                  className="rounded-lg border border-[#EAE6DF] px-4 py-2.5 text-sm font-medium transition hover:bg-[#F4F0E9] hover:border-[#176B6B]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              message.includes("successfully")
                ? "bg-[#E5F3EC] text-[#23684A] border border-[#CFE1D4]"
                : "bg-[#FFF6E8] text-[#76511D] border border-[#E8D5B8]"
            }`}>
              {message}
            </div>
          )}

          {categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#687572]">
              No categories created yet.
            </p>
          ) : (
            <div className="divide-y divide-[#EEF0EB]">
              {categories.map((category) => (
  <div
    key={category.id}
    className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0"
  >
    <div className="min-w-0 flex-1">
      <p className="font-medium text-[#18302F]">
        {category.name}
      </p>

      <p className="mt-1 text-xs text-[#687572]">
        {category.slug}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
          category.status === "active"
            ? "bg-[#E5F3EC] text-[#23684A]"
            : "bg-[#F0F1EF] text-[#687572]"
        }`}
      >
        {category.status === "active"
          ? "Active"
          : "Draft"}
      </span>

      <a
        href={`/${category.slug}`}
        className="text-xs font-semibold text-[#176B6B] transition hover:underline"
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
        className="text-xs font-semibold text-[#176B6B] transition hover:underline"
      >
        Edit
      </button>

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
        className="text-xs font-semibold text-red-600 transition hover:opacity-70"
      >
        Delete
      </button>
    </div>

    {editingCategoryId === category.id && (
      <div className="col-span-full mt-4 rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] p-6">
        <h3 className="text-base font-semibold text-[#18302F]">
          Edit category
        </h3>

        <div className="mt-4">
          <label
            htmlFor={`edit-category-${category.id}`}
            className="block text-sm font-medium text-[#18302F]"
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
            className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
          />
        </div>

        <div className="mt-4 flex gap-3">
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
            className="rounded-lg bg-[#176B6B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#125858]"
          >
            Save changes
          </button>

          <button
            type="button"
            onClick={() =>
              setEditingCategoryId(null)
            }
            className="rounded-lg border border-[#EAE6DF] px-4 py-2.5 text-sm font-medium transition hover:bg-[#F4F0E9] hover:border-[#176B6B]"
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
    </AdminLayout>
  );
}
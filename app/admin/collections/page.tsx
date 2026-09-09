"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<
    {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
      status: string | null;
    }[]
  >([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [collectionName, setCollectionName] = useState("");
const [savingCollection, setSavingCollection] = useState(false);
const [message, setMessage] = useState("");
const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
  null
);
const [editName, setEditName] = useState("");

  useEffect(() => {
    async function loadCollections() {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading collections:", error);
        return;
      }

      setCollections(data ?? []);
    }

    loadCollections();
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
              Collections
            </h1>

            <p className="mt-2 text-sm text-[#6B7280]">
              Create and manage curated product collections.
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
    Your collections
  </h2>

  <button
  type="button"
  onClick={() => setShowCreateForm(true)}
  className="rounded-full bg-[#176B6B] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
>
  Create collection
</button>
</div>

{showCreateForm && (
  <div className="mb-6 rounded-2xl border border-[#EAE6DF] bg-[#FFFDF9] p-6">
    <h3 className="text-base font-medium">
      Create collection
    </h3>

    <div className="mt-5">
      <label
        htmlFor="collection-name"
        className="text-sm font-medium"
      >
        Collection name
      </label>

      <input
        id="collection-name"
        type="text"
        value={collectionName}
onChange={(event) => setCollectionName(event.target.value)}
        placeholder="e.g. Soft Glam"
        className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-white px-4 py-3 outline-none transition focus:border-[#176B6B]"
      />
    </div>

    <div className="mt-5 flex gap-3">
      <button
  type="button"
  disabled={savingCollection}
  onClick={async () => {
    const name = collectionName.trim();

    if (!name) {
      setMessage("Please enter a collection name.");
      return;
    }

    setSavingCollection(true);
    setMessage("");

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { error } = await supabase
      .from("collections")
      .insert({
        name,
        slug,
        status: "active",
      });

    if (error) {
  console.error("Error creating collection:", {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });

  setMessage(
    error.message ||
      error.details ||
      error.hint ||
      "Unable to create collection."
  );

  setSavingCollection(false);
  return;
}

    setCollectionName("");
    setShowCreateForm(false);
    setSavingCollection(false);
    setMessage("Collection created successfully.");

    const { data } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });

    setCollections(data ?? []);
  }}
  className="rounded-full bg-[#176B6B] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
>
  {savingCollection ? "Saving..." : "Save collection"}
</button>

      <button
        type="button"
        onClick={() => setShowCreateForm(false)}
        className="rounded-full border border-[#EAE6DF] px-5 py-2.5 text-sm font-medium transition hover:border-[#176B6B]"
      >
        Cancel
      </button>
    </div>
  </div>
)}

          {collections.length === 0 ? (
  <p className="mt-2 text-sm text-[#6B7280]">
    No collections created yet.
  </p>
) : (
  <div className="space-y-3">
    {collections.map((collection) => (
      <div
  key={collection.id}
  className="rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-5 py-4"
>
        <div>
          <p className="font-medium">
            {collection.name}
          </p>

          <p className="mt-1 text-sm text-[#6B7280]">
            {collection.slug}
          </p>
        </div>

        {editingCollectionId === collection.id && (
  <div className="mt-3 rounded-2xl border border-[#EAE6DF] bg-[#FFFDF9] p-6">
    <h3 className="text-base font-medium">
      Edit collection
    </h3>

    <div className="mt-5">
      <label
        htmlFor={`edit-collection-${collection.id}`}
        className="text-sm font-medium"
      >
        Collection name
      </label>

      <input
        id={`edit-collection-${collection.id}`}
        type="text"
        value={editName}
        onChange={(event) => setEditName(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-white px-4 py-3 outline-none transition focus:border-[#176B6B]"
      />
    </div>

    <div className="mt-5 flex gap-3">
      <button
  type="button"
  onClick={async () => {
    const name = editName.trim();

    if (!name) {
      setMessage("Please enter a collection name.");
      return;
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { error } = await supabase
      .from("collections")
      .update({
        name,
        slug,
      })
      .eq("id", collection.id);

    if (error) {
      console.error("Error updating collection:", error);
      setMessage(error.message);
      return;
    }

    setCollections((current) =>
      current.map((item) =>
        item.id === collection.id
          ? {
              ...item,
              name,
              slug,
            }
          : item
      )
    );

    setEditingCollectionId(null);
    setMessage("Collection updated successfully.");
  }}
  className="rounded-full bg-[#176B6B] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
>
  Save changes
</button>

      <button
        type="button"
        onClick={() => setEditingCollectionId(null)}
        className="rounded-full border border-[#EAE6DF] px-5 py-2.5 text-sm font-medium transition hover:border-[#176B6B]"
      >
        Cancel
      </button>
    </div>
  </div>
)}

        <div className="flex items-center gap-3">
            <button
  type="button"
  onClick={() => {
    setEditingCollectionId(collection.id);
    setEditName(collection.name);
    setMessage("");
  }}
  className="text-sm font-medium transition hover:text-[#176B6B]"
>
  Edit
</button>

<a
  href={`/admin/collections/${collection.id}/products`}
  className="text-sm font-medium transition hover:text-[#176B6B]"
>
  Manage products
</a>
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      collection.status === "active"
        ? "bg-[#E7F2EF] text-[#176B6B]"
        : "bg-[#F4F0E9] text-[#6B7280]"
    }`}
  >
    {collection.status === "active" ? "Active" : "Draft"}
  </span>

  <button
  type="button"
  onClick={async () => {
    const confirmed = window.confirm(
      `Delete "${collection.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collection.id);

    if (error) {
      console.error("Error deleting collection:", error);
      setMessage(error.message);
      return;
    }

    setCollections((current) =>
      current.filter((item) => item.id !== collection.id)
    );

    setMessage("Collection deleted successfully.");
  }}
  className="text-sm font-medium text-red-600 transition hover:opacity-70"
>
  Delete
</button>
</div>
      </div>
    ))}
  </div>
)}
        </section>
      </div>
    </main>
  );
}
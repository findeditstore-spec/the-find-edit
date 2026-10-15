"use client";

import AdminLayout from "../_components/AdminLayout";
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
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
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
    <AdminLayout
      currentSection="collections"
      title="Collections"
      description="Create and manage curated product collections."
    >
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-[#176B6B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125858]"
        >
          Create collection
        </button>

        {showCreateForm && (
          <div className="rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] p-6">
            <h3 className="text-base font-semibold text-[#18302F]">
              Create collection
            </h3>

            <div className="mt-4">
              <label
                htmlFor="collection-name"
                className="block text-sm font-medium text-[#18302F]"
              >
                Collection name
              </label>

              <input
                id="collection-name"
                type="text"
                value={collectionName}
                onChange={(event) => setCollectionName(event.target.value)}
                placeholder="e.g. Soft Glam"
                className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
              />
            </div>

            <div className="mt-4 flex gap-3">
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
                    console.error("Error creating collection:", error);
                    setMessage(
                      error.message || "Unable to create collection."
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
                className="rounded-lg bg-[#176B6B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#125858] disabled:opacity-50"
              >
                {savingCollection ? "Saving..." : "Save collection"}
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
          <div className={`rounded-lg px-4 py-3 text-sm ${
            message.includes("successfully")
              ? "bg-[#E5F3EC] text-[#23684A] border border-[#CFE1D4]"
              : "bg-[#FFF6E8] text-[#76511D] border border-[#E8D5B8]"
          }`}>
            {message}
          </div>
        )}

        <section className="rounded-lg border border-[#EAE6DF] bg-white p-6">
          {collections.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#687572]">
              No collections created yet.
            </p>
          ) : (
            <div className="divide-y divide-[#EEF0EB]">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#18302F]">
                      {collection.name}
                    </p>
                    <p className="mt-1 text-xs text-[#687572]">
                      {collection.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        collection.status === "active"
                          ? "bg-[#E5F3EC] text-[#23684A]"
                          : "bg-[#F0F1EF] text-[#687572]"
                      }`}
                    >
                      {collection.status === "active" ? "Active" : "Draft"}
                    </span>

                    <a
                      href={`/admin/collections/${collection.id}/products`}
                      className="text-xs font-semibold text-[#176B6B] transition hover:underline"
                    >
                      Manage
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingCollectionId(collection.id);
                        setEditName(collection.name);
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
                      className="text-xs font-semibold text-red-600 transition hover:opacity-70"
                    >
                      Delete
                    </button>
                  </div>

                  {editingCollectionId === collection.id && (
                    <div className="col-span-full mt-4 rounded-lg border border-[#EAE6DF] bg-[#FFFDF9] p-6">
                      <h3 className="text-base font-semibold text-[#18302F]">
                        Edit collection
                      </h3>

                      <div className="mt-4">
                        <label
                          htmlFor={`edit-collection-${collection.id}`}
                          className="block text-sm font-medium text-[#18302F]"
                        >
                          Collection name
                        </label>

                        <input
                          id={`edit-collection-${collection.id}`}
                          type="text"
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          className="mt-2 w-full rounded-lg border border-[#EAE6DF] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#176B6B] focus:ring-1 focus:ring-[#176B6B]"
                        />
                      </div>

                      <div className="mt-4 flex gap-3">
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
                          className="rounded-lg bg-[#176B6B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#125858]"
                        >
                          Save changes
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingCollectionId(null)}
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

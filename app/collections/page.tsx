import { supabase } from "../lib/supabase";
import FindsHeader from "../components/FindsHeader";

export default async function CollectionsPage() {
  const { data: collections, error } = await supabase
    .from("collections")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading collections:", error);
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      <FindsHeader />

      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            Curated Collections
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-medium tracking-tight md:text-7xl">
            Finds, brought together.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5B6470]">
            Explore collections of products curated around ideas, interests,
            occasions and things worth finding.
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="px-6 pb-24 md:px-12 md:pb-32">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {(collections ?? []).map((collection) => (
            <a
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group rounded-2xl border border-[#EAE6DF] bg-white p-8 transition hover:-translate-y-1 hover:border-[#176B6B]"
            >
              <p className="text-sm font-medium text-[#176B6B]">
                Collection
              </p>

              <h2 className="mt-4 font-serif text-3xl font-medium">
                {collection.name}
              </h2>

              {collection.description && (
                <p className="mt-4 leading-7 text-[#5B6470]">
                  {collection.description}
                </p>
              )}

              <p className="mt-8 text-sm font-medium text-[#1F2937] transition group-hover:text-[#176B6B]">
                Explore collection →
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
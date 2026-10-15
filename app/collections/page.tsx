import { getSupabaseServerClient } from "../lib/supabase-server";
import { PageLayout, Container, Section, SectionHeader } from "../components/layout";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
}

export default async function CollectionsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: collections, error } = await supabase
    .from("collections")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading collections:", error);
  }

  const collectionsList: Collection[] = collections ?? [];

  return (
    <PageLayout>
      {/* Hero Section */}
      <Section background="cream" padding="xl">
        <Container maxWidth="xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#176B6B] mb-3">
              Curated Collections
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium text-[#1F2937] tracking-tight leading-[1.1] mb-6">
              Finds, brought together.
            </h1>
            <p className="text-base sm:text-lg text-[#5B6470] max-w-2xl leading-relaxed">
              Explore collections curated around concepts, aesthetics, occasions, and things genuinely worth finding.
            </p>
          </div>
        </Container>
      </Section>

      {/* Collections Grid */}
      <Section background="sand" padding="xl" className="border-t border-[#EAE6DF]">
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {collectionsList.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group rounded-2xl border border-[#EAE6DF] bg-white p-7 sm:p-9 transition-all duration-300 hover:border-[#176B6B] hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[#176B6B]">
                      Curated Collection
                    </span>
                    <span className="text-xs text-[#7A827D] group-hover:text-[#176B6B] transition-colors">
                      Explore →
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1F2937] group-hover:text-[#176B6B] transition-colors mb-3">
                    {collection.name}
                  </h2>

                  {collection.description && (
                    <p className="text-sm sm:text-base leading-relaxed text-[#5B6470] mb-6">
                      {collection.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#EAE6DF]/70 flex items-center justify-between text-xs font-medium text-[#176B6B]">
                  <span>View Curated Finds</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>

          {collectionsList.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-[#7A827D] mb-4">
                No collections available at this time.
              </p>
              <Link
                href="/finds"
                className="inline-block px-6 py-3 bg-[#176B6B] text-white rounded-full text-sm font-medium"
              >
                Browse All Finds
              </Link>
            </div>
          )}
        </Container>
      </Section>
    </PageLayout>
  );
}
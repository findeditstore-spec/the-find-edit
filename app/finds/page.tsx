import { getProducts } from "../lib/products";
import ProductSearch from "../components/ProductSearch";
import FindsHeader from "../components/FindsHeader";

export default async function FindsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      <FindsHeader />

      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            All Finds
          </p>

          <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl">
            Find something worth finding.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5B6470]">
            Explore everything currently featured on The Find Edit.
          </p>

<ProductSearch products={products} />

        </div>
      </section>
    </main>
  );
}
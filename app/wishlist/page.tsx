import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import WishlistContent from '../components/WishlistContent';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B] mb-4">
                My Wishlist
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-medium text-[#1F2937] mb-6 tracking-tight">
                My Saved Finds
              </h1>
              <p className="text-lg text-[#5B6470] max-w-2xl leading-relaxed">
                Keep track of products you love and return to them anytime.
              </p>
            </div>

            <WishlistContent />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1F2937] text-white mt-auto">
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col mb-4">
              <span className="text-2xl font-bold tracking-tight text-[#C9A86A]">TFE</span>
              <span className="text-xs tracking-widest uppercase text-gray-400">The Find Edit</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover, compare, and shop smarter. Curated finds for a better you.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h3>
            <nav className="space-y-3">
              <Link href="/finds" className="block text-sm text-gray-400 hover:text-white transition-colors">
                All Finds
              </Link>
              <Link href="/trending" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Trending
              </Link>
              <Link href="/collections" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Collections
              </Link>
              <Link href="/fashion" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Fashion
              </Link>
              <Link href="/beauty" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Beauty
              </Link>
              <Link href="/creator-tech" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Creator Tech
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <nav className="space-y-3">
              <Link href="/about" className="block text-sm text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/how-it-works" className="block text-sm text-gray-400 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
            <nav className="space-y-3">
              <Link href="/privacy" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/affiliate-disclosure" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Affiliate Disclosure
              </Link>
              <Link href="/admin/login" className="block text-xs text-gray-500 hover:text-gray-400 transition-colors mt-4 pt-3 border-t border-gray-700">
                Admin
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} The Find Edit. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Discover • Compare • Shop Smarter
          </p>
        </div>
      </div>
    </footer>
  );
}

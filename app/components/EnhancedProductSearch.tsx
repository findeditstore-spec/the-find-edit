"use client";

import { useState, useMemo } from 'react';
import StandardProductCard from './product-cards/StandardProductCard';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  price: string;
  store: string;
  category: string;
  subcategory: string;
  featured?: boolean | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EnhancedProductSearchProps {
  products: Product[];
  categories: Category[];
}

export default function EnhancedProductSearch({ products, categories }: EnhancedProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'price-low' | 'price-high'>('newest');

  // Get unique stores for filtering
  const stores = useMemo(() => {
    const storeSet = new Set(products.map(p => p.store));
    return Array.from(storeSet).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query) ||
        product.store.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'newest':
      default:
        // Already sorted by created_at desc from server
        break;
    }

    return sorted;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-12">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search products, brands or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 bg-white border-2 border-[#EAE6DF] rounded-full text-[#1F2937] placeholder:text-[#7A827D] focus:outline-none focus:border-[#176B6B] transition-colors"
            />
            <svg
              className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A827D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#176B6B] text-white'
                  : 'bg-white border border-[#EAE6DF] text-[#5B6470] hover:border-[#176B6B]'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-[#176B6B] text-white'
                    : 'bg-white border border-[#EAE6DF] text-[#5B6470] hover:border-[#176B6B]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white border border-[#EAE6DF] rounded-full text-sm text-[#5B6470] focus:outline-none focus:border-[#176B6B] cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-[#7A827D]">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'find' : 'finds'}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <StandardProductCard key={product.id} product={product} showBadge={!!product.featured} />
          ))}
        </div>
      ) : (
        // No Results
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#F4F0E9] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#7A827D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
              No finds match your search
            </h3>
            <p className="text-[#5B6470] mb-8">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="inline-block px-6 py-3 bg-[#176B6B] text-white rounded-full font-medium hover:bg-[#125858] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

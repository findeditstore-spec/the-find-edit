"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
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
  created_at?: string;
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
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'name-desc' | 'price-low' | 'price-high'>('newest');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive sorted list of unique, non-empty stores from products (or products in selected category)
  const availableStores = useMemo(() => {
    const storeSet = new Set<string>();
    products.forEach(p => {
      if (selectedCategory === 'all' || p.category === selectedCategory) {
        if (p.store && typeof p.store === 'string') {
          const trimmed = p.store.trim();
          if (trimmed) {
            storeSet.add(trimmed);
          }
        }
      }
    });
    return Array.from(storeSet).sort((a, b) => a.localeCompare(b));
  }, [products, selectedCategory]);

  // Derive subcategories available for the currently selected category
  const categorySubcategories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => {
      if (selectedCategory === 'all' || p.category === selectedCategory) {
        if (p.subcategory && typeof p.subcategory === 'string') {
          const trimmed = p.subcategory.trim();
          if (trimmed) {
            const lower = trimmed.toLowerCase();
            if (!map.has(lower)) {
              map.set(lower, trimmed);
            }
          }
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }, [products, selectedCategory]);

  // Ensure changing category or stores resets invalid subcategory selections
  useEffect(() => {
    if (selectedSubcategory !== 'all') {
      const exists = categorySubcategories.some(
        sub => sub.trim().toLowerCase() === selectedSubcategory.trim().toLowerCase()
      );
      if (!exists) {
        setSelectedSubcategory('all');
      }
    }
  }, [selectedCategory, categorySubcategories, selectedSubcategory]);

  // Toggle store selection
  const handleStoreToggle = (storeName: string) => {
    setSelectedStores(prev => {
      if (prev.includes(storeName)) {
        return prev.filter(s => s !== storeName);
      } else {
        return [...prev, storeName];
      }
    });
  };

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

    // Subcategory filter (case-insensitively, ignoring surrounding whitespace)
    if (selectedSubcategory !== 'all') {
      const targetSub = selectedSubcategory.trim().toLowerCase();
      filtered = filtered.filter(product => {
        if (!product.subcategory) return false;
        return product.subcategory.trim().toLowerCase() === targetSub;
      });
    }

    // Store filter (multiple stores)
    if (selectedStores.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.store) return false;
        return selectedStores.some(s => s.trim().toLowerCase() === product.store.trim().toLowerCase());
      });
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-low':
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'oldest':
        sorted.sort((a, b) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return timeA - timeB;
        });
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return timeB - timeA;
        });
        break;
    }

    return sorted;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, selectedStores, sortBy]);

  const activeFiltersCount = (selectedSubcategory !== 'all' ? 1 : 0) + selectedStores.length + (sortBy !== 'newest' ? 1 : 0);

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

        {/* Filters Container */}
        <div className="flex flex-col gap-4">
          {/* Category Pills & Advanced Filter & Sort Button Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
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

            {/* Filter & Sort Controls Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 border transition-colors ${
                  activeFiltersCount > 0
                    ? 'bg-[#176B6B] border-[#176B6B] text-white'
                    : 'bg-white border-[#EAE6DF] text-[#5B6470] hover:border-[#176B6B]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filter & Sort</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-white text-[#176B6B] rounded-full text-xs font-bold flex items-center justify-center ml-1">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {filterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#EAE6DF] rounded-2xl shadow-xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF] mb-4">
                    <h4 className="font-serif font-medium text-[#1F2937] text-lg">Filter & Sort</h4>
                    <button
                      onClick={() => {
                        setSelectedSubcategory('all');
                        setSelectedStores([]);
                        setSortBy('newest');
                      }}
                      className="text-xs font-medium text-[#176B6B] hover:underline"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Sort Options */}
                  <div className="mb-5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A827D] mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#EAE6DF] rounded-xl text-sm text-[#5B6470] focus:outline-none focus:border-[#176B6B] cursor-pointer"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A–Z</option>
                      <option value="name-desc">Name: Z–A</option>
                    </select>
                  </div>

                  {/* Store Filter */}
                  {availableStores.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7A827D]">
                          Filter by Store ({selectedStores.length === 0 ? 'All' : selectedStores.length})
                        </label>
                        {selectedStores.length > 0 && (
                          <button
                            onClick={() => setSelectedStores([])}
                            className="text-xs text-[#176B6B] hover:underline"
                          >
                            Clear stores
                          </button>
                        )}
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                        <label className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#F4F0E9]/50 cursor-pointer text-sm text-[#1F2937]">
                          <input
                            type="checkbox"
                            checked={selectedStores.length === 0}
                            onChange={() => setSelectedStores([])}
                            className="rounded border-[#EAE6DF] text-[#176B6B] focus:ring-[#176B6B]"
                          />
                          <span className="font-medium">All stores</span>
                        </label>
                        {availableStores.map(store => (
                          <label key={store} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#F4F0E9]/50 cursor-pointer text-sm text-[#5B6470]">
                            <input
                              type="checkbox"
                              checked={selectedStores.includes(store)}
                              onChange={() => handleStoreToggle(store)}
                              className="rounded border-[#EAE6DF] text-[#176B6B] focus:ring-[#176B6B]"
                            />
                            <span>{store}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#EAE6DF] mt-4 flex justify-end">
                    <button
                      onClick={() => setFilterDropdownOpen(false)}
                      className="px-4 py-2 bg-[#176B6B] text-white rounded-xl text-sm font-medium hover:bg-[#125858] transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subcategory Filter Pills */}
          {categorySubcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-[#EAE6DF]/60">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A827D] mr-2">Subcategories:</span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedSubcategory === 'all'
                    ? 'bg-[#1F2937] text-white'
                    : 'bg-white border border-[#EAE6DF] text-[#5B6470] hover:border-[#1F2937]'
                }`}
              >
                All subcategories
              </button>
              {categorySubcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedSubcategory.trim().toLowerCase() === sub.trim().toLowerCase()
                      ? 'bg-[#1F2937] text-white'
                      : 'bg-white border border-[#EAE6DF] text-[#5B6470] hover:border-[#1F2937]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Active Store Pills Banner if any stores selected */}
          {selectedStores.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center pt-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A827D] mr-2">Active Stores:</span>
              {selectedStores.map(store => (
                <span
                  key={store}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#176B6B]/10 text-[#176B6B] border border-[#176B6B]/20"
                >
                  {store}
                  <button
                    onClick={() => handleStoreToggle(store)}
                    className="hover:text-[#125858] font-bold ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setSelectedStores([])}
                className="text-xs text-[#7A827D] hover:text-[#1F2937] underline ml-1"
              >
                Clear stores
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#7A827D]">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'find' : 'finds'}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedStores.length > 0 && ` from ${selectedStores.length} store${selectedStores.length === 1 ? '' : 's'}`}
        </p>
        {(searchQuery || selectedSubcategory !== 'all' || selectedStores.length > 0 || sortBy !== 'newest') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubcategory('all');
              setSelectedStores([]);
              setSortBy('newest');
            }}
            className="text-xs font-medium text-[#176B6B] hover:underline"
          >
            Clear all filters
          </button>
        )}
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
                setSelectedSubcategory('all');
                setSelectedStores([]);
                setSortBy('newest');
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

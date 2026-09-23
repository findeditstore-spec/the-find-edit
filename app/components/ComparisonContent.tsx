"use client";

import { useComparison } from '../lib/comparison-context';
import Link from 'next/link';
import { useState } from 'react';

export default function ComparisonContent() {
  const { comparedProducts, removeFromComparison, clearComparison } = useComparison();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (comparedProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-[#F4F0E9] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#7A827D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#1F2937] mb-4">
            No products to compare
          </h3>
          <p className="text-[#5B6470] mb-8">
            Add products from any page to compare them side by side.
          </p>
          <Link
            href="/finds"
            className="inline-block px-8 py-4 bg-[#176B6B] text-white rounded-full font-medium hover:bg-[#125858] transition-colors"
          >
            Explore Finds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-[#7A827D]">
          Comparing {comparedProducts.length} {comparedProducts.length === 1 ? 'product' : 'products'}
        </p>
        {comparedProducts.length > 0 && (
          <button
            onClick={clearComparison}
            className="text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Comparison Table - Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-48 text-left p-4 border-b-2 border-[#EAE6DF]">
                <span className="text-xs font-medium uppercase tracking-wider text-[#7A827D]">
                  Field
                </span>
              </th>
              {comparedProducts.map(product => (
                <th key={product.id} className="p-4 border-b-2 border-[#EAE6DF]">
                  <div className="text-center">
                    <div className="aspect-square w-32 mx-auto mb-4 rounded-lg overflow-hidden bg-[#F4F0E9]">
                      <img
                        src={imageErrors[product.id] ? 'https://placehold.co/400x400/F4F0E9/7A827D?text=No+Image' : product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [product.id]: true }))}
                      />
                    </div>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="text-xs text-[#DC2626] hover:text-[#B91C1C] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-[#EAE6DF] text-sm font-medium text-[#5B6470]">
                Product Name
              </td>
              {comparedProducts.map(product => (
                <td key={product.id} className="p-4 border-b border-[#EAE6DF] text-center">
                  <Link href={`/products/${product.id}`} className="font-medium text-[#1F2937] hover:text-[#176B6B] transition-colors">
                    {product.name}
                  </Link>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-[#EAE6DF] text-sm font-medium text-[#5B6470]">
                Category
              </td>
              {comparedProducts.map(product => (
                <td key={product.id} className="p-4 border-b border-[#EAE6DF] text-center text-[#5B6470]">
                  {product.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-[#EAE6DF] text-sm font-medium text-[#5B6470]">
                Price
              </td>
              {comparedProducts.map(product => (
                <td key={product.id} className="p-4 border-b border-[#EAE6DF] text-center">
                  <span className="text-lg font-semibold text-[#176B6B]">{product.price}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-[#EAE6DF] text-sm font-medium text-[#5B6470]">
                Store
              </td>
              {comparedProducts.map(product => (
                <td key={product.id} className="p-4 border-b border-[#EAE6DF] text-center text-[#5B6470]">
                  {product.store}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comparison Cards - Mobile */}
      <div className="lg:hidden space-y-6">
        {comparedProducts.map(product => (
          <div key={product.id} className="bg-white border border-[#EAE6DF] rounded-2xl p-6">
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[#F4F0E9]">
                <img
                  src={imageErrors[product.id] ? 'https://placehold.co/200x200/F4F0E9/7A827D?text=No+Image' : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageErrors(prev => ({ ...prev, [product.id]: true }))}
                />
              </div>
              <div className="flex-1">
                <Link href={`/products/${product.id}`} className="font-serif text-xl font-medium text-[#1F2937] hover:text-[#176B6B] transition-colors block mb-2">
                  {product.name}
                </Link>
                <p className="text-sm text-[#7A827D] mb-2">{product.category}</p>
                <p className="text-lg font-semibold text-[#176B6B]">{product.price}</p>
              </div>
            </div>
            <div className="border-t border-[#EAE6DF] pt-4">
              <p className="text-sm text-[#5B6470] mb-3">
                Available at <span className="font-medium text-[#1F2937]">{product.store}</span>
              </p>
              <button
                onClick={() => removeFromComparison(product.id)}
                className="text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors"
              >
                Remove from Comparison
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

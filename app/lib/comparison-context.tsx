"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: string;
  slug?: string;
  name: string;
  image: string;
  price: string;
  store: string;
  category: string;
}

interface ComparisonContextType {
  comparedProducts: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'tfe_comparison';
const MAX_COMPARE = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setComparedProducts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load comparison:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparedProducts));
    }
  }, [comparedProducts, isClient]);

  const addToComparison = (product: Product) => {
    setComparedProducts(prev => {
      if (prev.length >= MAX_COMPARE) {
        alert(`You can compare up to ${MAX_COMPARE} products at once`);
        return prev;
      }
      if (prev.some(p => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setComparedProducts([]);
  };

  const isInComparison = (productId: string) => {
    return comparedProducts.some(p => p.id === productId);
  };

  return (
    <ComparisonContext.Provider value={{
      comparedProducts,
      addToComparison,
      removeFromComparison,
      clearComparison,
      isInComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
}

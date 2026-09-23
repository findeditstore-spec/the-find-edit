"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  savedProducts: string[];
  toggleSaved: (productId: string) => void;
  isSaved: (productId: string) => boolean;
  clearAll: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'tfe_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedProducts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load wishlist:', e);
      }
    }
  }, []);

  // Save to localStorage whenever savedProducts changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProducts));
    }
  }, [savedProducts, isClient]);

  const toggleSaved = (productId: string) => {
    setSavedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isSaved = (productId: string) => {
    return savedProducts.includes(productId);
  };

  const clearAll = () => {
    setSavedProducts([]);
  };

  return (
    <WishlistContext.Provider value={{ savedProducts, toggleSaved, isSaved, clearAll }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { getProductById, type Product } from '../data/catalog';

interface RecentlyViewedValue {
  recentlyViewed: Product[];
  addRecentlyViewed: (productId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedValue | undefined>(undefined);

const MAX_ITEMS = 12;

/** Session store of products the user has opened, most recent first. */
export function RecentlyViewedProvider({ children }: PropsWithChildren) {
  const [ids, setIds] = useState<string[]>([]);

  const addRecentlyViewed = useCallback((productId: string) => {
    setIds(prev => [productId, ...prev.filter(id => id !== productId)].slice(0, MAX_ITEMS));
  }, []);

  const recentlyViewed = useMemo(
    () =>
      ids
        .map(getProductById)
        .filter((product): product is Product => product !== undefined),
    [ids],
  );

  const value = useMemo(
    () => ({ recentlyViewed, addRecentlyViewed }),
    [recentlyViewed, addRecentlyViewed],
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed(): RecentlyViewedValue {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}

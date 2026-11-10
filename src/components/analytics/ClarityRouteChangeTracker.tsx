'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Microsoft Clarity Route Change Tracker
 * Accurately syncs client-side SPA route transitions with Microsoft Clarity sessions
 */
export function ClarityRouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
      const queryString = searchParams?.toString();
      const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
      // Tag current page view in Clarity recording session
      window.clarity('set', 'page_path', fullPath);
      window.clarity('event', 'page_view');
    }
  }, [pathname, searchParams]);

  return null;
}


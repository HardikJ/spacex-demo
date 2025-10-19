'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Launch } from '@/types';
import { LaunchCard } from './LaunchCard';
import { Loader } from 'lucide-react';

interface InfiniteScrollProps {
  launches: Launch[];
  hasMore: boolean;
  onLoadMore: () => void;
  loadFavoriteCount: () => void;
  isLoading?: boolean;
  viewMode: 'grid' | 'list';
}

export function InfiniteScroll({
  launches,
  hasMore,
  onLoadMore,
  loadFavoriteCount,
  isLoading = false,
  viewMode,
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleIntersection]);

  const gridClass =
    viewMode === 'grid'
      ? 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'space-y-4 max-w-4xl mx-auto';

  return (
    <div>
      <div className={gridClass}>
        {launches.map((launch, index) => (
          <div key={index}>
            <LaunchCard launch={launch} loadFavoriteCount={loadFavoriteCount} />
          </div>
        ))}
      </div>

      {/* Intersection Observer Target */}
      <div ref={observerTarget} className="mt-16 flex justify-center py-8">
        {hasMore && !isLoading && (
          <p className="text-slate-400 text-sm">Scroll to load more launches...</p>
        )}
        {isLoading && (
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-6 h-6 text-blue-400 animate-spin" />
            <span className="text-slate-400 text-sm">Loading more launches...</span>
          </div>
        )}
        {!hasMore && launches.length > 0 && (
          <div className="text-center">
            <p className="text-slate-400 text-sm font-medium">You've reached the end!</p>
            <p className="text-slate-500 text-xs mt-1">No more launches to load</p>
          </div>
        )}
      </div>
    </div>
  );
}
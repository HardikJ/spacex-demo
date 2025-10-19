'use client';

import { useState, useEffect } from "react";
import { ViewMode } from "@/types";
import { SearchHeader } from "@/components/SearchHeader";
import { ViewToggle } from "@/components/ViewToggle";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { LoadingSkeletons } from "@/components/LoadingSkeletons";
import { Heart, Rocket } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { fetchLaunches, setFilters } from "@/redux/slices/launchesSlice";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { launches, loading, error, filters, hasMore, totalCount, page } = useSelector(
    (state: RootState) => state.launches
  );

  const [favoriteCount, setFavoriteCount] = useState(0);

  const loadFavoriteCount = () => {
    try {
      const stored = localStorage.getItem("spacex_favorites");
      if (stored) {
        const favorites = JSON.parse(stored);
        setFavoriteCount(favorites.length);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };
  
  // Initial load on mount
  useEffect(() => {
    setMounted(true);


    loadFavoriteCount();
    window.addEventListener("storage", loadFavoriteCount);

    // Load first page of launches
    if (launches.length === 0) {
      dispatch(fetchLaunches({ page: 1 }));
    }

    return () => window.removeEventListener("storage", loadFavoriteCount);
  }, [dispatch, launches.length]);

  // Load more launches for infinite scroll
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchLaunches({ page })); // `page` is managed in slice
    }
  };

  // Update filters
  const handleFilterChange = (newFilters: typeof filters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchLaunches({ page: 1 })); // fetch first page with new filters
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Rocket className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  SpaceX Launches
                </h1>
                <p className="text-base text-gray-400 mt-2">
                  Explore all SpaceX missions and launches
                </p>
              </div>
            </div>

            {/* Favorites Button */}
            <Link
              href="/favorites"
              className="group relative inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50"
            >
              <Heart
                size={24}
                className="fill-white text-white transition-transform group-hover:scale-110"
              />
              

              {/* Badge for favorites count */}
              {favoriteCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-700 shadow-lg">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        {!error && (
          <div className="mb-8">
            <SearchHeader
              filters={filters}
              onFilterChange={handleFilterChange}
              totalCount={totalCount}
            />
          </div>
        )}

        {/* View Toggle */}
        <div className="mb-8 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="font-semibold text-blue-400">{launches.length}</span>{" "}
            Results
          </div>
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Content */}
        {error ? (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-8 text-center backdrop-blur-sm">
            <p className="text-lg font-semibold text-red-400 mb-2">
              Failed to load launches
            </p>
            <p className="text-red-300">{error}</p>
          </div>
        ) : loading && launches.length === 0 ? (
          <LoadingSkeletons />
        ) : launches.length === 0 ? (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-8 text-center backdrop-blur-sm">
            <p className="text-lg font-semibold text-yellow-400 mb-2">
              No launches found
            </p>
            <p className="text-yellow-300">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <InfiniteScroll
            launches={launches}
            hasMore={hasMore}
            loadFavoriteCount={loadFavoriteCount}
            onLoadMore={handleLoadMore}
            viewMode={viewMode}
            isLoading={loading}
          />
        )}
      </div>
    </main>
  );
}

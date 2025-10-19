"use client";

import { useEffect, useState } from "react";
import { Launch } from "@/types";
import { formatDate, formatTime } from "@/lib/api";
import {
  Rocket,
  MapPin,
  Calendar,
  Heart,
  Trash2,
  X,
  ArrowLeft,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Launch[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteCount, setDeleteCount] = useState(0);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem("spacex_favorites");
        if (stored) {
          const favs = JSON.parse(stored);
          setFavorites(favs);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(favorites.map((f) => f.flight_number));
      setSelectedIds(allIds);
      setSelectAll(true);
    }
  };

  // Handle individual selection
  const handleSelectFavorite = (flightNumber: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(flightNumber)) {
      newSelected.delete(flightNumber);
    } else {
      newSelected.add(flightNumber);
    }
    setSelectedIds(newSelected);
    setSelectAll(newSelected.size === favorites.length && favorites.length > 0);
  };

  // Remove single favorite
  const removeFavorite = (flightNumber: number) => {
    const updated = favorites.filter((f) => f.flight_number !== flightNumber);
    setFavorites(updated);
    localStorage.setItem("spacex_favorites", JSON.stringify(updated));

    const newSelected = new Set(selectedIds);
    newSelected.delete(flightNumber);
    setSelectedIds(newSelected);
    setSelectAll(false);
  };

  // Bulk remove selected favorites
  const bulkRemoveFavorites = () => {
    const updated = favorites.filter((f) => !selectedIds.has(f.flight_number));
    setFavorites(updated);
    localStorage.setItem("spacex_favorites", JSON.stringify(updated));
    setSelectedIds(new Set());
    setSelectAll(false);
    setShowConfirmDelete(false);
  };

  // Handle bulk delete click
  const handleBulkDelete = () => {
    setDeleteCount(selectedIds.size);
    setShowConfirmDelete(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-white text-xl">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 opacity-20 absolute inset-0" />
        <div className="relative px-6 sm:px-12 py-12">
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
              <Heart className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                My Favorites
              </h1>
              <p className="text-slate-400 mt-1">
                {favorites.length}{" "}
                {favorites.length === 1 ? "launch" : "launches"} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 mx-auto">
        {favorites.length === 0 ? (
          <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-12 text-center backdrop-blur-sm">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-300 mb-2">
              No favorites yet
            </p>
            <p className="text-slate-400 mb-6">
              Add launches to your favorites to see them here
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Browse Launches
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bulk Actions Toolbar */}
            {selectedIds.size > 0 && (
              <div className="bg-slate-800 border-2 border-blue-500/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-blue-600 rounded-full text-white font-semibold text-sm">
                      {selectedIds.size} selected
                    </div>
                    <p className="text-slate-300 text-sm">
                      {selectedIds.size === favorites.length
                        ? "All favorites selected"
                        : `${selectedIds.size} of ${favorites.length} selected`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedIds(new Set());
                        setSelectAll(false);
                      }}
                      className="px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm"
                    >
                      Deselect All
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                      <Trash2 size={16} />
                      Remove {selectedIds.size}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Select All Checkbox and Controls */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectAll
                        ? "bg-blue-600 border-blue-600"
                        : "border-slate-600 hover:border-blue-500"
                    }`}
                  >
                    {selectAll && <Check size={16} className="text-white" />}
                  </button>
                  <label className="text-slate-300 cursor-pointer font-medium">
                    Select All ({favorites.length})
                  </label>
                </div>
                <p className="text-slate-400 text-sm">
                  Click cards to select individual favorites
                </p>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((launch) => {
                const isSelected = selectedIds.has(launch.flight_number);
                const statusColor = launch.upcoming
                  ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
                  : launch.success
                  ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                  : "border-red-500/30 bg-red-500/5 hover:bg-red-500/10";

                const statusBadgeColor = launch.upcoming
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : launch.success
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30";

                const statusText = launch.upcoming
                  ? "Upcoming"
                  : launch.success
                  ? "Success"
                  : "Failed";

                return (
                  <div
                    key={launch.flight_number}
                    className={`relative rounded-lg border-2 transition-all duration-200 ${statusColor} ${
                      isSelected
                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900"
                        : ""
                    }`}
                  >
                    {/* Selection Checkbox */}

                    {/* Remove Button */}

                    {/* Card Link */}
                    <Link
                      href={`/${launch.flight_number}`}
                      onClick={() => {
                        localStorage.setItem(
                          `launch_${launch.flight_number}`,
                          JSON.stringify(launch)
                        );
                      }}
                    >
                      <div className="p-6 cursor-pointer">
                        {/* Header */}
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {launch.mission_patch?.small && (
                              <img
                                src={launch.mission_patch.small}
                                alt={launch.mission_name}
                                className="h-12 w-12 rounded-full object-cover flex-shrink-0 border-2 border-slate-700"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base font-bold text-white truncate">
                                {launch.mission_name}
                              </h3>
                              <p className="text-xs text-slate-400">
                                Flight #{launch.flight_number}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0 ${statusBadgeColor}`}
                          >
                            {statusText}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                              <Rocket size={16} className="text-blue-400" />
                            </div>
                            <span className="text-sm text-slate-300 truncate">
                              {launch.rocket.rocket_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                              <MapPin size={16} className="text-green-400" />
                            </div>
                            <span className="text-sm text-slate-300 truncate">
                              {launch.launch_site.site_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                              <Calendar size={16} className="text-purple-400" />
                            </div>
                            <div className="text-sm min-w-0 flex-1">
                              <span className="font-medium text-slate-200 block">
                                {formatDate(launch.launch_date_utc)}
                              </span>
                              <span className="text-slate-400 text-xs">
                                {formatTime(launch.launch_date_utc)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 justify-end w-full">
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default link behavior
                              e.stopPropagation(); // Stop the click from reaching the Link
                              removeFavorite(launch.flight_number);
                            }}
                            className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all z-10"
                            title="Remove from favorites"
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectFavorite(launch.flight_number);
                            }}
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all z-10 ${
                              isSelected
                                ? "bg-blue-600 border-blue-600"
                                : "border-slate-500 hover:border-blue-500 bg-slate-800/50"
                            }`}
                          >
                            {isSelected && (
                              <Check size={16} className="text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 sm:p-8 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-600/20 rounded-lg">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">
                Remove Favorites?
              </h2>
            </div>
            <p className="text-slate-300 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold">{deleteCount}</span>{" "}
              {deleteCount === 1 ? "favorite" : "favorites"}? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={bulkRemoveFavorites}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

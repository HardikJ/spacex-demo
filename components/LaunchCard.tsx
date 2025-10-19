'use client';

import { Launch } from '@/types';
import { formatDate, formatTime } from '@/lib/api';
import { Rocket, MapPin, Calendar, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LaunchCardProps {
  launch: Launch;
  loadFavoriteCount: () => void;
}

export function LaunchCard({ launch, loadFavoriteCount }: LaunchCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load favorite status on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('spacex_favorites');
    if (stored) {
      try {
        const favorites: Launch[] = JSON.parse(stored);
        const isFav = favorites.some(f => f.flight_number === launch.flight_number);
        setIsFavorite(isFav);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
  }, [launch.flight_number]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem('spacex_favorites');
      let favorites: Launch[] = stored ? JSON.parse(stored) : [];

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(f => f.flight_number !== launch.flight_number);
      } else {
        // Add to favorites
        const exists = favorites.some(f => f.flight_number === launch.flight_number);
        if (!exists) {
          favorites.push(launch);
        }
      }

      localStorage.setItem('spacex_favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
      loadFavoriteCount()
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };

  const statusColor = launch.upcoming
    ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20'
    : launch.success
      ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20'
      : 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20';

  const statusBadgeColor = launch.upcoming
    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    : launch.success
      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      : 'bg-red-500/20 text-red-300 border border-red-500/30';

  const statusBadge = launch.upcoming
    ? 'Upcoming'
    : launch.success
      ? 'Success'
      : 'Failed';

  const handleClick = () => {
    sessionStorage.setItem(`launch_${launch.flight_number}`, JSON.stringify(launch));
  };

  if (!mounted) return null;

  return (
    <Link href={`/${launch.flight_number}`} onClick={handleClick}>
      <div
        className={`rounded-lg border-2 p-5 sm:p-6 transition-all duration-300 cursor-pointer backdrop-blur-sm relative ${statusColor}`}
      >
       
        {/* Header with Mission Info and Status Badge */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {launch.mission_patch?.small && (
              <img
                src={launch.mission_patch.small}
                alt={launch.mission_name}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover flex-shrink-0 border-2 border-slate-700"
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {launch.mission_name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">Flight #{launch.flight_number}</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0 ${statusBadgeColor}`}>
            {statusBadge}
          </span>
           {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="rounded-lg transition-all duration-200"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={20}
            className={`transition-all duration-200 ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400 hover:text-red-400'
            }`}
          />
        </button>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {/* Rocket */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
              <Rocket size={16} className="text-blue-400" />
            </div>
            <span className="text-sm text-slate-300 truncate">{launch.rocket.rocket_name}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
              <MapPin size={16} className="text-green-400" />
            </div>
            <span className="text-sm text-slate-300 truncate">{launch.launch_site.site_name}</span>
          </div>

          {/* Date */}
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
      </div>
    </Link>
  );
}
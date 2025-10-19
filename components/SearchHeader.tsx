'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { FilterState, SortField } from '@/types';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchHeaderProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
}

export function SearchHeader({ filters, onFilterChange, totalCount }: SearchHeaderProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [SortField, 'asc' | 'desc'];
    onFilterChange({ ...filters, sortBy: field, order });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onFilterChange({ ...filters, search: '' });
  };


  return (
   <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
  {/* Search Bar */}
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Search className="text-slate-400" size={20} />
    </div>
    <input
      type="text"
      placeholder="Search missions names"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      className="w-full pl-12 pr-12 py-3 sm:py-2 text-base sm:text-lg bg-slate-800 border-2 border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-500"
    />
    {filters.search && (
      <button
        onClick={handleClearSearch}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <X size={20} />
      </button>
    )}
  </div>

  {/* Sort Dropdown */}
  <div className="flex-shrink-0 w-60">
    <select
      value={filters.sortBy ? `${filters.sortBy}-${filters.order}` : ''}
      onChange={handleSortChange}
      className="w-full px-4 sm:px-5 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg hover:border-blue-500 transition-all font-medium text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239CA3AF' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '36px',
      }}
    >
      <option value="flight_number-asc">Flight # (Low)</option>
      <option value="flight_number-desc">Flight # (High)</option>
      <option value="mission_name-asc">Mission Name A-Z</option>
      <option value="mission_name-desc">Mission Name Z-A</option>
    </select>
  </div>
</div>

  );
}
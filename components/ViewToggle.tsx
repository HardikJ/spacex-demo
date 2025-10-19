'use client';

import { ViewMode } from '@/types';
import { Grid3x3, List } from 'lucide-react';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
          currentView === 'grid'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Grid3x3 size={18} />
        Grid
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
          currentView === 'list'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <List size={18} />
        List
      </button>
    </div>
  );
}
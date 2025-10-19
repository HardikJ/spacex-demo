// src/types/index.ts

export interface Launch {
  id: string;
  flight_number: number;
  mission_name: string;
  launch_date_utc: string;
  rocket: {
    rocket_id: string;
    rocket_name: string;
  };
  launch_site: {
    site_name: string;
  };
  mission_patch: {
    small: string;
  } | null;
  success: boolean | null;
  upcoming: boolean;
}

export type ViewMode = 'grid' | 'list';

export type SortField =  'flight_number' | 'mission_name'; // can add more fields
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  order: SortOrder;
}
export type FilterStatus = 'all' | 'success' | 'failed' | 'upcoming';

export interface FilterState {
  search: string;
  sortBy: SortField;
  order: SortOrder
}
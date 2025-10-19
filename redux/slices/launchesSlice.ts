// store/launchesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Launch, FilterState } from '@/types';

const ITEMS_PER_PAGE = 12;

interface LaunchesState {
  launches: Launch[];
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  page: number;
  filters: FilterState;
}

const initialState: LaunchesState = {
  launches: [],
  totalCount: 0,
  hasMore: true,
  loading: false,
  error: null,
  page: 1,
  filters: {
    search: '',
    sortBy: 'mission_name',
    order: 'asc',
  },
};

// Async thunk for fetching launches
export const fetchLaunches = createAsyncThunk<
  { launches: Launch[]; total: number; hasMore: boolean },
  { page?: number }
>(
  'launches/fetchLaunches',
  async ({ page = 1 }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { launches: LaunchesState };
      const { filters } = state.launches;

      const params = new URLSearchParams({
        page: page.toString(),
        offset: ((page - 1) * ITEMS_PER_PAGE).toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: filters.search,
        sortBy: filters.sortBy,
        order: filters.order,
      });

      const response = await fetch(`/api/launches?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch launches');
      }

      const data = await response.json();

      return {
        launches: data.launches,
        total: data.total,
        hasMore: data.hasMore,
      };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

const launchesSlice = createSlice({
  name: 'launches',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<FilterState>) {
      state.filters = action.payload;
      state.page = 1;
      state.launches = [];
      state.hasMore = true;
    },
    resetLaunches(state) {
      state.launches = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        state.loading = false;
        state.launches = state.page === 1 ? action.payload.launches : [...state.launches, ...action.payload.launches];
        state.totalCount = action.payload.total;
        state.hasMore = action.payload.hasMore;
        state.page += 1;
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetLaunches } = launchesSlice.actions;
export default launchesSlice.reducer;

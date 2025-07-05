import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  destination: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  budget?: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripFilters {
  status: 'all' | 'planning' | 'active' | 'completed' | 'cancelled';
  dateRange?: {
    start: string;
    end: string;
  };
  search: string;
  sortBy: 'created_at' | 'start_date' | 'title';
  sortOrder: 'asc' | 'desc';
}

interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  filters: TripFilters;
  lastFetch: number | null;
}

const initialState: TripsState = {
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  lastFetch: null,
};

// Async thunks (these will be replaced with RTK Query later)
export const fetchTripsAsync = createAsyncThunk(
  'trips/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const trips = await tripsApi.getTrips();
      // return trips;
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trips');
    }
  }
);

export const createTripAsync = createAsyncThunk(
  'trips/createTrip',
  async (tripData: Partial<Trip>, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const trip = await tripsApi.createTrip(tripData);
      // return trip;
      const newTrip: Trip = {
        id: Date.now().toString(),
        user_id: 'current-user',
        title: tripData.title || 'New Trip',
        destination: tripData.destination || '',
        start_date: tripData.start_date || new Date().toISOString(),
        end_date: tripData.end_date || new Date().toISOString(),
        status: 'planning',
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...tripData,
      };
      return newTrip;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create trip');
    }
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setCurrentTrip: (state, action: PayloadAction<Trip | null>) => {
      state.currentTrip = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<TripFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTrip: (state, action: PayloadAction<{ id: string; updates: Partial<Trip> }>) => {
      const { id, updates } = action.payload;
      const tripIndex = state.trips.findIndex(trip => trip.id === id);
      if (tripIndex !== -1) {
        state.trips[tripIndex] = { ...state.trips[tripIndex], ...updates };
      }
      if (state.currentTrip?.id === id) {
        state.currentTrip = { ...state.currentTrip, ...updates };
      }
    },
    removeTrip: (state, action: PayloadAction<string>) => {
      const tripId = action.payload;
      state.trips = state.trips.filter(trip => trip.id !== tripId);
      if (state.currentTrip?.id === tripId) {
        state.currentTrip = null;
      }
    },
    clearTrips: (state) => {
      state.trips = [];
      state.currentTrip = null;
      state.lastFetch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trips
      .addCase(fetchTripsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTripsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trips = action.payload;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchTripsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create trip
      .addCase(createTripAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTripAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trips.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTripAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentTrip,
  updateFilters,
  clearError,
  updateTrip,
  removeTrip,
  clearTrips,
} = tripsSlice.actions;

export default tripsSlice.reducer;
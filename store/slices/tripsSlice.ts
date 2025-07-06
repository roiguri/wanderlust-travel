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
  image_url?: string;
  attractions_count?: number;
  days_count?: number;
}

export interface CreateTripData {
  title: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  is_public?: boolean;
}

export interface TripFilters {
  status: 'all' | 'planning' | 'active' | 'completed' | 'cancelled';
  dateRange?: {
    start: string;
    end: string;
  };
  search: string;
  sortBy: 'created_at' | 'start_date' | 'title' | 'destination';
  sortOrder: 'asc' | 'desc';
}

interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  filters: TripFilters;
  lastFetch: number | null;
  searchQuery: string;
  selectedTripIds: string[];
}

const initialState: TripsState = {
  trips: [],
  currentTrip: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  filters: {
    status: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  lastFetch: null,
  searchQuery: '',
  selectedTripIds: [],
};

// Mock data for development
const mockTrips: Trip[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'Tokyo Adventure',
    description: 'Exploring the vibrant culture and cuisine of Japan',
    destination: 'Tokyo, Japan',
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    start_date: '2024-03-15',
    end_date: '2024-03-22',
    status: 'planning',
    budget: 3500,
    is_public: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    image_url: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    attractions_count: 12,
    days_count: 7,
  },
  {
    id: '2',
    user_id: 'user1',
    title: 'European Grand Tour',
    description: 'A classic journey through Europe\'s most beautiful cities',
    destination: 'Paris, Rome, Barcelona',
    start_date: '2024-06-01',
    end_date: '2024-06-21',
    status: 'planning',
    budget: 5200,
    is_public: true,
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-20T09:15:00Z',
    image_url: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=800',
    attractions_count: 25,
    days_count: 21,
  },
  {
    id: '3',
    user_id: 'user1',
    title: 'Bali Retreat',
    description: 'Relaxation and spiritual journey in paradise',
    destination: 'Bali, Indonesia',
    start_date: '2024-02-10',
    end_date: '2024-02-20',
    status: 'completed',
    budget: 2800,
    is_public: false,
    created_at: '2023-12-01T16:45:00Z',
    updated_at: '2024-02-21T12:00:00Z',
    image_url: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
    attractions_count: 8,
    days_count: 10,
  },
  {
    id: '4',
    user_id: 'user1',
    title: 'New York City Weekend',
    description: 'Quick getaway to the Big Apple',
    destination: 'New York, USA',
    start_date: '2024-01-25',
    end_date: '2024-01-28',
    status: 'active',
    budget: 1200,
    is_public: false,
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-25T08:00:00Z',
    image_url: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    attractions_count: 6,
    days_count: 3,
  },
];

// Async thunks
export const fetchTripsAsync = createAsyncThunk(
  'trips/fetchTrips',
  async (params: { refresh?: boolean } = {}, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/trips');
      // const trips = await response.json();
      
      return mockTrips;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trips');
    }
  }
);

export const createTripAsync = createAsyncThunk(
  'trips/createTrip',
  async (tripData: CreateTripData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newTrip: Trip = {
        id: Date.now().toString(),
        user_id: 'user1',
        title: tripData.title,
        description: tripData.description,
        destination: tripData.destination,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        status: 'planning',
        budget: tripData.budget,
        is_public: tripData.is_public || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image_url: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
        attractions_count: 0,
        days_count: Math.ceil((new Date(tripData.end_date).getTime() - new Date(tripData.start_date).getTime()) / (1000 * 60 * 60 * 24)),
      };
      
      return newTrip;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create trip');
    }
  }
);

export const updateTripAsync = createAsyncThunk(
  'trips/updateTrip',
  async ({ id, updates }: { id: string; updates: Partial<Trip> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return { id, updates: { ...updates, updated_at: new Date().toISOString() } };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update trip');
    }
  }
);

export const deleteTripAsync = createAsyncThunk(
  'trips/deleteTrip',
  async (tripId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return tripId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete trip');
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
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filters.search = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    selectTrip: (state, action: PayloadAction<string>) => {
      const tripId = action.payload;
      if (state.selectedTripIds.includes(tripId)) {
        state.selectedTripIds = state.selectedTripIds.filter(id => id !== tripId);
      } else {
        state.selectedTripIds.push(tripId);
      }
    },
    
    selectAllTrips: (state) => {
      state.selectedTripIds = state.trips.map(trip => trip.id);
    },
    
    clearSelection: (state) => {
      state.selectedTripIds = [];
    },
    
    // Optimistic updates
    optimisticCreateTrip: (state, action: PayloadAction<CreateTripData>) => {
      const optimisticTrip: Trip = {
        id: `temp_${Date.now()}`,
        user_id: 'user1',
        title: action.payload.title,
        description: action.payload.description,
        destination: action.payload.destination,
        start_date: action.payload.start_date,
        end_date: action.payload.end_date,
        status: 'planning',
        budget: action.payload.budget,
        is_public: action.payload.is_public || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image_url: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
        attractions_count: 0,
        days_count: Math.ceil((new Date(action.payload.end_date).getTime() - new Date(action.payload.start_date).getTime()) / (1000 * 60 * 60 * 24)),
      };
      
      state.trips.unshift(optimisticTrip);
    },
    
    optimisticUpdateTrip: (state, action: PayloadAction<{ id: string; updates: Partial<Trip> }>) => {
      const { id, updates } = action.payload;
      const tripIndex = state.trips.findIndex(trip => trip.id === id);
      if (tripIndex !== -1) {
        state.trips[tripIndex] = { ...state.trips[tripIndex], ...updates, updated_at: new Date().toISOString() };
      }
      if (state.currentTrip?.id === id) {
        state.currentTrip = { ...state.currentTrip, ...updates, updated_at: new Date().toISOString() };
      }
    },
    
    optimisticDeleteTrip: (state, action: PayloadAction<string>) => {
      const tripId = action.payload;
      state.trips = state.trips.filter(trip => trip.id !== tripId);
      if (state.currentTrip?.id === tripId) {
        state.currentTrip = null;
      }
      state.selectedTripIds = state.selectedTripIds.filter(id => id !== tripId);
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
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createTripAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        
        // Remove optimistic trip and add real trip
        state.trips = state.trips.filter(trip => !trip.id.startsWith('temp_'));
        state.trips.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTripAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
        
        // Remove optimistic trip on failure
        state.trips = state.trips.filter(trip => !trip.id.startsWith('temp_'));
      })
      
      // Update trip
      .addCase(updateTripAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateTripAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { id, updates } = action.payload;
        const tripIndex = state.trips.findIndex(trip => trip.id === id);
        if (tripIndex !== -1) {
          state.trips[tripIndex] = { ...state.trips[tripIndex], ...updates };
        }
        if (state.currentTrip?.id === id) {
          state.currentTrip = { ...state.currentTrip, ...updates };
        }
        state.error = null;
      })
      .addCase(updateTripAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      
      // Delete trip
      .addCase(deleteTripAsync.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteTripAsync.fulfilled, (state, action) => {
        state.isDeleting = false;
        const tripId = action.payload;
        state.trips = state.trips.filter(trip => trip.id !== tripId);
        if (state.currentTrip?.id === tripId) {
          state.currentTrip = null;
        }
        state.selectedTripIds = state.selectedTripIds.filter(id => id !== tripId);
        state.error = null;
      })
      .addCase(deleteTripAsync.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentTrip,
  updateFilters,
  setSearchQuery,
  clearError,
  selectTrip,
  selectAllTrips,
  clearSelection,
  optimisticCreateTrip,
  optimisticUpdateTrip,
  optimisticDeleteTrip,
} = tripsSlice.actions;

export default tripsSlice.reducer;
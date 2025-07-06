import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface TripFormData {
  // Basic Info
  title: string;
  description: string;
  destination: string;
  destinationDetails?: {
    placeId?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address?: string;
    country?: string;
    city?: string;
  };
  
  // Dates
  start_date: string;
  end_date: string;
  
  // Details
  budget?: number;
  currency: string;
  is_public: boolean;
  
  // Media
  cover_image?: {
    uri: string;
    type: string;
    name: string;
  };
  
  // Categories/Tags
  trip_type: 'leisure' | 'business' | 'adventure' | 'cultural' | 'romantic' | 'family' | 'solo';
  tags: string[];
  
  // Advanced
  max_travelers?: number;
  difficulty_level: 'easy' | 'moderate' | 'challenging';
  
  // Draft metadata
  is_draft: boolean;
  draft_saved_at?: string;
}

export interface FormValidationErrors {
  title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  budget?: string;
  cover_image?: string;
  max_travelers?: string;
  general?: string;
}

export interface DestinationSuggestion {
  placeId: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  country: string;
  city: string;
  photoUrl?: string;
}

interface TripFormState {
  // Form data
  formData: TripFormData;
  
  // Form state
  currentStep: number;
  totalSteps: number;
  isValid: boolean;
  errors: FormValidationErrors;
  
  // UI state
  isSubmitting: boolean;
  isSavingDraft: boolean;
  isLoadingDestinations: boolean;
  
  // Destination search
  destinationQuery: string;
  destinationSuggestions: DestinationSuggestion[];
  selectedDestination: DestinationSuggestion | null;
  
  // Draft management
  drafts: TripFormData[];
  lastDraftSave: number | null;
  
  // Image upload
  isUploadingImage: boolean;
  uploadProgress: number;
  
  // Offline support
  pendingSubmissions: TripFormData[];
  isOffline: boolean;
}

const initialFormData: TripFormData = {
  title: '',
  description: '',
  destination: '',
  start_date: '',
  end_date: '',
  currency: 'USD',
  is_public: false,
  trip_type: 'leisure',
  tags: [],
  difficulty_level: 'easy',
  is_draft: false,
};

const initialState: TripFormState = {
  formData: initialFormData,
  currentStep: 1,
  totalSteps: 4,
  isValid: false,
  errors: {},
  isSubmitting: false,
  isSavingDraft: false,
  isLoadingDestinations: false,
  destinationQuery: '',
  destinationSuggestions: [],
  selectedDestination: null,
  drafts: [],
  lastDraftSave: null,
  isUploadingImage: false,
  uploadProgress: 0,
  pendingSubmissions: [],
  isOffline: false,
};

// Mock destination data for development
const mockDestinations: DestinationSuggestion[] = [
  {
    placeId: 'tokyo_japan',
    name: 'Tokyo',
    description: 'Capital of Japan, known for its modern architecture and traditional temples',
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    address: 'Tokyo, Japan',
    country: 'Japan',
    city: 'Tokyo',
    photoUrl: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    placeId: 'paris_france',
    name: 'Paris',
    description: 'City of Light, famous for the Eiffel Tower and romantic atmosphere',
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    address: 'Paris, France',
    country: 'France',
    city: 'Paris',
    photoUrl: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    placeId: 'bali_indonesia',
    name: 'Bali',
    description: 'Indonesian island known for its beaches, temples, and spiritual retreats',
    coordinates: { latitude: -8.3405, longitude: 115.0920 },
    address: 'Bali, Indonesia',
    country: 'Indonesia',
    city: 'Bali',
    photoUrl: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    placeId: 'nyc_usa',
    name: 'New York City',
    description: 'The Big Apple, famous for its skyline, Broadway, and cultural diversity',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    address: 'New York, NY, USA',
    country: 'United States',
    city: 'New York',
    photoUrl: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    placeId: 'london_uk',
    name: 'London',
    description: 'Historic capital of England, known for Big Ben, museums, and royal palaces',
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    address: 'London, UK',
    country: 'United Kingdom',
    city: 'London',
    photoUrl: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

// Async thunks
export const searchDestinationsAsync = createAsyncThunk(
  'tripForm/searchDestinations',
  async (query: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!query.trim()) return [];
      
      // In production, this would call Google Places API
      const filtered = mockDestinations.filter(dest =>
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.country.toLowerCase().includes(query.toLowerCase()) ||
        dest.city.toLowerCase().includes(query.toLowerCase())
      );
      
      return filtered;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search destinations');
    }
  }
);

export const uploadTripImageAsync = createAsyncThunk(
  'tripForm/uploadImage',
  async (imageData: { uri: string; type: string; name: string }, { dispatch, rejectWithValue }) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        dispatch(setUploadProgress(progress));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // In production, this would upload to cloud storage
      const uploadedUrl = `https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800&timestamp=${Date.now()}`;
      
      return {
        uri: uploadedUrl,
        type: imageData.type,
        name: imageData.name,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  }
);

export const saveDraftAsync = createAsyncThunk(
  'tripForm/saveDraft',
  async (formData: TripFormData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const draftData = {
        ...formData,
        is_draft: true,
        draft_saved_at: new Date().toISOString(),
      };
      
      return draftData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save draft');
    }
  }
);

export const loadDraftsAsync = createAsyncThunk(
  'tripForm/loadDrafts',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In production, this would fetch user's drafts from API
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load drafts');
    }
  }
);

const tripFormSlice = createSlice({
  name: 'tripForm',
  initialState,
  reducers: {
    // Form data updates
    updateFormData: (state, action: PayloadAction<Partial<TripFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
      state.errors = {}; // Clear errors when form data changes
    },
    
    updateFormField: (state, action: PayloadAction<{ field: keyof TripFormData; value: any }>) => {
      const { field, value } = action.payload;
      (state.formData as any)[field] = value;
      
      // Clear specific field error
      if (state.errors[field as keyof FormValidationErrors]) {
        delete state.errors[field as keyof FormValidationErrors];
      }
    },
    
    // Step navigation
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    
    goToStep: (state, action: PayloadAction<number>) => {
      const step = action.payload;
      if (step >= 1 && step <= state.totalSteps) {
        state.currentStep = step;
      }
    },
    
    // Validation
    setFormErrors: (state, action: PayloadAction<FormValidationErrors>) => {
      state.errors = action.payload;
      state.isValid = Object.keys(action.payload).length === 0;
    },
    
    clearFormErrors: (state) => {
      state.errors = {};
      state.isValid = true;
    },
    
    // Destination search
    setDestinationQuery: (state, action: PayloadAction<string>) => {
      state.destinationQuery = action.payload;
    },
    
    selectDestination: (state, action: PayloadAction<DestinationSuggestion>) => {
      state.selectedDestination = action.payload;
      state.formData.destination = action.payload.name;
      state.formData.destinationDetails = {
        placeId: action.payload.placeId,
        coordinates: action.payload.coordinates,
        address: action.payload.address,
        country: action.payload.country,
        city: action.payload.city,
      };
      state.destinationSuggestions = [];
      state.destinationQuery = '';
    },
    
    clearDestinationSearch: (state) => {
      state.destinationQuery = '';
      state.destinationSuggestions = [];
      state.selectedDestination = null;
    },
    
    // Tags management
    addTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload.trim().toLowerCase();
      if (tag && !state.formData.tags.includes(tag)) {
        state.formData.tags.push(tag);
      }
    },
    
    removeTag: (state, action: PayloadAction<string>) => {
      state.formData.tags = state.formData.tags.filter(tag => tag !== action.payload);
    },
    
    // Image upload
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    
    // Draft management
    loadDraftData: (state, action: PayloadAction<TripFormData>) => {
      state.formData = action.payload;
      state.currentStep = 1;
      state.errors = {};
    },
    
    deleteDraft: (state, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter(draft => draft.draft_saved_at !== action.payload);
    },
    
    // Form reset
    resetForm: (state) => {
      state.formData = initialFormData;
      state.currentStep = 1;
      state.errors = {};
      state.isValid = false;
      state.destinationQuery = '';
      state.destinationSuggestions = [];
      state.selectedDestination = null;
      state.uploadProgress = 0;
    },
    
    // Offline support
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    
    addPendingSubmission: (state, action: PayloadAction<TripFormData>) => {
      state.pendingSubmissions.push(action.payload);
    },
    
    removePendingSubmission: (state, action: PayloadAction<number>) => {
      state.pendingSubmissions.splice(action.payload, 1);
    },
    
    clearPendingSubmissions: (state) => {
      state.pendingSubmissions = [];
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Search destinations
      .addCase(searchDestinationsAsync.pending, (state) => {
        state.isLoadingDestinations = true;
      })
      .addCase(searchDestinationsAsync.fulfilled, (state, action) => {
        state.isLoadingDestinations = false;
        state.destinationSuggestions = action.payload;
      })
      .addCase(searchDestinationsAsync.rejected, (state) => {
        state.isLoadingDestinations = false;
        state.destinationSuggestions = [];
      })
      
      // Upload image
      .addCase(uploadTripImageAsync.pending, (state) => {
        state.isUploadingImage = true;
        state.uploadProgress = 0;
      })
      .addCase(uploadTripImageAsync.fulfilled, (state, action) => {
        state.isUploadingImage = false;
        state.uploadProgress = 100;
        state.formData.cover_image = action.payload;
      })
      .addCase(uploadTripImageAsync.rejected, (state) => {
        state.isUploadingImage = false;
        state.uploadProgress = 0;
      })
      
      // Save draft
      .addCase(saveDraftAsync.pending, (state) => {
        state.isSavingDraft = true;
      })
      .addCase(saveDraftAsync.fulfilled, (state, action) => {
        state.isSavingDraft = false;
        state.lastDraftSave = Date.now();
        
        // Update or add draft
        const existingIndex = state.drafts.findIndex(
          draft => draft.title === action.payload.title
        );
        
        if (existingIndex >= 0) {
          state.drafts[existingIndex] = action.payload;
        } else {
          state.drafts.unshift(action.payload);
        }
      })
      .addCase(saveDraftAsync.rejected, (state) => {
        state.isSavingDraft = false;
      })
      
      // Load drafts
      .addCase(loadDraftsAsync.fulfilled, (state, action) => {
        state.drafts = action.payload;
      });
  },
});

export const {
  updateFormData,
  updateFormField,
  nextStep,
  previousStep,
  goToStep,
  setFormErrors,
  clearFormErrors,
  setDestinationQuery,
  selectDestination,
  clearDestinationSearch,
  addTag,
  removeTag,
  setUploadProgress,
  loadDraftData,
  deleteDraft,
  resetForm,
  setOfflineStatus,
  addPendingSubmission,
  removePendingSubmission,
  clearPendingSubmissions,
} = tripFormSlice.actions;

export default tripFormSlice.reducer;
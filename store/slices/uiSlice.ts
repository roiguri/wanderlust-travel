import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';
export type TabName = 'explore' | 'trips' | 'recording' | 'map' | 'profile';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
  autoHide?: boolean;
}

export interface ModalState {
  tripCreate: boolean;
  tripEdit: boolean;
  attractionDetail: boolean;
  photoViewer: boolean;
  settings: boolean;
  profile: boolean;
  filters: boolean;
  confirmation: boolean;
}

export interface LoadingState {
  global: boolean;
  auth: boolean;
  trips: boolean;
  upload: boolean;
  sync: boolean;
}

export interface ErrorState {
  global: string | null;
  auth: string | null;
  trips: string | null;
  network: string | null;
  upload: string | null;
}

interface UIState {
  // Theme and appearance
  theme: Theme;
  
  // Navigation state
  activeTab: TabName;
  
  // Network connectivity
  isOnline: boolean;
  isConnecting: boolean;
  
  // Modal management
  modals: ModalState;
  
  // Toast notifications
  toasts: Toast[];
  
  // Loading states
  loading: LoadingState;
  
  // Error states
  errors: ErrorState;
  
  // Search and filters
  searchQuery: string;
  recentSearches: string[];
  
  // App state
  isAppReady: boolean;
  lastActiveTime: number | null;
  
  // User preferences
  preferences: {
    units: 'metric' | 'imperial';
    currency: string;
    language: string;
    notifications: {
      push: boolean;
      email: boolean;
      tripReminders: boolean;
      weatherAlerts: boolean;
      socialUpdates: boolean;
    };
    privacy: {
      shareLocation: boolean;
      publicProfile: boolean;
      shareTrips: boolean;
    };
  };
}

const initialState: UIState = {
  theme: 'system',
  activeTab: 'explore',
  isOnline: true,
  isConnecting: false,
  modals: {
    tripCreate: false,
    tripEdit: false,
    attractionDetail: false,
    photoViewer: false,
    settings: false,
    profile: false,
    filters: false,
    confirmation: false,
  },
  toasts: [],
  loading: {
    global: false,
    auth: false,
    trips: false,
    upload: false,
    sync: false,
  },
  errors: {
    global: null,
    auth: null,
    trips: null,
    network: null,
    upload: null,
  },
  searchQuery: '',
  recentSearches: [],
  isAppReady: false,
  lastActiveTime: null,
  preferences: {
    units: 'metric',
    currency: 'USD',
    language: 'en',
    notifications: {
      push: true,
      email: true,
      tripReminders: true,
      weatherAlerts: true,
      socialUpdates: false,
    },
    privacy: {
      shareLocation: false,
      publicProfile: false,
      shareTrips: false,
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    // Navigation actions
    setActiveTab: (state, action: PayloadAction<TabName>) => {
      state.activeTab = action.payload;
      state.lastActiveTime = Date.now();
    },

    // Network actions
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      if (!action.payload) {
        state.errors.network = 'No internet connection';
      } else {
        state.errors.network = null;
      }
    },

    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },

    // Modal actions
    openModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = true;
    },

    closeModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = false;
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof ModalState] = false;
      });
    },

    // Toast actions
    addToast: (state, action: PayloadAction<Omit<Toast, 'id' | 'timestamp'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        autoHide: action.payload.autoHide ?? true,
        duration: action.payload.duration ?? 4000,
      };
      
      state.toasts.unshift(toast);
      
      // Keep only last 10 toasts
      if (state.toasts.length > 10) {
        state.toasts = state.toasts.slice(0, 10);
      }
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },

    clearToasts: (state) => {
      state.toasts = [];
    },

    // Loading actions
    setLoading: (state, action: PayloadAction<{ key: keyof LoadingState; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      state.loading[key] = isLoading;
    },

    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },

    // Error actions
    setError: (state, action: PayloadAction<{ key: keyof ErrorState; error: string | null }>) => {
      const { key, error } = action.payload;
      state.errors[key] = error;
    },

    clearError: (state, action: PayloadAction<keyof ErrorState>) => {
      state.errors[action.payload] = null;
    },

    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key as keyof ErrorState] = null;
      });
    },

    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query);
        // Keep only last 10 searches
        if (state.recentSearches.length > 10) {
          state.recentSearches = state.recentSearches.slice(0, 10);
        }
      }
    },

    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(search => search !== action.payload);
    },

    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },

    // App state actions
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.isAppReady = action.payload;
    },

    updateLastActiveTime: (state) => {
      state.lastActiveTime = Date.now();
    },

    // Preferences actions
    updatePreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    updateNotificationPreferences: (state, action: PayloadAction<Partial<UIState['preferences']['notifications']>>) => {
      state.preferences.notifications = { ...state.preferences.notifications, ...action.payload };
    },

    updatePrivacyPreferences: (state, action: PayloadAction<Partial<UIState['preferences']['privacy']>>) => {
      state.preferences.privacy = { ...state.preferences.privacy, ...action.payload };
    },

    // Utility actions
    resetUIState: (state) => {
      // Reset to initial state but preserve theme and preferences
      const { theme, preferences } = state;
      Object.assign(state, initialState, { theme, preferences });
    },

    // Batch actions for performance
    batchUIUpdates: (state, action: PayloadAction<{
      loading?: Partial<LoadingState>;
      errors?: Partial<ErrorState>;
      modals?: Partial<ModalState>;
    }>) => {
      const { loading, errors, modals } = action.payload;
      
      if (loading) {
        state.loading = { ...state.loading, ...loading };
      }
      
      if (errors) {
        state.errors = { ...state.errors, ...errors };
      }
      
      if (modals) {
        state.modals = { ...state.modals, ...modals };
      }
    },
  },
});

export const {
  // Theme
  setTheme,
  
  // Navigation
  setActiveTab,
  
  // Network
  setOnlineStatus,
  setConnecting,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Toasts
  addToast,
  removeToast,
  clearToasts,
  
  // Loading
  setLoading,
  setGlobalLoading,
  
  // Errors
  setError,
  clearError,
  clearAllErrors,
  
  // Search
  setSearchQuery,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  
  // App state
  setAppReady,
  updateLastActiveTime,
  
  // Preferences
  updatePreferences,
  updateNotificationPreferences,
  updatePrivacyPreferences,
  
  // Utility
  resetUIState,
  batchUIUpdates,
} = uiSlice.actions;

export default uiSlice.reducer;
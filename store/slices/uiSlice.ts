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

interface UIState {
  // Theme and appearance
  theme: Theme;
  
  // Navigation state
  activeTab: TabName;
  
  // Network connectivity
  isOnline: boolean;
  
  // Modal management - simplified
  modals: {
    settings: boolean;
  };
  
  // Toast notifications
  toasts: Toast[];
  
  // Loading states - simplified
  loading: {
    global: boolean;
  };
  
  // Search
  searchQuery: string;
  recentSearches: string[];
  
  // App state
  isAppReady: boolean;
}

const initialState: UIState = {
  theme: 'system',
  activeTab: 'explore',
  isOnline: true,
  modals: {
    settings: false,
  },
  toasts: [],
  loading: {
    global: false,
  },
  searchQuery: '',
  recentSearches: [],
  isAppReady: false,
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
    },

    // Network actions
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },

    // Modal actions - simplified
    openModal: (state, action: PayloadAction<'settings'>) => {
      state.modals[action.payload] = true;
    },

    closeModal: (state, action: PayloadAction<'settings'>) => {
      state.modals[action.payload] = false;
    },

    closeAllModals: (state) => {
      state.modals.settings = false;
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
      
      // Keep only last 5 toasts
      if (state.toasts.length > 5) {
        state.toasts = state.toasts.slice(0, 5);
      }
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },

    clearToasts: (state) => {
      state.toasts = [];
    },

    // Loading actions - simplified
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },

    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query);
        // Keep only last 5 searches
        if (state.recentSearches.length > 5) {
          state.recentSearches = state.recentSearches.slice(0, 5);
        }
      }
    },

    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },

    // App state actions
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.isAppReady = action.payload;
    },
  },
});

export const {
  setTheme,
  setActiveTab,
  setOnlineStatus,
  openModal,
  closeModal,
  closeAllModals,
  addToast,
  removeToast,
  clearToasts,
  setGlobalLoading,
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  setAppReady,
} = uiSlice.actions;

export default uiSlice.reducer;
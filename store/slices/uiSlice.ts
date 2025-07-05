import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';
export type TabName = 'explore' | 'trips' | 'recording' | 'map' | 'profile';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  autoHide?: boolean;
  duration?: number;
}

export interface ModalState {
  tripCreate: boolean;
  tripEdit: boolean;
  attractionDetail: boolean;
  photoViewer: boolean;
  settings: boolean;
}

interface UIState {
  theme: Theme;
  activeTab: TabName;
  isOnline: boolean;
  modals: ModalState;
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage?: string;
  searchQuery: string;
  recentSearches: string[];
  preferences: {
    units: 'metric' | 'imperial';
    currency: string;
    language: string;
    notifications: {
      push: boolean;
      email: boolean;
      tripReminders: boolean;
      weatherAlerts: boolean;
    };
  };
}

const initialState: UIState = {
  theme: 'system',
  activeTab: 'explore',
  isOnline: true,
  modals: {
    tripCreate: false,
    tripEdit: false,
    attractionDetail: false,
    photoViewer: false,
    settings: false,
  },
  notifications: [],
  isLoading: false,
  searchQuery: '',
  recentSearches: [],
  preferences: {
    units: 'metric',
    currency: 'USD',
    language: 'en',
    notifications: {
      push: true,
      email: true,
      tripReminders: true,
      weatherAlerts: true,
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<TabName>) => {
      state.activeTab = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
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
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message;
    },
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
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    updatePreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
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
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
  setLoading,
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  updatePreferences,
} = uiSlice.actions;

export default uiSlice.reducer;
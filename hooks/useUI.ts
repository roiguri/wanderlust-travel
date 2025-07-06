import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setTheme,
  setActiveTab,
  setOnlineStatus,
  setConnecting,
  openModal,
  closeModal,
  closeAllModals,
  addToast,
  removeToast,
  clearToasts,
  setLoading,
  setGlobalLoading,
  setError,
  clearError,
  clearAllErrors,
  setSearchQuery,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  setAppReady,
  updateLastActiveTime,
  updatePreferences,
  updateNotificationPreferences,
  updatePrivacyPreferences,
  resetUIState,
  batchUIUpdates,
  type Theme,
  type TabName,
  type Toast,
  type ModalState,
  type LoadingState,
  type ErrorState,
} from '@/store/slices/uiSlice';

// Selectors
export const useUISelectors = () => {
  const ui = useAppSelector(state => state.ui);
  
  return {
    // Theme
    theme: ui.theme,
    
    // Navigation
    activeTab: ui.activeTab,
    
    // Network
    isOnline: ui.isOnline,
    isConnecting: ui.isConnecting,
    
    // Modals
    modals: ui.modals,
    isAnyModalOpen: Object.values(ui.modals).some(isOpen => isOpen),
    
    // Toasts
    toasts: ui.toasts,
    hasToasts: ui.toasts.length > 0,
    
    // Loading
    loading: ui.loading,
    isGlobalLoading: ui.loading.global,
    isAnyLoading: Object.values(ui.loading).some(isLoading => isLoading),
    
    // Errors
    errors: ui.errors,
    hasErrors: Object.values(ui.errors).some(error => error !== null),
    globalError: ui.errors.global,
    
    // Search
    searchQuery: ui.searchQuery,
    recentSearches: ui.recentSearches,
    
    // App state
    isAppReady: ui.isAppReady,
    lastActiveTime: ui.lastActiveTime,
    
    // Preferences
    preferences: ui.preferences,
    notificationPreferences: ui.preferences.notifications,
    privacyPreferences: ui.preferences.privacy,
  };
};

// Actions hook
export const useUIActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    // Theme actions
    setTheme: useCallback((theme: Theme) => {
      dispatch(setTheme(theme));
    }, [dispatch]),
    
    // Navigation actions
    setActiveTab: useCallback((tab: TabName) => {
      dispatch(setActiveTab(tab));
    }, [dispatch]),
    
    // Network actions
    setOnlineStatus: useCallback((isOnline: boolean) => {
      dispatch(setOnlineStatus(isOnline));
    }, [dispatch]),
    
    setConnecting: useCallback((isConnecting: boolean) => {
      dispatch(setConnecting(isConnecting));
    }, [dispatch]),
    
    // Modal actions
    openModal: useCallback((modal: keyof ModalState) => {
      dispatch(openModal(modal));
    }, [dispatch]),
    
    closeModal: useCallback((modal: keyof ModalState) => {
      dispatch(closeModal(modal));
    }, [dispatch]),
    
    closeAllModals: useCallback(() => {
      dispatch(closeAllModals());
    }, [dispatch]),
    
    // Toast actions
    showToast: useCallback((toast: Omit<Toast, 'id' | 'timestamp'>) => {
      dispatch(addToast(toast));
    }, [dispatch]),
    
    showSuccessToast: useCallback((title: string, message?: string) => {
      dispatch(addToast({ type: 'success', title, message }));
    }, [dispatch]),
    
    showErrorToast: useCallback((title: string, message?: string) => {
      dispatch(addToast({ type: 'error', title, message, autoHide: false }));
    }, [dispatch]),
    
    showWarningToast: useCallback((title: string, message?: string) => {
      dispatch(addToast({ type: 'warning', title, message }));
    }, [dispatch]),
    
    showInfoToast: useCallback((title: string, message?: string) => {
      dispatch(addToast({ type: 'info', title, message }));
    }, [dispatch]),
    
    removeToast: useCallback((id: string) => {
      dispatch(removeToast(id));
    }, [dispatch]),
    
    clearToasts: useCallback(() => {
      dispatch(clearToasts());
    }, [dispatch]),
    
    // Loading actions
    setLoading: useCallback((key: keyof LoadingState, isLoading: boolean) => {
      dispatch(setLoading({ key, isLoading }));
    }, [dispatch]),
    
    setGlobalLoading: useCallback((isLoading: boolean) => {
      dispatch(setGlobalLoading(isLoading));
    }, [dispatch]),
    
    // Error actions
    setError: useCallback((key: keyof ErrorState, error: string | null) => {
      dispatch(setError({ key, error }));
    }, [dispatch]),
    
    clearError: useCallback((key: keyof ErrorState) => {
      dispatch(clearError(key));
    }, [dispatch]),
    
    clearAllErrors: useCallback(() => {
      dispatch(clearAllErrors());
    }, [dispatch]),
    
    // Search actions
    setSearchQuery: useCallback((query: string) => {
      dispatch(setSearchQuery(query));
    }, [dispatch]),
    
    addRecentSearch: useCallback((query: string) => {
      dispatch(addRecentSearch(query));
    }, [dispatch]),
    
    removeRecentSearch: useCallback((query: string) => {
      dispatch(removeRecentSearch(query));
    }, [dispatch]),
    
    clearRecentSearches: useCallback(() => {
      dispatch(clearRecentSearches());
    }, [dispatch]),
    
    // App state actions
    setAppReady: useCallback((isReady: boolean) => {
      dispatch(setAppReady(isReady));
    }, [dispatch]),
    
    updateLastActiveTime: useCallback(() => {
      dispatch(updateLastActiveTime());
    }, [dispatch]),
    
    // Preferences actions
    updatePreferences: useCallback((preferences: Parameters<typeof updatePreferences>[0]['payload']) => {
      dispatch(updatePreferences(preferences));
    }, [dispatch]),
    
    updateNotificationPreferences: useCallback((preferences: Parameters<typeof updateNotificationPreferences>[0]['payload']) => {
      dispatch(updateNotificationPreferences(preferences));
    }, [dispatch]),
    
    updatePrivacyPreferences: useCallback((preferences: Parameters<typeof updatePrivacyPreferences>[0]['payload']) => {
      dispatch(updatePrivacyPreferences(preferences));
    }, [dispatch]),
    
    // Utility actions
    resetUIState: useCallback(() => {
      dispatch(resetUIState());
    }, [dispatch]),
    
    batchUIUpdates: useCallback((updates: Parameters<typeof batchUIUpdates>[0]['payload']) => {
      dispatch(batchUIUpdates(updates));
    }, [dispatch]),
  };
};

// Combined hook for convenience
export const useUI = () => {
  const selectors = useUISelectors();
  const actions = useUIActions();
  
  return {
    ...selectors,
    ...actions,
  };
};

// Specialized hooks for specific use cases
export const useToasts = () => {
  const { toasts, hasToasts } = useUISelectors();
  const { showToast, showSuccessToast, showErrorToast, showWarningToast, showInfoToast, removeToast, clearToasts } = useUIActions();
  
  return {
    toasts,
    hasToasts,
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    removeToast,
    clearToasts,
  };
};

export const useModals = () => {
  const { modals, isAnyModalOpen } = useUISelectors();
  const { openModal, closeModal, closeAllModals } = useUIActions();
  
  return {
    modals,
    isAnyModalOpen,
    openModal,
    closeModal,
    closeAllModals,
  };
};

export const useLoading = () => {
  const { loading, isGlobalLoading, isAnyLoading } = useUISelectors();
  const { setLoading, setGlobalLoading } = useUIActions();
  
  return {
    loading,
    isGlobalLoading,
    isAnyLoading,
    setLoading,
    setGlobalLoading,
  };
};

export const useErrors = () => {
  const { errors, hasErrors, globalError } = useUISelectors();
  const { setError, clearError, clearAllErrors } = useUIActions();
  
  return {
    errors,
    hasErrors,
    globalError,
    setError,
    clearError,
    clearAllErrors,
  };
};

export const useSearch = () => {
  const { searchQuery, recentSearches } = useUISelectors();
  const { setSearchQuery, addRecentSearch, removeRecentSearch, clearRecentSearches } = useUIActions();
  
  return {
    searchQuery,
    recentSearches,
    setSearchQuery,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
};
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setTheme,
  setActiveTab,
  setOnlineStatus,
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
  clearRecentSearches,
  updatePreferences,
  type Theme,
  type TabName,
  type Toast,
  type ModalState,
  type LoadingState,
  type ErrorState,
} from '@/store/slices/uiSlice';

// Main UI hook
export const useUI = () => {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.ui);

  return {
    // State
    ...ui,
    
    // Theme actions
    setTheme: (theme: Theme) => dispatch(setTheme(theme)),
    
    // Navigation actions
    setActiveTab: (tab: TabName) => dispatch(setActiveTab(tab)),
    
    // Network actions
    setOnlineStatus: (isOnline: boolean) => dispatch(setOnlineStatus(isOnline)),
    
    // Modal actions
    openModal: (modal: keyof ModalState) => dispatch(openModal(modal)),
    closeModal: (modal: keyof ModalState) => dispatch(closeModal(modal)),
    closeAllModals: () => dispatch(closeAllModals()),
    
    // Toast actions
    addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => dispatch(addToast(toast)),
    removeToast: (id: string) => dispatch(removeToast(id)),
    clearToasts: () => dispatch(clearToasts()),
    
    // Loading actions
    setLoading: (key: keyof LoadingState, isLoading: boolean) => 
      dispatch(setLoading({ key, isLoading })),
    setGlobalLoading: (isLoading: boolean) => dispatch(setGlobalLoading(isLoading)),
    
    // Error actions
    setError: (key: keyof ErrorState, error: string | null) => 
      dispatch(setError({ key, error })),
    clearError: (key: keyof ErrorState) => dispatch(clearError(key)),
    clearAllErrors: () => dispatch(clearAllErrors()),
    
    // Search actions
    setSearchQuery: (query: string) => dispatch(setSearchQuery(query)),
    addRecentSearch: (query: string) => dispatch(addRecentSearch(query)),
    clearRecentSearches: () => dispatch(clearRecentSearches()),
    
    // Preferences actions
    updatePreferences: (preferences: Partial<typeof ui.preferences>) => 
      dispatch(updatePreferences(preferences)),
  };
};

// Specialized hooks for common use cases
export const useToasts = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  const showToast = (toast: Omit<Toast, 'id' | 'timestamp'>) => {
    dispatch(addToast(toast));
  };

  const showSuccessToast = (title: string, message?: string, duration?: number) => {
    showToast({
      type: 'success',
      title,
      message,
      duration,
      autoHide: true,
    });
  };

  const showErrorToast = (title: string, message?: string, duration?: number) => {
    showToast({
      type: 'error',
      title,
      message,
      duration: duration || 6000, // Errors stay longer
      autoHide: true,
    });
  };

  const showWarningToast = (title: string, message?: string, duration?: number) => {
    showToast({
      type: 'warning',
      title,
      message,
      duration,
      autoHide: true,
    });
  };

  const showInfoToast = (title: string, message?: string, duration?: number) => {
    showToast({
      type: 'info',
      title,
      message,
      duration,
      autoHide: true,
    });
  };

  const removeToast = (id: string) => {
    dispatch(removeToast(id));
  };

  const clearAllToasts = () => {
    dispatch(clearToasts());
  };

  return {
    toasts,
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    removeToast,
    clearAllToasts,
  };
};

export const useModals = () => {
  const dispatch = useAppDispatch();
  const modals = useAppSelector((state) => state.ui.modals);

  const openModal = (modal: keyof ModalState) => {
    dispatch(openModal(modal));
  };

  const closeModal = (modal: keyof ModalState) => {
    dispatch(closeModal(modal));
  };

  const closeAllModals = () => {
    dispatch(closeAllModals());
  };

  const isModalOpen = (modal: keyof ModalState) => {
    return modals[modal];
  };

  const isAnyModalOpen = () => {
    return Object.values(modals).some(isOpen => isOpen);
  };

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    isAnyModalOpen,
  };
};

export const useLoading = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.ui.loading);

  const setLoading = (key: keyof LoadingState, isLoading: boolean) => {
    dispatch(setLoading({ key, isLoading }));
  };

  const setGlobalLoading = (isLoading: boolean) => {
    dispatch(setGlobalLoading(isLoading));
  };

  const isLoading = (key: keyof LoadingState) => {
    return loading[key];
  };

  const isAnyLoading = () => {
    return Object.values(loading).some(isLoading => isLoading);
  };

  return {
    loading,
    setLoading,
    setGlobalLoading,
    isLoading,
    isAnyLoading,
  };
};

export const useErrors = () => {
  const dispatch = useAppDispatch();
  const errors = useAppSelector((state) => state.ui.errors);

  const setError = (key: keyof ErrorState, error: string | null) => {
    dispatch(setError({ key, error }));
  };

  const clearError = (key: keyof ErrorState) => {
    dispatch(clearError(key));
  };

  const clearAllErrors = () => {
    dispatch(clearAllErrors());
  };

  const hasError = (key: keyof ErrorState) => {
    return !!errors[key];
  };

  const hasAnyError = () => {
    return Object.values(errors).some(error => !!error);
  };

  return {
    errors,
    setError,
    clearError,
    clearAllErrors,
    hasError,
    hasAnyError,
  };
};

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, recentSearches } = useAppSelector((state) => state.ui);

  const setSearchQuery = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const addRecentSearch = (query: string) => {
    dispatch(addRecentSearch(query));
  };

  const clearRecentSearches = () => {
    dispatch(clearRecentSearches());
  };

  return {
    searchQuery,
    recentSearches,
    setSearchQuery,
    addRecentSearch,
    clearRecentSearches,
  };
};
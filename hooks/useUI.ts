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
  setGlobalLoading,
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  setAppReady,
  type Theme,
  type TabName,
  type Toast,
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
    openModal: (modal: 'settings') => dispatch(openModal(modal)),
    closeModal: (modal: 'settings') => dispatch(closeModal(modal)),
    closeAllModals: () => dispatch(closeAllModals()),
    
    // Toast actions
    addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => dispatch(addToast(toast)),
    removeToast: (id: string) => dispatch(removeToast(id)),
    clearToasts: () => dispatch(clearToasts()),
    
    // Loading actions
    setGlobalLoading: (isLoading: boolean) => dispatch(setGlobalLoading(isLoading)),
    
    // Search actions
    setSearchQuery: (query: string) => dispatch(setSearchQuery(query)),
    addRecentSearch: (query: string) => dispatch(addRecentSearch(query)),
    clearRecentSearches: () => dispatch(clearRecentSearches()),
    
    // App state actions
    setAppReady: (isReady: boolean) => dispatch(setAppReady(isReady)),
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

  const openModal = (modal: 'settings') => {
    dispatch(openModal(modal));
  };

  const closeModal = (modal: 'settings') => {
    dispatch(closeModal(modal));
  };

  const closeAllModals = () => {
    dispatch(closeAllModals());
  };

  const isModalOpen = (modal: 'settings') => {
    return modals[modal];
  };

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
  };
};

export const useLoading = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.ui.loading);

  const setGlobalLoading = (isLoading: boolean) => {
    dispatch(setGlobalLoading(isLoading));
  };

  return {
    loading,
    setGlobalLoading,
    isLoading: loading.global,
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
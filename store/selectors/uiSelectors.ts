import { createSelector } from 'reselect';
import type { RootState } from '../index';

// Base selectors
const selectUIState = (state: RootState) => state.ui;

// Memoized selectors
export const selectTheme = createSelector(
  [selectUIState],
  (ui) => ui.theme
);

export const selectActiveTab = createSelector(
  [selectUIState],
  (ui) => ui.activeTab
);

export const selectIsOnline = createSelector(
  [selectUIState],
  (ui) => ui.isOnline
);

export const selectModals = createSelector(
  [selectUIState],
  (ui) => ui.modals
);

export const selectIsAnyModalOpen = createSelector(
  [selectModals],
  (modals) => Object.values(modals).some(isOpen => isOpen)
);

export const selectNotifications = createSelector(
  [selectUIState],
  (ui) => ui.notifications
);

export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => !n.read)
);

export const selectUnreadNotificationCount = createSelector(
  [selectUnreadNotifications],
  (unreadNotifications) => unreadNotifications.length
);

export const selectRecentNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.slice(0, 5) // Last 5 notifications
);

export const selectIsLoading = createSelector(
  [selectUIState],
  (ui) => ui.isLoading
);

export const selectLoadingMessage = createSelector(
  [selectUIState],
  (ui) => ui.loadingMessage
);

export const selectSearchQuery = createSelector(
  [selectUIState],
  (ui) => ui.searchQuery
);

export const selectRecentSearches = createSelector(
  [selectUIState],
  (ui) => ui.recentSearches
);

export const selectPreferences = createSelector(
  [selectUIState],
  (ui) => ui.preferences
);

export const selectNotificationPreferences = createSelector(
  [selectPreferences],
  (preferences) => preferences.notifications
);

export const selectDisplayPreferences = createSelector(
  [selectPreferences],
  (preferences) => ({
    units: preferences.units,
    currency: preferences.currency,
    language: preferences.language,
  })
);

// Specific modal selectors
export const selectIsTripCreateModalOpen = createSelector(
  [selectModals],
  (modals) => modals.tripCreate
);

export const selectIsTripEditModalOpen = createSelector(
  [selectModals],
  (modals) => modals.tripEdit
);

export const selectIsAttractionDetailModalOpen = createSelector(
  [selectModals],
  (modals) => modals.attractionDetail
);

export const selectIsPhotoViewerModalOpen = createSelector(
  [selectModals],
  (modals) => modals.photoViewer
);

export const selectIsSettingsModalOpen = createSelector(
  [selectModals],
  (modals) => modals.settings
);

// Notification selectors by type
export const selectNotificationsByType = createSelector(
  [selectNotifications],
  (notifications) => {
    return notifications.reduce((acc, notification) => {
      if (!acc[notification.type]) {
        acc[notification.type] = [];
      }
      acc[notification.type].push(notification);
      return acc;
    }, {} as Record<string, typeof notifications>);
  }
);

// Check if app should show offline indicator
export const selectShouldShowOfflineIndicator = createSelector(
  [selectIsOnline],
  (isOnline) => !isOnline
);
import { createSelector } from 'reselect';
import type { RootState } from '../index';

// Base selectors
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsLoggedIn = createSelector(
  [selectAuthState],
  (auth) => auth.isLoggedIn
);

export const selectIsLoading = createSelector(
  [selectAuthState],
  (auth) => auth.isLoading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectTokens = createSelector(
  [selectAuthState],
  (auth) => ({
    token: auth.token,
    refreshToken: auth.refreshToken,
  })
);

export const selectUserPreferences = createSelector(
  [selectUser],
  (user) => user?.preferences || {}
);

export const selectIsAuthenticated = createSelector(
  [selectUser, selectIsLoggedIn],
  (user, isLoggedIn) => !!(user && isLoggedIn)
);

export const selectLastLoginTime = createSelector(
  [selectAuthState],
  (auth) => auth.lastLoginTime
);

// Session validity selector (check if session is still valid)
export const selectIsSessionValid = createSelector(
  [selectTokens, selectLastLoginTime],
  (tokens, lastLoginTime) => {
    if (!tokens.token || !lastLoginTime) return false;
    
    // Check if session is older than 7 days (adjust as needed)
    const sessionAge = Date.now() - lastLoginTime;
    const maxSessionAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    return sessionAge < maxSessionAge;
  }
);
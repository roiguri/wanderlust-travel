import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { Platform } from 'react-native';

// Import slices (we'll create these next)
import authSlice from './slices/authSlice';
import tripsSlice from './slices/tripsSlice';
import uiSlice from './slices/uiSlice';

// Import API slices
import { baseApi } from './api/baseApi';

// Get appropriate storage for redux-persist
const getReduxPersistStorage = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      return {
        getItem: (key: string) => {
          try {
            return Promise.resolve(window.localStorage.getItem(key));
          } catch {
            return Promise.resolve(null);
          }
        },
        setItem: (key: string, value: string) => {
          try {
            window.localStorage.setItem(key, value);
            return Promise.resolve();
          } catch {
            return Promise.resolve();
          }
        },
        removeItem: (key: string) => {
          try {
            window.localStorage.removeItem(key);
            return Promise.resolve();
          } catch {
            return Promise.resolve();
          }
        },
      };
    } else {
      // Mock storage for SSR
      return {
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
      };
    }
  } else {
    // Use AsyncStorage for React Native
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage;
  }
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  trips: tripsSlice,
  ui: uiSlice,
  // Add the API reducer
  [baseApi.reducerPath]: baseApi.reducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage: getReduxPersistStorage(),
  // Only persist certain slices
  whitelist: ['auth', 'ui'],
  // Don't persist API cache and trips (they'll be fetched fresh)
  blacklist: [baseApi.reducerPath, 'trips'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
  devTools: __DEV__, // Enable Redux DevTools in development
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export { useAppDispatch, useAppSelector } from './hooks';
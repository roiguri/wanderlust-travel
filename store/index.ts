import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Import slices (we'll create these next)
import authSlice from './slices/authSlice';
import tripsSlice from './slices/tripsSlice';
import uiSlice from './slices/uiSlice';

// Import API slices
import { baseApi } from './api/baseApi';

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
  storage: AsyncStorage,
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
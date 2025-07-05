import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Base API configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      const token = (getState() as RootState).auth.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'Trip',
    'Attraction',
    'TripAttraction',
    'Photo',
    'SavedAttraction',
  ],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  // We'll add specific hooks as we create API endpoints
} = baseApi;
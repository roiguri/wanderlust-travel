import { baseApi } from './baseApi';
import type { Trip } from '../slices/tripsSlice';

export interface CreateTripData {
  title: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  is_public?: boolean;
}

export interface UpdateTripData extends Partial<CreateTripData> {
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
}

export const tripsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrips: builder.query<Trip[], { status?: string; limit?: number }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append('status', params.status);
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return `/trips?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Trip' as const, id })),
              { type: 'Trip', id: 'LIST' },
            ]
          : [{ type: 'Trip', id: 'LIST' }],
    }),
    getTrip: builder.query<Trip, string>({
      query: (id) => `/trips/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trip', id }],
    }),
    createTrip: builder.mutation<Trip, CreateTripData>({
      query: (tripData) => ({
        url: '/trips',
        method: 'POST',
        body: tripData,
      }),
      invalidatesTags: [{ type: 'Trip', id: 'LIST' }],
    }),
    updateTrip: builder.mutation<Trip, { id: string; updates: UpdateTripData }>({
      query: ({ id, updates }) => ({
        url: `/trips/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Trip', id },
        { type: 'Trip', id: 'LIST' },
      ],
    }),
    deleteTrip: builder.mutation<void, string>({
      query: (id) => ({
        url: `/trips/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Trip', id },
        { type: 'Trip', id: 'LIST' },
      ],
    }),
    duplicateTrip: builder.mutation<Trip, string>({
      query: (id) => ({
        url: `/trips/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Trip', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTripsQuery,
  useGetTripQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  useDuplicateTripMutation,
} = tripsApi;
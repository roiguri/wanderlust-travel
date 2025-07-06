import { baseApi } from './baseApi';
import type { Trip, CreateTripData } from '../slices/tripsSlice';

export interface UpdateTripData extends Partial<CreateTripData> {
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
}

export interface TripQueryParams {
  status?: string;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const tripsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrips: builder.query<Trip[], TripQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
        
        return `/trips?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Trip' as const, id })),
              { type: 'Trip', id: 'LIST' },
            ]
          : [{ type: 'Trip', id: 'LIST' }],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
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
      // Optimistic update
      async onQueryStarted(tripData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tripsApi.util.updateQueryData('getTrips', {}, (draft) => {
            const optimisticTrip: Trip = {
              id: `temp_${Date.now()}`,
              user_id: 'user1',
              title: tripData.title,
              description: tripData.description,
              destination: tripData.destination,
              start_date: tripData.start_date,
              end_date: tripData.end_date,
              status: 'planning',
              budget: tripData.budget,
              is_public: tripData.is_public || false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              image_url: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
              attractions_count: 0,
              days_count: Math.ceil((new Date(tripData.end_date).getTime() - new Date(tripData.start_date).getTime()) / (1000 * 60 * 60 * 24)),
            };
            draft.unshift(optimisticTrip);
          })
        );
        
        try {
          const { data: newTrip } = await queryFulfilled;
          // Replace optimistic update with real data
          dispatch(
            tripsApi.util.updateQueryData('getTrips', {}, (draft) => {
              const index = draft.findIndex(trip => trip.id.startsWith('temp_'));
              if (index !== -1) {
                draft[index] = newTrip;
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
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
      // Optimistic update
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tripsApi.util.updateQueryData('getTrips', {}, (draft) => {
            const trip = draft.find(t => t.id === id);
            if (trip) {
              Object.assign(trip, updates, { updated_at: new Date().toISOString() });
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tripsApi.util.updateQueryData('getTrips', {}, (draft) => {
            return draft.filter(trip => trip.id !== id);
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    duplicateTrip: builder.mutation<Trip, string>({
      query: (id) => ({
        url: `/trips/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Trip', id: 'LIST' }],
    }),
    
    getTripStats: builder.query<{
      total: number;
      planning: number;
      active: number;
      completed: number;
      cancelled: number;
      totalBudget: number;
      averageDuration: number;
    }, void>({
      query: () => '/trips/stats',
      providesTags: [{ type: 'Trip', id: 'STATS' }],
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
  useGetTripStatsQuery,
  useLazyGetTripsQuery,
} = tripsApi;
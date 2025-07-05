import { createSelector } from 'reselect';
import type { RootState } from '../index';
import type { Trip } from '../slices/tripsSlice';

// Base selectors
const selectTripsState = (state: RootState) => state.trips;

// Memoized selectors
export const selectAllTrips = createSelector(
  [selectTripsState],
  (trips) => trips.trips
);

export const selectCurrentTrip = createSelector(
  [selectTripsState],
  (trips) => trips.currentTrip
);

export const selectTripsLoading = createSelector(
  [selectTripsState],
  (trips) => trips.isLoading
);

export const selectTripsError = createSelector(
  [selectTripsState],
  (trips) => trips.error
);

export const selectTripsFilters = createSelector(
  [selectTripsState],
  (trips) => trips.filters
);

export const selectLastFetch = createSelector(
  [selectTripsState],
  (trips) => trips.lastFetch
);

// Filtered trips based on current filters
export const selectFilteredTrips = createSelector(
  [selectAllTrips, selectTripsFilters],
  (trips, filters) => {
    let filteredTrips = [...trips];

    // Filter by status
    if (filters.status !== 'all') {
      filteredTrips = filteredTrips.filter(trip => trip.status === filters.status);
    }

    // Filter by search query
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filteredTrips = filteredTrips.filter(trip =>
        trip.title.toLowerCase().includes(searchLower) ||
        trip.destination.toLowerCase().includes(searchLower) ||
        trip.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filteredTrips = filteredTrips.filter(trip => {
        const tripStart = new Date(trip.start_date);
        const tripEnd = new Date(trip.end_date);
        
        // Trip overlaps with filter date range
        return tripStart <= endDate && tripEnd >= startDate;
      });
    }

    // Sort trips
    filteredTrips.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredTrips;
  }
);

// Trips grouped by status
export const selectTripsByStatus = createSelector(
  [selectAllTrips],
  (trips) => {
    return trips.reduce((acc, trip) => {
      if (!acc[trip.status]) {
        acc[trip.status] = [];
      }
      acc[trip.status].push(trip);
      return acc;
    }, {} as Record<string, Trip[]>);
  }
);

// Upcoming trips (active or planning, starting within next 30 days)
export const selectUpcomingTrips = createSelector(
  [selectAllTrips],
  (trips) => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return trips.filter(trip => {
      const tripStart = new Date(trip.start_date);
      return (trip.status === 'planning' || trip.status === 'active') &&
             tripStart >= now &&
             tripStart <= thirtyDaysFromNow;
    }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  }
);

// Active trips (currently happening)
export const selectActiveTrips = createSelector(
  [selectAllTrips],
  (trips) => {
    const now = new Date();
    
    return trips.filter(trip => {
      const tripStart = new Date(trip.start_date);
      const tripEnd = new Date(trip.end_date);
      return trip.status === 'active' && tripStart <= now && tripEnd >= now;
    });
  }
);

// Trip statistics
export const selectTripStats = createSelector(
  [selectAllTrips],
  (trips) => {
    const stats = {
      total: trips.length,
      planning: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      totalBudget: 0,
      averageDuration: 0,
    };

    let totalDuration = 0;

    trips.forEach(trip => {
      stats[trip.status]++;
      
      if (trip.budget) {
        stats.totalBudget += trip.budget;
      }
      
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      totalDuration += duration;
    });

    if (trips.length > 0) {
      stats.averageDuration = Math.round(totalDuration / trips.length);
    }

    return stats;
  }
);

// Check if trips data needs refresh (older than 5 minutes)
export const selectShouldRefreshTrips = createSelector(
  [selectLastFetch],
  (lastFetch) => {
    if (!lastFetch) return true;
    
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return lastFetch < fiveMinutesAgo;
  }
);
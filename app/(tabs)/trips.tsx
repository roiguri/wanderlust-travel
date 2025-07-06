import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, MoveVertical as MoreVertical, MapPin, Calendar, TrendingUp, SquareCheck as CheckSquare, Square } from 'lucide-react-native';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchTripsAsync, 
  setSearchQuery, 
  clearError,
  selectTrip,
  selectAllTrips,
  clearSelection,
  deleteTripAsync,
  optimisticDeleteTrip,
  type Trip,
} from '@/store/slices/tripsSlice';
import { useToasts } from '@/hooks/useUI';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import TripCard from '@/components/trips/TripCard';
import CreateTripModal from '@/components/trips/CreateTripModal';
import TripFilters from '@/components/trips/TripFilters';

export default function TripsTab() {
  const dispatch = useAppDispatch();
  const { 
    trips, 
    isLoading, 
    error, 
    filters, 
    searchQuery, 
    selectedTripIds,
    lastFetch,
  } = useAppSelector((state) => state.trips);
  
  const { showSuccessToast, showErrorToast } = useToasts();
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load trips on mount
  useEffect(() => {
    if (!lastFetch || Date.now() - lastFetch > 5 * 60 * 1000) { // 5 minutes
      dispatch(fetchTripsAsync());
    }
  }, [dispatch, lastFetch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    let filtered = [...trips];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(trip => trip.status === filters.status);
    }

    // Filter by search query
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(searchLower) ||
        trip.destination.toLowerCase().includes(searchLower) ||
        trip.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filtered = filtered.filter(trip => {
        const tripStart = new Date(trip.start_date);
        const tripEnd = new Date(trip.end_date);
        
        // Trip overlaps with filter date range
        return tripStart <= endDate && tripEnd >= startDate;
      });
    }

    // Sort trips
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [trips, filters]);

  // Trip statistics
  const tripStats = useMemo(() => {
    const stats = {
      total: trips.length,
      planning: 0,
      active: 0,
      completed: 0,
      totalBudget: 0,
    };

    trips.forEach(trip => {
      if (trip.status === 'planning') stats.planning++;
      if (trip.status === 'active') stats.active++;
      if (trip.status === 'completed') stats.completed++;
      if (trip.budget) stats.totalBudget += trip.budget;
    });

    return stats;
  }, [trips]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchTripsAsync({ refresh: true })).unwrap();
    } catch (error) {
      // Error is handled by the slice
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleTripPress = (trip: Trip) => {
    if (selectionMode) {
      dispatch(selectTrip(trip.id));
    } else {
      // Navigate to trip detail (implement later)
      showSuccessToast('Trip Selected', `Opening ${trip.title}...`);
    }
  };

  const handleTripMenuPress = (trip: Trip) => {
    Alert.alert(
      trip.title,
      'Choose an action',
      [
        { text: 'Edit', onPress: () => showSuccessToast('Edit', 'Edit functionality coming soon') },
        { text: 'Duplicate', onPress: () => showSuccessToast('Duplicate', 'Duplicate functionality coming soon') },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => handleDeleteTrip(trip),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeleteTrip = (trip: Trip) => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${trip.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Optimistic update
              dispatch(optimisticDeleteTrip(trip.id));
              showSuccessToast('Trip Deleted', `${trip.title} has been deleted`);
              
              // Actual API call
              await dispatch(deleteTripAsync(trip.id)).unwrap();
            } catch (error: any) {
              showErrorToast('Error', error.message || 'Failed to delete trip');
            }
          },
        },
      ]
    );
  };

  const handleBulkDelete = () => {
    if (selectedTripIds.length === 0) return;

    Alert.alert(
      'Delete Trips',
      `Are you sure you want to delete ${selectedTripIds.length} trip(s)? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Optimistic updates
              selectedTripIds.forEach(id => {
                dispatch(optimisticDeleteTrip(id));
              });
              
              showSuccessToast('Trips Deleted', `${selectedTripIds.length} trip(s) deleted`);
              setSelectionMode(false);
              
              // Actual API calls
              await Promise.all(
                selectedTripIds.map(id => dispatch(deleteTripAsync(id)).unwrap())
              );
            } catch (error: any) {
              showErrorToast('Error', error.message || 'Failed to delete trips');
            }
          },
        },
      ]
    );
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      dispatch(clearSelection());
    }
  };

  const toggleSelectAll = () => {
    if (selectedTripIds.length === filteredTrips.length) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllTrips());
    }
  };

  if (isLoading && trips.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" message="Loading your trips..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>My Trips</Text>
          <View style={styles.headerActions}>
            {selectionMode && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={toggleSelectAll}
                activeOpacity={0.7}
              >
                {selectedTripIds.length === filteredTrips.length ? (
                  <CheckSquare size={24} color={theme.colors.primary[500]} />
                ) : (
                  <Square size={24} color={theme.text.secondary} />
                )}
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleSelectionMode}
              activeOpacity={0.7}
            >
              <MoreVertical size={24} color={theme.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tripStats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tripStats.planning}</Text>
            <Text style={styles.statLabel}>Planning</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tripStats.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tripStats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FormInput
            placeholder="Search trips..."
            value={searchQuery}
            onChangeText={handleSearch}
            leftIcon={<Search size={20} color={theme.text.secondary} />}
            variant="filled"
            style={styles.searchInput}
          />
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFiltersModalVisible(true)}
          activeOpacity={0.7}
        >
          <Filter size={20} color={theme.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Selection Actions */}
      {selectionMode && selectedTripIds.length > 0 && (
        <View style={styles.selectionActions}>
          <Text style={styles.selectionText}>
            {selectedTripIds.length} trip(s) selected
          </Text>
          <Button
            title="Delete Selected"
            onPress={handleBulkDelete}
            variant="danger"
            size="small"
          />
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={() => dispatch(fetchTripsAsync())}
            variant="secondary"
            size="small"
          />
        </View>
      )}

      {/* Trips List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.length === 0 ? (
          <EmptyState
            icon={<MapPin size={48} color={theme.colors.gray[400]} />}
            title={trips.length === 0 ? "No trips yet" : "No trips found"}
            description={
              trips.length === 0
                ? "Start planning your next adventure by creating your first trip."
                : "Try adjusting your search or filters to find what you're looking for."
            }
            actionLabel={trips.length === 0 ? "Create Your First Trip" : "Clear Filters"}
            onAction={
              trips.length === 0
                ? () => setCreateModalVisible(true)
                : () => {
                    dispatch(setSearchQuery(''));
                    setFiltersModalVisible(true);
                  }
            }
          />
        ) : (
          filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => handleTripPress(trip)}
              onMenuPress={() => handleTripMenuPress(trip)}
              isSelected={selectedTripIds.includes(trip.id)}
              onSelect={() => dispatch(selectTrip(trip.id))}
              showSelection={selectionMode}
            />
          ))
        )}
      </ScrollView>

      {/* Create Trip FAB */}
      {!selectionMode && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setCreateModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={24} color={theme.text.inverse} />
        </TouchableOpacity>
      )}

      {/* Modals */}
      <CreateTripModal
        isVisible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
      
      <TripFilters
        isVisible={filtersModalVisible}
        onClose={() => setFiltersModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: theme.surface,
    paddingHorizontal: theme.spacingPatterns.screen.horizontal,
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: theme.border.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    ...theme.h1,
    color: theme.text.primary,
    includeFontPadding: false,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: theme.spacing[2],
    marginLeft: theme.spacing[2],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.h3,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  statLabel: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacingPatterns.screen.horizontal,
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.light,
  },
  searchInputContainer: {
    flex: 1,
    marginRight: theme.spacing[3],
  },
  searchInput: {
    marginBottom: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacingPatterns.screen.horizontal,
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary[200],
  },
  selectionText: {
    ...theme.body1,
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacingPatterns.screen.horizontal,
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.error + '10',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.error + '30',
  },
  errorText: {
    ...theme.body2,
    color: theme.colors.error,
    flex: 1,
    marginRight: theme.spacing[3],
    includeFontPadding: false,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacingPatterns.screen.horizontal,
    paddingBottom: 100, // Space for FAB
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing[6],
    right: theme.spacingPatterns.screen.horizontal,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.componentShadows.cardElevated,
  },
});
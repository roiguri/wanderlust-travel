import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { 
  Filter, 
  Search, 
  Calendar, 
  ArrowUpDown,
  X,
  CheckCircle,
} from 'lucide-react-native';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFilters, setSearchQuery, type TripFilters } from '@/store/slices/tripsSlice';

interface TripFiltersProps {
  isVisible: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: 'all', label: 'All Trips', color: theme.colors.gray[500] },
  { value: 'planning', label: 'Planning', color: theme.colors.primary[500] },
  { value: 'active', label: 'Active', color: theme.colors.success },
  { value: 'completed', label: 'Completed', color: theme.colors.secondary[500] },
  { value: 'cancelled', label: 'Cancelled', color: theme.colors.error },
] as const;

const sortOptions = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'start_date', label: 'Start Date' },
  { value: 'title', label: 'Title' },
  { value: 'destination', label: 'Destination' },
] as const;

export default function TripFilters({ isVisible, onClose }: TripFiltersProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.trips.filters);
  
  const [localFilters, setLocalFilters] = useState<TripFilters>(filters);
  const [dateRangeStart, setDateRangeStart] = useState(filters.dateRange?.start || '');
  const [dateRangeEnd, setDateRangeEnd] = useState(filters.dateRange?.end || '');

  const handleApplyFilters = () => {
    const updatedFilters: TripFilters = {
      ...localFilters,
      dateRange: dateRangeStart && dateRangeEnd 
        ? { start: dateRangeStart, end: dateRangeEnd }
        : undefined,
    };
    
    dispatch(updateFilters(updatedFilters));
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: TripFilters = {
      status: 'all',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    
    setLocalFilters(resetFilters);
    setDateRangeStart('');
    setDateRangeEnd('');
    dispatch(updateFilters(resetFilters));
    dispatch(setSearchQuery(''));
  };

  const handleClose = () => {
    // Reset local state to current filters
    setLocalFilters(filters);
    setDateRangeStart(filters.dateRange?.start || '');
    setDateRangeEnd(filters.dateRange?.end || '');
    onClose();
  };

  const hasActiveFilters = () => {
    return (
      localFilters.status !== 'all' ||
      localFilters.search.trim() !== '' ||
      dateRangeStart !== '' ||
      dateRangeEnd !== '' ||
      localFilters.sortBy !== 'created_at' ||
      localFilters.sortOrder !== 'desc'
    );
  };

  return (
    <Modal isVisible={isVisible} onClose={handleClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter & Sort Trips</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={theme.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search</Text>
          <FormInput
            placeholder="Search trips by title, destination..."
            value={localFilters.search}
            onChangeText={(text) => setLocalFilters(prev => ({ ...prev, search: text }))}
            leftIcon={<Search size={20} color={theme.text.secondary} />}
            variant="filled"
          />
        </View>

        {/* Status Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.optionsGrid}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  localFilters.status === option.value && styles.statusOptionSelected,
                ]}
                onPress={() => setLocalFilters(prev => ({ ...prev, status: option.value }))}
                activeOpacity={0.7}
              >
                <View style={[styles.statusIndicator, { backgroundColor: option.color }]} />
                <Text style={[
                  styles.statusOptionText,
                  localFilters.status === option.value && styles.statusOptionTextSelected,
                ]}>
                  {option.label}
                </Text>
                {localFilters.status === option.value && (
                  <CheckCircle size={16} color={theme.colors.primary[500]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <FormInput
                label="From"
                placeholder="YYYY-MM-DD"
                value={dateRangeStart}
                onChangeText={setDateRangeStart}
                leftIcon={<Calendar size={20} color={theme.text.secondary} />}
                variant="filled"
              />
            </View>
            <View style={styles.dateField}>
              <FormInput
                label="To"
                placeholder="YYYY-MM-DD"
                value={dateRangeEnd}
                onChangeText={setDateRangeEnd}
                leftIcon={<Calendar size={20} color={theme.text.secondary} />}
                variant="filled"
              />
            </View>
          </View>
        </View>

        {/* Sort Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.sortContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortOption,
                  localFilters.sortBy === option.value && styles.sortOptionSelected,
                ]}
                onPress={() => setLocalFilters(prev => ({ ...prev, sortBy: option.value }))}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.sortOptionText,
                  localFilters.sortBy === option.value && styles.sortOptionTextSelected,
                ]}>
                  {option.label}
                </Text>
                {localFilters.sortBy === option.value && (
                  <CheckCircle size={16} color={theme.colors.primary[500]} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort Order */}
          <View style={styles.sortOrderContainer}>
            <Text style={styles.sortOrderLabel}>Order</Text>
            <View style={styles.sortOrderButtons}>
              <TouchableOpacity
                style={[
                  styles.sortOrderButton,
                  localFilters.sortOrder === 'desc' && styles.sortOrderButtonSelected,
                ]}
                onPress={() => setLocalFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                activeOpacity={0.7}
              >
                <ArrowUpDown size={16} color={
                  localFilters.sortOrder === 'desc' 
                    ? theme.text.inverse 
                    : theme.text.secondary
                } />
                <Text style={[
                  styles.sortOrderButtonText,
                  localFilters.sortOrder === 'desc' && styles.sortOrderButtonTextSelected,
                ]}>
                  Newest First
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.sortOrderButton,
                  localFilters.sortOrder === 'asc' && styles.sortOrderButtonSelected,
                ]}
                onPress={() => setLocalFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                activeOpacity={0.7}
              >
                <ArrowUpDown size={16} color={
                  localFilters.sortOrder === 'asc' 
                    ? theme.text.inverse 
                    : theme.text.secondary
                } />
                <Text style={[
                  styles.sortOrderButtonText,
                  localFilters.sortOrder === 'asc' && styles.sortOrderButtonTextSelected,
                ]}>
                  Oldest First
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Reset"
          onPress={handleResetFilters}
          variant="secondary"
          style={styles.resetButton}
          disabled={!hasActiveFilters()}
        />
        <Button
          title="Apply Filters"
          onPress={handleApplyFilters}
          style={styles.applyButton}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    ...theme.h3,
    color: theme.text.primary,
    includeFontPadding: false,
  },
  closeButton: {
    padding: theme.spacing[1],
  },
  content: {
    maxHeight: 500,
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    ...theme.h5,
    color: theme.text.primary,
    marginBottom: theme.spacing[3],
    includeFontPadding: false,
  },
  optionsGrid: {
    gap: theme.spacing[2],
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border.default,
    backgroundColor: theme.surface,
  },
  statusOptionSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing[3],
  },
  statusOptionText: {
    ...theme.body1,
    color: theme.text.primary,
    flex: 1,
    includeFontPadding: false,
  },
  statusOptionTextSelected: {
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeights.medium,
  },
  dateRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  dateField: {
    flex: 1,
  },
  sortContainer: {
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border.default,
    backgroundColor: theme.surface,
  },
  sortOptionSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  sortOptionText: {
    ...theme.body1,
    color: theme.text.primary,
    includeFontPadding: false,
  },
  sortOptionTextSelected: {
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeights.medium,
  },
  sortOrderContainer: {
    marginTop: theme.spacing[2],
  },
  sortOrderLabel: {
    ...theme.body2,
    color: theme.text.secondary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  sortOrderButtons: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  sortOrderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border.default,
    backgroundColor: theme.surface,
  },
  sortOrderButtonSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  sortOrderButtonText: {
    ...theme.body2,
    color: theme.text.secondary,
    marginLeft: theme.spacing[2],
    includeFontPadding: false,
  },
  sortOrderButtonTextSelected: {
    color: theme.text.inverse,
    fontWeight: theme.typography.fontWeights.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[6],
    gap: theme.spacing[3],
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  MoreVertical,
  Clock,
  Star,
} from 'lucide-react-native';
import { theme } from '@/theme';
import type { Trip } from '@/store/slices/tripsSlice';

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
  onMenuPress?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  showSelection?: boolean;
}

export default function TripCard({
  trip,
  onPress,
  onMenuPress,
  isSelected = false,
  onSelect,
  showSelection = false,
}: TripCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return 'No budget set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(budget);
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'planning':
        return theme.colors.primary[500];
      case 'active':
        return theme.colors.success;
      case 'completed':
        return theme.colors.secondary[500];
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.gray[500];
    }
  };

  const getStatusText = (status: Trip['status']) => {
    switch (status) {
      case 'planning':
        return 'Planning';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onPress}
      onLongPress={showSelection ? onSelect : undefined}
    >
      {/* Selection indicator */}
      {showSelection && (
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={onSelect}
          activeOpacity={0.7}
        >
          <View style={[
            styles.selectionIndicator,
            isSelected && styles.selectionIndicatorSelected,
          ]}>
            {isSelected && (
              <View style={styles.selectionCheck} />
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Trip Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: trip.image_url || 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <Text style={styles.statusText}>{getStatusText(trip.status)}</Text>
        </View>

        {/* Menu Button */}
        {onMenuPress && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <MoreVertical size={20} color={theme.text.inverse} />
          </TouchableOpacity>
        )}
      </View>

      {/* Trip Content */}
      <View style={styles.content}>
        {/* Title and Destination */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {trip.title}
          </Text>
          <View style={styles.destinationContainer}>
            <MapPin size={14} color={theme.text.secondary} />
            <Text style={styles.destination} numberOfLines={1}>
              {trip.destination}
            </Text>
          </View>
        </View>

        {/* Description */}
        {trip.description && (
          <Text style={styles.description} numberOfLines={2}>
            {trip.description}
          </Text>
        )}

        {/* Trip Details */}
        <View style={styles.details}>
          {/* Dates */}
          <View style={styles.detailItem}>
            <Calendar size={14} color={theme.text.secondary} />
            <Text style={styles.detailText}>
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </Text>
          </View>

          {/* Duration */}
          <View style={styles.detailItem}>
            <Clock size={14} color={theme.text.secondary} />
            <Text style={styles.detailText}>
              {trip.days_count} {trip.days_count === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          {/* Budget */}
          <View style={styles.budgetContainer}>
            <DollarSign size={14} color={theme.text.secondary} />
            <Text style={styles.budgetText}>
              {formatBudget(trip.budget)}
            </Text>
          </View>

          {/* Attractions Count */}
          {trip.attractions_count !== undefined && (
            <View style={styles.attractionsContainer}>
              <Star size={14} color={theme.colors.accent[500]} />
              <Text style={styles.attractionsText}>
                {trip.attractions_count} {trip.attractions_count === 1 ? 'place' : 'places'}
              </Text>
            </View>
          )}

          {/* Public indicator */}
          {trip.is_public && (
            <View style={styles.publicIndicator}>
              <Users size={14} color={theme.colors.info} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: theme.componentRadius.card,
    marginBottom: theme.spacing[4],
    ...theme.componentShadows.card,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primary[500],
  },
  selectionButton: {
    position: 'absolute',
    top: theme.spacing[3],
    left: theme.spacing[3],
    zIndex: 10,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.text.inverse,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionIndicatorSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  selectionCheck: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.text.inverse,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: theme.spacing[3],
    right: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    color: theme.text.inverse,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    includeFontPadding: false,
  },
  menuButton: {
    position: 'absolute',
    bottom: theme.spacing[3],
    right: theme.spacing[3],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing[4],
  },
  header: {
    marginBottom: theme.spacing[2],
  },
  title: {
    ...theme.h4,
    color: theme.text.primary,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destination: {
    ...theme.body2,
    color: theme.text.secondary,
    marginLeft: theme.spacing[1],
    flex: 1,
    includeFontPadding: false,
  },
  description: {
    ...theme.body2,
    color: theme.text.secondary,
    marginBottom: theme.spacing[3],
    lineHeight: 20,
    includeFontPadding: false,
  },
  details: {
    marginBottom: theme.spacing[3],
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  detailText: {
    ...theme.body2,
    color: theme.text.secondary,
    marginLeft: theme.spacing[2],
    includeFontPadding: false,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  budgetText: {
    ...theme.body2,
    color: theme.text.primary,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing[1],
    includeFontPadding: false,
  },
  attractionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing[3],
  },
  attractionsText: {
    ...theme.caption,
    color: theme.text.secondary,
    marginLeft: theme.spacing[1],
    includeFontPadding: false,
  },
  publicIndicator: {
    marginLeft: theme.spacing[2],
  },
});
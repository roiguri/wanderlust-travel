import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MapPin, Search, Navigation, Globe, Star } from 'lucide-react-native';
import FormInput from '@/components/ui/FormInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  updateFormField, 
  setDestinationQuery, 
  selectDestination,
  searchDestinationsAsync,
  clearDestinationSearch,
} from '@/store/slices/tripFormSlice';

export default function DestinationStep() {
  const dispatch = useAppDispatch();
  const { 
    formData, 
    errors, 
    destinationQuery, 
    destinationSuggestions, 
    selectedDestination,
    isLoadingDestinations,
  } = useAppSelector((state) => state.tripForm);

  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle destination search with debouncing
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (destinationQuery.trim().length >= 2) {
      const timeout = setTimeout(() => {
        dispatch(searchDestinationsAsync(destinationQuery));
      }, 300);
      setSearchTimeout(timeout);
    } else {
      dispatch(clearDestinationSearch());
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [destinationQuery, dispatch]);

  const handleDestinationInputChange = (text: string) => {
    dispatch(setDestinationQuery(text));
    dispatch(updateFormField({ field: 'destination', value: text }));
  };

  const handleSelectDestination = (destination: any) => {
    dispatch(selectDestination(destination));
  };

  const handleClearSelection = () => {
    dispatch(clearDestinationSearch());
    dispatch(updateFormField({ field: 'destination', value: '' }));
    dispatch(updateFormField({ field: 'destinationDetails', value: undefined }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Destination Search */}
      <View style={styles.searchSection}>
        <FormInput
          label="Destination"
          placeholder="Where would you like to go?"
          value={destinationQuery || formData.destination}
          onChangeText={handleDestinationInputChange}
          error={errors.destination}
          leftIcon={<Search size={20} color={theme.text.secondary} />}
          required
          helperText="Start typing to search for destinations"
        />

        {/* Loading indicator */}
        {isLoadingDestinations && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner size="small" />
            <Text style={styles.loadingText}>Searching destinations...</Text>
          </View>
        )}

        {/* Search Results */}
        {destinationSuggestions.length > 0 && !selectedDestination && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            {destinationSuggestions.map((destination) => (
              <TouchableOpacity
                key={destination.placeId}
                style={styles.suggestionItem}
                onPress={() => handleSelectDestination(destination)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: destination.photoUrl }}
                  style={styles.suggestionImage}
                  resizeMode="cover"
                />
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionName}>{destination.name}</Text>
                  <Text style={styles.suggestionAddress}>{destination.address}</Text>
                  <Text style={styles.suggestionDescription} numberOfLines={2}>
                    {destination.description}
                  </Text>
                </View>
                <View style={styles.suggestionAction}>
                  <Navigation size={16} color={theme.colors.primary[500]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Selected Destination */}
        {selectedDestination && (
          <View style={styles.selectedDestination}>
            <Text style={styles.selectedTitle}>Selected Destination</Text>
            <View style={styles.destinationCard}>
              <Image
                source={{ uri: selectedDestination.photoUrl }}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <View style={styles.destinationContent}>
                <View style={styles.destinationHeader}>
                  <Text style={styles.destinationName}>{selectedDestination.name}</Text>
                  <TouchableOpacity
                    onPress={handleClearSelection}
                    style={styles.clearButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.destinationMeta}>
                  <MapPin size={14} color={theme.text.secondary} />
                  <Text style={styles.destinationAddress}>
                    {selectedDestination.address}
                  </Text>
                </View>
                <Text style={styles.destinationDescription}>
                  {selectedDestination.description}
                </Text>
                
                {/* Destination Details */}
                <View style={styles.destinationDetails}>
                  <View style={styles.detailItem}>
                    <Globe size={14} color={theme.text.secondary} />
                    <Text style={styles.detailText}>{selectedDestination.country}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Star size={14} color={theme.colors.accent[500]} />
                    <Text style={styles.detailText}>Popular destination</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* No Results */}
        {destinationQuery.length >= 2 && 
         !isLoadingDestinations && 
         destinationSuggestions.length === 0 && 
         !selectedDestination && (
          <View style={styles.noResults}>
            <MapPin size={32} color={theme.colors.gray[400]} />
            <Text style={styles.noResultsTitle}>No destinations found</Text>
            <Text style={styles.noResultsText}>
              Try searching with a different term or check your spelling
            </Text>
          </View>
        )}
      </div>

      {/* Popular Destinations */}
      {!destinationQuery && !selectedDestination && (
        <View style={styles.popularSection}>
          <Text style={styles.popularTitle}>Popular Destinations</Text>
          <Text style={styles.popularSubtitle}>
            Get inspired by these trending travel spots
          </Text>
          
          <View style={styles.popularGrid}>
            {[
              {
                name: 'Tokyo, Japan',
                image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'Modern metropolis meets ancient tradition',
              },
              {
                name: 'Paris, France',
                image: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'City of Light and romance',
              },
              {
                name: 'Bali, Indonesia',
                image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'Tropical paradise and spiritual retreat',
              },
              {
                name: 'New York, USA',
                image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'The city that never sleeps',
              },
            ].map((destination, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularItem}
                onPress={() => handleDestinationInputChange(destination.name)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: destination.image }}
                  style={styles.popularImage}
                  resizeMode="cover"
                />
                <View style={styles.popularOverlay}>
                  <Text style={styles.popularName}>{destination.name}</Text>
                  <Text style={styles.popularDescription}>
                    {destination.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    marginBottom: theme.spacing[6],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing[3],
  },
  loadingText: {
    ...theme.body2,
    color: theme.text.secondary,
    marginLeft: theme.spacing[2],
    includeFontPadding: false,
  },
  suggestionsContainer: {
    marginTop: theme.spacing[3],
    backgroundColor: theme.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border.light,
    overflow: 'hidden',
  },
  suggestionsTitle: {
    ...theme.body2,
    color: theme.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    padding: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.border.light,
    includeFontPadding: false,
  },
  suggestionItem: {
    flexDirection: 'row',
    padding: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.border.light,
  },
  suggestionImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing[3],
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    ...theme.body1,
    color: theme.text.primary,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  suggestionAddress: {
    ...theme.caption,
    color: theme.text.secondary,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  suggestionDescription: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  suggestionAction: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spacing[2],
  },
  selectedDestination: {
    marginTop: theme.spacing[4],
  },
  selectedTitle: {
    ...theme.h5,
    color: theme.text.primary,
    marginBottom: theme.spacing[3],
    includeFontPadding: false,
  },
  destinationCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.componentShadows.card,
  },
  destinationImage: {
    width: '100%',
    height: 120,
  },
  destinationContent: {
    padding: theme.spacing[4],
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  destinationName: {
    ...theme.h4,
    color: theme.text.primary,
    flex: 1,
    includeFontPadding: false,
  },
  clearButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.sm,
  },
  clearButtonText: {
    ...theme.caption,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
  destinationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  destinationAddress: {
    ...theme.body2,
    color: theme.text.secondary,
    marginLeft: theme.spacing[1],
    includeFontPadding: false,
  },
  destinationDescription: {
    ...theme.body2,
    color: theme.text.secondary,
    marginBottom: theme.spacing[3],
    lineHeight: 20,
    includeFontPadding: false,
  },
  destinationDetails: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...theme.caption,
    color: theme.text.secondary,
    marginLeft: theme.spacing[1],
    includeFontPadding: false,
  },
  noResults: {
    alignItems: 'center',
    padding: theme.spacing[6],
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing[3],
  },
  noResultsTitle: {
    ...theme.h5,
    color: theme.text.primary,
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  noResultsText: {
    ...theme.body2,
    color: theme.text.secondary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  popularSection: {
    marginTop: theme.spacing[6],
  },
  popularTitle: {
    ...theme.h5,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  popularSubtitle: {
    ...theme.body2,
    color: theme.text.secondary,
    marginBottom: theme.spacing[4],
    includeFontPadding: false,
  },
  popularGrid: {
    gap: theme.spacing[3],
  },
  popularItem: {
    position: 'relative',
    height: 120,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing[3],
  },
  popularImage: {
    width: '100%',
    height: '100%',
  },
  popularOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing[3],
  },
  popularName: {
    ...theme.body1,
    color: theme.text.inverse,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  popularDescription: {
    ...theme.caption,
    color: theme.text.inverse,
    opacity: 0.9,
    includeFontPadding: false,
  },
});
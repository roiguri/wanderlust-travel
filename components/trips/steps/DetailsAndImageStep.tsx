import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Camera, Image as ImageIcon, Globe, Users, Upload, X, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  updateFormField, 
  uploadTripImageAsync,
} from '@/store/slices/tripFormSlice';
import { useToasts } from '@/hooks/useUI';

export default function DetailsAndImageStep() {
  const dispatch = useAppDispatch();
  const { 
    formData, 
    errors, 
    isUploadingImage, 
    uploadProgress,
  } = useAppSelector((state) => state.tripForm);
  
  const { showErrorToast, showSuccessToast } = useToasts();
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera roll permissions to select a cover photo.'
        );
        return false;
      }
    }
    return true;
  };

  const pickImageFromLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageData = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `trip-cover-${Date.now()}.jpg`,
        };

        await dispatch(uploadTripImageAsync(imageData)).unwrap();
        showSuccessToast('Image Uploaded', 'Cover photo has been set successfully');
      }
    } catch (error: any) {
      showErrorToast('Upload Failed', error.message || 'Failed to upload image');
    } finally {
      setImagePickerVisible(false);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      showErrorToast('Not Available', 'Camera is not available on web');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need camera permissions to take a photo.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageData = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `trip-cover-${Date.now()}.jpg`,
        };

        await dispatch(uploadTripImageAsync(imageData)).unwrap();
        showSuccessToast('Photo Taken', 'Cover photo has been set successfully');
      }
    } catch (error: any) {
      showErrorToast('Upload Failed', error.message || 'Failed to upload photo');
    } finally {
      setImagePickerVisible(false);
    }
  };

  const removeImage = () => {
    dispatch(updateFormField({ field: 'cover_image', value: undefined }));
  };

  const showImageOptions = () => {
    Alert.alert(
      'Cover Photo',
      'Choose how you want to add a cover photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImageFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cover Image */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cover Photo</Text>
        <Text style={styles.sectionDescription}>
          Add a beautiful cover photo to make your trip stand out
        </Text>

        {formData.cover_image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: formData.cover_image.uri }}
              style={styles.coverImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <TouchableOpacity
                style={styles.imageAction}
                onPress={showImageOptions}
                activeOpacity={0.7}
              >
                <Camera size={20} color={theme.text.inverse} />
                <Text style={styles.imageActionText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imageAction, styles.removeAction]}
                onPress={removeImage}
                activeOpacity={0.7}
              >
                <X size={20} color={theme.text.inverse} />
                <Text style={styles.imageActionText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={showImageOptions}
            disabled={isUploadingImage}
            activeOpacity={0.7}
          >
            {isUploadingImage ? (
              <View style={styles.uploadingContainer}>
                <LoadingSpinner size="small" />
                <Text style={styles.uploadingText}>
                  Uploading... {uploadProgress}%
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${uploadProgress}%` }
                    ]} 
                  />
                </View>
              </View>
            ) : (
              <>
                <ImageIcon size={32} color={theme.colors.gray[400]} />
                <Text style={styles.placeholderTitle}>Add Cover Photo</Text>
                <Text style={styles.placeholderText}>
                  Tap to select from library or take a photo
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Privacy Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Sharing</Text>
        <Text style={styles.sectionDescription}>
          Control who can see your trip
        </Text>

        <TouchableOpacity
          style={[
            styles.privacyOption,
            formData.is_public && styles.privacyOptionSelected,
          ]}
          onPress={() => dispatch(updateFormField({ field: 'is_public', value: !formData.is_public }))}
          activeOpacity={0.7}
        >
          <View style={styles.privacyIcon}>
            <Globe size={20} color={formData.is_public ? theme.text.inverse : theme.text.secondary} />
          </View>
          <View style={styles.privacyContent}>
            <Text style={[
              styles.privacyTitle,
              formData.is_public && styles.privacyTitleSelected,
            ]}>
              Make trip public
            </Text>
            <Text style={styles.privacyDescription}>
              Other users can discover and view your trip details
            </Text>
          </View>
          <View style={styles.privacyIndicator}>
            {formData.is_public && (
              <Check size={20} color={theme.colors.primary[500]} />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyNoteText}>
            {formData.is_public 
              ? "Your trip will be visible to other users and may appear in search results"
              : "Your trip will be private and only visible to you"
            }
          </Text>
        </View>
      </View>

      {/* Trip Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Summary</Text>
        <Text style={styles.sectionDescription}>
          Review your trip details before creating
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Title:</Text>
            <Text style={styles.summaryValue}>{formData.title || 'Not set'}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Destination:</Text>
            <Text style={styles.summaryValue}>{formData.destination || 'Not set'}</Text>
          </View>
          
          {formData.start_date && formData.end_date && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dates:</Text>
              <Text style={styles.summaryValue}>
                {new Date(formData.start_date).toLocaleDateString()} - {new Date(formData.end_date).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          {formData.budget && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Budget:</Text>
              <Text style={styles.summaryValue}>
                {formData.currency === 'USD' ? '$' : formData.currency} {formData.budget.toLocaleString()}
              </Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Type:</Text>
            <Text style={styles.summaryValue}>
              {formData.trip_type.charAt(0).toUpperCase() + formData.trip_type.slice(1)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Difficulty:</Text>
            <Text style={styles.summaryValue}>
              {formData.difficulty_level.charAt(0).toUpperCase() + formData.difficulty_level.slice(1)}
            </Text>
          </View>
          
          {formData.tags.length > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tags:</Text>
              <Text style={styles.summaryValue}>{formData.tags.join(', ')}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    ...theme.h5,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  sectionDescription: {
    ...theme.body2,
    color: theme.text.secondary,
    marginBottom: theme.spacing[4],
    includeFontPadding: false,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: theme.spacing[3],
    right: theme.spacing[3],
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  imageAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: theme.borderRadius.lg,
  },
  removeAction: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  imageActionText: {
    ...theme.caption,
    color: theme.text.inverse,
    marginLeft: theme.spacing[1],
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.border.default,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray[50],
  },
  placeholderTitle: {
    ...theme.h5,
    color: theme.text.primary,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  placeholderText: {
    ...theme.body2,
    color: theme.text.secondary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  uploadingContainer: {
    alignItems: 'center',
  },
  uploadingText: {
    ...theme.body2,
    color: theme.text.primary,
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[3],
    includeFontPadding: false,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.border.default,
    backgroundColor: theme.surface,
  },
  privacyOptionSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    ...theme.body1,
    color: theme.text.primary,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  privacyTitleSelected: {
    color: theme.colors.primary[600],
  },
  privacyDescription: {
    ...theme.body2,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  privacyIndicator: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyNote: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
  },
  privacyNoteText: {
    ...theme.caption,
    color: theme.text.secondary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  summaryCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.border.light,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  summaryLabel: {
    ...theme.body2,
    color: theme.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    width: 80,
    includeFontPadding: false,
  },
  summaryValue: {
    ...theme.body2,
    color: theme.text.primary,
    flex: 1,
    textAlign: 'right',
    includeFontPadding: false,
  },
});
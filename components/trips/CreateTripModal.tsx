import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { X, MapPin, Calendar, DollarSign, FileText, Globe } from 'lucide-react-native';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { theme } from '@/theme';
import { useAppDispatch } from '@/store/hooks';
import { createTripAsync, optimisticCreateTrip, type CreateTripData } from '@/store/slices/tripsSlice';
import { useToasts } from '@/hooks/useUI';

interface CreateTripModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateTripModal({ isVisible, onClose }: CreateTripModalProps) {
  const dispatch = useAppDispatch();
  const { showSuccessToast, showErrorToast } = useToasts();
  
  const [formData, setFormData] = useState<CreateTripData>({
    title: '',
    description: '',
    destination: '',
    start_date: '',
    end_date: '',
    budget: undefined,
    is_public: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTripData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTripData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Trip title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (startDate >= endDate) {
        newErrors.end_date = 'End date must be after start date';
      }
      
      if (startDate < new Date()) {
        newErrors.start_date = 'Start date cannot be in the past';
      }
    }
    
    if (formData.budget !== undefined && formData.budget < 0) {
      newErrors.budget = 'Budget cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      
      // Optimistic update
      dispatch(optimisticCreateTrip(formData));
      
      // Close modal immediately for better UX
      onClose();
      resetForm();
      
      // Show loading toast
      showSuccessToast('Creating Trip', 'Your trip is being created...');
      
      // Actual API call
      await dispatch(createTripAsync(formData)).unwrap();
      
      showSuccessToast('Trip Created', 'Your new trip has been created successfully!');
    } catch (error: any) {
      showErrorToast('Error', error.message || 'Failed to create trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      destination: '',
      start_date: '',
      end_date: '',
      budget: undefined,
      is_public: false,
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) {
      Alert.alert(
        'Creating Trip',
        'Your trip is being created. Please wait...',
        [{ text: 'OK' }]
      );
      return;
    }
    
    resetForm();
    onClose();
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    return formatDateForInput(new Date());
  };

  const getMinEndDate = () => {
    if (formData.start_date) {
      const startDate = new Date(formData.start_date);
      startDate.setDate(startDate.getDate() + 1);
      return formatDateForInput(startDate);
    }
    return getMinDate();
  };

  return (
    <Modal isVisible={isVisible} onClose={handleClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Trip</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={theme.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Title */}
        <FormInput
          label="Trip Title"
          placeholder="Enter trip title"
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          error={errors.title}
          leftIcon={<FileText size={20} color={theme.text.secondary} />}
          required
          maxLength={100}
        />

        {/* Destination */}
        <FormInput
          label="Destination"
          placeholder="Where are you going?"
          value={formData.destination}
          onChangeText={(text) => setFormData(prev => ({ ...prev, destination: text }))}
          error={errors.destination}
          leftIcon={<MapPin size={20} color={theme.text.secondary} />}
          required
          maxLength={200}
        />

        {/* Description */}
        <FormInput
          label="Description"
          placeholder="Tell us about your trip (optional)"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          error={errors.description}
          multiline
          numberOfLines={3}
          maxLength={500}
          style={styles.textArea}
        />

        {/* Date Range */}
        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <FormInput
              label="Start Date"
              placeholder="YYYY-MM-DD"
              value={formData.start_date}
              onChangeText={(text) => setFormData(prev => ({ ...prev, start_date: text }))}
              error={errors.start_date}
              leftIcon={<Calendar size={20} color={theme.text.secondary} />}
              required
              keyboardType="default"
            />
          </View>
          
          <View style={styles.dateField}>
            <FormInput
              label="End Date"
              placeholder="YYYY-MM-DD"
              value={formData.end_date}
              onChangeText={(text) => setFormData(prev => ({ ...prev, end_date: text }))}
              error={errors.end_date}
              leftIcon={<Calendar size={20} color={theme.text.secondary} />}
              required
              keyboardType="default"
            />
          </View>
        </View>

        {/* Budget */}
        <FormInput
          label="Budget (Optional)"
          placeholder="Enter your budget"
          value={formData.budget?.toString() || ''}
          onChangeText={(text) => {
            const budget = text ? parseFloat(text) : undefined;
            setFormData(prev => ({ ...prev, budget }));
          }}
          error={errors.budget}
          leftIcon={<DollarSign size={20} color={theme.text.secondary} />}
          keyboardType="numeric"
          helperText="Total budget for the entire trip"
        />

        {/* Public Trip Toggle */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleLabel}>
            <Globe size={20} color={theme.text.secondary} />
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Make trip public</Text>
              <Text style={styles.toggleDescription}>
                Other users can discover and view your trip
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.toggle,
              formData.is_public && styles.toggleActive,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, is_public: !prev.is_public }))}
            activeOpacity={0.7}
          >
            <View style={[
              styles.toggleThumb,
              formData.is_public && styles.toggleThumbActive,
            ]} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={handleClose}
          variant="secondary"
          style={styles.cancelButton}
          disabled={isSubmitting}
        />
        <Button
          title={isSubmitting ? "Creating..." : "Create Trip"}
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.createButton}
          disabled={isSubmitting}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  dateField: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.border.light,
    marginTop: theme.spacing[2],
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleTextContainer: {
    marginLeft: theme.spacing[3],
    flex: 1,
  },
  toggleTitle: {
    ...theme.body1,
    color: theme.text.primary,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  toggleDescription: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.gray[300],
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: theme.colors.primary[500],
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.surface,
    ...theme.shadows.sm,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[6],
    gap: theme.spacing[3],
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
});
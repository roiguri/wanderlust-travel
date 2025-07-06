import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { X, Save, ArrowLeft, ArrowRight, Wifi, WifiOff } from 'lucide-react-native';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  resetForm, 
  nextStep, 
  previousStep,
  saveDraftAsync,
  setOfflineStatus,
} from '@/store/slices/tripFormSlice';
import { createTripAsync } from '@/store/slices/tripsSlice';
import { useToasts } from '@/hooks/useUI';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import DestinationStep from './steps/DestinationStep';
import DatesAndBudgetStep from './steps/DatesAndBudgetStep';
import DetailsAndImageStep from './steps/DetailsAndImageStep';

interface CreateTripFlowProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateTripFlow({ isVisible, onClose }: CreateTripFlowProps) {
  const dispatch = useAppDispatch();
  const { 
    formData, 
    currentStep, 
    totalSteps, 
    isValid, 
    errors,
    isSubmitting,
    isSavingDraft,
    isOffline,
    lastDraftSave,
  } = useAppSelector((state) => state.tripForm);
  
  const { showSuccessToast, showErrorToast, showWarningToast } = useToasts();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Monitor network status
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => dispatch(setOfflineStatus(false));
      const handleOffline = () => dispatch(setOfflineStatus(true));
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [dispatch]);

  // Track unsaved changes
  useEffect(() => {
    const hasContent = formData.title || formData.destination || formData.description;
    setHasUnsavedChanges(hasContent && !lastDraftSave);
  }, [formData, lastDraftSave]);

  const validateCurrentStep = (): boolean => {
    const stepErrors: any = {};
    
    switch (currentStep) {
      case 1: // Basic Info
        if (!formData.title.trim()) {
          stepErrors.title = 'Trip title is required';
        } else if (formData.title.length < 3) {
          stepErrors.title = 'Title must be at least 3 characters';
        }
        break;
        
      case 2: // Destination
        if (!formData.destination.trim()) {
          stepErrors.destination = 'Destination is required';
        }
        break;
        
      case 3: // Dates & Budget
        if (!formData.start_date) {
          stepErrors.start_date = 'Start date is required';
        }
        if (!formData.end_date) {
          stepErrors.end_date = 'End date is required';
        }
        if (formData.start_date && formData.end_date) {
          const startDate = new Date(formData.start_date);
          const endDate = new Date(formData.end_date);
          
          if (startDate >= endDate) {
            stepErrors.end_date = 'End date must be after start date';
          }
          
          if (startDate < new Date()) {
            stepErrors.start_date = 'Start date cannot be in the past';
          }
        }
        if (formData.budget !== undefined && formData.budget < 0) {
          stepErrors.budget = 'Budget cannot be negative';
        }
        break;
        
      case 4: // Details & Image
        // Optional validation for final step
        break;
    }
    
    const hasErrors = Object.keys(stepErrors).length > 0;
    if (hasErrors) {
      showErrorToast('Validation Error', 'Please fix the errors before continuing');
    }
    
    return !hasErrors;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      dispatch(nextStep());
    }
  };

  const handlePrevious = () => {
    dispatch(previousStep());
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      showWarningToast('Draft Save', 'Please add a title before saving as draft');
      return;
    }

    try {
      await dispatch(saveDraftAsync(formData)).unwrap();
      showSuccessToast('Draft Saved', 'Your trip has been saved as a draft');
      setHasUnsavedChanges(false);
    } catch (error: any) {
      showErrorToast('Save Failed', error.message || 'Failed to save draft');
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    // Final validation
    const finalErrors: any = {};
    
    if (!formData.title.trim()) finalErrors.title = 'Title is required';
    if (!formData.destination.trim()) finalErrors.destination = 'Destination is required';
    if (!formData.start_date) finalErrors.start_date = 'Start date is required';
    if (!formData.end_date) finalErrors.end_date = 'End date is required';
    
    if (Object.keys(finalErrors).length > 0) {
      showErrorToast('Validation Error', 'Please complete all required fields');
      return;
    }

    try {
      // Convert form data to trip data
      const tripData = {
        title: formData.title,
        description: formData.description,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget,
        is_public: formData.is_public,
      };

      if (isOffline) {
        // Handle offline submission
        dispatch(addPendingSubmission(formData));
        showWarningToast('Offline Mode', 'Trip will be created when connection is restored');
        handleClose();
        return;
      }

      await dispatch(createTripAsync(tripData)).unwrap();
      
      showSuccessToast('Trip Created', 'Your trip has been created successfully!');
      handleClose();
    } catch (error: any) {
      showErrorToast('Creation Failed', error.message || 'Failed to create trip');
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Save Draft', 
            onPress: async () => {
              await handleSaveDraft();
              dispatch(resetForm());
              onClose();
            }
          },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              dispatch(resetForm());
              onClose();
            }
          },
        ]
      );
    } else {
      dispatch(resetForm());
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <DestinationStep />;
      case 3:
        return <DatesAndBudgetStep />;
      case 4:
        return <DetailsAndImageStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Basic Information';
      case 2:
        return 'Choose Destination';
      case 3:
        return 'Dates & Budget';
      case 4:
        return 'Details & Cover Photo';
      default:
        return 'Create Trip';
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={handleClose}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{getStepTitle()}</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>
              Step {currentStep} of {totalSteps}
            </Text>
            {isOffline && (
              <View style={styles.offlineIndicator}>
                <WifiOff size={14} color={theme.colors.warning} />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.headerActions}>
          {hasUnsavedChanges && (
            <TouchableOpacity
              style={styles.draftButton}
              onPress={handleSaveDraft}
              disabled={isSavingDraft}
              activeOpacity={0.7}
            >
              <Save size={20} color={theme.colors.secondary[500]} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentStep / totalSteps) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Step Content */}
      <View style={styles.content}>
        {renderStepContent()}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <Button
              title="Previous"
              onPress={handlePrevious}
              variant="secondary"
              icon={<ArrowLeft size={16} color={theme.text.primary} />}
              style={styles.navButton}
            />
          )}
          
          {currentStep < totalSteps ? (
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              icon={<ArrowRight size={16} color={theme.text.inverse} />}
              iconPosition="right"
              style={styles.navButton}
            />
          ) : (
            <Button
              title={isSubmitting ? "Creating..." : "Create Trip"}
              onPress={handleSubmit}
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          )}
        </View>
        
        {currentStep < totalSteps && (
          <Button
            title={isSavingDraft ? "Saving..." : "Save as Draft"}
            onPress={handleSaveDraft}
            variant="ghost"
            size="small"
            loading={isSavingDraft}
            disabled={isSavingDraft || !formData.title.trim()}
            style={styles.draftButtonFooter}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    ...theme.h3,
    color: theme.text.primary,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.warning + '20',
    borderRadius: theme.borderRadius.sm,
  },
  offlineText: {
    ...theme.caption,
    color: theme.colors.warning,
    marginLeft: theme.spacing[1],
    includeFontPadding: false,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  draftButton: {
    padding: theme.spacing[2],
    marginRight: theme.spacing[2],
  },
  closeButton: {
    padding: theme.spacing[1],
  },
  progressContainer: {
    marginBottom: theme.spacing[6],
  },
  progressTrack: {
    height: 4,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: 2,
  },
  content: {
    flex: 1,
    maxHeight: 500,
  },
  footer: {
    marginTop: theme.spacing[6],
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  navButton: {
    flex: 1,
    marginHorizontal: theme.spacing[1],
  },
  submitButton: {
    flex: 1,
  },
  draftButtonFooter: {
    alignSelf: 'center',
  },
});
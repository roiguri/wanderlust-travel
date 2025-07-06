import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar, DollarSign, Clock, TrendingUp, Users, Globe } from 'lucide-react-native';
import FormInput from '@/components/ui/FormInput';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormField } from '@/store/slices/tripFormSlice';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const difficultyLevels = [
  { 
    value: 'easy', 
    label: 'Easy', 
    description: 'Relaxed pace, comfortable accommodations',
    color: theme.colors.success,
  },
  { 
    value: 'moderate', 
    label: 'Moderate', 
    description: 'Some walking, mixed activities',
    color: theme.colors.warning,
  },
  { 
    value: 'challenging', 
    label: 'Challenging', 
    description: 'Active itinerary, adventure activities',
    color: theme.colors.error,
  },
] as const;

export default function DatesAndBudgetStep() {
  const dispatch = useAppDispatch();
  const { formData, errors } = useAppSelector((state) => state.tripForm);
  
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

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

  const calculateDuration = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const formatBudget = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    const number = parseFloat(numericValue);
    
    if (isNaN(number)) return '';
    
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const handleBudgetChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const number = parseFloat(numericValue);
    
    dispatch(updateFormField({ 
      field: 'budget', 
      value: isNaN(number) ? undefined : number 
    }));
  };

  const selectedCurrency = currencies.find(c => c.code === formData.currency) || currencies[0];
  const duration = calculateDuration();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Date Range */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Travel Dates</Text>
        <Text style={styles.sectionDescription}>
          When are you planning to travel?
        </Text>

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <FormInput
              label="Start Date"
              placeholder="YYYY-MM-DD"
              value={formData.start_date}
              onChangeText={(text) => dispatch(updateFormField({ field: 'start_date', value: text }))}
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
              onChangeText={(text) => dispatch(updateFormField({ field: 'end_date', value: text }))}
              error={errors.end_date}
              leftIcon={<Calendar size={20} color={theme.text.secondary} />}
              required
              keyboardType="default"
            />
          </View>
        </View>

        {/* Duration Display */}
        {duration > 0 && (
          <View style={styles.durationContainer}>
            <Clock size={16} color={theme.colors.primary[500]} />
            <Text style={styles.durationText}>
              {duration} {duration === 1 ? 'day' : 'days'} trip
            </Text>
          </View>
        )}
      </View>

      {/* Budget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget</Text>
        <Text style={styles.sectionDescription}>
          Set your total budget for this trip (optional)
        </Text>

        {/* Currency Selector */}
        <TouchableOpacity
          style={styles.currencySelector}
          onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
          activeOpacity={0.7}
        >
          <Globe size={20} color={theme.text.secondary} />
          <Text style={styles.currencyText}>
            {selectedCurrency.symbol} {selectedCurrency.code}
          </Text>
          <Text style={styles.currencyName}>{selectedCurrency.name}</Text>
        </TouchableOpacity>

        {/* Currency Options */}
        {showCurrencyPicker && (
          <View style={styles.currencyOptions}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  formData.currency === currency.code && styles.currencyOptionSelected,
                ]}
                onPress={() => {
                  dispatch(updateFormField({ field: 'currency', value: currency.code }));
                  setShowCurrencyPicker(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={styles.currencyCode}>{currency.code}</Text>
                  <Text style={styles.currencyFullName}>{currency.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Budget Input */}
        <FormInput
          label="Total Budget"
          placeholder="Enter your budget"
          value={formData.budget ? formatBudget(formData.budget.toString()) : ''}
          onChangeText={handleBudgetChange}
          error={errors.budget}
          leftIcon={<DollarSign size={20} color={theme.text.secondary} />}
          keyboardType="numeric"
          helperText={`Budget in ${selectedCurrency.name}${duration > 0 ? ` (≈${selectedCurrency.symbol}${formData.budget ? Math.round(formData.budget / duration) : 0}/day)` : ''}`}
        />

        {/* Budget Tips */}
        <View style={styles.budgetTips}>
          <View style={styles.tipItem}>
            <TrendingUp size={16} color={theme.colors.info} />
            <Text style={styles.tipText}>
              Include flights, accommodation, food, and activities
            </Text>
          </View>
          <View style={styles.tipItem}>
            <TrendingUp size={16} color={theme.colors.info} />
            <Text style={styles.tipText}>
              Add 10-20% buffer for unexpected expenses
            </Text>
          </View>
        </View>
      </View>

      {/* Group Size */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Group Size</Text>
        <Text style={styles.sectionDescription}>
          How many people will be traveling? (optional)
        </Text>

        <FormInput
          label="Maximum Travelers"
          placeholder="Number of travelers"
          value={formData.max_travelers?.toString() || ''}
          onChangeText={(text) => {
            const number = parseInt(text);
            dispatch(updateFormField({ 
              field: 'max_travelers', 
              value: isNaN(number) ? undefined : number 
            }));
          }}
          error={errors.max_travelers}
          leftIcon={<Users size={20} color={theme.text.secondary} />}
          keyboardType="numeric"
          helperText="Leave empty if traveling solo or group size is flexible"
        />
      </View>

      {/* Difficulty Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Difficulty Level</Text>
        <Text style={styles.sectionDescription}>
          How physically demanding will this trip be?
        </Text>

        <View style={styles.difficultyOptions}>
          {difficultyLevels.map((level) => {
            const isSelected = formData.difficulty_level === level.value;
            
            return (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.difficultyOption,
                  isSelected && styles.difficultyOptionSelected,
                  { borderColor: level.color },
                ]}
                onPress={() => dispatch(updateFormField({ field: 'difficulty_level', value: level.value }))}
                activeOpacity={0.7}
              >
                <View style={[styles.difficultyIndicator, { backgroundColor: level.color }]} />
                <View style={styles.difficultyContent}>
                  <Text style={[
                    styles.difficultyLabel,
                    isSelected && styles.difficultyLabelSelected,
                  ]}>
                    {level.label}
                  </Text>
                  <Text style={styles.difficultyDescription}>
                    {level.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
  dateRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  dateField: {
    flex: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.lg,
  },
  durationText: {
    ...theme.body2,
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing[2],
    includeFontPadding: false,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[3],
  },
  currencyText: {
    ...theme.body1,
    color: theme.text.primary,
    fontWeight: theme.typography.fontWeights.semibold,
    marginLeft: theme.spacing[2],
    includeFontPadding: false,
  },
  currencyName: {
    ...theme.body2,
    color: theme.text.secondary,
    marginLeft: theme.spacing[2],
    flex: 1,
    includeFontPadding: false,
  },
  currencyOptions: {
    backgroundColor: theme.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border.light,
    marginBottom: theme.spacing[4],
    overflow: 'hidden',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.border.light,
  },
  currencyOptionSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  currencySymbol: {
    ...theme.h5,
    color: theme.text.primary,
    width: 30,
    textAlign: 'center',
    includeFontPadding: false,
  },
  currencyInfo: {
    marginLeft: theme.spacing[3],
  },
  currencyCode: {
    ...theme.body1,
    color: theme.text.primary,
    fontWeight: theme.typography.fontWeights.semibold,
    includeFontPadding: false,
  },
  currencyFullName: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  budgetTips: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.info + '10',
    borderRadius: theme.borderRadius.lg,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  tipText: {
    ...theme.caption,
    color: theme.colors.info,
    marginLeft: theme.spacing[2],
    flex: 1,
    includeFontPadding: false,
  },
  difficultyOptions: {
    gap: theme.spacing[3],
  },
  difficultyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    backgroundColor: theme.surface,
  },
  difficultyOptionSelected: {
    backgroundColor: theme.colors.gray[50],
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing[3],
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyLabel: {
    ...theme.body1,
    color: theme.text.primary,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  difficultyLabelSelected: {
    color: theme.colors.primary[600],
  },
  difficultyDescription: {
    ...theme.body2,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
});
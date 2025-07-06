import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FileText, Hash, Users, Mountain, Heart, Briefcase, Compass, Baby } from 'lucide-react-native';
import FormInput from '@/components/ui/FormInput';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormField, addTag, removeTag } from '@/store/slices/tripFormSlice';

const tripTypes = [
  { value: 'leisure', label: 'Leisure', icon: Heart, color: theme.colors.primary[500] },
  { value: 'business', label: 'Business', icon: Briefcase, color: theme.colors.gray[600] },
  { value: 'adventure', label: 'Adventure', icon: Mountain, color: theme.colors.success },
  { value: 'cultural', label: 'Cultural', icon: Compass, color: theme.colors.accent[500] },
  { value: 'romantic', label: 'Romantic', icon: Heart, color: theme.colors.error },
  { value: 'family', label: 'Family', icon: Baby, color: theme.colors.secondary[500] },
  { value: 'solo', label: 'Solo', icon: Users, color: theme.colors.info },
] as const;

const popularTags = [
  'beach', 'mountains', 'city', 'nature', 'food', 'culture', 
  'history', 'photography', 'relaxation', 'shopping', 'nightlife', 'museums'
];

export default function BasicInfoStep() {
  const dispatch = useAppDispatch();
  const { formData, errors } = useAppSelector((state) => state.tripForm);
  
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      dispatch(addTag(newTag.trim()));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    dispatch(removeTag(tag));
  };

  const handleAddPopularTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      dispatch(addTag(tag));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Trip Title */}
      <FormInput
        label="Trip Title"
        placeholder="Enter a memorable title for your trip"
        value={formData.title}
        onChangeText={(text) => dispatch(updateFormField({ field: 'title', value: text }))}
        error={errors.title}
        leftIcon={<FileText size={20} color={theme.text.secondary} />}
        required
        maxLength={100}
        helperText="Give your trip a catchy name that captures its essence"
      />

      {/* Description */}
      <FormInput
        label="Description"
        placeholder="Describe what makes this trip special..."
        value={formData.description}
        onChangeText={(text) => dispatch(updateFormField({ field: 'description', value: text }))}
        error={errors.description}
        multiline
        numberOfLines={4}
        maxLength={500}
        style={styles.textArea}
        helperText="Share your vision, goals, or what you're most excited about"
      />

      {/* Trip Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Type</Text>
        <Text style={styles.sectionDescription}>
          What kind of experience are you planning?
        </Text>
        
        <View style={styles.tripTypesGrid}>
          {tripTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.trip_type === type.value;
            
            return (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.tripTypeOption,
                  isSelected && styles.tripTypeOptionSelected,
                ]}
                onPress={() => dispatch(updateFormField({ field: 'trip_type', value: type.value }))}
                activeOpacity={0.7}
              >
                <Icon 
                  size={24} 
                  color={isSelected ? theme.text.inverse : type.color} 
                />
                <Text style={[
                  styles.tripTypeText,
                  isSelected && styles.tripTypeTextSelected,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <Text style={styles.sectionDescription}>
          Add tags to help categorize and discover your trip
        </Text>

        {/* Current Tags */}
        {formData.tags.length > 0 && (
          <View style={styles.currentTags}>
            {formData.tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => handleRemoveTag(tag)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Text style={styles.tagRemove}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Add New Tag */}
        <View style={styles.addTagContainer}>
          <FormInput
            placeholder="Add a tag..."
            value={newTag}
            onChangeText={setNewTag}
            leftIcon={<Hash size={20} color={theme.text.secondary} />}
            onSubmitEditing={handleAddTag}
            returnKeyType="done"
            style={styles.tagInput}
          />
        </View>

        {/* Popular Tags */}
        <View style={styles.popularTagsContainer}>
          <Text style={styles.popularTagsTitle}>Popular tags:</Text>
          <View style={styles.popularTags}>
            {popularTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.popularTag,
                  formData.tags.includes(tag) && styles.popularTagSelected,
                ]}
                onPress={() => handleAddPopularTag(tag)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.popularTagText,
                  formData.tags.includes(tag) && styles.popularTagTextSelected,
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginTop: theme.spacing[6],
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
  tripTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  tripTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border.default,
    backgroundColor: theme.surface,
    minWidth: '45%',
  },
  tripTypeOptionSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  tripTypeText: {
    ...theme.body2,
    color: theme.text.primary,
    marginLeft: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
  tripTypeTextSelected: {
    color: theme.text.inverse,
  },
  currentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[100],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
  },
  tagText: {
    ...theme.body2,
    color: theme.colors.primary[700],
    marginRight: theme.spacing[2],
    includeFontPadding: false,
  },
  tagRemove: {
    ...theme.body1,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeights.bold,
    includeFontPadding: false,
  },
  addTagContainer: {
    marginBottom: theme.spacing[4],
  },
  tagInput: {
    marginBottom: 0,
  },
  popularTagsContainer: {
    marginTop: theme.spacing[2],
  },
  popularTagsTitle: {
    ...theme.body2,
    color: theme.text.secondary,
    marginBottom: theme.spacing[3],
    includeFontPadding: false,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  popularTag: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.border.default,
    backgroundColor: theme.surface,
  },
  popularTagSelected: {
    backgroundColor: theme.colors.secondary[100],
    borderColor: theme.colors.secondary[300],
  },
  popularTagText: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  popularTagTextSelected: {
    color: theme.colors.secondary[700],
    fontWeight: theme.typography.fontWeights.medium,
  },
});
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export default function FormInput({
  label,
  error,
  containerStyle,
  required = false,
  ...textInputProps
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    textInputProps.style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TextInput
        {...textInputProps}
        style={inputStyle}
        onFocus={(e) => {
          setIsFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          textInputProps.onBlur?.(e);
        }}
        placeholderTextColor={theme.text.disabled}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacingPatterns.form.fieldGap,
  },
  label: {
    ...theme.label,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  required: {
    color: theme.colors.error,
    marginLeft: theme.spacing[1],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border.default,
    borderRadius: theme.componentRadius.input,
    paddingHorizontal: theme.sizes.input.paddingHorizontal,
    paddingVertical: theme.sizes.input.paddingVertical,
    ...theme.body1,
    backgroundColor: theme.surface,
    color: theme.text.primary,
    minHeight: theme.sizes.input.height,
    ...theme.shadows.xs,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  inputFocused: {
    borderColor: theme.colors.primary[500],
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    ...theme.caption,
    color: theme.colors.error,
    marginTop: theme.spacing[1],
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
});
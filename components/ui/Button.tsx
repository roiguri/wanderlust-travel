import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { theme } from '@/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.semanticColors.button.primary.text : theme.semanticColors.button.primary.background}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.componentRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...theme.componentShadows.button,
  },
  primary: {
    backgroundColor: theme.semanticColors.button.primary.background,
    borderColor: theme.semanticColors.button.primary.border,
  },
  secondary: {
    backgroundColor: theme.semanticColors.button.secondary.background,
    borderColor: theme.semanticColors.button.secondary.border,
  },
  disabled: {
    backgroundColor: theme.semanticColors.button.disabled.background,
    borderColor: theme.semanticColors.button.disabled.border,
    ...theme.shadows.none,
  },
  small: {
    paddingVertical: theme.sizes.button.small.paddingVertical,
    paddingHorizontal: theme.sizes.button.small.paddingHorizontal,
    minHeight: theme.sizes.button.small.height,
  },
  medium: {
    paddingVertical: theme.sizes.button.medium.paddingVertical,
    paddingHorizontal: theme.sizes.button.medium.paddingHorizontal,
    minHeight: theme.sizes.button.medium.height,
  },
  large: {
    paddingVertical: theme.sizes.button.large.paddingVertical,
    paddingHorizontal: theme.sizes.button.large.paddingHorizontal,
    minHeight: theme.sizes.button.large.height,
  },
  baseText: {
    ...theme.textStyles.button,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  primaryText: {
    color: theme.semanticColors.button.primary.text,
  },
  secondaryText: {
    color: theme.semanticColors.button.secondary.text,
  },
  disabledText: {
    color: theme.semanticColors.button.disabled.text,
  },
  smallText: {
    fontSize: theme.typography.fontSizes.sm,
  },
  mediumText: {
    fontSize: theme.typography.fontSizes.md,
  },
  largeText: {
    fontSize: theme.typography.fontSizes.lg,
  },
});
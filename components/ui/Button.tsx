import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { theme } from '@/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
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
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={getLoadingColor(variant)}
            style={styles.loadingSpinner}
          />
          <Text style={textStyles}>Loading...</Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={[styles.contentContainer, iconPosition === 'right' && styles.contentReverse]}>
          {iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
          {iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      );
    }

    return <Text style={textStyles}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

function getLoadingColor(variant: string): string {
  switch (variant) {
    case 'primary':
    case 'danger':
      return theme.text.inverse;
    case 'secondary':
    case 'outline':
    case 'ghost':
      return theme.colors.primary[500];
    default:
      return theme.text.inverse;
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.componentRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...theme.componentShadows.button,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  secondary: {
    backgroundColor: theme.surface,
    borderColor: theme.border.default,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  
  // Sizes
  small: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    minHeight: theme.sizes.button.small.height,
  },
  medium: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    minHeight: theme.sizes.button.medium.height,
  },
  large: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    minHeight: theme.sizes.button.large.height,
  },
  
  // States
  disabled: {
    opacity: 0.5,
    ...theme.shadows.none,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  baseText: {
    ...theme.buttonText,
    textAlign: 'center',
    includeFontPadding: false,
  },
  primaryText: {
    color: theme.text.inverse,
  },
  secondaryText: {
    color: theme.text.primary,
  },
  outlineText: {
    color: theme.colors.primary[500],
  },
  ghostText: {
    color: theme.colors.primary[500],
  },
  dangerText: {
    color: theme.text.inverse,
  },
  disabledText: {
    color: theme.text.disabled,
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
  
  // Content layout
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentReverse: {
    flexDirection: 'row-reverse',
  },
  iconLeft: {
    marginRight: theme.spacing[2],
  },
  iconRight: {
    marginLeft: theme.spacing[2],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    marginRight: theme.spacing[2],
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '@/theme';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
  icon,
}: BadgeProps) {
  const badgeStyle = [
    styles.base,
    styles[variant],
    styles[size],
    style,
  ];

  const badgeTextStyle = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={badgeTextStyle}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.componentRadius.badge,
    alignSelf: 'flex-start',
  },
  
  // Variants
  default: {
    backgroundColor: theme.colors.gray[100],
  },
  primary: {
    backgroundColor: theme.colors.primary[500],
  },
  secondary: {
    backgroundColor: theme.colors.secondary[500],
  },
  success: {
    backgroundColor: theme.colors.success,
  },
  warning: {
    backgroundColor: theme.colors.warning,
  },
  error: {
    backgroundColor: theme.colors.error,
  },
  info: {
    backgroundColor: theme.colors.info,
  },
  
  // Sizes
  small: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    minHeight: 20,
  },
  medium: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    minHeight: 24,
  },
  large: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    minHeight: 32,
  },
  
  // Text styles
  baseText: {
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
  defaultText: {
    color: theme.text.primary,
  },
  primaryText: {
    color: theme.text.inverse,
  },
  secondaryText: {
    color: theme.text.inverse,
  },
  successText: {
    color: theme.text.inverse,
  },
  warningText: {
    color: theme.text.inverse,
  },
  errorText: {
    color: theme.text.inverse,
  },
  infoText: {
    color: theme.text.inverse,
  },
  smallText: {
    fontSize: theme.typography.fontSizes.xs,
  },
  mediumText: {
    fontSize: theme.typography.fontSizes.sm,
  },
  largeText: {
    fontSize: theme.typography.fontSizes.md,
  },
  
  // Icon
  icon: {
    marginRight: theme.spacing[1],
  },
});
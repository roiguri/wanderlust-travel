import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { theme } from '@/theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof theme.spacing;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  pressable?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 4,
  onPress,
  onLongPress,
  disabled = false,
  style,
  pressable = false,
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    { padding: theme.spacing[padding] },
    disabled && styles.disabled,
    style,
  ];

  const isInteractive = onPress || onLongPress || pressable;

  if (isInteractive) {
    return (
      <Pressable
        style={({ pressed }) => [
          cardStyle,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.surface,
    borderRadius: theme.componentRadius.card,
  },
  
  // Variants
  default: {
    ...theme.componentShadows.card,
  },
  elevated: {
    ...theme.componentShadows.cardElevated,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.border.default,
    ...theme.shadows.xs,
  },
  filled: {
    backgroundColor: theme.colors.gray[50],
    ...theme.shadows.xs,
  },
  
  // States
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
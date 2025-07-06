import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { theme } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({
  children,
  style,
  onPress,
  variant = 'default',
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.95}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.surface,
    borderRadius: theme.componentRadius.card,
    padding: theme.spacing[4],
  },
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
});
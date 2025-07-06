import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

export default function LoadingSpinner({
  size = 'medium',
  color = theme.colors.primary[500],
  message,
  overlay = false,
  style,
}: LoadingSpinnerProps) {
  const spinnerSize = getSpinnerSize(size);
  
  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator
        size={spinnerSize}
        color={color}
        style={styles.spinner}
      />
      {message && (
        <Text style={[styles.message, { color }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

function getSpinnerSize(size: string): 'small' | 'large' {
  switch (size) {
    case 'small':
      return 'small';
    case 'large':
      return 'large';
    case 'medium':
    default:
      return 'large';
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[4],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  spinner: {
    marginBottom: theme.spacing[2],
  },
  message: {
    ...theme.body2,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
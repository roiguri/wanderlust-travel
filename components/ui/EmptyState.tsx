import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';
import Button from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[6],
  },
  iconContainer: {
    marginBottom: theme.spacing[4],
    opacity: 0.6,
  },
  title: {
    ...theme.h4,
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  description: {
    ...theme.body1,
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    maxWidth: 300,
    includeFontPadding: false,
  },
  action: {
    minWidth: 120,
  },
});
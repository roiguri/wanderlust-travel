import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { theme } from '@/theme';
import { useLoading } from '@/hooks/useUI';

interface LoadingOverlayProps {
  message?: string;
  visible?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message,
  visible,
}) => {
  const { isGlobalLoading } = useLoading();
  
  const isVisible = visible !== undefined ? visible : isGlobalLoading;

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary[500]}
            style={styles.spinner}
          />
          {message && (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

interface InlineLoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message,
  size = 'small',
  color = theme.colors.primary[500],
}) => {
  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator
        size={size}
        color={color}
        style={styles.inlineSpinner}
      />
      {message && (
        <Text style={styles.inlineMessage}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.semanticColors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[8],
    alignItems: 'center',
    minWidth: 120,
    ...theme.shadows.lg,
  },
  spinner: {
    marginBottom: theme.spacing[4],
  },
  message: {
    ...theme.textStyles.body1,
    color: theme.semanticColors.text.primary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[4],
  },
  inlineSpinner: {
    marginRight: theme.spacing[2],
  },
  inlineMessage: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.secondary,
    includeFontPadding: false,
  },
});

export default LoadingOverlay;
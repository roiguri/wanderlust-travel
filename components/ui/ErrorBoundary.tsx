import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { theme } from '@/theme';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  retry: () => void;
}

function DefaultErrorFallback({ error, retry }: DefaultErrorFallbackProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertTriangle size={48} color={theme.colors.error} />
      </View>
      
      <Text style={styles.title}>Something went wrong</Text>
      
      <Text style={styles.message}>
        We're sorry, but something unexpected happened. Please try again.
      </Text>
      
      {__DEV__ && (
        <View style={styles.errorDetails}>
          <Text style={styles.errorTitle}>Error Details (Development):</Text>
          <Text style={styles.errorText}>{error.message}</Text>
          {error.stack && (
            <Text style={styles.stackTrace}>{error.stack}</Text>
          )}
        </View>
      )}
      
      <Button
        title="Try Again"
        onPress={retry}
        variant="primary"
        style={styles.retryButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
    backgroundColor: theme.background,
  },
  iconContainer: {
    marginBottom: theme.spacing[4],
  },
  title: {
    ...theme.h3,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
    includeFontPadding: false,
  },
  message: {
    ...theme.body1,
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    includeFontPadding: false,
  },
  errorDetails: {
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[6],
    width: '100%',
    maxWidth: 400,
  },
  errorTitle: {
    ...theme.body2,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.error,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  errorText: {
    ...theme.caption,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  stackTrace: {
    ...theme.caption,
    color: theme.text.secondary,
    fontFamily: 'monospace',
    includeFontPadding: false,
  },
  retryButton: {
    minWidth: 120,
  },
});
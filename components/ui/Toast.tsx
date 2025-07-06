import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle, Info, X } from 'lucide-react-native';
import { theme } from '@/theme';
import { useToasts } from '@/hooks/useUI';
import type { Toast as ToastType } from '@/store/slices/uiSlice';

const { width: screenWidth } = Dimensions.get('window');

interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToasts();
  const translateY = new Animated.Value(-100);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide if enabled
    if (toast.autoHide && toast.duration) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      removeToast(toast.id);
    });
  };

  const getIcon = () => {
    const iconProps = { size: 20, color: getIconColor() };
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'error':
        return <XCircle {...iconProps} />;
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      case 'info':
        return <Info {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.info;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return theme.colors.success + '20';
      case 'error':
        return theme.colors.error + '20';
      case 'warning':
        return theme.colors.warning + '20';
      case 'info':
        return theme.colors.info + '20';
      default:
        return theme.colors.info + '20';
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return theme.colors.success + '50';
      case 'error':
        return theme.colors.error + '50';
      case 'warning':
        return theme.colors.warning + '50';
      case 'info':
        return theme.colors.info + '50';
      default:
        return theme.colors.info + '50';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message && (
            <Text style={styles.message}>{toast.message}</Text>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleDismiss}
          activeOpacity={0.7}
        >
          <X size={16} color={theme.semanticColors.text.secondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

interface ToastContainerProps {}

export const ToastContainer: React.FC<ToastContainerProps> = () => {
  const { toasts } = useToasts();

  return (
    <View style={styles.toastContainer} pointerEvents="box-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60, // Below status bar
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: theme.spacing[4],
  },
  container: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    marginBottom: theme.spacing[2],
    ...theme.shadows.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing[4],
  },
  iconContainer: {
    marginRight: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.textStyles.body1,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.semanticColors.text.primary,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  message: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.secondary,
    includeFontPadding: false,
  },
  closeButton: {
    padding: theme.spacing[1],
    marginLeft: theme.spacing[2],
  },
});

export default Toast;
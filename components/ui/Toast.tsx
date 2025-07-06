import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import { theme } from '@/theme';
import { useAppDispatch } from '@/store/hooks';
import { removeToast, type Toast } from '@/store/slices/uiSlice';

interface ToastProps {
  toast: Toast;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const dispatch = useAppDispatch();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-hide toast
    if (toast.autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration || 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      dispatch(removeToast(toast.id));
    });
  };

  const getIcon = () => {
    const iconProps = { size: 20, color: theme.semanticColors.text.inverse };
    
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

  const getBackgroundColor = () => {
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
        return theme.colors.gray[800];
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor(), opacity: fadeAnim }
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
          <X size={18} color={theme.semanticColors.text.inverse} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <View style={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: theme.spacing[4],
    right: theme.spacing[4],
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  container: {
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[2],
    ...theme.shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  iconContainer: {
    marginRight: theme.spacing[3],
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.textStyles.body1,
    color: theme.semanticColors.text.inverse,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  message: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.inverse,
    opacity: 0.9,
    includeFontPadding: false,
  },
  closeButton: {
    marginLeft: theme.spacing[2],
    padding: theme.spacing[1],
  },
});
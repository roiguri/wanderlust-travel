import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanGestureHandler,
  State,
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
  const translateX = new Animated.Value(0);
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.9);

  useEffect(() => {
    // Animate in with slide down and scale up
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
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

  const handleDismiss = (direction: 'up' | 'right' = 'up') => {
    const animations = [
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 250,
        useNativeDriver: true,
      }),
    ];

    if (direction === 'up') {
      animations.push(
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        })
      );
    } else {
      animations.push(
        Animated.timing(translateX, {
          toValue: screenWidth + 50,
          duration: 250,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start(() => {
      removeToast(toast.id);
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      // If swiped far enough or fast enough, dismiss
      if (Math.abs(translationX) > screenWidth * 0.3 || Math.abs(velocityX) > 500) {
        handleDismiss('right');
      } else {
        // Spring back to original position
        Animated.spring(translateX, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    }
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
        return theme.colors.white;
      case 'error':
        return theme.colors.white;
      case 'warning':
        return theme.colors.gray[900];
      case 'info':
        return theme.colors.white;
      default:
        return theme.colors.white;
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
        return theme.colors.info;
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return theme.colors.white;
      case 'error':
        return theme.colors.white;
      case 'warning':
        return theme.colors.gray[900];
      case 'info':
        return theme.colors.white;
      default:
        return theme.colors.white;
    }
  };

  const getCloseButtonColor = () => {
    switch (toast.type) {
      case 'success':
        return theme.colors.white;
      case 'error':
        return theme.colors.white;
      case 'warning':
        return theme.colors.gray[700];
      case 'info':
        return theme.colors.white;
      default:
        return theme.colors.white;
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-10, 10]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: getBackgroundColor(),
            transform: [
              { translateY },
              { translateX },
              { scale },
            ],
            opacity,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {getIcon()}
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: getTextColor() }]}>
              {toast.title}
            </Text>
            {toast.message && (
              <Text style={[styles.message, { color: getTextColor() }]}>
                {toast.message}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleDismiss('up')}
            activeOpacity={0.7}
          >
            <X size={16} color={getCloseButtonColor()} />
          </TouchableOpacity>
        </View>
        
        {/* Swipe indicator */}
        <View style={styles.swipeIndicator} />
      </Animated.View>
    </PanGestureHandler>
  );
};

interface ToastContainerProps {}

export const ToastContainer: React.FC<ToastContainerProps> = () => {
  const { toasts } = useToasts();

  return (
    <View style={styles.toastContainer} pointerEvents="box-none">
      {toasts.map((toast, index) => (
        <View key={toast.id} style={[styles.toastWrapper, { zIndex: 1000 - index }]}>
          <Toast toast={toast} />
        </View>
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
  toastWrapper: {
    marginBottom: theme.spacing[2],
  },
  container: {
    borderRadius: theme.componentRadius.card,
    ...theme.componentShadows.card,
    overflow: 'hidden',
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
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  message: {
    ...theme.textStyles.body2,
    includeFontPadding: false,
    opacity: 0.9,
  },
  closeButton: {
    padding: theme.spacing[1],
    marginLeft: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
  },
  swipeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
});

export default Toast;
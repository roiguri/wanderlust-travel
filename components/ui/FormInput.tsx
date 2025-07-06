import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react-native';
import { theme } from '@/theme';

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

const FormInput = forwardRef<TextInput, FormInputProps>(({
  label,
  error,
  success,
  helperText,
  containerStyle,
  required = false,
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  variant = 'default',
  secureTextEntry,
  style,
  ...textInputProps
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const showPassword = showPasswordToggle && secureTextEntry;
  const actualSecureTextEntry = showPassword ? !isPasswordVisible : secureTextEntry;

  const inputStyle = [
    styles.input,
    styles[variant],
    isFocused && styles.inputFocused,
    hasError && styles.inputError,
    hasSuccess && styles.inputSuccess,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || showPassword || hasError || hasSuccess) && styles.inputWithRightIcon,
    style,
  ];

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderRightIcon = () => {
    if (showPassword) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={togglePasswordVisibility}
          accessibilityRole="button"
          accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
        >
          {isPasswordVisible ? (
            <EyeOff size={20} color={theme.text.secondary} />
          ) : (
            <Eye size={20} color={theme.text.secondary} />
          )}
        </TouchableOpacity>
      );
    }

    if (hasError) {
      return (
        <View style={styles.iconContainer}>
          <AlertCircle size={20} color={theme.colors.error} />
        </View>
      );
    }

    if (hasSuccess) {
      return (
        <View style={styles.iconContainer}>
          <CheckCircle size={20} color={theme.colors.success} />
        </View>
      );
    }

    if (rightIcon) {
      return <View style={styles.iconContainer}>{rightIcon}</View>;
    }

    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>{leftIcon}</View>
        )}
        
        <TextInput
          ref={ref}
          {...textInputProps}
          style={inputStyle}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          secureTextEntry={actualSecureTextEntry}
          placeholderTextColor={theme.text.disabled}
          accessibilityLabel={label}
          accessibilityHint={helperText}
        />
        
        {renderRightIcon()}
      </View>
      
      {(error || success || helperText) && (
        <View style={styles.messageContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && !error && <Text style={styles.successText}>{success}</Text>}
          {helperText && !error && !success && (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </View>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacingPatterns.form.fieldGap,
  },
  label: {
    ...theme.label,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  required: {
    color: theme.colors.error,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    ...theme.body1,
    color: theme.text.primary,
    minHeight: theme.sizes.input.height,
    paddingHorizontal: theme.sizes.input.paddingHorizontal,
    paddingVertical: theme.sizes.input.paddingVertical,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  
  // Variants
  default: {
    borderWidth: 1,
    borderColor: theme.border.default,
    borderRadius: theme.componentRadius.input,
    backgroundColor: theme.surface,
    ...theme.shadows.xs,
  },
  filled: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.componentRadius.input,
    borderWidth: 0,
  },
  outlined: {
    borderWidth: 2,
    borderColor: theme.border.default,
    borderRadius: theme.componentRadius.input,
    backgroundColor: 'transparent',
  },
  
  // States
  inputFocused: {
    borderColor: theme.colors.primary[500],
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputSuccess: {
    borderColor: theme.colors.success,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  
  // Icons
  leftIconContainer: {
    position: 'absolute',
    left: theme.spacing[3],
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    right: theme.spacing[3],
    zIndex: 1,
  },
  iconButton: {
    position: 'absolute',
    right: theme.spacing[3],
    padding: theme.spacing[1],
    zIndex: 1,
  },
  
  // Messages
  messageContainer: {
    marginTop: theme.spacing[1],
  },
  errorText: {
    ...theme.caption,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
  successText: {
    ...theme.caption,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
  helperText: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
});
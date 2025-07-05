# **Trip Planning App \- Best Practices Guide**

## **Design System & Theme**

### **Color Palette (Aligned with Current Implementation)**

// theme/colors.ts  
export const colors \= {  
  primary: {  
    50: '\#FFE6ED',  
    100: '\#FFB3CB',  
    200: '\#FF80AA',  
    300: '\#FF4D88',  
    400: '\#FF1A66',  
    500: '\#FF385C',  // Current brand color  
    600: '\#E6004F',  
    700: '\#CC0045',  
    800: '\#B3003C',  
    900: '\#990032',  
  },  
  secondary: {  
    50: '\#F0FDF4',  
    100: '\#DCFCE7',  
    200: '\#BBF7D0',  
    300: '\#86EFAC',  
    400: '\#4ADE80',  
    500: '\#22C55E',  // Success/nature color  
    600: '\#16A34A',  
    700: '\#15803D',  
    800: '\#166534',  
    900: '\#14532D',  
  },  
  accent: {  
    50: '\#FFF7ED',  
    100: '\#FFEDD5',  
    200: '\#FED7AA',  
    300: '\#FDBA74',  
    400: '\#FB923C',  
    500: '\#F97316',  // Warm accent  
    600: '\#EA580C',  
    700: '\#C2410C',  
    800: '\#9A3412',  
    900: '\#7C2D12',  
  },  
  gray: {  
    50: '\#F9FAFB',  
    100: '\#F3F4F6',  
    200: '\#E5E7EB',  
    300: '\#D1D5DB',  
    400: '\#9CA3AF',  
    500: '\#6B7280',  
    600: '\#4B5563',  
    700: '\#374151',  
    800: '\#1F2937',  
    900: '\#111827',  
  },  
  error: '\#EF4444',  
  warning: '\#F59E0B',  
  success: '\#10B981',  
  info: '\#3B82F6',  
};

// Theme configuration  
export const theme \= {  
  colors: {  
    ...colors,  
    background: colors.gray\[50\],  
    surface: '\#FFFFFF',  
    text: {  
      primary: colors.gray\[900\],  
      secondary: colors.gray\[600\],  
      disabled: colors.gray\[400\],  
    },  
    border: colors.gray\[200\],  
  },  
  fonts: {  
    heading: 'Inter\_700Bold',  
    body: 'Inter\_400Regular',  
    mono: 'JetBrainsMono\_400Regular',  
  },  
  fontSizes: {  
    xs: 12,  
    sm: 14,  
    md: 16,  
    lg: 18,  
    xl: 20,  
    '2xl': 24,  
    '3xl': 30,  
    '4xl': 36,  
  },  
  space: {  
    1: 4,  
    2: 8,  
    3: 12,  
    4: 16,  
    5: 20,  
    6: 24,  
    8: 32,  
    10: 40,  
    12: 48,  
    16: 64,  
    20: 80,  
  },  
  radii: {  
    none: 0,  
    sm: 2,  
    md: 6,  
    lg: 8,  
    xl: 12,  
    '2xl': 16,  
    '3xl': 24,  
    full: 9999,  
  },  
  shadows: {  
    sm: {  
      shadowColor: '\#000',  
      shadowOffset: { width: 0, height: 1 },  
      shadowOpacity: 0.18,  
      shadowRadius: 1.0,  
      elevation: 1,  
    },  
    md: {  
      shadowColor: '\#000',  
      shadowOffset: { width: 0, height: 2 },  
      shadowOpacity: 0.2,  
      shadowRadius: 2.62,  
      elevation: 4,  
    },  
    lg: {  
      shadowColor: '\#000',  
      shadowOffset: { width: 0, height: 4 },  
      shadowOpacity: 0.3,  
      shadowRadius: 4.65,  
      elevation: 8,  
    },  
  },  
};

### **Typography System**

// theme/typography.ts  
export const typography \= {  
  // Headings  
  h1: {  
    fontFamily: 'Inter\_700Bold',  
    fontSize: 36,  
    lineHeight: 40,  
    letterSpacing: \-0.5,  
  },  
  h2: {  
    fontFamily: 'Inter\_700Bold',  
    fontSize: 30,  
    lineHeight: 36,  
    letterSpacing: \-0.25,  
  },  
  h3: {  
    fontFamily: 'Inter\_600SemiBold',  
    fontSize: 24,  
    lineHeight: 32,  
    letterSpacing: 0,  
  },  
  h4: {  
    fontFamily: 'Inter\_600SemiBold',  
    fontSize: 20,  
    lineHeight: 28,  
    letterSpacing: 0.25,  
  },  
  h5: {  
    fontFamily: 'Inter\_500Medium',  
    fontSize: 18,  
    lineHeight: 24,  
    letterSpacing: 0,  
  },  
  h6: {  
    fontFamily: 'Inter\_500Medium',  
    fontSize: 16,  
    lineHeight: 24,  
    letterSpacing: 0.15,  
  },  
    
  // Body text  
  body1: {  
    fontFamily: 'Inter\_400Regular',  
    fontSize: 16,  
    lineHeight: 24,  
    letterSpacing: 0.5,  
  },  
  body2: {  
    fontFamily: 'Inter\_400Regular',  
    fontSize: 14,  
    lineHeight: 20,  
    letterSpacing: 0.25,  
  },  
    
  // UI text  
  button: {  
    fontFamily: 'Inter\_500Medium',  
    fontSize: 14,  
    lineHeight: 24,  
    letterSpacing: 1.25,  
    textTransform: 'uppercase',  
  },  
  caption: {  
    fontFamily: 'Inter\_400Regular',  
    fontSize: 12,  
    lineHeight: 16,  
    letterSpacing: 0.4,  
  },  
  overline: {  
    fontFamily: 'Inter\_400Regular',  
    fontSize: 10,  
    lineHeight: 16,  
    letterSpacing: 1.5,  
    textTransform: 'uppercase',  
  },  
};

## **Progressive Component Development**

### **Starting Simple (Current Approach)**

#### **Basic Button Component**

// components/ui/Button.tsx \- Current implementation enhanced  
import React from 'react';  
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {  
  title: string;  
  onPress: () \=\> void;  
  variant?: 'primary' | 'secondary';  
  size?: 'small' | 'medium' | 'large';  
  disabled?: boolean;  
  loading?: boolean;  
}

export const Button: React.FC\<ButtonProps\> \= ({  
  title,  
  onPress,  
  variant \= 'primary',  
  size \= 'medium',  
  disabled \= false,  
  loading \= false,  
}) \=\> {  
  return (  
    \<TouchableOpacity  
      style={\[styles.base, styles\[variant\], styles\[size\], disabled && styles.disabled\]}  
      onPress={onPress}  
      disabled={disabled || loading}  
      activeOpacity={0.7}  
    \>  
      {loading ? (  
        \<ActivityIndicator color={variant \=== 'primary' ? '\#ffffff' : '\#FF385C'} /\>  
      ) : (  
        \<Text style={\[styles.text, styles\[\`text\_${variant}\`\]\]}\>{title}\</Text\>  
      )}  
    \</TouchableOpacity\>  
  );  
};

// Simple styles using theme colors  
const styles \= StyleSheet.create({  
  base: {  
    borderRadius: 8,  
    alignItems: 'center',  
    justifyContent: 'center',  
    borderWidth: 1,  
  },  
  primary: {  
    backgroundColor: '\#FF385C', // Your current brand color  
    borderColor: '\#FF385C',  
  },  
  secondary: {  
    backgroundColor: '\#ffffff',  
    borderColor: '\#DDDDDD',  
  },  
  // ... rest of styles  
});

### **Evolution Path**

#### **Phase 1: Extract Theme (Next Step)**

// theme/colors.ts  
export const colors \= {  
  primary: '\#FF385C',  
  secondary: '\#22C55E',  
  background: '\#f8fafc',  
  surface: '\#ffffff',  
  text: {  
    primary: '\#222222',  
    secondary: '\#717171',  
  }  
};

// Updated Button using theme  
const styles \= StyleSheet.create({  
  primary: {  
    backgroundColor: colors.primary,  
    borderColor: colors.primary,  
  },  
  // ...  
});

#### **Phase 2: Advanced Patterns (Future)**

// components/ui/Button.tsx  
import React from 'react';  
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';  
import { theme } from '../../theme';

interface ButtonProps {  
  title: string;  
  onPress: () \=\> void;  
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';  
  size?: 'sm' | 'md' | 'lg';  
  disabled?: boolean;  
  loading?: boolean;  
  icon?: React.ReactNode;  
  style?: ViewStyle;  
  textStyle?: TextStyle;  
}

export const Button: React.FC\<ButtonProps\> \= ({  
  title,  
  onPress,  
  variant \= 'primary',  
  size \= 'md',  
  disabled \= false,  
  loading \= false,  
  icon,  
  style,  
  textStyle,  
}) \=\> {  
  const buttonStyle \= \[  
    styles.base,  
    styles\[variant\],  
    styles\[size\],  
    disabled && styles.disabled,  
    style,  
  \];

  const textStyles \= \[  
    styles.text,  
    styles\[\`text\_${variant}\`\],  
    styles\[\`text\_${size}\`\],  
    disabled && styles.textDisabled,  
    textStyle,  
  \];

  return (  
    \<TouchableOpacity  
      style={buttonStyle}  
      onPress={onPress}  
      disabled={disabled || loading}  
      activeOpacity={0.7}  
    \>  
      {icon && \<\>{icon}\</\>}  
      \<Text style={textStyles}\>{title}\</Text\>  
    \</TouchableOpacity\>  
  );  
};

const styles \= StyleSheet.create({  
  base: {  
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'center',  
    borderRadius: theme.radii.md,  
    ...theme.shadows.sm,  
  },  
    
  // Variants  
  primary: {  
    backgroundColor: theme.colors.primary\[500\],  
  },  
  secondary: {  
    backgroundColor: theme.colors.secondary\[500\],  
  },  
  outline: {  
    backgroundColor: 'transparent',  
    borderWidth: 1,  
    borderColor: theme.colors.primary\[500\],  
  },  
  ghost: {  
    backgroundColor: 'transparent',  
  },  
    
  // Sizes  
  sm: {  
    paddingHorizontal: theme.space\[3\],  
    paddingVertical: theme.space\[2\],  
    minHeight: 32,  
  },  
  md: {  
    paddingHorizontal: theme.space\[4\],  
    paddingVertical: theme.space\[3\],  
    minHeight: 40,  
  },  
  lg: {  
    paddingHorizontal: theme.space\[6\],  
    paddingVertical: theme.space\[4\],  
    minHeight: 48,  
  },  
    
  // States  
  disabled: {  
    opacity: 0.5,  
  },  
    
  // Text styles  
  text: {  
    ...theme.typography.button,  
    color: 'white',  
  },  
  text\_primary: {  
    color: 'white',  
  },  
  text\_secondary: {  
    color: 'white',  
  },  
  text\_outline: {  
    color: theme.colors.primary\[500\],  
  },  
  text\_ghost: {  
    color: theme.colors.primary\[500\],  
  },  
  text\_sm: {  
    fontSize: theme.fontSizes.sm,  
  },  
  text\_md: {  
    fontSize: theme.fontSizes.md,  
  },  
  text\_lg: {  
    fontSize: theme.fontSizes.lg,  
  },  
  textDisabled: {  
    color: theme.colors.text.disabled,  
  },  
});

### **Card Component**

// components/ui/Card.tsx  
import React from 'react';  
import { View, StyleSheet, ViewStyle } from 'react-native';  
import { theme } from '../../theme';

interface CardProps {  
  children: React.ReactNode;  
  variant?: 'default' | 'elevated' | 'outlined';  
  padding?: keyof typeof theme.space;  
  style?: ViewStyle;  
}

export const Card: React.FC\<CardProps\> \= ({  
  children,  
  variant \= 'default',  
  padding \= 4,  
  style,  
}) \=\> {  
  const cardStyle \= \[  
    styles.base,  
    styles\[variant\],  
    { padding: theme.space\[padding\] },  
    style,  
  \];

  return \<View style={cardStyle}\>{children}\</View\>;  
};

const styles \= StyleSheet.create({  
  base: {  
    backgroundColor: theme.colors.surface,  
    borderRadius: theme.radii.lg,  
  },  
  default: {  
    ...theme.shadows.sm,  
  },  
  elevated: {  
    ...theme.shadows.lg,  
  },  
  outlined: {  
    borderWidth: 1,  
    borderColor: theme.colors.border,  
  },  
});

## **State Management Approaches**

### **Context API Best Practices (Current)**

#### **Simple Auth Context (Current Working Pattern)**

// contexts/AuthContext.tsx \- Enhanced version of current  
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {  
  user: User | null;  
  isLoading: boolean;  
  isLoggedIn: boolean;  
  login: (data: LoginData) \=\> Promise\<void\>;  
  register: (data: RegisterData) \=\> Promise\<void\>;  
  logout: () \=\> Promise\<void\>;  
}

export const AuthProvider: React.FC\<{ children: React.ReactNode }\> \= ({ children }) \=\> {  
  const \[user, setUser\] \= useState\<User | null\>(null);  
  const \[isLoading, setIsLoading\] \= useState(true);

  // Keep your current auth logic here  
    
  return (  
    \<AuthContext.Provider value={{ user, isLoading, isLoggedIn: \!\!user, login, register, logout }}\>  
      {children}  
    \</AuthContext.Provider\>  
  );  
};

#### **Multiple Contexts Pattern (Growth Phase)**

// When app grows, split contexts by domain  
const AppProviders: React.FC\<{ children: React.ReactNode }\> \= ({ children }) \=\> (  
  \<AuthProvider\>  
    \<TripsProvider\>  
      \<UIProvider\>  
        {children}  
      \</UIProvider\>  
    \</TripsProvider\>  
  \</AuthProvider\>  
);

### **Redux Toolkit Migration (Future)**

// store/slices/tripsSlice.ts  
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';  
import { Trip, TripFilters } from '../../types';  
import { supabase } from '../../services/supabase';

interface TripsState {  
  trips: Trip\[\];  
  currentTrip: Trip | null;  
  loading: boolean;  
  error: string | null;  
  filters: TripFilters;  
}

const initialState: TripsState \= {  
  trips: \[\],  
  currentTrip: null,  
  loading: false,  
  error: null,  
  filters: {  
    status: 'all',  
    dateRange: null,  
    search: '',  
  },  
};

// Async thunks  
export const fetchTrips \= createAsyncThunk(  
  'trips/fetchTrips',  
  async (\_, { rejectWithValue }) \=\> {  
    try {  
      const { data, error } \= await supabase  
        .from('trips')  
        .select('\*')  
        .order('created\_at', { ascending: false });  
        
      if (error) throw error;  
      return data;  
    } catch (error) {  
      return rejectWithValue(error.message);  
    }  
  }  
);

export const createTrip \= createAsyncThunk(  
  'trips/createTrip',  
  async (tripData: Partial\<Trip\>, { rejectWithValue }) \=\> {  
    try {  
      const { data, error } \= await supabase  
        .from('trips')  
        .insert(\[tripData\])  
        .select()  
        .single();  
        
      if (error) throw error;  
      return data;  
    } catch (error) {  
      return rejectWithValue(error.message);  
    }  
  }  
);

const tripsSlice \= createSlice({  
  name: 'trips',  
  initialState,  
  reducers: {  
    setCurrentTrip: (state, action: PayloadAction\<Trip | null\>) \=\> {  
      state.currentTrip \= action.payload;  
    },  
    updateFilters: (state, action: PayloadAction\<Partial\<TripFilters\>\>) \=\> {  
      state.filters \= { ...state.filters, ...action.payload };  
    },  
    clearError: (state) \=\> {  
      state.error \= null;  
    },  
  },  
  extraReducers: (builder) \=\> {  
    builder  
      .addCase(fetchTrips.pending, (state) \=\> {  
        state.loading \= true;  
        state.error \= null;  
      })  
      .addCase(fetchTrips.fulfilled, (state, action) \=\> {  
        state.loading \= false;  
        state.trips \= action.payload;  
      })  
      .addCase(fetchTrips.rejected, (state, action) \=\> {  
        state.loading \= false;  
        state.error \= action.payload as string;  
      })  
      .addCase(createTrip.fulfilled, (state, action) \=\> {  
        state.trips.unshift(action.payload);  
      });  
  },  
});

export const { setCurrentTrip, updateFilters, clearError } \= tripsSlice.actions;  
export default tripsSlice.reducer;

### **Custom Hooks**

// hooks/useTrips.ts  
import { useSelector, useDispatch } from 'react-redux';  
import { useCallback } from 'react';  
import { RootState } from '../store';  
import { fetchTrips, createTrip, setCurrentTrip } from '../store/slices/tripsSlice';

export const useTrips \= () \=\> {  
  const dispatch \= useDispatch();  
  const { trips, currentTrip, loading, error, filters } \= useSelector(  
    (state: RootState) \=\> state.trips  
  );

  const loadTrips \= useCallback(() \=\> {  
    dispatch(fetchTrips());  
  }, \[dispatch\]);

  const addTrip \= useCallback((tripData: Partial\<Trip\>) \=\> {  
    return dispatch(createTrip(tripData));  
  }, \[dispatch\]);

  const selectTrip \= useCallback((trip: Trip | null) \=\> {  
    dispatch(setCurrentTrip(trip));  
  }, \[dispatch\]);

  return {  
    trips,  
    currentTrip,  
    loading,  
    error,  
    filters,  
    loadTrips,  
    addTrip,  
    selectTrip,  
  };  
};

## **Error Handling**

### **Error Boundary**

// components/common/ErrorBoundary.tsx  
import React from 'react';  
import { View, Text, StyleSheet } from 'react-native';  
import { Button } from '../ui/Button';  
import { theme } from '../../theme';

interface ErrorBoundaryState {  
  hasError: boolean;  
  error: Error | null;  
}

interface ErrorBoundaryProps {  
  children: React.ReactNode;  
  fallback?: React.ComponentType\<{ error: Error; retry: () \=\> void }\>;  
}

export class ErrorBoundary extends React.Component\<ErrorBoundaryProps, ErrorBoundaryState\> {  
  constructor(props: ErrorBoundaryProps) {  
    super(props);  
    this.state \= { hasError: false, error: null };  
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {  
    return { hasError: true, error };  
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {  
    console.error('ErrorBoundary caught an error:', error, errorInfo);  
    // Log to crash reporting service  
    // logErrorToService(error, errorInfo);  
  }

  handleRetry \= () \=\> {  
    this.setState({ hasError: false, error: null });  
  };

  render() {  
    if (this.state.hasError && this.state.error) {  
      if (this.props.fallback) {  
        const FallbackComponent \= this.props.fallback;  
        return \<FallbackComponent error={this.state.error} retry={this.handleRetry} /\>;  
      }

      return (  
        \<View style={styles.container}\>  
          \<Text style={styles.title}\>Something went wrong\</Text\>  
          \<Text style={styles.message}\>  
            We're sorry, but something unexpected happened. Please try again.  
          \</Text\>  
          \<Button  
            title="Try Again"  
            onPress={this.handleRetry}  
            variant="primary"  
          /\>  
        \</View\>  
      );  
    }

    return this.props.children;  
  }  
}

const styles \= StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    padding: theme.space\[6\],  
    backgroundColor: theme.colors.background,  
  },  
  title: {  
    ...theme.typography.h3,  
    color: theme.colors.text.primary,  
    marginBottom: theme.space\[2\],  
  },  
  message: {  
    ...theme.typography.body1,  
    color: theme.colors.text.secondary,  
    textAlign: 'center',  
    marginBottom: theme.space\[6\],  
  },  
});

### **Global Error Handler**

// utils/errorHandler.ts  
import { Alert } from 'react-native';

export interface AppError {  
  message: string;  
  code?: string;  
  details?: any;  
  timestamp: number;  
}

export class ErrorHandler {  
  static handle(error: Error | AppError, context?: string): void {  
    const appError: AppError \= {  
      message: error.message,  
      code: 'code' in error ? error.code : 'UNKNOWN\_ERROR',  
      details: error,  
      timestamp: Date.now(),  
    };

    // Log error  
    console.error(\`\[${context}\]\`, appError);

    // Show user-friendly message  
    this.showUserError(appError);

    // Report to crash analytics  
    this.reportError(appError, context);  
  }

  private static showUserError(error: AppError): void {  
    const userMessage \= this.getUserFriendlyMessage(error);  
      
    Alert.alert(  
      'Error',  
      userMessage,  
      \[{ text: 'OK', style: 'default' }\],  
      { cancelable: true }  
    );  
  }

  private static getUserFriendlyMessage(error: AppError): string {  
    switch (error.code) {  
      case 'NETWORK\_ERROR':  
        return 'Please check your internet connection and try again.';  
      case 'AUTH\_ERROR':  
        return 'Please sign in again to continue.';  
      case 'PERMISSION\_DENIED':  
        return 'Permission denied. Please check your app permissions.';  
      case 'LOCATION\_UNAVAILABLE':  
        return 'Location services are not available. Please enable location access.';  
      default:  
        return 'Something went wrong. Please try again.';  
    }  
  }

  private static reportError(error: AppError, context?: string): void {  
    // Report to crash analytics service  
    // Example: Sentry, Bugsnag, Firebase Crashlytics  
    // crashlytics().recordError(error);  
  }  
}

## **Performance Optimization**

### **Image Optimization**

// components/common/OptimizedImage.tsx  
import React, { useState } from 'react';  
import { Image, View, StyleSheet, ImageStyle, ViewStyle } from 'react-native';  
import { theme } from '../../theme';

interface OptimizedImageProps {  
  source: { uri: string } | number;  
  style?: ImageStyle;  
  placeholder?: React.ReactNode;  
  onLoad?: () \=\> void;  
  onError?: () \=\> void;  
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';  
}

export const OptimizedImage: React.FC\<OptimizedImageProps\> \= ({  
  source,  
  style,  
  placeholder,  
  onLoad,  
  onError,  
  resizeMode \= 'cover',  
}) \=\> {  
  const \[loading, setLoading\] \= useState(true);  
  const \[error, setError\] \= useState(false);

  const handleLoad \= () \=\> {  
    setLoading(false);  
    onLoad?.();  
  };

  const handleError \= () \=\> {  
    setLoading(false);  
    setError(true);  
    onError?.();  
  };

  return (  
    \<View style={\[styles.container, style\]}\>  
      {loading && (  
        \<View style={styles.placeholder}\>  
          {placeholder || \<View style={styles.defaultPlaceholder} /\>}  
        \</View\>  
      )}  
        
      {\!error && (  
        \<Image  
          source={source}  
          style={\[styles.image, style\]}  
          onLoad={handleLoad}  
          onError={handleError}  
          resizeMode={resizeMode}  
        /\>  
      )}  
        
      {error && (  
        \<View style={styles.errorContainer}\>  
          \<Text style={styles.errorText}\>Failed to load image\</Text\>  
        \</View\>  
      )}  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  container: {  
    overflow: 'hidden',  
  },  
  image: {  
    width: '100%',  
    height: '100%',  
  },  
  placeholder: {  
    ...StyleSheet.absoluteFillObject,  
    justifyContent: 'center',  
    alignItems: 'center',  
    backgroundColor: theme.colors.gray\[100\],  
  },  
  defaultPlaceholder: {  
    width: 40,  
    height: 40,  
    backgroundColor: theme.colors.gray\[300\],  
    borderRadius: theme.radii.sm,  
  },  
  errorContainer: {  
    ...StyleSheet.absoluteFillObject,  
    justifyContent: 'center',  
    alignItems: 'center',  
    backgroundColor: theme.colors.gray\[100\],  
  },  
  errorText: {  
    ...theme.typography.caption,  
    color: theme.colors.text.secondary,  
  },  
});

### **List Optimization**

// components/common/OptimizedList.tsx  
import React, { useMemo } from 'react';  
import { FlatList, FlatListProps, ViewStyle } from 'react-native';

interface OptimizedListProps\<T\> extends Omit\<FlatListProps\<T\>, 'data' | 'renderItem'\> {  
  data: T\[\];  
  renderItem: (item: T, index: number) \=\> React.ReactElement;  
  keyExtractor: (item: T, index: number) \=\> string;  
  estimatedItemSize?: number;  
}

export function OptimizedList\<T\>({  
  data,  
  renderItem,  
  keyExtractor,  
  estimatedItemSize \= 100,  
  ...props  
}: OptimizedListProps\<T\>) {  
  const optimizedData \= useMemo(() \=\> data, \[data\]);

  const getItemLayout \= useMemo(  
    () \=\> (data: T\[\] | null | undefined, index: number) \=\> ({  
      length: estimatedItemSize,  
      offset: estimatedItemSize \* index,  
      index,  
    }),  
    \[estimatedItemSize\]  
  );

  const renderOptimizedItem \= ({ item, index }: { item: T; index: number }) \=\> {  
    return renderItem(item, index);  
  };

  return (  
    \<FlatList  
      data={optimizedData}  
      renderItem={renderOptimizedItem}  
      keyExtractor={keyExtractor}  
      getItemLayout={getItemLayout}  
      removeClippedSubviews  
      maxToRenderPerBatch={10}  
      updateCellsBatchingPeriod={50}  
      initialNumToRender={10}  
      windowSize={10}  
      {...props}  
    /\>  
  );  
}

## **Form Handling Evolution**

### **Simple Form Validation (Current Level)**

// Simple validation for current implementation  
const LoginScreen \= () \=\> {  
  const \[email, setEmail\] \= useState('');  
  const \[password, setPassword\] \= useState('');  
  const \[errors, setErrors\] \= useState\<{email?: string; password?: string}\>({});

  const validateForm \= () \=\> {  
    const newErrors: {email?: string; password?: string} \= {};  
      
    if (\!email.trim()) {  
      newErrors.email \= 'Email is required';  
    } else if (\!/\\S+@\\S+\\.\\S+/.test(email)) {  
      newErrors.email \= 'Email is invalid';  
    }  
      
    if (\!password) {  
      newErrors.password \= 'Password is required';  
    } else if (password.length \< 6\) {  
      newErrors.password \= 'Password must be at least 6 characters';  
    }  
      
    setErrors(newErrors);  
    return Object.keys(newErrors).length \=== 0;  
  };

  const handleSubmit \= async () \=\> {  
    if (validateForm()) {  
      try {  
        await login({ email: email.trim(), password });  
      } catch (error) {  
        // Handle error  
      }  
    }  
  };

  return (  
    \<View\>  
      \<FormInput  
        label="Email"  
        value={email}  
        onChangeText={setEmail}  
        error={errors.email}  
        keyboardType="email-address"  
        autoCapitalize="none"  
      /\>  
      \<FormInput  
        label="Password"  
        value={password}  
        onChangeText={setPassword}  
        error={errors.password}  
        secureTextEntry  
      /\>  
      \<Button title="Sign In" onPress={handleSubmit} /\>  
    \</View\>  
  );  
};

### **Advanced Form Hook (Future Enhancement)**

// components/forms/FormField.tsx  
import React from 'react';  
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';  
import { theme } from '../../theme';

interface FormFieldProps extends TextInputProps {  
  label: string;  
  error?: string;  
  required?: boolean;  
  helperText?: string;  
}

export const FormField: React.FC\<FormFieldProps\> \= ({  
  label,  
  error,  
  required,  
  helperText,  
  style,  
  ...props  
}) \=\> {  
  return (  
    \<View style={styles.container}\>  
      \<Text style={styles.label}\>  
        {label}  
        {required && \<Text style={styles.required}\> \*\</Text\>}  
      \</Text\>  
        
      \<TextInput  
        style={\[  
          styles.input,  
          error && styles.inputError,  
          style,  
        \]}  
        placeholderTextColor={theme.colors.text.disabled}  
        {...props}  
      /\>  
        
      {error && \<Text style={styles.errorText}\>{error}\</Text\>}  
      {helperText && \!error && (  
        \<Text style={styles.helperText}\>{helperText}\</Text\>  
      )}  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  container: {  
    marginBottom: theme.space\[4\],  
  },  
  label: {  
    ...theme.typography.body2,  
    color: theme.colors.text.primary,  
    marginBottom: theme.space\[1\],  
    fontWeight: '500',  
  },  
  required: {  
    color: theme.colors.error,  
  },  
  input: {  
    ...theme.typography.body1,  
    borderWidth: 1,  
    borderColor: theme.colors.border,  
    borderRadius: theme.radii.md,  
    padding: theme.space\[3\],  
    backgroundColor: theme.colors.surface,  
    color: theme.colors.text.primary,  
  },  
  inputError: {  
    borderColor: theme.colors.error,  
  },  
  errorText: {  
    ...theme.typography.caption,  
    color: theme.colors.error,  
    marginTop: theme.space\[1\],  
  },  
  helperText: {  
    ...theme.typography.caption,  
    color: theme.colors.text.secondary,  
    marginTop: theme.space\[1\],  
  },  
});

### **Form Hook**

// hooks/useForm.ts  
import { useState, useCallback } from 'react';

interface FormState\<T\> {  
  values: T;  
  errors: Partial\<Record\<keyof T, string\>\>;  
  touched: Partial\<Record\<keyof T, boolean\>\>;  
}

interface ValidationRule\<T\> {  
  required?: boolean;  
  minLength?: number;  
  maxLength?: number;  
  pattern?: RegExp;  
  custom?: (value: T\[keyof T\], values: T) \=\> string | undefined;  
}

type ValidationRules\<T\> \= Partial\<Record\<keyof T, ValidationRule\<T\>\>\>;

export function useForm\<T extends Record\<string, any\>\>(  
  initialValues: T,  
  validationRules?: ValidationRules\<T\>  
) {  
  const \[state, setState\] \= useState\<FormState\<T\>\>({  
    values: initialValues,  
    errors: {},  
    touched: {},  
  });

  const setValue \= useCallback((name: keyof T, value: T\[keyof T\]) \=\> {  
    setState(prev \=\> ({  
      ...prev,  
      values: { ...prev.values, \[name\]: value },  
      touched: { ...prev.touched, \[name\]: true },  
    }));  
  }, \[\]);

  const setError \= useCallback((name: keyof T, error: string) \=\> {  
    setState(prev \=\> ({  
      ...prev,  
      errors: { ...prev.errors, \[name\]: error },  
    }));  
  }, \[\]);

  const clearError \= useCallback((name: keyof T) \=\> {  
    setState(prev \=\> ({  
      ...prev,  
      errors: { ...prev.errors, \[name\]: undefined },  
    }));  
  }, \[\]);

  const validate \= useCallback((values: T \= state.values): boolean \=\> {  
    if (\!validationRules) return true;

    const errors: Partial\<Record\<keyof T, string\>\> \= {};

    Object.keys(validationRules).forEach(key \=\> {  
      const fieldKey \= key as keyof T;  
      const rule \= validationRules\[fieldKey\];  
      const value \= values\[fieldKey\];

      if (rule?.required && (\!value || value \=== '')) {  
        errors\[fieldKey\] \= 'This field is required';  
        return;  
      }

      if (rule?.minLength && value && value.length \< rule.minLength) {  
        errors\[fieldKey\] \= \`Minimum length is ${rule.minLength}\`;  
        return;  
      }

      if (rule?.maxLength && value && value.length \> rule.maxLength) {  
        errors\[fieldKey\] \= \`Maximum length is ${rule.maxLength}\`;  
        return;  
      }

      if (rule?.pattern && value && \!rule.pattern.test(value)) {  
        errors\[fieldKey\] \= 'Invalid format';  
        return;  
      }

      if (rule?.custom) {  
        const customError \= rule.custom(value, values);  
        if (customError) {  
          errors\[fieldKey\] \= customError;  
          return;  
        }  
      }  
    });

    setState(prev \=\> ({ ...prev, errors }));  
    return Object.keys(errors).length \=== 0;  
  }, \[state.values, validationRules\]);

  const handleSubmit \= useCallback((onSubmit: (values: T) \=\> void) \=\> {  
    return () \=\> {  
      if (validate()) {  
        onSubmit(state.values);  
      }  
    };  
  }, \[state.values, validate\]);

  const reset \= useCallback(() \=\> {  
    setState({  
      values: initialValues,  
      errors: {},  
      touched: {},  
    });  
  }, \[initialValues\]);

  return {  
    values: state.values,  
    errors: state.errors,  
    touched: state.touched,  
    setValue,  
    setError,  
    clearError,  
    validate,  
    handleSubmit,  
    reset,  
    isValid: Object.keys(state.errors).length \=== 0,  
  };  
}

## **Navigation Best Practices**

### **Type-Safe Navigation**

// types/navigation.ts  
export type RootStackParamList \= {  
  Auth: undefined;  
  Main: undefined;  
};

export type MainTabParamList \= {  
  Explore: undefined;  
  Map: undefined;  
  Trips: undefined;  
  Record: undefined;  
  Profile: undefined;  
};

export type TripsStackParamList \= {  
  TripsList: undefined;  
  TripDetail: { tripId: string };  
  TripCreate: undefined;  
  TripEdit: { tripId: string };  
};

export type ExploreStackParamList \= {  
  ExploreHome: undefined;  
  AttractionDetail: { attractionId: string };  
  SearchResults: { query: string };  
};

// Navigation prop types  
export type RootStackNavigationProp \= StackNavigationProp\<RootStackParamList\>;  
export type MainTabNavigationProp \= BottomTabNavigationProp\<MainTabParamList\>;  
export type TripsStackNavigationProp \= StackNavigationProp\<TripsStackParamList\>;

### **Navigation Hook**

// hooks/useNavigation.ts  
import { useNavigation as useRNNavigation } from '@react-navigation/native';  
import { MainTabNavigationProp } from '../types/navigation';

export const useAppNavigation \= () \=\> {  
  return useRNNavigation\<MainTabNavigationProp\>();  
};

## **Testing Best Practices**

### **Component Testing**

// \_\_tests\_\_/components/Button.test.tsx  
import React from 'react';  
import { render, fireEvent } from '@testing-library/react-native';  
import { Button } from '../../src/components/ui/Button';

describe('Button', () \=\> {  
  it('renders correctly', () \=\> {  
    const { getByText } \= render(  
      \<Button title="Test Button" onPress={() \=\> {}} /\>  
    );  
      
    expect(getByText('Test Button')).toBeTruthy();  
  });

  it('calls onPress when pressed', () \=\> {  
    const mockOnPress \= jest.fn();  
    const { getByText } \= render(  
      \<Button title="Test Button" onPress={mockOnPress} /\>  
    );  
      
    fireEvent.press(getByText('Test Button'));  
    expect(mockOnPress).toHaveBeenCalledTimes(1);  
  });

  it('is disabled when disabled prop is true', () \=\> {  
    const mockOnPress \= jest.fn();  
    const { getByText } \= render(  
      \<Button title="Test Button" onPress={mockOnPress} disabled /\>  
    );  
      
    const button \= getByText('Test Button').parent;  
    expect(button).toHaveStyle({ opacity: 0.5 });  
  });  
});

### **Hook Testing**

// \_\_tests\_\_/hooks/useForm.test.ts  
import { renderHook, act } from '@testing-library/react-hooks';  
import { useForm } from '../../src/hooks/useForm';

describe('useForm', () \=\> {  
  it('should initialize with default values', () \=\> {  
    const { result } \= renderHook(() \=\>   
      useForm({ name: '', email: '' })  
    );

    expect(result.current.values).toEqual({ name: '', email: '' });  
    expect(result.current.errors).toEqual({});  
    expect(result.current.touched).toEqual({});  
  });

  it('should update values', () \=\> {  
    const { result } \= renderHook(() \=\>   
      useForm({ name: '', email: '' })  
    );

    act(() \=\> {  
      result.current.setValue('name', 'John Doe');  
    });

    expect(result.current.values.name).toBe('John Doe');  
    expect(result.current.touched.name).toBe(true);  
  });

  it('should validate required fields', () \=\> {  
    const { result } \= renderHook(() \=\>   
      useForm(  
        { name: '', email: '' },  
        { name: { required: true } }  
      )  
    );

    act(() \=\> {  
      result.current.validate();  
    });

    expect(result.current.errors.name).toBe('This field is required');  
    expect(result.current.isValid).toBe(false);  
  });  
});

## **Code Quality & Standards**

### **ESLint Configuration**

// .eslintrc.js  
{  
  "extends": \[  
    "expo",  
    "@react-native-community",  
    "plugin:@typescript-eslint/recommended"  
  \],  
  "parser": "@typescript-eslint/parser",  
  "plugins": \["@typescript-eslint"\],  
  "rules": {  
    "@typescript-eslint/no-unused-vars": "error",  
    "@typescript-eslint/explicit-function-return-type": "off",  
    "@typescript-eslint/explicit-module-boundary-types": "off",  
    "react-native/no-unused-styles": "error",  
    "react-native/split-platform-components": "error",  
    "react-native/no-inline-styles": "warn",  
    "react-native/no-color-literals": "warn",  
    "react-hooks/exhaustive-deps": "warn",  
    "prefer-const": "error",  
    "no-console": "warn"  
  }  
}

### **Prettier Configuration**

// .prettierrc  
{  
  "semi": true,  
  "trailingComma": "es5",  
  "singleQuote": true,  
  "printWidth": 80,  
  "tabWidth": 2,  
  "useTabs": false  
}

## **Performance Monitoring**

### **Performance Metrics**

// utils/performance.ts  
import { InteractionManager } from 'react-native';

export class PerformanceMonitor {  
  private static timers: Map\<string, number\> \= new Map();

  static startTimer(name: string): void {  
    this.timers.set(name, performance.now());  
  }

  static endTimer(name: string): number {  
    const startTime \= this.timers.get(name);  
    if (\!startTime) {  
      console.warn(\`Timer ${name} was not started\`);  
      return 0;  
    }

    const duration \= performance.now() \- startTime;  
    this.timers.delete(name);  
      
    console.log(\`Performance \[${name}\]: ${duration.toFixed(2)}ms\`);  
    return duration;  
  }

  static measureAsync\<T\>(  
    name: string,  
    fn: () \=\> Promise\<T\>  
  ): Promise\<T\> {  
    return new Promise((resolve, reject) \=\> {  
      InteractionManager.runAfterInteractions(() \=\> {  
        this.startTimer(name);  
        fn()  
          .then(result \=\> {  
            this.endTimer(name);  
            resolve(result);  
          })  
          .catch(error \=\> {  
            this.endTimer(name);  
            reject(error);  
          });  
      });  
    });  
  }  
}

This comprehensive best practices guide ensures your Bolt-developed trip planning app maintains high code quality, consistent styling, proper error handling, and optimal performance throughout the development process.


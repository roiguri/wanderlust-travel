// Travel app color palette
export const colors = {
  // Primary brand color (Airbnb-inspired)
  primary: {
    50: '#FFE6ED',
    100: '#FFB3CB',
    200: '#FF80AA',
    300: '#FF4D88',
    400: '#FF1A66',
    500: '#FF385C', // Main brand color
    600: '#E6004F',
    700: '#CC0045',
    800: '#B3003C',
    900: '#990032',
  },
  
  // Secondary nature greens
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Nature/success color
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  // Warm accent oranges
  accent: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Warm accent
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  
  // Neutral grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic colors
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  
  // Common colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Flattened semantic color mappings to prevent stack overflow
export const background = colors.gray[50];
export const surface = colors.white;

export const text = {
  primary: colors.gray[900],
  secondary: colors.gray[500],
  disabled: colors.gray[400],
  inverse: colors.white,
} as const;

export const border = {
  default: colors.gray[200],
  light: colors.gray[100],
  dark: colors.gray[300],
} as const;

export const button = {
  primary: {
    background: colors.primary[500],
    text: colors.white,
    border: colors.primary[500],
  },
  secondary: {
    background: colors.white,
    text: colors.gray[900],
    border: colors.gray[200],
  },
  disabled: {
    background: colors.gray[100],
    text: colors.gray[400],
    border: colors.gray[200],
  },
} as const;
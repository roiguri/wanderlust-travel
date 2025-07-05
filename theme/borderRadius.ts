// Border radius scale
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const;

// Component-specific radius presets
export const componentRadius = {
  button: borderRadius.lg, // 8px
  card: borderRadius.xl, // 12px
  input: borderRadius.lg, // 8px
  modal: borderRadius['2xl'], // 16px
  avatar: borderRadius.full,
  badge: borderRadius.full,
} as const;
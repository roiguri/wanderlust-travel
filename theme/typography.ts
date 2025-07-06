// Typography system
export const typography = {
  // Font families
  fonts: {
    heading: 'System', // Will use system font for now
    body: 'System',
    mono: 'Courier',
  },
  
  // Font sizes
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
  
  // Font weights
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeights: {
    tight: 1.3,
    normal: 1.6,
    relaxed: 1.8,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

// Flattened text style presets to prevent stack overflow
export const h1 = {
  fontSize: typography.fontSizes['4xl'],
  fontWeight: typography.fontWeights.bold,
  lineHeight: Math.round(typography.fontSizes['4xl'] * typography.lineHeights.tight),
  letterSpacing: typography.letterSpacing.tight,
} as const;

export const h2 = {
  fontSize: typography.fontSizes['3xl'],
  fontWeight: typography.fontWeights.bold,
  lineHeight: Math.round(typography.fontSizes['3xl'] * typography.lineHeights.tight),
  letterSpacing: typography.letterSpacing.tight,
} as const;

export const h3 = {
  fontSize: typography.fontSizes['2xl'],
  fontWeight: typography.fontWeights.semibold,
  lineHeight: Math.round(typography.fontSizes['2xl'] * typography.lineHeights.normal),
} as const;

export const h4 = {
  fontSize: typography.fontSizes.xl,
  fontWeight: typography.fontWeights.semibold,
  lineHeight: Math.round(typography.fontSizes.xl * typography.lineHeights.normal),
} as const;

export const h5 = {
  fontSize: typography.fontSizes.lg,
  fontWeight: typography.fontWeights.medium,
  lineHeight: Math.round(typography.fontSizes.lg * typography.lineHeights.normal),
} as const;

export const h6 = {
  fontSize: typography.fontSizes.md,
  fontWeight: typography.fontWeights.medium,
  lineHeight: Math.round(typography.fontSizes.md * typography.lineHeights.normal),
} as const;

export const body1 = {
  fontSize: typography.fontSizes.md,
  fontWeight: typography.fontWeights.normal,
  lineHeight: Math.round(typography.fontSizes.md * typography.lineHeights.normal),
} as const;

export const body2 = {
  fontSize: typography.fontSizes.sm,
  fontWeight: typography.fontWeights.normal,
  lineHeight: Math.round(typography.fontSizes.sm * typography.lineHeights.normal),
} as const;

export const buttonText = {
  fontSize: typography.fontSizes.md,
  fontWeight: typography.fontWeights.semibold,
  lineHeight: Math.round(typography.fontSizes.md * typography.lineHeights.tight),
} as const;

export const caption = {
  fontSize: typography.fontSizes.xs,
  fontWeight: typography.fontWeights.normal,
  lineHeight: Math.round(typography.fontSizes.xs * typography.lineHeights.normal),
} as const;

export const label = {
  fontSize: typography.fontSizes.sm,
  fontWeight: typography.fontWeights.medium,
  lineHeight: Math.round(typography.fontSizes.sm * typography.lineHeights.normal),
} as const;
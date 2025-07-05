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
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

// Text style presets
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSizes['4xl'], // 36
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSizes['3xl'], // 30
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.fontSizes['2xl'], // 24
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.normal,
  },
  h4: {
    fontSize: typography.fontSizes.xl, // 20
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.normal,
  },
  h5: {
    fontSize: typography.fontSizes.lg, // 18
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.normal,
  },
  h6: {
    fontSize: typography.fontSizes.md, // 16
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.normal,
  },
  
  // Body text
  body1: {
    fontSize: typography.fontSizes.md, // 16
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.lineHeights.normal,
  },
  body2: {
    fontSize: typography.fontSizes.sm, // 14
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.lineHeights.normal,
  },
  
  // UI text
  button: {
    fontSize: typography.fontSizes.md, // 16
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  caption: {
    fontSize: typography.fontSizes.xs, // 12
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.lineHeights.normal,
  },
  label: {
    fontSize: typography.fontSizes.sm, // 14
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.normal,
  },
} as const;
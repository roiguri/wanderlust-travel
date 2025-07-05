// 8px base spacing system
export const spacing = {
  0: 0,
  1: 4,   // 0.25rem
  2: 8,   // 0.5rem
  3: 12,  // 0.75rem
  4: 16,  // 1rem
  5: 20,  // 1.25rem
  6: 24,  // 1.5rem
  7: 28,  // 1.75rem
  8: 32,  // 2rem
  9: 36,  // 2.25rem
  10: 40, // 2.5rem
  11: 44, // 2.75rem
  12: 48, // 3rem
  14: 56, // 3.5rem
  16: 64, // 4rem
  20: 80, // 5rem
  24: 96, // 6rem
  28: 112, // 7rem
  32: 128, // 8rem
} as const;

// Common spacing patterns
export const spacingPatterns = {
  // Component internal spacing
  component: {
    xs: spacing[1], // 4px
    sm: spacing[2], // 8px
    md: spacing[3], // 12px
    lg: spacing[4], // 16px
    xl: spacing[6], // 24px
  },
  
  // Layout spacing
  layout: {
    xs: spacing[2], // 8px
    sm: spacing[4], // 16px
    md: spacing[6], // 24px
    lg: spacing[8], // 32px
    xl: spacing[12], // 48px
  },
  
  // Screen padding
  screen: {
    horizontal: spacing[4], // 16px
    vertical: spacing[6], // 24px
  },
  
  // Form spacing
  form: {
    fieldGap: spacing[5], // 20px
    sectionGap: spacing[6], // 24px
  },
} as const;
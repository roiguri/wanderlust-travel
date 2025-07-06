// Main theme configuration
import { colors, background, surface, text, border, button } from './colors';
import { spacing, spacingPatterns } from './spacing';
import { typography, h1, h2, h3, h4, h5, h6, body1, body2, buttonText, caption, label } from './typography';
import { shadows, componentShadows } from './shadows';
import { borderRadius, componentRadius } from './borderRadius';

export const theme = {
  // Color system
  colors,
  background,
  surface,
  text,
  border,
  button,
  
  // Spacing system
  spacing,
  spacingPatterns,
  
  // Typography system
  typography,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  body1,
  body2,
  buttonText,
  caption,
  label,
  
  // Shadow system
  shadows,
  componentShadows,
  
  // Border radius system
  borderRadius,
  componentRadius,
  
  // Component sizing
  sizes: {
    button: {
      small: {
        height: 36,
        paddingHorizontal: spacing[4], // 16px
        paddingVertical: spacing[2], // 8px
      },
      medium: {
        height: 48,
        paddingHorizontal: spacing[6], // 24px
        paddingVertical: spacing[3], // 12px
      },
      large: {
        height: 56,
        paddingHorizontal: spacing[8], // 32px
        paddingVertical: spacing[4], // 16px
      },
    },
    input: {
      height: 48,
      paddingHorizontal: spacing[4], // 16px
      paddingVertical: spacing[3], // 12px
    },
  },
  
  // Animation durations
  transitions: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};

// Export individual theme parts for convenience
export { colors, background, surface, text, border, button } from './colors';
export { spacing, spacingPatterns } from './spacing';
export { typography, h1, h2, h3, h4, h5, h6, body1, body2, buttonText, caption, label } from './typography';
export { shadows, componentShadows } from './shadows';
export { borderRadius, componentRadius } from './borderRadius';

// Type definitions for theme
export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Shadows = typeof shadows;
export type BorderRadius = typeof borderRadius;
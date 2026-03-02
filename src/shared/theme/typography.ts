// src/theme/typography.ts
export const typography = {
  fonts: {
    // Base fonts
    regular: 'Urbanist-Regular',
    medium: 'Urbanist-Medium',
    semiBold: 'Urbanist-SemiBold',
    bold: 'Urbanist-Bold',
    light: 'Urbanist-Light',

    // Extra (optional)
    extraBold: 'Urbanist-ExtraBold',
    black: 'Urbanist-Black',
    thin: 'Urbanist-Thin',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
};

// Text style presets
export const textStyles = {
  h1: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['3xl'],
    lineHeight: 38,
  },
  h2: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    lineHeight: 32,
  },
  h3: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xl,
    lineHeight: 28,
  },
  body: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.base,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.base,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.base,
    lineHeight: 24,
  },
  caption: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  small: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
  },
};
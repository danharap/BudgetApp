import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 52,
} as const;

export const FontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
  black: '900' as TextStyle['fontWeight'],
};

export const Typography = {
  // Display
  displayLarge: {
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -2,
  } as TextStyle,
  displayMedium: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -1.5,
  } as TextStyle,
  displaySmall: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -1,
  } as TextStyle,

  // Headings
  h1: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  } as TextStyle,

  // Body
  bodyLarge: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.regular,
    color: Colors.textPrimary,
  } as TextStyle,
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textPrimary,
  } as TextStyle,
  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  } as TextStyle,

  // Labels
  labelLarge: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  } as TextStyle,
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  } as TextStyle,
  labelSmall: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    letterSpacing: 0.3,
  } as TextStyle,

  // Caption
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
  } as TextStyle,

  // Numbers / money
  moneyLarge: {
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  moneyMedium: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  money: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  moneySmall: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
} as const;

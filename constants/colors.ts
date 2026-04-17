export const Colors = {
  // Base backgrounds
  background: '#080C18',
  backgroundSecondary: '#0D1221',

  // Card surfaces (layered depth)
  surface: '#111827',
  surfaceElevated: '#182035',
  surfaceBright: '#1E2A40',

  // Borders
  border: 'rgba(255, 255, 255, 0.07)',
  borderFocus: 'rgba(255, 255, 255, 0.15)',

  // Primary accent — green
  accent: '#22C55E',
  accentLight: '#4ADE80',
  accentDark: '#16A34A',
  accentGlow: 'rgba(34, 197, 94, 0.20)',
  accentGlowStrong: 'rgba(34, 197, 94, 0.35)',

  // Secondary accents
  blue: '#3B82F6',
  blueGlow: 'rgba(59, 130, 246, 0.20)',
  purple: '#8B5CF6',
  purpleGlow: 'rgba(139, 92, 246, 0.20)',
  orange: '#F97316',
  orangeGlow: 'rgba(249, 115, 22, 0.20)',
  red: '#EF4444',
  redGlow: 'rgba(239, 68, 68, 0.20)',
  yellow: '#EAB308',
  teal: '#14B8A6',
  pink: '#EC4899',
  indigo: '#6366F1',

  // Text hierarchy
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',
  textDisabled: '#334155',

  // Functional
  income: '#22C55E',
  expense: '#EF4444',
  transfer: '#3B82F6',

  // Tab bar
  tabActive: '#22C55E',
  tabInactive: '#475569',
  tabBackground: '#111827',

  // Glow orb colors for background
  glowBlue: 'rgba(59, 130, 246, 0.12)',
  glowGreen: 'rgba(34, 197, 94, 0.08)',
  glowPurple: 'rgba(139, 92, 246, 0.10)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // White utilities
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;

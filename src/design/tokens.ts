export const colors = {
  primary: '#281C59',
  secondary: '#4E8D9C',
  success: '#85C79A',
  lime: '#EDF7BD',
  surface: '#05060B',
  surfaceElevated: '#0A0B13',
  surfaceCard: '#151621',
  surfaceStrong: '#231F3B',
  surfaceSoft: '#1B1D2A',
  textPrimary: '#F8F8FC',
  textSecondary: '#A9A9BC',
  textMuted: '#777891',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#05060B',
  border: 'rgba(255,255,255,0.11)',
  borderStrong: 'rgba(237,247,189,0.24)',
  danger: '#FF6B7D',
  dangerSoft: 'rgba(255,107,125,0.16)',
  warning: '#F3AD5D',
} as const;

export const gradients = {
  primary: ['#4E8D9C', '#6E69D9', '#EDF7BD'] as const,
  cardStart: '#281C59',
  cardEnd: '#151621',
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  xs: 10,
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

export const touchTarget = {
  minHeight: 48,
} as const;

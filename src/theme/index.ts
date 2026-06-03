/**
 * AwesomeProject design tokens.
 * Brand palette is a teal/petrol primary with warm coral accents,
 * matching the marketplace's recognizable look.
 */

export const colors = {
  brand: '#0FA89E',
  brandDark: '#0B5D57',
  brandLight: '#E6F6F4',

  accent: '#FF6B35',
  sale: '#E2231A',

  text: '#16161D',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',

  background: '#FFFFFF',
  surface: '#F4F5F7',
  surfaceAlt: '#EEF0F2',
  border: '#E2E5EA',

  star: '#FFB400',
  success: '#2E9E5B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 26, fontWeight: '800' as const, color: colors.text },
  title: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 17, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.textMuted },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

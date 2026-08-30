/**
 * Bosluk, yaricap ve golge belirtecleri. Yumusak, hacimli ve dokunulabilir
 * kartlar icin comlu yaricaplar ve yumusak golgeler (README bolum 12).
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const shadow = {
  soft: {
    shadowColor: '#17143D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  lifted: {
    shadowColor: '#17143D',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
} as const;

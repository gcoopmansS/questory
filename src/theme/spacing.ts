// Consistent spacing scale (8px base)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Screen padding
export const screenPadding = {
  horizontal: spacing.md,
  vertical: spacing.lg,
} as const;

// Component spacing
export const componentSpacing = {
  headerHeight: 60,
  tabBarHeight: 80,
  buttonHeight: 48,
  cardPadding: spacing.md,
} as const;

export type SpacingKey = keyof typeof spacing;
// Pixel game inspired color palette
export const colors = {
  // Primary colors
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#F59E0B',
  
  // Backgrounds
  background: '#0F172A',
  surface: '#1E293B',
  card: '#334155',
  
  // Text
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Accents
  accent1: '#EC4899',
  accent2: '#8B5CF6',
  accent3: '#06B6D4',
  
  // UI elements
  border: '#475569',
  divider: '#334155',
  shadow: '#000000',
} as const;

export type ColorName = keyof typeof colors;
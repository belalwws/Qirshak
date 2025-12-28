export { colors, type ThemeColors, type ColorScheme } from './colors';
export { spacing, borderRadius, iconSize } from './spacing';
export { typography, fontSize, fontWeight, fontFamily, lineHeight } from './typography';

import { colors, type ThemeColors } from './colors';
import { spacing, borderRadius } from './spacing';
import { typography, fontSize, fontWeight } from './typography';

export const createTheme = (isDark: boolean) => ({
  colors: isDark ? colors.dark : colors.light,
  spacing,
  borderRadius,
  typography,
  fontSize,
  fontWeight,
  isDark,
});

export type Theme = ReturnType<typeof createTheme>;

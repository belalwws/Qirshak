import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { borderRadius, spacing, fontSize, fontWeight } from '@/theme';
import * as Haptics from 'expo-haptics';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  onPress,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const handlePress = (e: any) => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(e);
    }
  };

  const getBackgroundColor = (): string => {
    if (disabled) return colors.border;
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.backgroundSecondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return colors.textTertiary;
    
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return colors.text;
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.text;
      default:
        return '#FFFFFF';
    }
  };

  const getBorderColor = (): string => {
    if (disabled) return colors.border;
    if (variant === 'outline') return colors.primary;
    return 'transparent';
  };

  const getPadding = (): { paddingVertical: number; paddingHorizontal: number } => {
    switch (size) {
      case 'sm':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.base };
      case 'lg':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return fontSize.sm;
      case 'lg':
        return fontSize.lg;
      default:
        return fontSize.base;
    }
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outline' ? 1.5 : 0,
    ...getPadding(),
  };

  const textStyle: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <React.Fragment>{icon}</React.Fragment>
          )}
          <Text style={[styles.text, textStyle, icon ? styles.textWithIcon : undefined]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <React.Fragment>{icon}</React.Fragment>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.base,
    gap: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  textWithIcon: {
    marginHorizontal: spacing.xs,
  },
});

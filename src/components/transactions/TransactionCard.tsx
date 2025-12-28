import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { Transaction } from '@/types';
import { getCategoryById, formatCurrency, formatRelativeDate } from '@/utils';
import { borderRadius, spacing, fontSize, fontWeight } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '@/store';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onLongPress?: () => void;
  showFullDate?: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
  onLongPress,
  showFullDate = false,
}) => {
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const { language } = useLocalization();
  const { currency } = useSettingsStore();
  
  const category = getCategoryById(transaction.categoryId);
  const isIncome = transaction.type === 'income';
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
  
  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  };

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      'restaurant': 'restaurant',
      'car': 'car',
      'cart': 'cart',
      'game-controller': 'game-controller',
      'receipt': 'receipt',
      'medical': 'medical',
      'school': 'school',
      'wallet': 'wallet',
      'briefcase': 'briefcase',
      'trending-up': 'trending-up',
      'gift': 'gift',
      'ellipsis-horizontal': 'ellipsis-horizontal',
    };
    return iconMap[category?.icon || 'ellipsis-horizontal'] || 'ellipsis-horizontal';
  };

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
    },
    android: {
      elevation: isDark ? 4 : 2,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        shadowStyle,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      android_ripple={{ color: colors.border, borderless: false }}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${category?.color || colors.primary}15` },
        ]}
      >
        <Ionicons
          name={getIconName()}
          size={22}
          color={category?.color || colors.primary}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={1}>
          {language === 'ar' ? (category?.nameAr || 'أخرى') : (category?.name || 'Other')}
        </Text>
        {transaction.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {transaction.description}
          </Text>
        ) : (
          <Text style={[styles.description, { color: colors.textTertiary }]}>
            {formatRelativeDate(transaction.date, language === 'ar')}
          </Text>
        )}
      </View>
      
      <View style={styles.amountContainer}>
        <View style={[
          styles.amountBadge,
          { backgroundColor: isIncome ? `${colors.success}15` : `${colors.danger}10` }
        ]}>
          <Text
            style={[
              styles.amount,
              { color: isIncome ? colors.success : colors.danger },
            ]}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </Text>
        </View>
        {transaction.description && (
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {formatRelativeDate(transaction.date, language === 'ar')}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  categoryName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  description: {
    fontSize: fontSize.sm,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.base,
  },
  amount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  date: {
    fontSize: fontSize.xs,
    marginTop: 4,
  },
});

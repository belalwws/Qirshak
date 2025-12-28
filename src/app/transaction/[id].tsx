import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useTransactionStore, useSettingsStore } from '@/store';
import { Card, Button } from '@/components/ui';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { getCategoryById, formatCurrency, formatDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TransactionDetailScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { currency } = useSettingsStore();
  
  const { getTransactionById, deleteTransaction } = useTransactionStore();
  
  const transaction = getTransactionById(id || '');
  const category = transaction ? getCategoryById(transaction.categoryId) : null;

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle" size={64} color={colors.textTertiary} />
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
            المعاملة غير موجودة
          </Text>
          <Button title="العودة" onPress={() => router.back()} variant="primary" />
        </View>
      </View>
    );
  }

  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    Alert.alert(
      'حذف المعاملة',
      'هل أنت متأكد من حذف هذه المعاملة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            deleteTransaction(transaction.id);
            router.back();
          },
        },
      ]
    );
  };

  const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
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
    return iconMap[iconName] || 'ellipsis-horizontal';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Card */}
        <Card
          variant="elevated"
          style={[
            styles.amountCard,
            { backgroundColor: isIncome ? colors.success : colors.danger },
          ]}
        >
          <View style={styles.amountHeader}>
            <View
              style={[
                styles.typeIconContainer,
                { backgroundColor: 'rgba(255,255,255,0.2)' },
              ]}
            >
              <Ionicons
                name={isIncome ? 'arrow-up' : 'arrow-down'}
                size={24}
                color="#FFFFFF"
              />
            </View>
            <Text style={styles.typeLabel}>
              {isIncome ? 'دخل' : 'مصروف'}
            </Text>
          </View>
          
          <Text style={styles.amount}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </Text>
        </Card>

        {/* Details Card */}
        <Card variant="elevated" style={styles.detailsCard}>
          {/* Category */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="pricetag" size={20} color={colors.textSecondary} />
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>
                الفئة
              </Text>
            </View>
            <View style={styles.detailValue}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: (category?.color || colors.primary) + '20' },
                ]}
              >
                <Ionicons
                  name={getIconName(category?.icon || 'ellipsis-horizontal')}
                  size={16}
                  color={category?.color || colors.primary}
                />
              </View>
              <Text style={[styles.valueText, { color: colors.text }]}>
                {category?.nameAr || 'غير محدد'}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="calendar" size={20} color={colors.textSecondary} />
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>
                التاريخ
              </Text>
            </View>
            <Text style={[styles.valueText, { color: colors.text }]}>
              {formatDate(transaction.date, 'EEEE، d MMMM yyyy', true)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="time" size={20} color={colors.textSecondary} />
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>
                الوقت
              </Text>
            </View>
            <Text style={[styles.valueText, { color: colors.text }]}>
              {formatDate(transaction.createdAt, 'hh:mm a')}
            </Text>
          </View>

          {transaction.description && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              {/* Description */}
              <View style={styles.descriptionRow}>
                <View style={styles.detailLabel}>
                  <Ionicons name="document-text" size={20} color={colors.textSecondary} />
                  <Text style={[styles.labelText, { color: colors.textSecondary }]}>
                    ملاحظات
                  </Text>
                </View>
                <Text style={[styles.descriptionText, { color: colors.text }]}>
                  {transaction.description}
                </Text>
              </View>
            </>
          )}
        </Card>
      </ScrollView>

      {/* Actions */}
      <View
        style={[
          styles.actionsContainer,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + spacing.base,
          },
        ]}
      >
        <Button
          title="حذف المعاملة"
          onPress={handleDelete}
          variant="danger"
          fullWidth
          icon={<Ionicons name="trash" size={20} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
  },
  notFoundText: {
    fontSize: fontSize.lg,
  },
  amountCard: {
    marginBottom: spacing.base,
    padding: spacing.xl,
  },
  amountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
  },
  detailsCard: {
    marginBottom: spacing.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  labelText: {
    fontSize: fontSize.base,
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  valueText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
  },
  descriptionRow: {
    paddingVertical: spacing.md,
  },
  descriptionText: {
    fontSize: fontSize.base,
    marginTop: spacing.sm,
    lineHeight: 24,
  },
  actionsContainer: {
    padding: spacing.base,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

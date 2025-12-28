import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { useTransactionStore, useSettingsStore } from '@/store';
import { TransactionCard } from '@/components/transactions';
import { EmptyState } from '@/components/ui';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionType } from '@/types';
import { formatCurrency } from '@/utils';

type FilterType = 'all' | 'income' | 'expense';

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t, isRTL } = useLocalization();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currency } = useSettingsStore();
  
  const { transactions, getTotalByType } = useTransactionStore();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // حساب Tab Bar height
  const bottomInset = Math.max(insets.bottom, 20);
  const tabBarHeight = 60 + bottomInset;

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    
    // Filter by type
    if (filter !== 'all') {
      result = result.filter((t) => t.type === filter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(query) ||
          t.categoryId.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, filter, searchQuery]);

  const totalIncome = getTotalByType('income');
  const totalExpense = getTotalByType('expense');

  const handleFilterChange = (newFilter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(newFilter);
  };

  const FilterButton = ({
    type,
    label,
    color,
  }: {
    type: FilterType;
    label: string;
    color?: string;
  }) => (
    <Pressable
      style={[
        styles.filterButton,
        {
          backgroundColor:
            filter === type ? colors.primary : colors.backgroundSecondary,
        },
      ]}
      onPress={() => handleFilterChange(type)}
    >
      <Text
        style={[
          styles.filterText,
          { color: filter === type ? '#FFFFFF' : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: colors.success + '15' }]}>
          <Ionicons name="arrow-up-circle" size={24} color={colors.success} />
          <View style={styles.summaryContent}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {t.totalIncome}
            </Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {formatCurrency(totalIncome, currency)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: colors.danger + '15' }]}>
          <Ionicons name="arrow-down-circle" size={24} color={colors.danger} />
          <View style={styles.summaryContent}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {t.totalExpense}
            </Text>
            <Text style={[styles.summaryValue, { color: colors.danger }]}>
              {formatCurrency(totalExpense, currency)}
            </Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FilterButton type="all" label={t.all} />
        <FilterButton type="income" label={t.income} />
        <FilterButton type="expense" label={t.expense} />
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={searchQuery ? t.noResults : t.noTransactions}
            description={
              searchQuery
                ? t.tryDifferentFilter
                : t.startTracking
            }
            actionLabel={searchQuery ? undefined : t.addTransaction}
            onAction={searchQuery ? undefined : () => router.push('/add-transaction')}
          />
        ) : (
          <>
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              {filteredTransactions.length} {t.transactionsCount}
            </Text>
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => router.push(`/transaction/${transaction.id}`)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    padding: spacing.base,
    paddingBottom: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.base,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    textAlign: 'right',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.base,
    gap: spacing.sm,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.full,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingTop: 0,
  },
  resultsCount: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
});

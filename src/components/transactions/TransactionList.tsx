import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { Transaction } from '@/types';
import { TransactionCard } from './TransactionCard';
import { EmptyState } from '@/components/ui';
import { spacing, fontSize, fontWeight } from '@/theme';
import { useRouter } from 'expo-router';

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  limit?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  title,
  showSeeAll = false,
  onSeeAll,
  limit,
  emptyTitle,
  emptyDescription,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useLocalization();
  const router = useRouter();

  const displayedTransactions = limit
    ? transactions.slice(0, limit)
    : transactions;

  const handleTransactionPress = (transaction: Transaction) => {
    router.push(`/transaction/${transaction.id}`);
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="receipt-outline"
        title={emptyTitle || t.noTransactions}
        description={emptyDescription || t.startTracking}
        actionLabel={t.addTransaction}
        onAction={() => router.push('/add-transaction')}
      />
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {showSeeAll && onSeeAll && (
            <Text
              style={[styles.seeAll, { color: colors.primary }]}
              onPress={onSeeAll}
            >
              {t.viewAll}
            </Text>
          )}
        </View>
      )}
      
      <FlatList
        data={displayedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onPress={() => handleTransactionPress(item)}
          />
        )}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  seeAll: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});

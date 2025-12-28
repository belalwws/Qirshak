import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { useTransactionStore, useSettingsStore } from '@/store';
import { Card } from '@/components/ui';
import { TransactionList } from '@/components/transactions';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { formatCurrency } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t, isRTL } = useLocalization();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currency } = useSettingsStore();
  
  const {
    transactions,
    getBalance,
    getCurrentMonthIncome,
    getCurrentMonthExpense,
    getCurrentMonthTransactions,
  } = useTransactionStore();

  const [refreshing, setRefreshing] = React.useState(false);
  
  const balance = getBalance();
  const monthlyIncome = getCurrentMonthIncome();
  const monthlyExpense = getCurrentMonthExpense();
  const recentTransactions = getCurrentMonthTransactions().slice(0, 5);

  // حساب Tab Bar height للـ padding
  const bottomInset = Math.max(insets.bottom, 20);
  const tabBarHeight = 60 + bottomInset;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAddTransaction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-transaction');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCardWrapper}>
          <View
            style={[
              styles.balanceCard,
              { backgroundColor: colors.primary },
            ]}
          >
            <View style={styles.balanceHeader}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="wallet" size={24} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.balanceLabel}>{t.totalBalance}</Text>
            </View>
            
            <Text style={styles.balanceAmount}>
              {formatCurrency(balance, currency)}
            </Text>
            
            <View style={styles.monthlyStats}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                  <Ionicons name="trending-up" size={18} color="#22C55E" />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>{t.income}</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(monthlyIncome, currency)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                  <Ionicons name="trending-down" size={18} color="#EF4444" />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>{t.expense}</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(monthlyExpense, currency)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable
            style={[
              styles.quickAction,
              { 
                backgroundColor: colors.card,
                borderColor: colors.success + '40',
                borderWidth: 1.5,
              }
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/add-transaction?type=income');
            }}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="add-circle" size={26} color={colors.success} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              {t.addIncome}
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.quickAction,
              { 
                backgroundColor: colors.card,
                borderColor: colors.danger + '40',
                borderWidth: 1.5,
              }
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/add-transaction?type=expense');
            }}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.danger + '15' }]}>
              <Ionicons name="remove-circle" size={26} color={colors.danger} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              {t.addExpense}
            </Text>
          </Pressable>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <TransactionList
            transactions={recentTransactions}
            title={t.recentTransactions}
            showSeeAll={transactions.length > 5}
            onSeeAll={() => router.push('/transactions')}
            limit={5}
            emptyTitle={t.noTransactions}
            emptyDescription={t.startTracking}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={[
          styles.fab, 
          { 
            backgroundColor: colors.primary,
            bottom: tabBarHeight + 16,
          }
        ]}
        onPress={handleAddTransaction}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
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
  balanceCardWrapper: {
    marginBottom: spacing.lg,
  },
  balanceCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  balanceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.lg,
    letterSpacing: -1,
  },
  monthlyStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statIconContainer: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  section: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});

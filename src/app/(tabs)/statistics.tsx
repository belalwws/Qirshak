import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { useTransactionStore, useSettingsStore } from '@/store';
import { Card } from '@/components/ui';
import { PieChart } from '@/components/charts';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { formatCurrency, getCategoryById, getCategoriesByType } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartData, TransactionType } from '@/types';
import { format, subMonths } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

type Period = 'week' | 'month' | 'year';

export default function StatisticsScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t, language, isRTL } = useLocalization();
  const insets = useSafeAreaInsets();
  const { currency } = useSettingsStore();
  
  const { transactions, getTotalByType, getBalance } = useTransactionStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  // حساب Tab Bar height
  const bottomInset = Math.max(insets.bottom, 20);
  const tabBarHeight = 60 + bottomInset;

  const dateLocale = language === 'ar' ? ar : enUS;

  // Calculate category-wise spending
  const categoryData = useMemo((): ChartData[] => {
    const categoryTotals: Record<string, number> = {};
    
    const filteredTransactions = transactions.filter((t) => t.type === selectedType);
    
    filteredTransactions.forEach((t) => {
      categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
    });
    
    const data: ChartData[] = Object.entries(categoryTotals)
      .map(([categoryId, total]) => {
        const category = getCategoryById(categoryId);
        return {
          label: language === 'ar' ? (category?.nameAr || 'أخرى') : (category?.name || 'Other'),
          value: total,
          color: category?.color || colors.textTertiary,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories
    
    return data;
  }, [transactions, selectedType, colors, language]);

  // Monthly comparison
  const monthlyComparison = useMemo(() => {
    const months: { month: string; income: number; expense: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthNum = date.getMonth();
      const year = date.getFullYear();
      
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === monthNum && tDate.getFullYear() === year;
      });
      
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: format(date, 'MMM', { locale: dateLocale }),
        income,
        expense,
      });
    }
    
    return months;
  }, [transactions]);

  const totalSelected = categoryData.reduce((sum, item) => sum + item.value, 0);
  const balance = getBalance();

  const handlePeriodChange = (period: Period) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPeriod(period);
  };

  const handleTypeChange = (type: TransactionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(type);
  };

  const maxBarValue = Math.max(
    ...monthlyComparison.flatMap((m) => [m.income, m.expense]),
    1
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Overview */}
        <Card variant="elevated" style={styles.balanceCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.summary}
          </Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                {t.totalBalance}
              </Text>
              <Text
                style={[
                  styles.overviewValue,
                  { color: balance >= 0 ? colors.success : colors.danger },
                ]}
              >
                {formatCurrency(balance, currency)}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                {t.totalIncome}
              </Text>
              <Text style={[styles.overviewValue, { color: colors.success }]}>
                {formatCurrency(getTotalByType('income'), currency)}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                {t.totalExpense}
              </Text>
              <Text style={[styles.overviewValue, { color: colors.danger }]}>
                {formatCurrency(getTotalByType('expense'), currency)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Category Distribution */}
        <Card variant="elevated" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t.topCategories}
            </Text>
            <View style={styles.typeToggle}>
              <Pressable
                style={[
                  styles.typeButton,
                  selectedType === 'expense' && {
                    backgroundColor: colors.danger + '20',
                  },
                ]}
                onPress={() => handleTypeChange('expense')}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color:
                        selectedType === 'expense'
                          ? colors.danger
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {t.expense}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.typeButton,
                  selectedType === 'income' && {
                    backgroundColor: colors.success + '20',
                  },
                ]}
                onPress={() => handleTypeChange('income')}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color:
                        selectedType === 'income'
                          ? colors.success
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {t.income}
                </Text>
              </Pressable>
            </View>
          </View>

          <PieChart
            data={categoryData}
            size={180}
            innerRadius={50}
            centerLabel={language === 'ar' ? 'الإجمالي' : 'Total'}
            centerValue={formatCurrency(totalSelected, currency)}
            showLegend={true}
          />
        </Card>

        {/* Monthly Comparison */}
        <Card variant="elevated" style={styles.chartCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {language === 'ar' ? 'مقارنة شهرية' : 'Monthly Comparison'}
          </Text>
          
          <View style={styles.barChartContainer}>
            {monthlyComparison.map((item, index) => (
              <View key={index} style={styles.barGroup}>
                <View style={styles.barsContainer}>
                  {/* Income Bar */}
                  <View
                    style={[
                      styles.bar,
                      styles.incomeBar,
                      {
                        height: Math.max((item.income / maxBarValue) * 100, 4),
                        backgroundColor: colors.success,
                      },
                    ]}
                  />
                  {/* Expense Bar */}
                  <View
                    style={[
                      styles.bar,
                      styles.expenseBar,
                      {
                        height: Math.max((item.expense / maxBarValue) * 100, 4),
                        backgroundColor: colors.danger,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                  {item.month}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                {t.income}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                {t.expense}
              </Text>
            </View>
          </View>
        </Card>

        {/* Top Categories */}
        <Card variant="elevated" style={styles.topCategoriesCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.topCategories}
          </Text>
          
          {categoryData.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t.noData}
            </Text>
          ) : (
            categoryData.slice(0, 5).map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text style={[styles.categoryName, { color: colors.text }]}>
                    {category.label}
                  </Text>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={[styles.categoryAmount, { color: colors.text }]}>
                    {formatCurrency(category.value, currency)}
                  </Text>
                  <Text
                    style={[styles.categoryPercent, { color: colors.textSecondary }]}
                  >
                    {((category.value / totalSelected) * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
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
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.base,
  },
  balanceCard: {
    marginBottom: spacing.base,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  overviewItem: {
    flex: 1,
    minWidth: '30%',
  },
  overviewLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  overviewValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  chartCard: {
    marginBottom: spacing.base,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  typeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginTop: spacing.base,
  },
  barGroup: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: 16,
    borderRadius: borderRadius.sm,
    minHeight: 4,
  },
  incomeBar: {},
  expenseBar: {},
  barLabel: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.base,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: fontSize.sm,
  },
  topCategoriesCard: {
    marginBottom: spacing.base,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: fontSize.base,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  categoryPercent: {
    fontSize: fontSize.xs,
  },
  emptyText: {
    fontSize: fontSize.base,
    textAlign: 'center',
    padding: spacing.lg,
  },
});

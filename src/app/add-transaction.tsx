import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { useTransactionStore, useSettingsStore } from '@/store';
import { Card, Button } from '@/components/ui';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { getCategoriesByType, formatCurrency } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionType, Category } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTransactionScreen() {
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const { t, language, isRTL } = useLocalization();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const insets = useSafeAreaInsets();
  const { currency, currencySymbol } = useSettingsStore();
  
  const { addTransaction } = useTransactionStore();

  // Form state
  const [type, setType] = useState<TransactionType>(
    (params.type as TransactionType) || 'expense'
  );
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = getCategoriesByType(type);

  useEffect(() => {
    // Reset category when type changes
    setSelectedCategory(null);
  }, [type]);

  const handleTypeChange = (newType: TransactionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setType(newType);
  };

  const handleCategorySelect = (category: Category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    setAmount(cleaned);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert(t.error, t.enterValidAmount);
      return;
    }

    if (!selectedCategory) {
      Alert.alert(t.error, t.selectCategory);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    addTransaction({
      type,
      amount: parseFloat(amount),
      categoryId: selectedCategory.id,
      description: description.trim(),
      date: date.toISOString(),
    });

    router.back();
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
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <Pressable
            style={({ pressed }) => [
              styles.typeButton,
              {
                backgroundColor:
                  type === 'expense' ? colors.danger : colors.backgroundSecondary,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={() => handleTypeChange('expense')}
          >
            <Ionicons
              name={type === 'expense' ? 'arrow-down-circle' : 'arrow-down-circle-outline'}
              size={22}
              color={type === 'expense' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.typeText,
                { color: type === 'expense' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {t.expense}
            </Text>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.typeButton,
              {
                backgroundColor:
                  type === 'income' ? colors.success : colors.backgroundSecondary,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={() => handleTypeChange('income')}
          >
            <Ionicons
              name={type === 'income' ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
              size={22}
              color={type === 'income' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.typeText,
                { color: type === 'income' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {t.income}
            </Text>
          </Pressable>
        </View>

        {/* Amount Input */}
        <Card variant="elevated" style={styles.amountCard}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.amount}
          </Text>
          <View style={styles.amountInputContainer}>
            <Text style={[styles.currencySymbol, { color: colors.textTertiary }]}>
              {currencySymbol}
            </Text>
            <TextInput
              style={[styles.amountInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={handleAmountChange}
              autoFocus
            />
          </View>
        </Card>

        {/* Category Selector */}
        <Card variant="elevated" style={styles.categoryCard}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.category}
          </Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryItem,
                  {
                    backgroundColor:
                      selectedCategory?.id === category.id
                        ? category.color + '20'
                        : colors.backgroundSecondary,
                    borderColor:
                      selectedCategory?.id === category.id
                        ? category.color
                        : 'transparent',
                  },
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '30' },
                  ]}
                >
                  <Ionicons
                    name={getIconName(category.icon)}
                    size={20}
                    color={category.color}
                  />
                </View>
                <Text
                  style={[styles.categoryName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {language === 'ar' ? category.nameAr : category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Date Picker */}
        <Card variant="elevated" style={styles.dateCard}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.date}
          </Text>
          <Pressable
            style={[
              styles.dateButton,
              { backgroundColor: colors.backgroundSecondary },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Pressable>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </Card>

        {/* Description */}
        <Card variant="elevated" style={styles.descriptionCard}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.notesOptional}
          </Text>
          <TextInput
            style={[
              styles.descriptionInput,
              {
                color: colors.text,
                backgroundColor: colors.backgroundSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            placeholder={t.addNote}
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Card>
      </ScrollView>

      {/* Submit Button */}
      <View
        style={[
          styles.submitContainer,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + spacing.base,
            borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          },
        ]}
      >
        <Button
          title={type === 'expense' ? t.addExpense : t.addIncome}
          onPress={handleSubmit}
          variant={type === 'expense' ? 'danger' : 'primary'}
          fullWidth
          style={{
            backgroundColor: type === 'expense' ? colors.danger : colors.success,
            height: 52,
          }}
        />
      </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  typeText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  amountCard: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currencySymbol: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
  },
  amountInput: {
    flex: 1,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    textAlign: 'left',
  },
  categoryCard: {
    marginBottom: spacing.base,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryItem: {
    width: '30%',
    padding: spacing.sm,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: spacing.xs,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  dateCard: {
    marginBottom: spacing.base,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.base,
    borderRadius: borderRadius.base,
  },
  dateText: {
    fontSize: fontSize.base,
    flex: 1,
  },
  descriptionCard: {
    marginBottom: spacing.base,
  },
  descriptionInput: {
    padding: spacing.base,
    borderRadius: borderRadius.base,
    fontSize: fontSize.base,
    minHeight: 100,
    textAlign: 'right',
  },
  submitContainer: {
    padding: spacing.base,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

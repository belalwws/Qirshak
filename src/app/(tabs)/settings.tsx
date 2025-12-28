import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsStore, useTransactionStore, useAuthStore } from '@/store';
import { Card, BottomSheet } from '@/components/ui';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { CURRENCIES } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LANGUAGES, Language } from '@/localization';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors } = theme;
  const { t, language, setLanguage, isRTL } = useLocalization();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 20);
  const tabBarHeight = 60 + bottomInset;
  
  // Modal states
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  
  const {
    currency,
    currencySymbol,
    setCurrency,
  } = useSettingsStore();
  
  const { clearAllTransactions, transactions } = useTransactionStore();
  const { user, isGuest, logout, lastSyncedAt } = useAuthStore();

  // Language options for BottomSheet
  const languageOptions = LANGUAGES.map((lang) => ({
    id: lang.code,
    label: lang.name,
    subtitle: lang.nameEn,
    icon: lang.code === 'ar' ? 'flag' as const : 'globe' as const,
  }));

  // Currency options for BottomSheet
  const currencyOptions = CURRENCIES.map((curr) => ({
    id: curr.code,
    label: language === 'ar' ? curr.nameAr : curr.nameEn,
    subtitle: curr.symbol,
    icon: 'cash' as const,
  }));

  const handleCurrencyChange = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCurrencySheet(true);
  };

  const handleCurrencySelect = (id: string) => {
    const selectedCurrency = CURRENCIES.find(c => c.code === id);
    if (selectedCurrency) {
      setCurrency(selectedCurrency.code, selectedCurrency.symbol);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowCurrencySheet(false);
  };

  const handleLanguageChange = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLanguageSheet(true);
  };

  const handleLanguageSelect = (id: string) => {
    setLanguage(id as Language);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowLanguageSheet(false);
  };

  const handleDarkModeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const handleClearData = () => {
    if (transactions.length === 0) {
      Alert.alert(t.warning, t.noDataToDelete);
      return;
    }

    Alert.alert(
      t.deleteAllConfirmTitle,
      t.deleteAllConfirmMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: () => {
            clearAllTransactions();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(t.success, t.dataDeleted);
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(t.comingSoon, t.exportComingSoon);
  };

  const handleRateApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(t.thankYou, t.appreciateSupport);
  };

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      language === 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logout,
          style: 'destructive',
          onPress: () => {
            logout();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleLoginPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/login');
  };

  const currentLang = LANGUAGES.find(l => l.code === language);
  const currentCurrency = CURRENCIES.find(c => c.code === currency);

  const SettingItem = ({
    icon,
    iconColor,
    title,
    subtitle,
    onPress,
    rightElement,
    showArrow = true,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        { opacity: pressed && onPress ? 0.7 : 1 },
      ]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: (iconColor || colors.primary) + '15' },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={iconColor || colors.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (
        showArrow && onPress && (
          <Ionicons 
            name={isRTL ? "chevron-back" : "chevron-forward"} 
            size={20} 
            color={colors.textTertiary} 
          />
        )
      )}
    </Pressable>
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
        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.account}
        </Text>
        <Card variant="default" padding="none" style={styles.settingsCard}>
          {user ? (
            <>
              <View style={styles.profileSection}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name="person" size={32} color={colors.primary} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]}>
                    {user.name}
                  </Text>
                  <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                    {user.email}
                  </Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <SettingItem
                icon="sync"
                iconColor="#10B981"
                title={t.syncData}
                subtitle={lastSyncedAt ? new Date(lastSyncedAt).toLocaleDateString() : t.never}
                onPress={() => Alert.alert(t.comingSoon, t.syncDescription)}
              />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <SettingItem
                icon="log-out"
                iconColor="#EF4444"
                title={t.logout}
                onPress={handleLogout}
              />
            </>
          ) : isGuest ? (
            <>
              <View style={styles.guestSection}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.textTertiary + '20' }]}>
                  <Ionicons name="person-outline" size={32} color={colors.textTertiary} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]}>
                    {t.guestMode}
                  </Text>
                  <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                    {t.guestModeDescription}
                  </Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <SettingItem
                icon="log-in"
                iconColor="#6366F1"
                title={t.loginToSync}
                onPress={handleLoginPress}
              />
            </>
          ) : (
            <SettingItem
              icon="log-in"
              iconColor="#6366F1"
              title={t.login}
              subtitle={t.loginToSync}
              onPress={handleLoginPress}
            />
          )}
        </Card>

        {/* General Settings */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.general}
        </Text>
        <Card variant="default" padding="none" style={styles.settingsCard}>
          <SettingItem
            icon="language"
            iconColor="#8B5CF6"
            title={t.language}
            subtitle={currentLang?.name}
            onPress={handleLanguageChange}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem
            icon="cash"
            iconColor="#22C55E"
            title={t.currency}
            subtitle={`${currencySymbol} - ${language === 'ar' ? currentCurrency?.nameAr : currentCurrency?.nameEn}`}
            onPress={handleCurrencyChange}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem
            icon="moon"
            iconColor="#6366F1"
            title={t.darkMode}
            subtitle={isDark ? t.enabled : t.disabled}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
            showArrow={false}
          />
        </Card>

        {/* Data Management */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.data}
        </Text>
        <Card variant="default" padding="none" style={styles.settingsCard}>
          <SettingItem
            icon="download"
            iconColor="#3B82F6"
            title={t.exportData}
            subtitle={t.exportYourTransactions}
            onPress={handleExportData}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem
            icon="trash"
            iconColor="#EF4444"
            title={t.deleteAllData}
            subtitle={`${transactions.length} ${t.transactionsCount}`}
            onPress={handleClearData}
          />
        </Card>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.aboutApp}
        </Text>
        <Card variant="default" padding="none" style={styles.settingsCard}>
          <SettingItem
            icon="star"
            iconColor="#F59E0B"
            title={t.rateApp}
            subtitle={t.helpUsWithRating}
            onPress={handleRateApp}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem
            icon="information-circle"
            iconColor="#64748B"
            title={t.version}
            subtitle="1.0.0"
            showArrow={false}
          />
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Ionicons name="wallet" size={40} color={colors.primary} />
          <Text style={[styles.appName, { color: colors.text }]}>
            {t.appName}
          </Text>
          <Text style={[styles.appDesc, { color: colors.textSecondary }]}>
            {language === 'ar' ? 'تتبع مصروفاتك بسهولة' : 'Track your expenses easily'}
          </Text>
          <Text style={[styles.copyright, { color: colors.textTertiary }]}>
            © 2025 - {t.madeWithLove}
          </Text>
        </View>
      </ScrollView>

      {/* Language Bottom Sheet */}
      <BottomSheet
        visible={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        title={t.selectLanguage}
        options={languageOptions}
        selectedValue={language}
        onSelect={handleLanguageSelect}
      />

      {/* Currency Bottom Sheet */}
      <BottomSheet
        visible={showCurrencySheet}
        onClose={() => setShowCurrencySheet(false)}
        title={t.selectCurrency}
        options={currencyOptions}
        selectedValue={currency}
        onSelect={handleCurrencySelect}
      />
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
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
    marginTop: spacing.base,
    marginLeft: spacing.xs,
    textTransform: 'uppercase',
  },
  settingsCard: {
    marginBottom: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  settingTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  settingSubtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    marginLeft: spacing.base + 40 + spacing.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  guestSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  profileEmail: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.md,
  },
  appDesc: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  copyright: {
    fontSize: fontSize.xs,
    marginTop: spacing.lg,
  },
});

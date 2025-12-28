import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { LocalizationProvider, useLocalization } from '@/hooks/useLocalization';
import { useSettingsStore, useAuthStore } from '@/store';

function RootLayoutNav() {
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const { t } = useLocalization();
  const router = useRouter();
  const segments = useSegments();
  const { hasSeenWelcome } = useSettingsStore();
  const { user, isGuest, token } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const isAuthenticated = !!token || isGuest;

  useEffect(() => {
    // Small delay to ensure store is hydrated
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inWelcome = segments[0] === 'welcome';
    const inAuth = segments[0] === 'login' || segments[0] === 'register';
    const inTabs = segments[0] === '(tabs)';

    // First time user - show welcome
    if (!hasSeenWelcome && !inWelcome) {
      router.replace('/welcome');
      return;
    }

    // After welcome, check auth - but allow guest users to access login/register
    if (hasSeenWelcome) {
      if (!isAuthenticated && !inAuth && !inWelcome) {
        // Not authenticated at all, go to login
        router.replace('/login');
      } else if (isAuthenticated && !isGuest && (inAuth || inWelcome)) {
        // Fully authenticated (not guest) but on auth/welcome screen, go to tabs
        router.replace('/(tabs)');
      }
    }
  }, [hasSeenWelcome, isAuthenticated, isGuest, segments, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-transaction"
          options={{
            presentation: 'modal',
            headerTitle: t.addTransaction,
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{
            headerTitle: t.transactionDetails,
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LocalizationProvider>
            <RootLayoutNav />
          </LocalizationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

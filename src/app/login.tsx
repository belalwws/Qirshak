import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { useAuthStore } from '@/store';
import { apiService } from '@/services';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const { t, isRTL } = useLocalization();
  const { login, continueAsGuest } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = t.invalidEmail;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t.invalidEmail;
    }
    
    if (!password) {
      newErrors.password = t.passwordTooShort;
    } else if (password.length < 6) {
      newErrors.password = t.passwordTooShort;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    
    try {
      const response = await apiService.login(email, password);
      login(response.user, response.token);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t.error, error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    continueAsGuest();
    router.replace('/(tabs)');
  };

  const handleGoToRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/register');
  };

  const cardBg = isDark ? 'rgba(30,30,45,0.95)' : '#FFFFFF';
  const inputBg = isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6';
  const textPrimary = isDark ? '#FFFFFF' : '#1F2937';
  const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : '#6B7280';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1e1e2f', '#2d1b4e'] : ['#667eea', '#764ba2']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 50, paddingBottom: insets.bottom + 30 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                style={styles.logoCircle}
              >
                <Ionicons name="wallet" size={50} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.appName}>{t.appName}</Text>
            <Text style={styles.welcomeText}>{t.welcomeBack}</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: textSecondary }]}>{t.email}</Text>
              <View style={[
                styles.inputBox,
                { backgroundColor: inputBg },
                errors.email && styles.inputError,
              ]}>
                <Ionicons name="mail-outline" size={20} color={textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder="example@email.com"
                  placeholderTextColor={textSecondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={styles.errorMsg}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: textSecondary }]}>{t.password}</Text>
              <View style={[
                styles.inputBox,
                { backgroundColor: inputBg },
                errors.password && styles.inputError,
              ]}>
                <Ionicons name="lock-closed-outline" size={20} color={textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder="••••••••"
                  placeholderTextColor={textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={textSecondary}
                  />
                </Pressable>
              </View>
              {errors.password && <Text style={styles.errorMsg}>{errors.password}</Text>}
            </View>

            {/* Forgot Password */}
            <Pressable style={styles.forgotBtn}>
              <Text style={styles.forgotText}>{t.forgotPassword}</Text>
            </Pressable>

            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [styles.loginBtn, pressed && styles.btnPressed]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.loginBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.loginBtnText}>{t.login}</Text>
                    <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color="#FFF" />
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t.orContinueWith}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest Button */}
          <Pressable
            style={({ pressed }) => [styles.guestBtn, pressed && styles.btnPressed]}
            onPress={handleGuestMode}
          >
            <Ionicons name="person-outline" size={20} color="#FFFFFF" />
            <Text style={styles.guestBtnText}>{t.continueAsGuest}</Text>
          </Pressable>

          {/* Register Link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>{t.dontHaveAccount} </Text>
            <Pressable onPress={handleGoToRegister} hitSlop={10}>
              <Text style={styles.registerLink}>{t.register}</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoWrapper: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 12,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  errorMsg: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 22,
  },
  forgotText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  loginBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  loginBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loginBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 10,
    marginBottom: 30,
  },
  guestBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
  },
  registerLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

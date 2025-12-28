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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const { t, isRTL } = useLocalization();
  const { login } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = t.nameRequired;
    }
    
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
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    
    try {
      const response = await apiService.register(name.trim(), email, password);
      login(response.user, response.token);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t.error, error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const cardBg = isDark ? 'rgba(30,30,45,0.95)' : '#FFFFFF';
  const inputBg = isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6';
  const textPrimary = isDark ? '#FFFFFF' : '#1F2937';
  const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : '#6B7280';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1e1e2f', '#2d1b4e'] : ['#f093fb', '#f5576c']}
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
            { paddingTop: insets.top + 30, paddingBottom: insets.bottom + 30 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={handleGoToLogin}>
              <Ionicons 
                name={isRTL ? 'arrow-forward' : 'arrow-back'} 
                size={24} 
                color="#FFFFFF" 
              />
            </Pressable>
            
            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                style={styles.logoCircle}
              >
                <Ionicons name="person-add" size={44} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>{t.joinUs}</Text>
            <Text style={styles.headerSubtitle}>{t.createAccount}</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: textSecondary }]}>{t.fullName}</Text>
              <View style={[
                styles.inputBox,
                { backgroundColor: inputBg },
                errors.name && styles.inputError,
              ]}>
                <Ionicons name="person-outline" size={20} color={textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder={t.fullName}
                  placeholderTextColor={textSecondary}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && <Text style={styles.errorMsg}>{errors.name}</Text>}
            </View>

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

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: textSecondary }]}>{t.confirmPassword}</Text>
              <View style={[
                styles.inputBox,
                { backgroundColor: inputBg },
                errors.confirmPassword && styles.inputError,
              ]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder="••••••••"
                  placeholderTextColor={textSecondary}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  secureTextEntry={!showConfirmPassword}
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={10}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={textSecondary}
                  />
                </Pressable>
              </View>
              {errors.confirmPassword && <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>}
            </View>

            {/* Register Button */}
            <Pressable
              style={({ pressed }) => [styles.registerBtn, pressed && styles.btnPressed]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isDark ? ['#6366F1', '#8B5CF6'] : ['#f093fb', '#f5576c']}
                style={styles.registerBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.registerBtnText}>{t.register}</Text>
                    <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>{t.alreadyHaveAccount} </Text>
            <Pressable onPress={handleGoToLogin} hitSlop={10}>
              <Text style={styles.loginLink}>{t.login}</Text>
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
    marginBottom: 24,
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: 14,
    marginTop: 10,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  card: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    gap: 10,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  errorMsg: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
  registerBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  registerBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  registerBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

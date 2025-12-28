import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsStore } from '@/store';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { Language } from '@/localization';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  gradient: [string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    icon: 'wallet',
    titleAr: 'تتبع مصروفاتك',
    titleEn: 'Track Expenses',
    descriptionAr: 'سجّل جميع مصروفاتك ودخلك في مكان واحد بسهولة تامة',
    descriptionEn: 'Record all your expenses and income in one place with ease',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    icon: 'pie-chart',
    titleAr: 'تحليلات ذكية',
    titleEn: 'Smart Analytics',
    descriptionAr: 'احصل على رؤى واضحة حول أنماط إنفاقك مع رسوم بيانية جميلة',
    descriptionEn: 'Get clear insights into your spending patterns with beautiful charts',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    icon: 'trending-up',
    titleAr: 'حقق أهدافك',
    titleEn: 'Achieve Goals',
    descriptionAr: 'حدد ميزانيتك وتابع تقدمك نحو أهدافك المالية',
    descriptionEn: 'Set your budget and track progress towards your financial goals',
    gradient: ['#4facfe', '#00f2fe'],
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { colors } = theme;
  const { language, setLanguage, t } = useLocalization();
  const { setHasSeenWelcome } = useSettingsStore();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isRTL = language === 'ar';
  const isLastSlide = currentSlide === slides.length - 1;

  const animateTransition = (nextSlide: number) => {
    // Fade out and scale down
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSlide(nextSlide);
      // Fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (isLastSlide) {
      handleGetStarted();
    } else {
      animateTransition(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleGetStarted();
  };

  const handleGetStarted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setHasSeenWelcome(true);
    router.replace('/login');
  };

  const handleDotPress = (index: number) => {
    if (index !== currentSlide) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateTransition(index);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    if (language !== lang) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setLanguage(lang);
    }
  };

  const currentData = slides[currentSlide];

  return (
    <LinearGradient
      colors={currentData.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Skip Button */}
      {!isLastSlide && (
        <Pressable
          style={[
            styles.skipButton,
            { top: insets.top + spacing.base },
            isRTL ? { left: spacing.lg } : { right: spacing.lg },
          ]}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>
            {language === 'ar' ? 'تخطي' : 'Skip'}
          </Text>
        </Pressable>
      )}

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + 80 }]}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name={currentData.icon} size={80} color="#FFFFFF" />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>
            {language === 'ar' ? currentData.titleAr : currentData.titleEn}
          </Text>
          <Text style={styles.description}>
            {language === 'ar' ? currentData.descriptionAr : currentData.descriptionEn}
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing.xl }]}>
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <Pressable key={index} onPress={() => handleDotPress(index)}>
              <View
                style={[
                  styles.dot,
                  currentSlide === index && styles.dotActive,
                ]}
              />
            </Pressable>
          ))}
        </View>

        {/* Next/Get Started Button */}
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide
              ? (language === 'ar' ? 'ابدأ الآن' : 'Get Started')
              : (language === 'ar' ? 'التالي' : 'Next')}
          </Text>
          <Ionicons
            name={isRTL ? 'arrow-back' : 'arrow-forward'}
            size={20}
            color={currentData.gradient[0]}
            style={{ marginLeft: isRTL ? 0 : spacing.sm, marginRight: isRTL ? spacing.sm : 0 }}
          />
        </Pressable>

        {/* Language Toggle */}
        <View style={styles.languageContainer}>
          <Pressable
            style={[
              styles.languageButton,
              language === 'en' && styles.languageButtonActive,
            ]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={[
              styles.languageButtonText,
              language === 'en' && styles.languageButtonTextActive,
            ]}>
              EN
            </Text>
          </Pressable>
          <View style={styles.languageDivider} />
          <Pressable
            style={[
              styles.languageButton,
              language === 'ar' && styles.languageButtonActive,
            ]}
            onPress={() => handleLanguageChange('ar')}
          >
            <Text style={[
              styles.languageButtonText,
              language === 'ar' && styles.languageButtonTextActive,
            ]}>
              عربي
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    zIndex: 10,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing['2xl'],
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  description: {
    fontSize: fontSize.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: spacing.base,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    width: 30,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing['2xl'],
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: '#333',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  languageButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.base,
  },
  languageButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
  },
  languageDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.sm,
  },
});

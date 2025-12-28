import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SelectOption {
  id?: string;
  value?: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  subtitle?: string;
}

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  const handleSelect = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(value);
    onClose();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <View style={styles.overlayBackground} />
      </Pressable>
      
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            paddingBottom: insets.bottom + spacing.base,
          },
        ]}
      >
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Pressable
            style={[styles.closeButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={handleClose}
          >
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Options */}
        <ScrollView
          style={styles.optionsList}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {options.map((option, index) => {
            const optionValue = option.id || option.value || '';
            const isSelected = optionValue === selectedValue;
            return (
              <Pressable
                key={`option-${optionValue}-${index}`}
                style={({ pressed }) => [
                  styles.optionItem,
                  {
                    backgroundColor: isSelected
                      ? colors.primary + '15'
                      : pressed
                      ? colors.backgroundSecondary
                      : 'transparent',
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                  index === options.length - 1 && { marginBottom: 0 },
                ]}
                onPress={() => handleSelect(optionValue)}
              >
                {option.icon && (
                  <View
                    style={[
                      styles.optionIcon,
                      { backgroundColor: (option.iconColor || colors.primary) + '15' },
                    ]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={22}
                      color={option.iconColor || colors.primary}
                    />
                  </View>
                )}
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: isSelected ? colors.primary : colors.text,
                        fontWeight: isSelected ? '600' : '500',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.subtitle && (
                    <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                      {option.subtitle}
                    </Text>
                  )}
                </View>
                {isSelected && (
                  <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: SCREEN_HEIGHT * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.base,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    paddingHorizontal: spacing.base,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: fontSize.base,
  },
  optionSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

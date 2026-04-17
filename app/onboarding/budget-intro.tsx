import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { NumericKeypad } from '../../components/ui/NumericKeypad';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BudgetIntroScreen() {
  const insets = useSafeAreaInsets();
  const [amountStr, setAmountStr] = useState('0');

  const handleKeyPress = (key: string) => {
    setAmountStr((prev) => {
      if (key === '.' && prev.includes('.')) return prev;
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  };

  const handleDelete = () => {
    setAmountStr((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  return (
    <GlowBackground style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        {/* Progress */}
        <View style={styles.progressRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i === 3 && styles.dotActive]} />
          ))}
        </View>

        <Text style={styles.title}>Set Monthly Budget</Text>
        <Text style={styles.subtitle}>
          How much do you want to spend this month?{'\n'}You can change this anytime.
        </Text>

        {/* Amount display */}
        <View style={styles.amountSection}>
          <Text style={styles.currencySymbol}>$</Text>
          <Text style={styles.amountText} numberOfLines={1} adjustsFontSizeToFit>
            {amountStr}
          </Text>
        </View>

        <Text style={styles.amountHint}>Monthly spending limit</Text>

        {/* Keypad */}
        <View style={styles.keypadWrapper}>
          <NumericKeypad onPress={handleKeyPress} onDelete={handleDelete} />
        </View>

        <PrimaryButton
          label="Next"
          onPress={() =>
            router.push(
              `/onboarding/budget-categories?totalLimit=${amountStr}` as any,
            )
          }
          disabled={amountStr === '0' || parseFloat(amountStr) === 0}
        />

        <Pressable
          onPress={() => router.replace('/(tabs)/' as any)}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontal,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.xxl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textDisabled,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.accent,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xxxl,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  currencySymbol: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    paddingBottom: 8,
  },
  amountText: {
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
    maxWidth: '85%',
  },
  amountHint: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  keypadWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Spacing.xl,
  },
  skipBtn: {
    alignSelf: 'center',
    paddingTop: Spacing.lg,
  },
  skipText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
});

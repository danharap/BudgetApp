import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    label: 'Step 1',
    title: 'Open the Shortcuts App',
    body: 'Find and open the Shortcuts app on your iPhone. It comes pre-installed with iOS.',
    icon: 'apps' as const,
    iconColor: Colors.blue,
  },
  {
    label: 'Step 2',
    title: 'Create a New Automation',
    body: 'Tap the Automation tab at the bottom, then tap the + button to create a new personal automation.',
    icon: 'add-circle' as const,
    iconColor: Colors.purple,
  },
  {
    label: 'Step 3',
    title: 'Select Wallet & Apple Pay',
    body: 'Scroll down and select "Transaction" under Wallet & Apple Pay. This triggers on every tap-to-pay.',
    icon: 'wallet' as const,
    iconColor: Colors.accent,
  },
  {
    label: 'Step 4',
    title: 'Choose Cards & Run Immediately',
    body: 'Select which cards to monitor. Enable "Run Immediately" so the shortcut fires without confirmation.',
    icon: 'card' as const,
    iconColor: Colors.orange,
  },
  {
    label: 'Step 5',
    title: 'Add the BudgetApp Action',
    body: 'Tap "Add Action", search for BudgetApp, and select "Log Transaction" from the list.',
    icon: 'search' as const,
    iconColor: Colors.teal,
  },
  {
    label: 'Step 6',
    title: 'Configure Fields',
    body: 'Map the Shortcut variables: Amount, Merchant Name, and Card Name to the corresponding action fields.',
    icon: 'settings' as const,
    iconColor: Colors.indigo,
  },
  {
    label: 'Step 7',
    title: 'Save Your Automation',
    body: 'Tap Done to save. From now on, every tap-to-pay will automatically appear in your BudgetApp.',
    icon: 'checkmark-circle' as const,
    iconColor: Colors.accent,
  },
];

export default function AutomationStepsScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <GlowBackground style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={22} color={Colors.textSecondary} />
          </Pressable>
          <Text style={styles.headerTitle}>iOS Shortcuts Setup</Text>
          <Text style={styles.stepCount}>{step + 1}/{STEPS.length}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${((step + 1) / STEPS.length) * 100}%` },
            ]}
          />
        </View>

        {/* Main content */}
        <View style={styles.main}>
          {/* Visual placeholder */}
          <View style={styles.visualBox}>
            <View style={[styles.visualIcon, { backgroundColor: current.iconColor + '20' }]}>
              <Ionicons name={current.icon} size={48} color={current.iconColor} />
            </View>
            <View style={styles.screenMockLines}>
              {[80, 60, 70, 50].map((w, i) => (
                <View
                  key={i}
                  style={[styles.mockLine, { width: `${w}%`, backgroundColor: current.iconColor + '20' }]}
                />
              ))}
            </View>
          </View>

          {/* Step info */}
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>{current.label}</Text>
          </View>

          <Text style={styles.stepTitle}>{current.title}</Text>
          <Text style={styles.stepBody}>{current.body}</Text>
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          {step > 0 ? (
            <SecondaryButton
              label="Back"
              onPress={() => setStep((s) => s - 1)}
              style={styles.navBtn}
              size="md"
            />
          ) : (
            <View style={styles.navBtn} />
          )}

          <PrimaryButton
            label={isLast ? 'All Done!' : 'Next'}
            onPress={() =>
              isLast
                ? router.push('/onboarding/budget-intro')
                : setStep((s) => s + 1)
            }
            style={styles.navBtn}
            size="md"
          />
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  stepCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.surfaceBright,
    borderRadius: 2,
    marginBottom: Spacing.xxxl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  main: {
    flex: 1,
  },
  visualBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 220,
    marginBottom: Spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    overflow: 'hidden',
  },
  visualIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenMockLines: {
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  mockLine: {
    height: 8,
    borderRadius: 4,
  },
  stepPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentGlow,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  stepPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  stepBody: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  navRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  navBtn: {
    flex: 1,
  },
});

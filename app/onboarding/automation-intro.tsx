import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OPTIONS = [
  {
    id: 'tap-to-pay',
    icon: 'phone-portrait' as const,
    title: 'Tap-to-Pay',
    subtitle: 'Auto-log every Apple Pay & contactless payment instantly',
    color: Colors.accent,
    glowColor: Colors.accentGlow,
    badge: 'Recommended',
  },
  {
    id: 'any-payment',
    icon: 'card' as const,
    title: 'Any Payment',
    subtitle: 'Log payments from all cards and methods via Shortcuts',
    color: Colors.blue,
    glowColor: Colors.blueGlow,
    badge: null,
  },
];

export default function AutomationIntroScreen() {
  const insets = useSafeAreaInsets();

  return (
    <GlowBackground style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
          ))}
        </View>

        {/* Icon */}
        <View style={styles.iconHero}>
          <View style={styles.iconRing}>
            <Ionicons name="flash" size={32} color={Colors.accent} />
          </View>
        </View>

        <Text style={styles.title}>Automatic Logging</Text>
        <Text style={styles.subtitle}>
          Use iOS Shortcuts to automatically log transactions the moment
          you make a payment — no manual entry needed.
        </Text>

        {/* Options */}
        <View style={styles.options}>
          {OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => router.push('/onboarding/automation-steps')}
              style={({ pressed }) => [
                styles.optionCard,
                { borderColor: option.color + '40', opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <LinearGradient
                colors={[option.glowColor, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.optionTop}>
                <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
                  <Ionicons name={option.icon} size={22} color={option.color} />
                </View>
                {option.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{option.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              <View style={styles.optionAction}>
                <Text style={[styles.optionActionText, { color: option.color }]}>
                  Set up
                </Text>
                <Ionicons name="arrow-forward" size={14} color={option.color} />
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => router.push('/onboarding/budget-intro')}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Maybe Later</Text>
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
  iconHero: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  options: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    borderWidth: 1,
    overflow: 'hidden',
    gap: Spacing.sm,
  },
  optionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },
  optionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  optionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  optionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  optionActionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  skipBtn: {
    alignSelf: 'center',
    padding: Spacing.md,
  },
  skipText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
});

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OPTIONS = [
  {
    id: 'fresh',
    icon: 'sparkles' as const,
    title: 'Start Fresh',
    subtitle: 'Set up your accounts and start tracking from today',
    color: Colors.accent,
    glowColor: Colors.accentGlow,
    route: '/onboarding/add-accounts?mode=fresh',
  },
  {
    id: 'import',
    icon: 'cloud-download' as const,
    title: 'Import Existing Data',
    subtitle: 'Connect your bank or import from another app',
    color: Colors.blue,
    glowColor: Colors.blueGlow,
    route: '/onboarding/add-accounts?mode=import',
  },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <GlowBackground style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing.xxxl, paddingBottom: insets.bottom + Spacing.xl }]}>
        {/* Progress dots */}
        <View style={styles.progressRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
          ))}
        </View>

        {/* Hero text */}
        <View style={styles.hero}>
          <View style={styles.logoMark}>
            <Ionicons name="leaf" size={28} color={Colors.accent} />
          </View>
          <Text style={styles.headline}>How would you{'\n'}like to start?</Text>
          <Text style={styles.subheadline}>
            Set up your finances your way. You can always adjust later.
          </Text>
        </View>

        {/* Option cards */}
        <View style={styles.options}>
          {OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => router.push(option.route as any)}
              style={({ pressed }) => [
                styles.optionCard,
                { borderColor: option.color + '40', opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.optionIcon, { backgroundColor: option.glowColor }]}>
                <Ionicons name={option.icon} size={24} color={option.color} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>
          Your data stays private and on-device by default.
        </Text>
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
    marginBottom: Spacing.huge,
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
  hero: {
    marginBottom: Spacing.xxxl,
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  headline: {
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    lineHeight: 54,
    letterSpacing: -2,
    marginBottom: Spacing.md,
  },
  subheadline: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  options: {
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.cardPadding,
    borderWidth: 1,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: Radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  optionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    fontSize: FontSize.sm,
    color: Colors.textDisabled,
    textAlign: 'center',
    lineHeight: 18,
  },
});

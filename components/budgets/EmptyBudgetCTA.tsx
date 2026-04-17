import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../ui/PrimaryButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';

interface EmptyBudgetCTAProps {
  onPress: () => void;
}

export function EmptyBudgetCTA({ onPress }: EmptyBudgetCTAProps) {
  return (
    <View style={styles.container}>
      {/* Glow ring around icon */}
      <View style={styles.iconRingOuter}>
        <View style={styles.iconRingInner}>
          <Ionicons name="pie-chart-outline" size={36} color={Colors.accent} />
        </View>
      </View>

      <Text style={styles.headline}>Take Control of{'\n'}Your Spending</Text>

      <Text style={styles.subtext}>
        Set a monthly budget to track your spending, see where your money goes, and stay on target.
      </Text>

      <Text style={styles.hint}>Tap to set up</Text>

      {/* CTA with green glow */}
      <View style={styles.glowWrapper}>
        <PrimaryButton label="Set Up Budget" onPress={onPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
  },
  iconRingOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    // soft outer glow
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
  },
  iconRingInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: Spacing.lg,
  },
  subtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  hint: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  glowWrapper: {
    width: '100%',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    borderRadius: Radii.button,
  },
});

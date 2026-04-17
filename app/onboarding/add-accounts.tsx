import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { AccountCard } from '../../components/accounts/AccountCard';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';

export default function AddAccountsScreen() {
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const accounts = useAppStore((s) => s.accounts);
  const isImportMode = mode === 'import';

  return (
    <GlowBackground style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progressRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>

        <Text style={styles.title}>Where does your{'\n'}money live?</Text>
        <Text style={styles.subtitle}>
          {isImportMode
            ? 'Bank import is coming soon. For now, add your accounts manually.'
            : 'Add your accounts so we can show you the full picture.'}
        </Text>

        {/* Existing accounts */}
        {accounts.length > 0 && (
          <View style={styles.accountsList}>
            {accounts.map((account, idx) => (
              <View key={account.id}>
                <AccountCard account={account} />
                {idx < accounts.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </View>
        )}

        {/* Add account button */}
        <Pressable
          onPress={() => router.push('/onboarding/add-account-modal')}
          style={styles.addCard}
        >
          <View style={styles.addIcon}>
            <Ionicons name="add" size={24} color={Colors.accent} />
          </View>
          <Text style={styles.addLabel}>Add Account</Text>
        </Pressable>
      </ScrollView>

      {/* Bottom actions */}
      <View
        style={[
          styles.bottomActions,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        <PrimaryButton
          label="Continue"
          onPress={() => router.push('/onboarding/automation-intro')}
          style={styles.cta}
        />
        <SecondaryButton
          label="Just Track Spending"
          onPress={() => router.push('/onboarding/budget-intro')}
          size="md"
        />
      </View>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
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
    lineHeight: 40,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  accountsList: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.accent + '40',
    borderStyle: 'dashed',
    borderRadius: Radii.card,
    padding: Spacing.lg,
  },
  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.md,
    backgroundColor: Colors.background + 'E0',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cta: {},
});

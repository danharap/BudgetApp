import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { RoundedIconButton } from '../../components/ui/RoundedIconButton';
import { TotalAssetsCard } from '../../components/accounts/TotalAssetsCard';
import { AccountCard } from '../../components/accounts/AccountCard';
import { EmptyStateCard } from '../../components/ui/EmptyStateCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useAppStore } from '../../store/useAppStore';
import { getTotalAssets } from '../../utils/calculations';
import { router } from 'expo-router';

export default function AccountsScreen() {
  const insets = useSafeAreaInsets();
  const accounts = useAppStore((s) => s.accounts);
  const totalAssets = getTotalAssets(accounts);

  return (
    <GlowBackground>
      <ScreenHeader
        title="Accounts"
        style={{ paddingTop: insets.top + Spacing.sm }}
        rightAction={
          <RoundedIconButton
            icon="add"
            onPress={() => router.push('/onboarding/add-account-modal')}
            color={Colors.accent}
            backgroundColor={Colors.accentGlow}
          />
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Total assets hero */}
        <TotalAssetsCard accounts={accounts} totalAssets={totalAssets} />

        {/* Accounts list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Accounts</Text>

          {accounts.length === 0 ? (
            <EmptyStateCard
              icon="wallet-outline"
              title="No accounts yet"
              subtitle="Add your bank accounts, credit cards, and other assets."
              iconColor={Colors.accent}
              action={
                <PrimaryButton
                  label="Add Account"
                  onPress={() => router.push('/onboarding/add-account-modal')}
                />
              }
            />
          ) : (
            <View style={styles.accountsList}>
              {accounts.map((account, idx) => (
                <View key={account.id}>
                  <AccountCard
                    account={account}
                    onPress={() => router.push(`/account-detail?id=${account.id}` as any)}
                  />
                  {idx < accounts.length - 1 ? (
                    <View style={styles.divider} />
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Account types breakdown */}
        {accounts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breakdown</Text>
            <View style={styles.breakdownGrid}>
              {(['bank', 'credit_card', 'savings', 'investment', 'cash'] as const).map((type) => {
                const typeAccounts = accounts.filter((a) => a.type === type);
                if (typeAccounts.length === 0) return null;
                const typeTotal = typeAccounts.reduce((s, a) => s + a.balance, 0);
                const labels: Record<string, string> = {
                  bank: 'Bank',
                  credit_card: 'Credit',
                  savings: 'Savings',
                  investment: 'Invested',
                  cash: 'Cash',
                };
                return (
                  <View key={type} style={styles.breakdownItem}>
                    <Text style={styles.breakdownValue}>
                      {typeTotal < 0 ? '-' : ''}${Math.abs(typeTotal).toFixed(0)}
                    </Text>
                    <Text style={styles.breakdownLabel}>{labels[type]}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 0,
  },
  section: {
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  accountsList: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  breakdownItem: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 4,
  },
  breakdownValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  breakdownLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

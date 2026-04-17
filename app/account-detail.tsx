import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowBackground } from '../components/ui/GlowBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { RoundedIconButton } from '../components/ui/RoundedIconButton';
import { TransactionGroup } from '../components/transactions/TransactionGroup';
import { EmptyStateCard } from '../components/ui/EmptyStateCard';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Radii } from '../constants/radii';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../utils/currency';
import { groupTransactionsByDate } from '../utils/calculations';
import { ACCOUNT_TYPE_LABELS } from '../types/account';

export default function AccountDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const accounts = useAppStore((s) => s.accounts);
  const transactions = useAppStore((s) => s.transactions);
  const removeAccount = useAppStore((s) => s.removeAccount);

  const account = accounts.find((a) => a.id === id);

  const accountTransactions = useMemo(
    () => transactions.filter((t) => t.accountId === id).slice(0, 30),
    [transactions, id],
  );

  const grouped = useMemo(
    () => groupTransactionsByDate(accountTransactions),
    [accountTransactions],
  );

  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const totalIn = accountTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalOut = accountTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  if (!account) {
    return (
      <GlowBackground style={styles.container}>
        <ScreenHeader
          title="Account"
          style={{ paddingTop: insets.top + Spacing.sm }}
          leftAction={
            <RoundedIconButton icon="chevron-back" onPress={() => router.back()} />
          }
        />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Account not found.</Text>
        </View>
      </GlowBackground>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeAccount(id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <GlowBackground style={styles.container}>
      <ScreenHeader
        title={account.name}
        style={{ paddingTop: insets.top + Spacing.sm }}
        leftAction={
          <RoundedIconButton icon="chevron-back" onPress={() => router.back()} />
        }
        rightAction={
          <RoundedIconButton
            icon="trash-outline"
            onPress={handleDelete}
            color={Colors.red}
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
        {/* Balance card */}
        <View style={styles.balanceCard}>
          <View
            style={[styles.accountIconLarge, { backgroundColor: account.color + '20' }]}
          >
            <Ionicons name={account.icon as any} size={28} color={account.color} />
          </View>
          <Text style={styles.accountType}>
            {ACCOUNT_TYPE_LABELS[account.type]}
          </Text>
          <Text style={[styles.balance, account.balance < 0 && { color: Colors.red }]}>
            {account.balance < 0 ? '-' : ''}
            {formatCurrency(Math.abs(account.balance))}
          </Text>
          <Text style={styles.currency}>{account.currency}</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.income }]}>
              +{formatCurrency(totalIn)}
            </Text>
            <Text style={styles.statLabel}>Total In</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.expense }]}>
              -{formatCurrency(totalOut)}
            </Text>
            <Text style={styles.statLabel}>Total Out</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{accountTransactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </View>

        {/* Add transaction CTA */}
        <Pressable
          style={styles.addTxnBtn}
          onPress={() =>
            router.push(`/add-transaction?accountId=${account.id}` as any)
          }
        >
          <Ionicons name="add-circle" size={18} color={Colors.accent} />
          <Text style={styles.addTxnLabel}>Add Transaction</Text>
        </Pressable>

        {/* Transactions list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {dateKeys.length === 0 ? (
            <EmptyStateCard
              icon="receipt-outline"
              title="No transactions"
              subtitle="No transactions recorded for this account."
              iconColor={Colors.textMuted}
            />
          ) : (
            dateKeys.map((key) => (
              <TransactionGroup
                key={key}
                dateKey={key}
                transactions={grouped[key]}
              />
            ))
          )}
        </View>
      </ScrollView>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { gap: 0 },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginHorizontal: Spacing.screenHorizontal,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  accountIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  accountType: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balance: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  currency: {
    fontSize: FontSize.sm,
    color: Colors.textDisabled,
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.screenHorizontal,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
  },
  addTxnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
    backgroundColor: Colors.accentGlow,
    marginBottom: Spacing.xl,
  },
  addTxnLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },
  section: {
    marginHorizontal: Spacing.screenHorizontal,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
});

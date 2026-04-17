import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Account, ACCOUNT_TYPE_LABELS } from '../../types/account';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { formatCurrency } from '../../utils/currency';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
}

export function AccountCard({ account, onPress }: AccountCardProps) {
  const balanceColor = account.balance >= 0 ? Colors.income : Colors.expense;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.85 : 1 }]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: account.color + '22', borderColor: account.color + '33' }]}>
        <Ionicons name={account.icon as any} size={20} color={account.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{account.name}</Text>
        <Text style={styles.type}>
          {ACCOUNT_TYPE_LABELS[account.type]} · {account.currency}
        </Text>
      </View>
      <View style={styles.balanceBlock}>
        <Text style={[styles.balance, { color: balanceColor }]}>
          {formatCurrency(account.balance, account.currency, true)}
        </Text>
        <Text style={styles.balanceLabel}>Balance</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  type: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  balanceBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  balance: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  balanceLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});

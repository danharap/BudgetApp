import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Transaction } from '../../types/transaction';
import { TransactionListItem } from './TransactionListItem';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { formatDayLabel } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface TransactionGroupProps {
  dateKey: string; // "2026-04-15"
  transactions: Transaction[];
}

export function TransactionGroup({ dateKey, transactions }: TransactionGroupProps) {
  const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netTotal     = totalIncome - totalExpense;
  const netPositive  = netTotal >= 0;
  const netColor     = netPositive ? Colors.income : Colors.expense;
  const netPrefix    = netPositive ? '+' : '-';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateLabel}>{formatDayLabel(`${dateKey}T12:00:00.000Z`)}</Text>
        {(totalIncome > 0 || totalExpense > 0) ? (
          <Text style={[styles.dayTotal, { color: netColor }]}>
            {netPrefix}{formatCurrency(Math.abs(netTotal))}
          </Text>
        ) : null}
      </View>

      <View style={styles.list}>
        {transactions.map((txn, idx) => (
          <View key={txn.id}>
            <TransactionListItem transaction={txn} />
            {idx < transactions.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.screenHorizontal,
  },
  dateLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayTotal: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.expense, // overridden dynamically at render time
  },
  list: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.screenHorizontal,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});

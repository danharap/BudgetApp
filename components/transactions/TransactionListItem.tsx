import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../../types/transaction';
import { getCategoryById } from '../../constants/categories';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { formatCurrency } from '../../utils/currency';
import { formatTime } from '../../utils/date';

interface TransactionListItemProps {
  transaction: Transaction;
  onPress?: () => void;
  showDate?: boolean;
}

export function TransactionListItem({
  transaction,
  onPress,
  showDate = false,
}: TransactionListItemProps) {
  const category = getCategoryById(transaction.category);
  const isIncome = transaction.type === 'income';
  const isTransfer = transaction.type === 'transfer';
  const amountColor = isIncome
    ? Colors.income
    : isTransfer
    ? Colors.transfer
    : Colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: category.glowColor, borderColor: category.color + '30' },
        ]}
      >
        <Ionicons name={category.icon as any} size={18} color={category.color} />
      </View>

      <View style={styles.details}>
        <Text style={styles.merchant} numberOfLines={1}>
          {transaction.merchant}
        </Text>
        <Text style={styles.meta}>
          {category.name}
          {showDate ? ` · ${formatTime(transaction.date)}` : ` · ${formatTime(transaction.date)}`}
        </Text>
      </View>

      <View style={styles.amountBlock}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isIncome ? '+' : isTransfer ? '' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
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
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  details: {
    flex: 1,
    gap: 3,
  },
  merchant: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  amountBlock: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    fontVariant: ['tabular-nums'],
  },
});

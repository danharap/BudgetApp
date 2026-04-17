import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Bill } from '../../types/bill';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { formatCurrency } from '../../utils/currency';
import { formatDateShort } from '../../utils/date';
import { billService } from '../../features/bills/service';

interface BillCardProps {
  bill: Bill;
}

export function BillCard({ bill }: BillCardProps) {
  const iconColor = bill.color ?? Colors.blue;
  const isOverdue = !bill.paid && new Date(bill.dueDate) < new Date();

  return (
    <Pressable
      onPress={() => router.push(`/add-bill?billId=${bill.id}` as any)}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.75 : 1 }]}
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: iconColor + '20', borderColor: iconColor + '30' },
        ]}
      >
        <Ionicons name={(bill.icon ?? 'receipt') as any} size={18} color={iconColor} />
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>{bill.name}</Text>
        <Text style={[styles.dueDate, isOverdue && { color: Colors.red }]}>
          {isOverdue ? 'Overdue · ' : 'Due '}
          {formatDateShort(bill.dueDate)}
          {bill.isRecurring ? ' · Recurring' : ''}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
        {/* Stop propagation so tapping "Mark paid" doesn't open the edit screen */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            billService.markPaid(bill.id, !bill.paid);
          }}
          style={[styles.payButton, bill.paid && styles.payButtonPaid]}
          hitSlop={8}
        >
          <Text style={[styles.payLabel, bill.paid && styles.payLabelPaid]}>
            {bill.paid ? 'Paid' : 'Mark paid'}
          </Text>
        </Pressable>
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
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  dueDate: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    gap: 5,
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  payButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.accent + '50',
    backgroundColor: Colors.accentGlow,
  },
  payButtonPaid: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  payLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },
  payLabelPaid: {
    color: Colors.textMuted,
  },
});

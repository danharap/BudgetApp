import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { RoundedIconButton } from '../../components/ui/RoundedIconButton';
import { MonthPickerPill } from '../../components/ui/MonthPickerPill';
import { TransactionGroup } from '../../components/transactions/TransactionGroup';
import { EmptyStateCard } from '../../components/ui/EmptyStateCard';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useAppStore } from '../../store/useAppStore';
import { groupTransactionsByDate, filterTransactions } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';
import { TransactionType } from '../../types/transaction';

const TYPE_FILTERS: Array<{ label: string; value: TransactionType | null }> = [
  { label: 'All', value: null },
  { label: 'Expenses', value: 'expense' },
  { label: 'Income', value: 'income' },
  { label: 'Transfers', value: 'transfer' },
];

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const transactions = useAppStore((s) => s.transactions);
  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const transactionFilters = useAppStore((s) => s.transactionFilters);
  const setTransactionFilters = useAppStore((s) => s.setTransactionFilters);

  const activeFilter = transactionFilters.type;

  const filtered = filterTransactions(transactions, {
    monthKey: selectedMonth,
    type: activeFilter ?? undefined,
  });

  const grouped = groupTransactionsByDate(filtered);
  const dateKeys = Object.keys(grouped).sort((a, b) =>
    b.localeCompare(a)
  );

  const totalExpenses = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <GlowBackground>
      <ScreenHeader
        title="Transactions"
        style={{ paddingTop: insets.top + Spacing.sm }}
        rightAction={
          <View style={styles.rightActions}>
            <RoundedIconButton
              icon="add"
              onPress={() => router.push('/add-transaction')}
              size={36}
              iconSize={19}
              color={Colors.accent}
              backgroundColor={Colors.accentGlow}
            />
          </View>
        }
      />

      {/* Month picker */}
      <View style={styles.monthRow}>
        <MonthPickerPill />
      </View>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryValue, { color: Colors.expense }]}>
            -{formatCurrency(totalExpenses)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryValue, { color: Colors.income }]}>
            +{formatCurrency(totalIncome)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(totalIncome - totalExpenses)}
          </Text>
        </View>
      </View>

      {/* Type filter pills */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {TYPE_FILTERS.map((f) => (
            <Pressable
              key={String(f.value)}
              onPress={() => setTransactionFilters({ type: f.value })}
              style={[
                styles.filterPill,
                activeFilter === f.value && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  activeFilter === f.value && styles.filterLabelActive,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {dateKeys.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyStateCard
              icon="receipt-outline"
              title="No transactions"
              subtitle="No transactions found for this period."
              iconColor={Colors.textMuted}
            />
          </View>
        ) : (
          dateKeys.map((key) => (
            <TransactionGroup
              key={key}
              dateKey={key}
              transactions={grouped[key]}
            />
          ))
        )}
      </ScrollView>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    paddingHorizontal: Spacing.screenHorizontal,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.screenHorizontal,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  summaryLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
  },
  filterWrapper: {
    // Fixed-height container prevents the horizontal ScrollView from growing vertically
    height: 42,
    marginBottom: Spacing.lg,
  },
  filterScroll: {
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.sm,
    alignItems: 'center',  // keeps pills vertically centered, prevents stretch
    flexGrow: 1,
  },
  filterPill: {
    height: 34,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accent + '50',
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * 1.4,
  },
  filterLabelActive: {
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
  },
  list: {
    gap: 0,
  },
  emptyWrapper: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
  },
  rightActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from '../ui/AppCard';
import { CircularChart } from '../ui/CircularChart';
import { MonthPickerPill } from '../ui/MonthPickerPill';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { useAppStore } from '../../store/useAppStore';
import {
  getMonthlyExpenses,
  getMonthlyIncome,
  getWeeklyAverage,
  getDailyAverage,
  getTotalAssets,
} from '../../utils/calculations';
import { getDaysLeftInMonth } from '../../utils/date';

export function SummaryCard() {
  // Select stable primitives/references — no new objects created per render
  const transactions = useAppStore((s) => s.transactions);
  const accounts = useAppStore((s) => s.accounts);
  const budgets = useAppStore((s) => s.budgets);
  const selectedMonth = useAppStore((s) => s.selectedMonth);

  // Compute derived values only when dependencies change
  const summary = useMemo(
    () => ({
      totalSpent: getMonthlyExpenses(transactions, selectedMonth),
      totalIncome: getMonthlyIncome(transactions, selectedMonth),
      weeklyAverage: getWeeklyAverage(transactions, selectedMonth),
      dailyAverage: getDailyAverage(transactions, selectedMonth),
      daysLeft: getDaysLeftInMonth(selectedMonth),
      totalAssets: getTotalAssets(accounts),
    }),
    [transactions, accounts, selectedMonth],
  );

  const budget = useMemo(
    () => budgets.find((b) => b.monthKey === selectedMonth),
    [budgets, selectedMonth],
  );

  const spentProgress = budget
    ? Math.min(summary.totalSpent / budget.totalLimit, 1)
    : summary.totalIncome > 0
    ? Math.min(summary.totalSpent / summary.totalIncome, 1)
    : 0;

  return (
    <AppCard elevated style={styles.card} padding={Spacing.cardPaddingLg}>
      <View style={styles.monthRow}>
        <MonthPickerPill />
      </View>

      <View style={styles.chartSection}>
        <CircularChart
          progress={spentProgress}
          size={180}
          strokeWidth={16}
          color={spentProgress > 0.9 ? Colors.red : Colors.accent}
        >
          <View style={styles.chartCenter}>
            <Text style={styles.spentLabel}>Spent this month</Text>
            <Text style={styles.spentAmount}>
              {formatCurrency(summary.totalSpent)}
            </Text>
            {budget ? (
              <Pressable
                style={styles.budgetRow}
                onPress={() => router.push('/edit-budget')}
                hitSlop={8}
              >
                <Text style={styles.budgetLabel}>
                  of {formatCurrency(budget.totalLimit)}
                </Text>
                <Ionicons name="pencil-outline" size={11} color={Colors.accent} />
              </Pressable>
            ) : (
              <Pressable
                style={styles.setBudgetPill}
                onPress={() => router.push('/edit-budget')}
              >
                <Ionicons name="add" size={12} color={Colors.accent} />
                <Text style={styles.setBudgetLabel}>Set budget</Text>
              </Pressable>
            )}
          </View>
        </CircularChart>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatCurrency(summary.weeklyAverage)}</Text>
          <Text style={styles.statLabel}>Weekly avg</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatCurrency(summary.dailyAverage)}</Text>
          <Text style={styles.statLabel}>Daily avg</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{summary.daysLeft}d</Text>
          <Text style={styles.statLabel}>Days left</Text>
        </View>
      </View>

      <Pressable
        style={styles.insightsButton}
        onPress={() => router.push('/(tabs)/transactions')}
      >
        <Ionicons name="sparkles" size={14} color={Colors.blue} />
        <Text style={styles.insightsLabel}>View Insights</Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.blue + '80'} />
      </Pressable>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.screenHorizontal,
  },
  monthRow: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  chartCenter: {
    alignItems: 'center',
  },
  spentLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  spentAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  budgetLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  setBudgetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  setBudgetLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
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
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  insightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    backgroundColor: Colors.blueGlow,
    borderWidth: 1,
    borderColor: Colors.blue + '30',
  },
  insightsLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.blue,
  },
});

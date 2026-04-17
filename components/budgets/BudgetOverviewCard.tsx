import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from '../ui/AppCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { formatMonthKey } from '../../utils/date';
import { Budget } from '../../types/budget';

interface BudgetOverviewCardProps {
  budget: Budget;
  totalSpent: number;
}

export function BudgetOverviewCard({ budget, totalSpent }: BudgetOverviewCardProps) {
  const progress = Math.min(totalSpent / budget.totalLimit, 1);
  const remaining = Math.max(budget.totalLimit - totalSpent, 0);
  const overBudget = totalSpent > budget.totalLimit;
  const barColor = progress > 0.9 ? Colors.red : progress > 0.7 ? Colors.orange : Colors.accent;

  return (
    <AppCard elevated style={styles.card}>
      {/* Header with edit button */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.monthLabel}>{formatMonthKey(budget.monthKey)}</Text>
          <Text style={styles.title}>Budget Overview</Text>
        </View>
        <Pressable
          onPress={() => router.push('/edit-budget')}
          style={({ pressed }) => [styles.editBtn, { opacity: pressed ? 0.7 : 1 }]}
          hitSlop={8}
        >
          <Ionicons name="pencil-outline" size={14} color={Colors.accent} />
          <Text style={styles.editLabel}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.percentageRow}>
        <Text style={[styles.percentage, { color: barColor }]}>
          {Math.round(progress * 100)}%
        </Text>
        <Text style={styles.percentageSub}>used</Text>
      </View>

      <View style={styles.bar}>
        <ProgressBar progress={progress} color={barColor} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={styles.statValue}>{formatCurrency(totalSpent)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{overBudget ? 'Over budget' : 'Remaining'}</Text>
          <Text style={[styles.statValue, overBudget && { color: Colors.red }]}>
            {overBudget
              ? formatCurrency(totalSpent - budget.totalLimit)
              : formatCurrency(remaining)}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Limit</Text>
          <Text style={styles.statValue}>{formatCurrency(budget.totalLimit)}</Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.screenHorizontal,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  monthLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  editLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: Spacing.md,
  },
  percentage: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    letterSpacing: -1,
  },
  percentageSub: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  bar: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
  },
});

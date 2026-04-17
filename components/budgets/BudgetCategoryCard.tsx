import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '../ui/ProgressBar';
import { getCategoryById } from '../../constants/categories';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { formatCurrency } from '../../utils/currency';

interface BudgetCategoryCardProps {
  categoryId: string;
  limit: number;
  spent: number;
}

export function BudgetCategoryCard({
  categoryId,
  limit,
  spent,
}: BudgetCategoryCardProps) {
  const category = getCategoryById(categoryId);
  const progress = Math.min(spent / limit, 1);
  const remaining = Math.max(limit - spent, 0);
  const isOver = spent > limit;
  const barColor = isOver ? Colors.red : progress > 0.8 ? Colors.orange : category.color;

  return (
    <Pressable
      onPress={() => router.push('/edit-budget')}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.75 : 1 }]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { backgroundColor: category.color + '22' }]}>
          <Ionicons name={category.icon as any} size={18} color={category.color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{category.name}</Text>
          <Text style={styles.amounts}>
            <Text>{formatCurrency(spent)}</Text>
            <Text style={styles.separator}> / </Text>
            <Text>{formatCurrency(limit)}</Text>
          </Text>
        </View>
        <Text style={[styles.remaining, isOver && { color: Colors.red }]}>
          {isOver ? 'Over' : formatCurrency(remaining)}
        </Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.textDisabled} />
      </View>
      <View style={styles.bar}>
        <ProgressBar progress={progress} color={barColor} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  amounts: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  separator: {
    color: Colors.textDisabled,
  },
  remaining: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  bar: {},
});

import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { RoundedIconButton } from '../../components/ui/RoundedIconButton';
import { MonthPickerPill } from '../../components/ui/MonthPickerPill';
import { BudgetOverviewCard } from '../../components/budgets/BudgetOverviewCard';
import { BudgetCategoryCard } from '../../components/budgets/BudgetCategoryCard';
import { EmptyBudgetCTA } from '../../components/budgets/EmptyBudgetCTA';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useAppStore } from '../../store/useAppStore';
import { getMonthlyExpenses, getCategorySpend } from '../../utils/calculations';
import { router } from 'expo-router';

export default function BudgetsScreen() {
  const insets = useSafeAreaInsets();
  // Select stable primitives/refs — derive objects with useMemo to avoid infinite loops
  const budgets = useAppStore((s) => s.budgets);
  const transactions = useAppStore((s) => s.transactions);
  const selectedMonth = useAppStore((s) => s.selectedMonth);

  const budget = useMemo(
    () => budgets.find((b) => b.monthKey === selectedMonth),
    [budgets, selectedMonth],
  );

  const totalSpent = useMemo(
    () => getMonthlyExpenses(transactions, selectedMonth),
    [transactions, selectedMonth],
  );

  const getCategorySpent = useMemo(
    () => (categoryId: string) => getCategorySpend(transactions, selectedMonth, categoryId),
    [transactions, selectedMonth],
  );

  return (
    <GlowBackground>
      <ScreenHeader
        title="Budget"
        style={{ paddingTop: insets.top + Spacing.sm }}
        rightAction={
          <RoundedIconButton
            icon="add"
            onPress={() => router.push('/onboarding/budget-intro')}
            color={Colors.accent}
            backgroundColor={Colors.accentGlow}
          />
        }
      />

      <View style={styles.monthRow}>
        <MonthPickerPill />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {budget ? (
          <>
            <BudgetOverviewCard budget={budget} totalSpent={totalSpent} />

            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.categoriesList}>
                {budget.categories.map((cb, idx) => (
                  <View key={cb.categoryId}>
                    <BudgetCategoryCard
                      categoryId={cb.categoryId}
                      limit={cb.limit}
                      spent={getCategorySpent(cb.categoryId)}
                    />
                    {idx < budget.categories.length - 1 ? (
                      <View style={styles.divider} />
                    ) : null}
                  </View>
                ))}
              </View>
            </View>

            {/* Tip card */}
            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Ionicons name="bulb" size={18} color={Colors.yellow} />
              </View>
              <View style={styles.tipText}>
                <Text style={styles.tipTitle}>Budget Tip</Text>
                <Text style={styles.tipBody}>
                  You're on track! Keeping food under {' '}
                  <Text style={{ color: Colors.accent }}>$600</Text> helps you
                  save more each month.
                </Text>
              </View>
            </View>
          </>
        ) : (
          <EmptyBudgetCTA onPress={() => router.push('/edit-budget')} />
        )}
      </ScrollView>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    paddingHorizontal: Spacing.screenHorizontal,
    marginBottom: Spacing.lg,
  },
  scroll: {
    gap: 0,
  },
  categoriesSection: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.screenHorizontal,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  categoriesList: {
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
  tipCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.yellow + '30',
  },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.yellow + '20',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    gap: 4,
  },
  tipTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  tipBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  emptyWrapper: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
  },
});

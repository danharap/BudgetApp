import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowBackground } from '../components/ui/GlowBackground';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Radii } from '../constants/radii';
import { CATEGORIES } from '../constants/categories';
import { useAppStore } from '../store/useAppStore';
import { budgetService } from '../features/budgets/service';
import { getMonthKey } from '../utils/date';
import { formatCurrency } from '../utils/currency';

const BUDGET_CATEGORY_IDS = [
  'food', 'transport', 'shopping', 'entertainment',
  'health', 'housing', 'utilities', 'subscriptions', 'travel',
];

const DEFAULT_LIMITS: Record<string, number> = {
  food: 500, transport: 200, shopping: 300, entertainment: 150,
  health: 200, housing: 1800, utilities: 150, subscriptions: 50, travel: 200,
};

const BUDGET_CATEGORIES = CATEGORIES.filter((c) =>
  BUDGET_CATEGORY_IDS.includes(c.id),
);

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export default function EditBudgetScreen() {
  const insets = useSafeAreaInsets();
  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const existingBudget = useAppStore((s) =>
    s.budgets.find((b) => b.monthKey === selectedMonth),
  );
  const [saving, setSaving] = useState(false);

  // Total monthly limit
  const [totalLimitStr, setTotalLimitStr] = useState(
    existingBudget ? String(existingBudget.totalLimit) : '',
  );

  // Per-category limits
  const [limits, setLimits] = useState<Record<string, string>>(
    Object.fromEntries(
      BUDGET_CATEGORY_IDS.map((id) => {
        const existing = existingBudget?.categories.find(
          (c) => c.categoryId === id,
        );
        return [id, String(existing ? existing.limit : (DEFAULT_LIMITS[id] ?? 0))];
      }),
    ),
  );

  const categoryTotal = BUDGET_CATEGORIES.reduce(
    (sum, c) => sum + (parseFloat(limits[c.id] ?? '0') || 0),
    0,
  );

  const overallLimit = parseFloat(totalLimitStr) || 0;

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    const effectiveTotalLimit =
      overallLimit > 0 ? overallLimit : categoryTotal;

    await budgetService.add({
      id: `budget-${selectedMonth}`,
      monthKey: selectedMonth,
      totalLimit: effectiveTotalLimit,
      categories: BUDGET_CATEGORIES.map((c) => ({
        categoryId: c.id,
        limit: parseFloat(limits[c.id] ?? '0') || 0,
      })),
      createdAt: new Date().toISOString(),
    });

    router.back();
  };

  return (
    <GlowBackground style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + 130,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Edit Budget</Text>
            <Text style={styles.headerMonth}>{selectedMonth}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Total monthly limit */}
        <View style={styles.totalCard}>
          <View style={styles.totalCardHeader}>
            <Ionicons name="wallet-outline" size={18} color={Colors.accent} />
            <Text style={styles.totalCardTitle}>Monthly Limit</Text>
          </View>
          <Text style={styles.totalCardHint}>
            Leave blank to use the sum of category limits ({formatCurrency(categoryTotal)})
          </Text>
          <View style={styles.totalInputRow}>
            <Text style={styles.totalDollar}>$</Text>
            <TextInput
              style={[
                styles.totalInput,
                Platform.OS === 'web' && ({ outlineWidth: 0 } as any),
              ]}
              value={totalLimitStr}
              onChangeText={setTotalLimitStr}
              placeholder={fmt(categoryTotal)}
              placeholderTextColor={Colors.textDisabled}
              keyboardType="decimal-pad"
              selectionColor={Colors.accent}
            />
          </View>
        </View>

        {/* Section label */}
        <Text style={styles.sectionLabel}>Category Limits</Text>

        {/* Category limits */}
        <View style={styles.categoryList}>
          {/* Summary row */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Category Total</Text>
              <Text
                style={[
                  styles.summaryValue,
                  overallLimit > 0 &&
                    categoryTotal > overallLimit && { color: Colors.red },
                ]}
              >
                ${fmt(categoryTotal)}
              </Text>
            </View>
            {overallLimit > 0 && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Monthly Limit</Text>
                <Text style={[styles.summaryValue, { color: Colors.accent }]}>
                  ${fmt(overallLimit)}
                </Text>
              </View>
            )}
          </View>

          {BUDGET_CATEGORIES.map((category, idx) => (
            <View key={category.id}>
              <View style={styles.categoryRow}>
                <View
                  style={[
                    styles.catIcon,
                    { backgroundColor: category.glowColor },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={category.color}
                  />
                </View>
                <Text style={styles.catName}>{category.name}</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.dollar}>$</Text>
                  <TextInput
                    style={[
                      styles.limitInput,
                      Platform.OS === 'web' && ({ outlineWidth: 0 } as any),
                    ]}
                    value={limits[category.id]}
                    onChangeText={(val) =>
                      setLimits((prev) => ({ ...prev, [category.id]: val }))
                    }
                    keyboardType="decimal-pad"
                    selectionColor={Colors.accent}
                    placeholderTextColor={Colors.textDisabled}
                    placeholder="0"
                  />
                </View>
              </View>
              {idx < BUDGET_CATEGORIES.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.lg }]}
      >
        <SecondaryButton
          label="Cancel"
          onPress={() => router.back()}
          style={styles.halfBtn}
          size="md"
        />
        <PrimaryButton
          label={existingBudget ? 'Save Changes' : 'Set Budget'}
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.halfBtn}
          size="md"
        />
      </View>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  headerMonth: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  // Total limit card
  totalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    marginBottom: Spacing.xl,
  },
  totalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  totalCardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  totalCardHint: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  totalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.input,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  totalDollar: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    marginRight: Spacing.xs,
  },
  totalInput: {
    flex: 1,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    padding: 0,
    minWidth: 0,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  // Category list (identical to budget-categories.tsx)
  categoryList: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'flex-end',
    gap: 2,
  },
  summaryLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  catIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 100,
    overflow: 'hidden',
  },
  dollar: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginRight: 3,
    flexShrink: 0,
  },
  limitInput: {
    flex: 1,
    minWidth: 0,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background + 'E0',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  halfBtn: { flex: 1 },
});

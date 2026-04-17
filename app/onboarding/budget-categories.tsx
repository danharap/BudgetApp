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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { ToggleRow } from '../../components/ui/ToggleRow';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '../../constants/categories';
import { budgetService } from '../../features/budgets/service';
import { onboardingService } from '../../features/onboarding/service';
import { getMonthKey } from '../../utils/date';

const BUDGET_CATEGORY_IDS = [
  'food', 'transport', 'shopping', 'entertainment',
  'health', 'housing', 'utilities', 'subscriptions', 'travel',
];

const DEFAULT_LIMITS: Record<string, number> = {
  food: 500,
  transport: 200,
  shopping: 300,
  entertainment: 150,
  health: 200,
  housing: 1800,
  utilities: 150,
  subscriptions: 50,
  travel: 200,
};

const BUDGET_CATEGORIES = CATEGORIES.filter((c) =>
  BUDGET_CATEGORY_IDS.includes(c.id)
);

export default function BudgetCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { totalLimit: totalLimitParam } = useLocalSearchParams<{ totalLimit?: string }>();

  const overallLimit = parseFloat(totalLimitParam ?? '0') || 0;

  const [setCategoryLimits, setSetCategoryLimits] = useState(true);
  const [saving, setSaving] = useState(false);
  const [limits, setLimits] = useState<Record<string, string>>(
    Object.fromEntries(
      BUDGET_CATEGORY_IDS.map((id) => [id, String(DEFAULT_LIMITS[id] ?? 0)])
    )
  );

  // Sum only the categories visible in the UI, not ALL keys in the limits map.
  const categoryTotal = BUDGET_CATEGORIES.reduce(
    (sum, c) => sum + (parseFloat(limits[c.id] ?? '0') || 0),
    0
  );

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const totalLimit = setCategoryLimits
    ? overallLimit > 0
      ? overallLimit
      : categoryTotal
    : overallLimit > 0
    ? overallLimit
    : categoryTotal;

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const budget = {
      id: `budget-${getMonthKey()}`,
      monthKey: getMonthKey(),
      totalLimit,
      categories: BUDGET_CATEGORIES.map((c) => ({
        categoryId: c.id,
        limit: parseFloat(limits[c.id] ?? '0') || 0,
      })),
      createdAt: new Date().toISOString(),
    };
    await budgetService.add(budget);
    await onboardingService.complete();
    router.replace('/(tabs)/' as any);
  };

  return (
    <GlowBackground style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + 130 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Category Limits</Text>
        <Text style={styles.subtitle}>
          Set spending limits for each category.
        </Text>

        <View style={styles.card}>
          <ToggleRow
            label="Set Category Limits"
            value={setCategoryLimits}
            onValueChange={setSetCategoryLimits}
            subtitle="Allocate your budget by category"
          />
        </View>

        {setCategoryLimits ? (
          <View style={styles.categoryList}>
            {/* Summary row */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Category Total</Text>
                <Text style={[styles.summaryValue, overallLimit > 0 && categoryTotal > overallLimit && { color: Colors.red }]}>
                  ${fmt(categoryTotal)}
                </Text>
              </View>
              {overallLimit > 0 && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Monthly Limit</Text>
                  <Text style={[styles.summaryValue, { color: Colors.accent }]}>${fmt(overallLimit)}</Text>
                </View>
              )}
            </View>

            {BUDGET_CATEGORIES.map((category, idx) => (
              <View key={category.id}>
                <View style={styles.categoryRow}>
                  <View style={[styles.catIcon, { backgroundColor: category.glowColor }]}>
                    <Ionicons name={category.icon as any} size={16} color={category.color} />
                  </View>
                  <Text style={styles.catName}>{category.name}</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.dollar}>$</Text>
                    <TextInput
                      style={[
                        styles.limitInput,
                        // Remove the browser default focus ring on web.
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
                {idx < BUDGET_CATEGORIES.length - 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.simpleCard}>
            <Ionicons name="pie-chart-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.simpleText}>
              Your total budget will be split evenly across all categories.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky bottom */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <SecondaryButton
          label="Back"
          onPress={() => router.back()}
          style={styles.halfBtn}
          size="md"
        />
        <PrimaryButton
          label="Save Budget"
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
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
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
  simpleCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: Spacing.md,
  },
  simpleText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { RoundedIconButton } from '../../components/ui/RoundedIconButton';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { BillCard } from '../../components/bills/BillCard';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';

function UpcomingEmpty() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconRing}>
        <Ionicons name="checkmark-circle" size={40} color={Colors.accent} />
      </View>
      <Text style={styles.emptyTitle}>All caught up!</Text>
      <Text style={styles.emptySubtitle}>
        No upcoming bills or payments.
      </Text>
    </View>
  );
}

function RecurringEmpty() {
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconRing, { backgroundColor: Colors.blueGlow }]}>
        <Ionicons name="repeat" size={40} color={Colors.blue} />
      </View>
      <Text style={styles.emptyTitle}>No recurring rules</Text>
      <Text style={styles.emptySubtitle}>
        Add recurring bills to track subscriptions and regular payments automatically.
      </Text>
    </View>
  );
}

export default function BillsScreen() {
  const insets = useSafeAreaInsets();
  const [segment, setSegment] = useState(0);
  // Select the raw bills array (stable reference) and derive in useMemo
  const bills = useAppStore((s) => s.bills);

  const upcomingBills = useMemo(() => {
    const now = new Date();
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    return bills
      .filter((b) => {
        const due = new Date(b.dueDate);
        return !b.paid && due >= now && due <= thirtyDaysLater;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [bills]);

  const recurringBills = useMemo(
    () => bills.filter((b) => b.isRecurring),
    [bills],
  );

  const totalUpcoming = upcomingBills.reduce((s, b) => s + b.amount, 0);
  const totalRecurring = recurringBills.reduce((s, b) => s + b.amount, 0);

  return (
    <GlowBackground>
      <ScreenHeader
        title="Bills"
        style={{ paddingTop: insets.top + Spacing.sm }}
        rightAction={
          <RoundedIconButton
            icon="add"
            onPress={() => router.push('/add-bill')}
            color={Colors.accent}
            backgroundColor={Colors.accentGlow}
          />
        }
      />

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Due this month</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalUpcoming)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Recurring total</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalRecurring)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Bill count</Text>
          <Text style={styles.summaryValue}>{recurringBills.length}</Text>
        </View>
      </View>

      {/* Segmented control */}
      <View style={styles.segmentWrapper}>
        <SegmentedControl
          options={['Upcoming', 'Recurring']}
          selectedIndex={segment}
          onChange={setSegment}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {segment === 0 ? (
          upcomingBills.length === 0 ? (
            <UpcomingEmpty />
          ) : (
            <View style={styles.billsList}>
              {upcomingBills.map((bill, idx) => (
                <View key={bill.id}>
                  <BillCard bill={bill} />
                  {idx < upcomingBills.length - 1 ? (
                    <View style={styles.divider} />
                  ) : null}
                </View>
              ))}
            </View>
          )
        ) : recurringBills.length === 0 ? (
          <RecurringEmpty />
        ) : (
          <View style={styles.billsList}>
            {recurringBills.map((bill, idx) => (
              <View key={bill.id}>
                <BillCard bill={bill} />
                {idx < recurringBills.length - 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.screenHorizontal,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
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
  segmentWrapper: {
    paddingHorizontal: Spacing.screenHorizontal,
    marginBottom: Spacing.lg,
  },
  scroll: {
    paddingHorizontal: Spacing.screenHorizontal,
  },
  billsList: {
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
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.huge,
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.lg,
  },
  emptyIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

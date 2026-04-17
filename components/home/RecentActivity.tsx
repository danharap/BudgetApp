import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TransactionListItem } from '../transactions/TransactionListItem';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { useAppStore } from '../../store/useAppStore';
import { EmptyStateCard } from '../ui/EmptyStateCard';

const RECENT_COUNT = 5;

export function RecentActivity() {
  const transactions = useAppStore((s) => s.transactions);
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, RECENT_COUNT);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/transactions')}
          style={styles.seeAll}
        >
          <Text style={styles.seeAllText}>See all</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
        </Pressable>
      </View>

      {recent.length === 0 ? (
        <EmptyStateCard
          icon="receipt-outline"
          title="No transactions yet"
          subtitle="Your recent activity will appear here"
        />
      ) : (
        <View style={styles.list}>
          {recent.map((txn, idx) => (
            <View key={txn.id}>
              <TransactionListItem transaction={txn} />
              {idx < recent.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.screenHorizontal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  seeAllText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.medium,
  },
  list: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});

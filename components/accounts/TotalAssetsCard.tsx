import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { formatCurrency } from '../../utils/currency';
import { Account } from '../../types/account';

interface TotalAssetsCardProps {
  accounts: Account[];
  totalAssets: number;
}

export function TotalAssetsCard({ accounts, totalAssets }: TotalAssetsCardProps) {
  const bankCount = accounts.filter((a) => a.type === 'bank' || a.type === 'savings').length;
  const cardCount = accounts.filter((a) => a.type === 'credit_card').length;
  const investmentTotal = accounts
    .filter((a) => a.type === 'investment')
    .reduce((s, a) => s + a.balance, 0);

  return (
    <LinearGradient
      colors={['#1A2840', '#0F1C30']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.top}>
        <View>
          <Text style={styles.cardLabel}>Total Net Worth</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalAssets)}</Text>
        </View>
        <View style={styles.sparkle}>
          <Ionicons name="trending-up" size={22} color={Colors.accent} />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{accounts.length}</Text>
          <Text style={styles.statLabel}>Accounts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{bankCount}</Text>
          <Text style={styles.statLabel}>Bank / Savings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatCurrency(investmentTotal)}</Text>
          <Text style={styles.statLabel}>Invested</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.screenHorizontal,
    borderRadius: Radii.card,
    padding: Spacing.cardPaddingLg,
    borderWidth: 1,
    borderColor: Colors.blue + '30',
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  cardLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  totalAmount: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  sparkle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
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
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
  },
});

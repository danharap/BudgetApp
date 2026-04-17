import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { formatMonthShort, navigateMonth } from '../../utils/date';
import { useAppStore } from '../../store/useAppStore';

export function MonthPickerPill() {
  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const setSelectedMonth = useAppStore((s) => s.setSelectedMonth);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setSelectedMonth(navigateMonth(selectedMonth, -1))}
        style={styles.arrow}
        hitSlop={12}
      >
        <Ionicons name="chevron-back" size={16} color={Colors.textSecondary} />
      </Pressable>

      <View style={styles.pill}>
        <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.label}>{formatMonthShort(selectedMonth)}</Text>
        <Ionicons name="chevron-down" size={12} color={Colors.textMuted} />
      </View>

      <Pressable
        onPress={() => setSelectedMonth(navigateMonth(selectedMonth, 1))}
        style={styles.arrow}
        hitSlop={12}
      >
        <Ionicons
          name="chevron-forward"
          size={16}
          color={Colors.textSecondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
});

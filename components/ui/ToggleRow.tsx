import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  subtitle?: string;
}

export function ToggleRow({
  label,
  value,
  onValueChange,
  subtitle,
}: ToggleRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.surfaceBright, true: Colors.accent }}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.surfaceBright}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  textBlock: {
    flex: 1,
    marginRight: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 3,
  },
});

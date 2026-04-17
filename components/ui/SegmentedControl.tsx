import React from 'react';
import { StyleSheet, Text, Pressable, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: ViewStyle;
}

export function SegmentedControl({
  options,
  selectedIndex,
  onChange,
  style,
}: SegmentedControlProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => {
        const isActive = index === selectedIndex;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(index)}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
});

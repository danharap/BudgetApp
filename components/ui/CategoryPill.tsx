import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryById } from '../../constants/categories';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

interface CategoryPillProps {
  categoryId: string;
  style?: ViewStyle;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function CategoryPill({
  categoryId,
  style,
  showLabel = true,
  size = 'md',
}: CategoryPillProps) {
  const category = getCategoryById(categoryId);
  const iconSize = size === 'md' ? 14 : 12;
  const pillHeight = size === 'md' ? 28 : 22;

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: category.glowColor,
          borderColor: category.color + '40',
          height: pillHeight,
        },
        style,
      ]}
    >
      <Ionicons
        name={category.icon as any}
        size={iconSize}
        color={category.color}
      />
      {showLabel ? (
        <Text style={[styles.label, { color: category.color }]}>
          {category.name}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
    gap: 4,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});

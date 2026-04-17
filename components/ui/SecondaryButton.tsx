import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export function SecondaryButton({
  label,
  onPress,
  style,
  textStyle,
  size = 'lg',
}: SecondaryButtonProps) {
  const height = size === 'lg' ? 56 : size === 'md' ? 48 : 40;
  const fontSize = size === 'lg' ? FontSize.lg : FontSize.md;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { height, borderRadius: Radii.buttonLg },
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, { fontSize }, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.surface,
  },
  label: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.2,
  },
});

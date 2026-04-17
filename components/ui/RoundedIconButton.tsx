import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';

interface RoundedIconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function RoundedIconButton({
  icon,
  onPress,
  size = 40,
  iconSize = 20,
  color = Colors.textSecondary,
  backgroundColor = Colors.surface,
  style,
}: RoundedIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

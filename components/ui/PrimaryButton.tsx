import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PrimaryButton({
  label,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  size = 'lg',
}: PrimaryButtonProps) {
  const height = size === 'lg' ? 56 : size === 'md' ? 48 : 40;
  const fontSize = size === 'lg' ? FontSize.lg : size === 'md' ? FontSize.md : FontSize.sm;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.wrapper,
        { opacity: pressed || disabled ? 0.7 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={
          disabled
            ? [Colors.textMuted, Colors.textMuted]
            : [Colors.accentLight, Colors.accent, Colors.accentDark]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { height, borderRadius: Radii.buttonLg }]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={[styles.label, { fontSize }, textStyle]}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  label: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
});

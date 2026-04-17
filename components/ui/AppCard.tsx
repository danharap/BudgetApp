import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';
import { Spacing } from '../../constants/spacing';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
  elevated?: boolean;
}

export function AppCard({
  children,
  style,
  onPress,
  padding = Spacing.cardPadding,
  elevated = false,
}: AppCardProps) {
  const content = (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
});

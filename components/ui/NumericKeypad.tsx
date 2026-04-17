import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';

interface NumericKeypadProps {
  onPress: (value: string) => void;
  onDelete: () => void;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'del'],
];

export function NumericKeypad({ onPress, onDelete }: NumericKeypadProps) {
  // On web / laptop allow physical keyboard input.
  // We only fire when no <input> or <textarea> is focused so we don't
  // double-type into other text fields on the same screen.
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName ?? '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key >= '0' && e.key <= '9') {
        onPress(e.key);
      } else if (e.key === '.') {
        onPress('.');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        onDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPress, onDelete]);

  return (
    <View style={styles.grid}>
      {KEYS.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((key) => (
            <Pressable
              key={key}
              onPress={() => (key === 'del' ? onDelete() : onPress(key))}
              style={({ pressed }) => [
                styles.key,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              {key === 'del' ? (
                <Ionicons
                  name="backspace-outline"
                  size={22}
                  color={Colors.textSecondary}
                />
              ) : (
                <Text style={styles.keyLabel}>{key}</Text>
              )}
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    height: 60,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  keyLabel: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
});

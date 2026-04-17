import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

interface GlowBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GlowBackground({ children, style }: GlowBackgroundProps) {
  return (
    <LinearGradient
      colors={['#080C18', '#0D1221', '#080C18']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {/* Glow orbs */}
      <View style={styles.orbTopLeft} />
      <View style={styles.orbTopRight} />
      <View style={styles.orbBottom} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orbTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.glowBlue,
    // Simulated glow via large shadow
  },
  orbTopRight: {
    position: 'absolute',
    top: 100,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.glowGreen,
  },
  orbBottom: {
    position: 'absolute',
    bottom: 100,
    left: '30%',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.glowPurple,
  },
});

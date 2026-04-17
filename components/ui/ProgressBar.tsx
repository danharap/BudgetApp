import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';

interface ProgressBarProps {
  progress: number; // 0–1
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color = Colors.accent,
  trackColor = Colors.surfaceBright,
  height = 6,
  style,
  animated = true,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    const target = Math.min(Math.max(progress, 0), 1) * 100;
    if (animated) {
      width.value = withTiming(target, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      width.value = target;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: trackColor, borderRadius: height },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          animatedStyle,
          { backgroundColor: color, borderRadius: height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

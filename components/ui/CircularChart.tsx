import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularChartProps {
  progress: number; // 0–1
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export function CircularChart({
  progress,
  size = 200,
  strokeWidth = 14,
  color = Colors.accent,
  trackColor = Colors.surfaceBright,
  children,
}: CircularChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedOffset = useSharedValue(circumference);

  useEffect(() => {
    const target = circumference * (1 - Math.min(Math.max(progress, 0), 1));
    animatedOffset.value = withTiming(target, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, circumference]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  // On web, render a static circle since animated SVG props may not work
  const staticOffset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress — animated on native, static on web */}
        {Platform.OS === 'web' ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={staticOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        ) : (
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        )}
      </Svg>
      {children ? (
        <View style={[StyleSheet.absoluteFillObject, styles.content]}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Radii } from '../../constants/radii';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  transactions: { active: 'list', inactive: 'list-outline' },
  budgets: { active: 'pie-chart', inactive: 'pie-chart-outline' },
  bills: { active: 'receipt', inactive: 'receipt-outline' },
  accounts: { active: 'wallet', inactive: 'wallet-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  transactions: 'Activity',
  budgets: 'Budget',
  bills: 'Bills',
  accounts: 'Accounts',
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outerWrapper, { paddingBottom: insets.bottom + Spacing.sm }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icons = TAB_ICONS[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
          const label = TAB_LABELS[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                <Ionicons
                  name={isFocused ? icons.active : icons.inactive}
                  size={22}
                  color={isFocused ? Colors.accent : Colors.tabInactive}
                />
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: Spacing.screenHorizontal,
    right: Spacing.screenHorizontal,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBackground,
    borderRadius: Radii.tabBar,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconContainer: {
    width: 44,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: Colors.accentGlow,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.tabInactive,
  },
  labelActive: {
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
  },
});

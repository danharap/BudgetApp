import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { RoundedIconButton } from '../../components/ui/RoundedIconButton';
import { SummaryCard } from '../../components/home/SummaryCard';
import { RecentActivity } from '../../components/home/RecentActivity';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <GlowBackground>
      <ScreenHeader
        title="Overview"
        style={{ paddingTop: insets.top + Spacing.sm }}
        leftAction={
          <RoundedIconButton
            icon="settings-outline"
            onPress={() => router.push('/settings')}
          />
        }
        rightAction={
          <View style={styles.rightActions}>
            <RoundedIconButton
              icon="mic-outline"
              onPress={() => router.push('/add-transaction')}
              size={36}
              iconSize={17}
            />
            <RoundedIconButton
              icon="add"
              onPress={() => router.push('/add-transaction')}
              size={36}
              iconSize={19}
              color={Colors.accent}
              backgroundColor={Colors.accentGlow}
            />
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCard />
        <View style={styles.separator} />
        <RecentActivity />
      </ScrollView>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 0,
  },
  separator: {
    height: Spacing.xxl,
  },
  rightActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});

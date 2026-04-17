import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowBackground } from '../components/ui/GlowBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { RoundedIconButton } from '../components/ui/RoundedIconButton';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Radii } from '../constants/radii';
import Constants from 'expo-constants';
import { useAppStore } from '../store/useAppStore';

interface SettingsRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

function SettingsRow({ icon, label, value, onPress, destructive, showChevron = true }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={[styles.rowIcon, destructive && styles.rowIconDestructive]}>
        <Ionicons
          name={icon as any}
          size={18}
          color={destructive ? Colors.red : Colors.textSecondary}
        />
      </View>
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>
        {label}
      </Text>
      {value ? (
        <Text style={styles.rowValue}>{value}</Text>
      ) : null}
      {showChevron && !destructive ? (
        <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} />
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const signOut = useAppStore((s) => s.signOut);
  const user = useAppStore((s) => s.user);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <GlowBackground style={styles.container}>
      <ScreenHeader
        title="Settings"
        style={{ paddingTop: insets.top + Spacing.sm }}
        leftAction={
          <RoundedIconButton icon="chevron-back" onPress={() => router.back()} />
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="person-outline"
              label={user?.email ?? 'Profile'}
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="notifications-outline"
              label="Notifications"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="shield-checkmark-outline"
              label="Privacy & Security"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Data section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Data</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="download-outline"
              label="Export Data"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="cloud-upload-outline"
              label="Sync & Backup"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* App section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>App</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="color-palette-outline"
              label="Appearance"
              value="Dark"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="language-outline"
              label="Currency"
              value="USD"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="information-circle-outline"
              label="Version"
              value={appVersion}
              showChevron={false}
            />
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <View style={styles.card}>
            <SettingsRow
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleSignOut}
              destructive
              showChevron={false}
            />
          </View>
        </View>
      </ScrollView>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.screenHorizontal,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowIconDestructive: {
    backgroundColor: Colors.redGlow,
  },
  rowLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  rowLabelDestructive: {
    color: Colors.red,
  },
  rowValue: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginRight: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 44 + Spacing.md,
  },
});

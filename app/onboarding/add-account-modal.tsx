import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlowBackground } from '../../components/ui/GlowBackground';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radii } from '../../constants/radii';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountType, ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_ICONS } from '../../types/account';
import { accountService } from '../../features/accounts/service';
import { NumericKeypad } from '../../components/ui/NumericKeypad';

const ACCOUNT_COLORS = [
  Colors.accent, Colors.blue, Colors.purple,
  Colors.orange, Colors.teal, Colors.pink,
  Colors.yellow, Colors.red, Colors.indigo,
];

const ACCOUNT_TYPES: AccountType[] = ['bank', 'credit_card', 'savings', 'investment', 'cash', 'other'];

export default function AddAccountModal() {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balanceStr, setBalanceStr] = useState('0');
  const [color, setColor] = useState<string>(Colors.blue);
  const [currency] = useState('USD');
  const [saving, setSaving] = useState(false);

  const handleKeyPress = (key: string) => {
    setBalanceStr((prev) => {
      if (key === '.' && prev.includes('.')) return prev;
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  };

  const handleDelete = () => {
    setBalanceStr((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleAdd = async () => {
    if (saving) return;
    setSaving(true);
    await accountService.add({
      id: `acc-${Date.now()}`,
      name: name || ACCOUNT_TYPE_LABELS[type],
      type,
      balance: parseFloat(balanceStr) || 0,
      currency,
      color,
      icon: ACCOUNT_TYPE_ICONS[type],
      createdAt: new Date().toISOString(),
    });
    setSaving(false);
    router.back();
  };

  return (
    <GlowBackground>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>New Account</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Balance display */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceDisplay}>${balanceStr}</Text>
        </View>

        {/* Numeric keypad */}
        <View style={styles.keypadWrapper}>
          <NumericKeypad onPress={handleKeyPress} onDelete={handleDelete} />
        </View>

        {/* Account name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Account Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={ACCOUNT_TYPE_LABELS[type]}
            placeholderTextColor={Colors.textDisabled}
            selectionColor={Colors.accent}
          />
        </View>

        {/* Account type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Account Type</Text>
          <View style={styles.typeGrid}>
            {ACCOUNT_TYPES.map((t) => (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={[styles.typeOption, type === t && styles.typeOptionActive]}
              >
                <Ionicons
                  name={ACCOUNT_TYPE_ICONS[t] as any}
                  size={18}
                  color={type === t ? Colors.accent : Colors.textMuted}
                />
                <Text style={[styles.typeLabel, type === t && styles.typeLabelActive]}>
                  {ACCOUNT_TYPE_LABELS[t]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Color picker */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Color</Text>
          <View style={styles.colorRow}>
            {ACCOUNT_COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  color === c && styles.colorSwatchActive,
                ]}
              >
                {color === c ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>

        <PrimaryButton
          label="Add Account"
          onPress={handleAdd}
          loading={saving}
          disabled={saving}
          style={styles.addBtn}
        />
      </ScrollView>
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  cancelBtn: { width: 60 },
  cancelText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  balanceDisplay: {
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  keypadWrapper: {
    marginBottom: Spacing.xl,
  },
  fieldGroup: {
    marginBottom: Spacing.xl,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.input,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  typeOptionActive: {
    borderColor: Colors.accent + '60',
    backgroundColor: Colors.accentGlow,
  },
  typeLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  typeLabelActive: {
    color: Colors.accent,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
  addBtn: { marginTop: Spacing.md },
});

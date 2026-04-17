import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowBackground } from '../components/ui/GlowBackground';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { ToggleRow } from '../components/ui/ToggleRow';
import { NumericKeypad } from '../components/ui/NumericKeypad';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Radii } from '../constants/radii';
import { billService } from '../features/bills/service';
import { useAppStore } from '../store/useAppStore';
import { RecurrenceType } from '../types/bill';

const BILL_ICONS = [
  { name: 'home-outline', label: 'Rent' },
  { name: 'flash-outline', label: 'Electric' },
  { name: 'wifi-outline', label: 'Internet' },
  { name: 'phone-portrait-outline', label: 'Phone' },
  { name: 'tv-outline', label: 'Streaming' },
  { name: 'car-outline', label: 'Car' },
  { name: 'medical-outline', label: 'Insurance' },
  { name: 'fitness-outline', label: 'Gym' },
  { name: 'musical-notes-outline', label: 'Music' },
  { name: 'cloud-outline', label: 'Cloud' },
  { name: 'game-controller-outline', label: 'Games' },
  { name: 'ellipsis-horizontal', label: 'Other' },
];

const BILL_COLORS = [
  Colors.blue, Colors.purple, Colors.orange,
  Colors.teal, Colors.pink, Colors.red,
  Colors.yellow, Colors.accent, Colors.indigo,
];

const RECURRENCE_OPTIONS: Array<{ label: string; value: RecurrenceType }> = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Yearly', value: 'yearly' },
];

// Day chips for monthly recurring bills (1–28 to avoid month-end edge cases)
const MONTH_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

function getNextOccurrence(day: number): string {
  const today = new Date();
  let d = new Date(today.getFullYear(), today.getMonth(), day);
  // If that day already passed this month, push to next month
  if (d <= today) d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}

function parseDayFromDate(dateStr: string): number {
  if (!dateStr) return new Date().getDate();
  return new Date(dateStr + 'T00:00:00').getDate();
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function AddBillScreen() {
  const insets = useSafeAreaInsets();
  const { billId } = useLocalSearchParams<{ billId?: string }>();
  const isEdit = !!billId;

  const existingBill = useAppStore((s) =>
    billId ? s.bills.find((b) => b.id === billId) : undefined,
  );

  // ── Form state (pre-populated when editing) ──────────────────
  const [step, setStep] = useState<'amount' | 'details'>(
    isEdit ? 'details' : 'amount',
  );
  const [amountStr, setAmountStr] = useState(
    existingBill ? String(existingBill.amount) : '0',
  );
  const [name, setName] = useState(existingBill?.name ?? '');
  const [isRecurring, setIsRecurring] = useState(
    existingBill?.isRecurring ?? true,
  );
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(
    existingBill?.recurrenceType ?? 'monthly',
  );
  const [selectedIcon, setSelectedIcon] = useState(
    existingBill?.icon ?? 'home-outline',
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    existingBill?.color ?? Colors.blue,
  );
  const [saving, setSaving] = useState(false);

  // Due date: for monthly recurring we track day-of-month; for everything
  // else we track a free-form date string (YYYY-MM-DD).
  const defaultDay = existingBill?.dueDate
    ? Math.min(parseDayFromDate(existingBill.dueDate), 28)
    : Math.min(new Date().getDate() + 7, 28);
  const defaultDateStr = existingBill?.dueDate
    ?? (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split('T')[0];
    })();

  const [dueDay, setDueDay] = useState(defaultDay);
  const [dueDateStr, setDueDateStr] = useState(defaultDateStr);

  // Compute the actual due date to save
  const computedDueDate =
    isRecurring && recurrenceType === 'monthly'
      ? getNextOccurrence(dueDay)
      : dueDateStr;

  // ── Keypad handlers ───────────────────────────────────────────
  const handleKeyPress = (key: string) => {
    setAmountStr((prev) => {
      if (key === '.' && prev.includes('.')) return prev;
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  };

  const handleKeyDelete = () => {
    setAmountStr((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  };

  // ── Save / Delete ─────────────────────────────────────────────
  const handleSave = async () => {
    if (saving) return;
    const amount = parseFloat(amountStr);
    if (!amount || amount === 0) return;

    setSaving(true);

    if (isEdit && billId) {
      await billService.update(billId, {
        name: name || 'Bill',
        amount,
        dueDate: computedDueDate,
        isRecurring,
        recurrenceType: isRecurring ? recurrenceType : undefined,
        icon: selectedIcon,
        color: selectedColor,
      });
    } else {
      await billService.add({
        id: `bill-${Date.now()}`,
        name: name || 'Bill',
        amount,
        dueDate: computedDueDate,
        isRecurring,
        recurrenceType: isRecurring ? recurrenceType : undefined,
        paid: false,
        icon: selectedIcon,
        color: selectedColor,
      });
    }

    router.back();
  };

  const handleDelete = () => {
    if (!billId) return;
    Alert.alert(
      'Delete Bill',
      `Delete "${name || 'this bill'}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await billService.remove(billId);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <GlowBackground style={styles.container}>
      {step === 'amount' ? (
        /* ── Amount step ── */
        <View
          style={[
            styles.amountPage,
            {
              paddingTop: insets.top + Spacing.xl,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>New Bill</Text>
            <View style={{ width: 60 }} />
          </View>

          <Text style={styles.prompt}>How much is this bill?</Text>

          <View style={styles.amountDisplay}>
            <Text style={styles.amountCurrency}>$</Text>
            <Text
              style={styles.amountText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {amountStr}
            </Text>
          </View>

          <View style={styles.keypadWrapper}>
            <NumericKeypad onPress={handleKeyPress} onDelete={handleKeyDelete} />
          </View>

          <PrimaryButton
            label="Next"
            onPress={() => setStep('details')}
            disabled={amountStr === '0' || parseFloat(amountStr) === 0}
          />
        </View>
      ) : (
        /* ── Details step ── */
        <>
          <ScrollView
            contentContainerStyle={[
              styles.detailsPage,
              {
                paddingTop: insets.top + Spacing.xl,
                paddingBottom: insets.bottom + 120,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                onPress={() => (isEdit ? router.back() : setStep('amount'))}
                style={styles.cancelBtn}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={Colors.textSecondary}
                />
              </Pressable>
              <Text style={styles.headerTitle}>
                {isEdit ? 'Edit Bill' : 'Bill Details'}
              </Text>
              {isEdit ? (
                <Pressable onPress={handleDelete} style={styles.deleteBtn}>
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={Colors.red}
                  />
                </Pressable>
              ) : (
                <View style={{ width: 60 }} />
              )}
            </View>

            {/* Amount summary (tap to edit in add mode) */}
            <Pressable
              style={styles.amountSummary}
              onPress={() => !isEdit && setStep('amount')}
            >
              <Text style={styles.amountSummaryText}>
                ${parseFloat(amountStr).toFixed(2)}
              </Text>
              {!isEdit && (
                <Ionicons
                  name="pencil-outline"
                  size={14}
                  color={Colors.textMuted}
                />
              )}
            </Pressable>

            {/* Bill name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Bill Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Rent, Netflix, Electricity…"
                placeholderTextColor={Colors.textDisabled}
                selectionColor={Colors.accent}
              />
            </View>

            {/* Icon */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Icon</Text>
              <View style={styles.iconGrid}>
                {BILL_ICONS.map((item) => (
                  <Pressable
                    key={item.name}
                    onPress={() => setSelectedIcon(item.name)}
                    style={[
                      styles.iconChip,
                      selectedIcon === item.name && {
                        backgroundColor: selectedColor + '20',
                        borderColor: selectedColor + '60',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.name as any}
                      size={18}
                      color={
                        selectedIcon === item.name
                          ? selectedColor
                          : Colors.textMuted
                      }
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Color */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Color</Text>
              <View style={styles.colorRow}>
                {BILL_COLORS.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setSelectedColor(c)}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c },
                      selectedColor === c && styles.colorSwatchActive,
                    ]}
                  >
                    {selectedColor === c && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Recurring toggle */}
            <View style={styles.card}>
              <ToggleRow
                label="Recurring Bill"
                value={isRecurring}
                onValueChange={setIsRecurring}
                subtitle="Automatically track this bill each period"
              />
            </View>

            {/* Frequency (only when recurring) */}
            {isRecurring && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Frequency</Text>
                <View style={styles.recurrenceRow}>
                  {RECURRENCE_OPTIONS.map((opt) => (
                    <Pressable
                      key={opt.value}
                      onPress={() => setRecurrenceType(opt.value)}
                      style={[
                        styles.recurrenceChip,
                        recurrenceType === opt.value && {
                          backgroundColor: Colors.accentGlow,
                          borderColor: Colors.accent + '60',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.recurrenceLabel,
                          recurrenceType === opt.value && {
                            color: Colors.accent,
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Due date / renewal day */}
            {isRecurring && recurrenceType === 'monthly' ? (
              /* Monthly: pick the day of month */
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Renews on the</Text>
                <View style={styles.dayGrid}>
                  {MONTH_DAYS.map((d) => (
                    <Pressable
                      key={d}
                      onPress={() => setDueDay(d)}
                      style={[
                        styles.dayChip,
                        dueDay === d && {
                          backgroundColor: selectedColor + '25',
                          borderColor: selectedColor + '70',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayChipLabel,
                          dueDay === d && { color: selectedColor },
                        ]}
                      >
                        {d}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.dayHint}>
                  Next due: {ordinal(dueDay)} of the month
                </Text>
              </View>
            ) : (
              /* One-time or non-monthly: pick a specific date */
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Due Date</Text>
                <TextInput
                  style={[
                    styles.input,
                    Platform.OS === 'web' && ({ outlineWidth: 0 } as any),
                  ]}
                  value={dueDateStr}
                  onChangeText={setDueDateStr}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textDisabled}
                  selectionColor={Colors.accent}
                  keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                />
              </View>
            )}
          </ScrollView>

          {/* Sticky bottom bar */}
          <View
            style={[
              styles.bottomBar,
              { paddingBottom: insets.bottom + Spacing.lg },
            ]}
          >
            {isEdit && (
              <SecondaryButton
                label="Delete"
                onPress={handleDelete}
                style={styles.deleteSecondary}
                size="md"
              />
            )}
            <PrimaryButton
              label={isEdit ? 'Save Changes' : 'Add Bill'}
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              style={styles.saveBtn}
            />
          </View>
        </>
      )}
    </GlowBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  amountPage: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontal,
  },
  detailsPage: {
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
  deleteBtn: {
    width: 60,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  prompt: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  amountCurrency: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    paddingBottom: 8,
  },
  amountText: {
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
    maxWidth: '85%',
  },
  keypadWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Spacing.xl,
  },
  amountSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  amountSummaryText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
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
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  recurrenceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  recurrenceChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  recurrenceLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  // Day-of-month picker
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayChip: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayChipLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  dayHint: {
    marginTop: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background + 'E0',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveBtn: { flex: 1 },
  deleteSecondary: {
    width: 90,
    borderColor: Colors.red + '50',
  },
});

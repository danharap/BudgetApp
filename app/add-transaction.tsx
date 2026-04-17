import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { NumericKeypad } from '../components/ui/NumericKeypad';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Radii } from '../constants/radii';
import { CATEGORIES } from '../constants/categories';
import { useAppStore } from '../store/useAppStore';
import { transactionService } from '../features/transactions/service';
import { TransactionType } from '../types/transaction';

// ── Type toggle config ────────────────────────────────────────────────────────
interface TypeOption {
  label: string;
  value: TransactionType;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  glow: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  { label: 'Expense', value: 'expense', icon: 'arrow-up',   color: Colors.red,    glow: Colors.redGlow },
  { label: 'Income',  value: 'income',  icon: 'arrow-down', color: Colors.accent, glow: Colors.accentGlow },
  { label: 'Transfer',value: 'transfer',icon: 'swap-horizontal', color: Colors.blue, glow: Colors.blueGlow },
];

const EXPENSE_CATEGORIES = CATEGORIES.filter((c) =>
  ['food','transport','shopping','entertainment','health','housing','utilities','subscriptions','travel','education','other'].includes(c.id),
);
const INCOME_CATEGORIES = CATEGORIES.filter((c) => ['income', 'other'].includes(c.id));

export default function AddTransactionScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    amount?: string;
    merchant?: string;
    date?: string;
    accountId?: string;
  }>();

  const accounts = useAppStore((s) => s.accounts);

  const [type, setType]           = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState(params.amount ?? '0');
  const [merchant, setMerchant]   = useState(params.merchant ?? '');
  const [category, setCategory]   = useState('other');
  const [accountIdx, setAccountIdx] = useState(() => {
    if (!params.accountId) return 0;
    const idx = accounts.findIndex((a) => a.id === params.accountId);
    return idx >= 0 ? idx : 0;
  });
  const [toAccountIdx, setToAccountIdx] = useState(1);
  const [note, setNote]           = useState('');
  const [step, setStep]           = useState<'amount' | 'details'>('amount');
  const [saving, setSaving]       = useState(false);

  const account  = accounts[accountIdx];
  const toAccount = accounts[toAccountIdx] ?? accounts.find((_, i) => i !== accountIdx);
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const typeOption = TYPE_OPTIONS.find((t) => t.value === type)!;
  const typeColor  = typeOption.color;

  // ── Amount is valid when non-zero ─────────────────────────────────────────
  const amountValid = parseFloat(amountStr) > 0;

  // ── Keypad ────────────────────────────────────────────────────────────────
  const handleKeyPress = (key: string) => {
    setAmountStr((prev) => {
      if (key === '.' && prev.includes('.')) return prev;
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  };
  const handleKeyDelete = () =>
    setAmountStr((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (saving || !amountValid) return;
    setSaving(true);
    const amount  = parseFloat(amountStr);
    const dateStr = params.date ?? new Date().toISOString().split('T')[0];
    const fromId  = account?.id ?? '';
    const toId    = toAccount?.id ?? '';

    if (type === 'transfer' && fromId && toId && fromId !== toId) {
      // Two-sided transfer: expense from source, income to dest
      await transactionService.add({
        id: `txn-${Date.now()}-out`,
        accountId: fromId,
        amount,
        merchant: merchant || 'Transfer',
        category: 'transfer',
        note,
        date: dateStr,
        type: 'expense',
        source: 'manual',
      });
      await transactionService.add({
        id: `txn-${Date.now()}-in`,
        accountId: toId,
        amount,
        merchant: merchant || 'Transfer',
        category: 'transfer',
        note,
        date: dateStr,
        type: 'income',
        source: 'manual',
      });
    } else {
      await transactionService.add({
        id: `txn-${Date.now()}`,
        accountId: fromId,
        amount,
        merchant: merchant || 'Unknown',
        category,
        note,
        date: dateStr,
        type,
        source: 'manual',
      });
    }
    router.back();
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Dim top area — shows screen behind the modal */}
      <Pressable style={styles.topDim} onPress={() => router.back()} />

      {/* Modal card */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.lg }]}>
        {step === 'amount' ? (
          <AmountStep
            type={type}
            typeOption={typeOption}
            typeColor={typeColor}
            amountStr={amountStr}
            amountValid={amountValid}
            account={account}
            accounts={accounts}
            accountIdx={accountIdx}
            onTypeChange={(t) => {
              setType(t);
              setCategory(t === 'income' ? 'income' : 'other');
            }}
            onAccountCycle={() => setAccountIdx((i) => (i + 1) % Math.max(accounts.length, 1))}
            onKeyPress={handleKeyPress}
            onKeyDelete={handleKeyDelete}
            onNext={() => setStep('details')}
          />
        ) : (
          <DetailsStep
            type={type}
            typeColor={typeColor}
            amountStr={amountStr}
            merchant={merchant}
            category={category}
            categories={categories}
            accounts={accounts}
            accountIdx={accountIdx}
            toAccountIdx={toAccountIdx}
            note={note}
            saving={saving}
            onMerchantChange={setMerchant}
            onCategoryChange={setCategory}
            onAccountChange={setAccountIdx}
            onToAccountChange={setToAccountIdx}
            onNoteChange={setNote}
            onBack={() => setStep('amount')}
            onSave={handleSave}
          />
        )}
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Amount Step
// ════════════════════════════════════════════════════════════════════════════
interface AmountStepProps {
  type: TransactionType;
  typeOption: TypeOption;
  typeColor: string;
  amountStr: string;
  amountValid: boolean;
  account: ReturnType<typeof useAppStore.getState>['accounts'][number] | undefined;
  accounts: ReturnType<typeof useAppStore.getState>['accounts'];
  accountIdx: number;
  onTypeChange: (t: TransactionType) => void;
  onAccountCycle: () => void;
  onKeyPress: (k: string) => void;
  onKeyDelete: () => void;
  onNext: () => void;
}

function AmountStep({
  type, typeOption, typeColor, amountStr, amountValid,
  account, accounts, accountIdx,
  onTypeChange, onAccountCycle, onKeyPress, onKeyDelete, onNext,
}: AmountStepProps) {
  return (
    <View style={styles.amountContent}>
      {/* Close + type toggle row */}
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn} hitSlop={8}>
          <Ionicons name="close" size={18} color={Colors.textSecondary} />
        </Pressable>

        <View style={styles.typeToggle}>
          {TYPE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => onTypeChange(opt.value)}
              style={[
                styles.typeChip,
                type === opt.value && { backgroundColor: opt.color + '25', borderColor: opt.color + '70' },
              ]}
            >
              <Ionicons
                name={opt.icon}
                size={14}
                color={type === opt.value ? opt.color : Colors.textMuted}
              />
              <Text style={[styles.typeChipLabel, type === opt.value && { color: opt.color }]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* Account selector pill */}
      {accounts.length > 0 ? (
        <Pressable onPress={onAccountCycle} style={styles.accountPill}>
          <View style={[styles.accountPillDot, { backgroundColor: account?.color ?? Colors.accent }]} />
          <Text style={styles.accountPillName}>{account?.name ?? 'Account'}</Text>
          <Ionicons name="chevron-down" size={13} color={Colors.textMuted} />
        </Pressable>
      ) : null}

      {/* Amount display */}
      <View style={styles.amountBlock}>
        <Text
          style={[styles.amountText, { color: typeColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          ${amountStr}
        </Text>
      </View>

      {/* Quick Add row */}
      <View style={styles.quickAddRow}>
        <Text style={styles.quickAddLabel}>Quick Add</Text>
        <Pressable>
          <Text style={styles.quickAddEdit}>Edit</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickAddScroll}
        style={styles.quickAddScrollView}
      >
        <Pressable style={styles.quickAddChip}>
          <Ionicons name="add-circle-outline" size={14} color={Colors.accent} />
          <Text style={styles.quickAddChipLabel}>Add quick templates</Text>
        </Pressable>
      </ScrollView>

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        <NumericKeypad onPress={onKeyPress} onDelete={onKeyDelete} />
      </View>

      {/* Next */}
      <PrimaryButton
        label="Next"
        onPress={onNext}
        disabled={!amountValid}
      />
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Details Step
// ════════════════════════════════════════════════════════════════════════════
type AccountArr = ReturnType<typeof useAppStore.getState>['accounts'];

interface DetailsStepProps {
  type: TransactionType;
  typeColor: string;
  amountStr: string;
  merchant: string;
  category: string;
  categories: typeof CATEGORIES;
  accounts: AccountArr;
  accountIdx: number;
  toAccountIdx: number;
  note: string;
  saving: boolean;
  onMerchantChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onAccountChange: (i: number) => void;
  onToAccountChange: (i: number) => void;
  onNoteChange: (v: string) => void;
  onBack: () => void;
  onSave: () => void;
}

function DetailsStep({
  type, typeColor, amountStr, merchant, category, categories,
  accounts, accountIdx, toAccountIdx, note, saving,
  onMerchantChange, onCategoryChange, onAccountChange, onToAccountChange,
  onNoteChange, onBack, onSave,
}: DetailsStepProps) {
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.detailsScroll}
      >
        {/* Back header */}
        <View style={styles.detailsHeader}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </Pressable>
          <Text style={styles.detailsTitle}>Details</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Amount summary */}
        <View style={styles.detailsAmountRow}>
          <Text style={[styles.detailsAmount, { color: typeColor }]}>
            ${parseFloat(amountStr).toFixed(2)}
          </Text>
          <View style={[styles.detailsTypeBadge, { backgroundColor: typeColor + '20' }]}>
            <Text style={[styles.detailsTypeBadgeLabel, { color: typeColor }]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </View>
        </View>

        {/* Merchant */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            {type === 'transfer' ? 'Note / Reference' : 'Merchant / Description'}
          </Text>
          <TextInput
            style={[styles.input, Platform.OS === 'web' && ({ outlineWidth: 0 } as any)]}
            value={merchant}
            onChangeText={onMerchantChange}
            placeholder={type === 'transfer' ? 'Optional note…' : 'e.g. Whole Foods, Netflix…'}
            placeholderTextColor={Colors.textDisabled}
            selectionColor={Colors.accent}
          />
        </View>

        {/* Category (not for transfer) */}
        {type !== 'transfer' && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.chipGrid}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => onCategoryChange(cat.id)}
                  style={[
                    styles.categoryChip,
                    category === cat.id && { backgroundColor: cat.glowColor, borderColor: cat.color + '60' },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={13}
                    color={category === cat.id ? cat.color : Colors.textMuted}
                  />
                  <Text style={[styles.chipLabel, category === cat.id && { color: cat.color }]}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Account */}
        {accounts.length > 0 && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {type === 'transfer' ? 'From Account' : 'Account'}
            </Text>
            <View style={styles.chipGrid}>
              {accounts.map((acc, i) => (
                <Pressable
                  key={acc.id}
                  onPress={() => onAccountChange(i)}
                  style={[
                    styles.accountChip,
                    accountIdx === i && { backgroundColor: acc.color + '20', borderColor: acc.color + '60' },
                  ]}
                >
                  <View style={[styles.accountDot, { backgroundColor: acc.color }]} />
                  <Text style={[styles.chipLabel, accountIdx === i && { color: Colors.textPrimary }]}>
                    {acc.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* To Account (transfer only) */}
        {type === 'transfer' && accounts.length > 1 && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>To Account</Text>
            <View style={styles.chipGrid}>
              {accounts.map((acc, i) => (
                <Pressable
                  key={acc.id}
                  onPress={() => onToAccountChange(i)}
                  style={[
                    styles.accountChip,
                    toAccountIdx === i && { backgroundColor: acc.color + '20', borderColor: acc.color + '60' },
                  ]}
                >
                  <View style={[styles.accountDot, { backgroundColor: acc.color }]} />
                  <Text style={[styles.chipLabel, toAccountIdx === i && { color: Colors.textPrimary }]}>
                    {acc.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Note */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Note (optional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput, Platform.OS === 'web' && ({ outlineWidth: 0 } as any)]}
            value={note}
            onChangeText={onNoteChange}
            placeholder="Add a note…"
            placeholderTextColor={Colors.textDisabled}
            selectionColor={Colors.accent}
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.detailsBottomBar}>
        <PrimaryButton
          label="Save Transaction"
          onPress={onSave}
          loading={saving}
          disabled={saving}
        />
      </View>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Styles
// ════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  // ── Root (transparent overlay) ──
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  topDim: {
    flex: 1,
  },

  // ── Sliding sheet ──
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
    overflow: 'hidden',
    // soft top shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 24,
  },

  // ── Amount step ──
  amountContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeToggle: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  typeChipLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },

  // Account pill
  accountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.xl,
  },
  accountPillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accountPillName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },

  // Amount
  amountBlock: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    minHeight: 64,
    justifyContent: 'center',
  },
  amountText: {
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },

  // Quick Add
  quickAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickAddLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  quickAddEdit: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.medium,
  },
  quickAddScrollView: {
    marginBottom: Spacing.lg,
  },
  quickAddScroll: {
    gap: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  quickAddChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
    backgroundColor: Colors.accentGlow,
  },
  quickAddChipLabel: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.medium,
  },

  // Keypad
  keypadContainer: {
    marginBottom: Spacing.lg,
  },

  // ── Details step ──
  detailsScroll: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  detailsAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  detailsAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  detailsTypeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  detailsTypeBadgeLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'capitalize',
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
  noteInput: {
    minHeight: 72,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  accountDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  detailsBottomBar: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});

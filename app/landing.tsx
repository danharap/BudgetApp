import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  useWindowDimensions,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Radii } from '../constants/radii';

// ─── Layout constants ────────────────────────────────────────────────────────
const NAV_HEIGHT = 58;
const BREAKPOINT = 780;
const MAX_W = 1080;

const SECTION_KEYS = ['features', 'pricing', 'reviews', 'faq'] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

// ─── Shared shell ────────────────────────────────────────────────────────────
function Shell({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[S.shell, style]}>{children}</View>;
}

function Anchor({ id, children }: { id: string; children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return (
      <View nativeID={id} {...({ id } as { id: string })}>
        {children}
      </View>
    );
  }
  return <>{children}</>;
}

// ─── Nav CTA buttons ─────────────────────────────────────────────────────────
function GreenBtn({
  label,
  onPress,
  size = 'md',
}: {
  label: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const py = size === 'lg' ? Spacing.lg : size === 'sm' ? 7 : 10;
  const px = size === 'lg' ? Spacing.xxxl : size === 'sm' ? Spacing.md : Spacing.lg;
  const fs = size === 'lg' ? FontSize.lg : FontSize.sm;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
      <LinearGradient
        colors={[Colors.accentLight, Colors.accent, Colors.accentDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          S.greenBtn,
          { paddingVertical: py, paddingHorizontal: px },
          size === 'lg' && S.greenBtnLg,
        ]}
      >
        <Text style={[S.greenBtnLabel, { fontSize: fs }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function OutlineBtn({
  label,
  onPress,
  size = 'md',
}: {
  label: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const py = size === 'lg' ? Spacing.lg : size === 'sm' ? 7 : 10;
  const px = size === 'lg' ? Spacing.xxxl : size === 'sm' ? Spacing.md : Spacing.lg;
  const fs = size === 'lg' ? FontSize.lg : FontSize.sm;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        S.outlineBtn,
        { paddingVertical: py, paddingHorizontal: px },
        size === 'lg' && S.outlineBtnLg,
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[S.outlineBtnLabel, { fontSize: fs }]}>{label}</Text>
    </Pressable>
  );
}

// ─── App screen mockups ──────────────────────────────────────────────────────
function OverviewMock() {
  return (
    <View style={S.mockCard}>
      <Text style={S.mockTitle}>Overview</Text>
      {/* Summary card */}
      <LinearGradient
        colors={[Colors.surfaceElevated, Colors.surface]}
        style={S.mockSummary}
      >
        <Text style={S.mockSummaryLabel}>Total spent · April</Text>
        <Text style={S.mockSummaryAmount}>$2,480<Text style={S.mockSummaryCents}>.50</Text></Text>
        <View style={S.mockSummaryRow}>
          <View style={S.mockSummaryChip}>
            <Text style={S.mockChipGreen}>↑ $3,200 income</Text>
          </View>
          <View style={S.mockSummaryChip}>
            <Text style={S.mockChipRed}>↓ $2,480 spent</Text>
          </View>
        </View>
      </LinearGradient>
      {/* Activity rows */}
      {[
        { icon: 'restaurant', label: 'Starbucks', amt: '-$6.50', color: Colors.orange },
        { icon: 'car', label: 'Uber', amt: '-$14.00', color: Colors.blue },
        { icon: 'trending-up', label: 'Salary', amt: '+$3,200', color: Colors.accent },
      ].map((item) => (
        <View key={item.label} style={S.mockRow}>
          <View style={[S.mockRowIcon, { backgroundColor: item.color + '22' }]}>
            <Ionicons name={item.icon as any} size={14} color={item.color} />
          </View>
          <Text style={S.mockRowLabel}>{item.label}</Text>
          <Text style={[S.mockRowAmt, item.amt.startsWith('+') ? S.green : S.red]}>{item.amt}</Text>
        </View>
      ))}
    </View>
  );
}

function BudgetMock() {
  const cats = [
    { name: 'Food & Drink', pct: 72, color: Colors.orange, spent: '$432', limit: '$600' },
    { name: 'Transport', pct: 38, color: Colors.blue, spent: '$114', limit: '$300' },
    { name: 'Entertainment', pct: 55, color: Colors.purple, spent: '$110', limit: '$200' },
    { name: 'Housing', pct: 90, color: Colors.teal, spent: '$1,800', limit: '$2,000' },
  ];
  return (
    <View style={S.mockCard}>
      <View style={S.mockHeaderRow}>
        <Text style={S.mockTitle}>Budget</Text>
        <Text style={S.mockBadge}>Apr 2026</Text>
      </View>
      {cats.map((c) => (
        <View key={c.name} style={S.mockBudgetRow}>
          <View style={S.mockBudgetTop}>
            <Text style={S.mockBudgetName}>{c.name}</Text>
            <Text style={S.mockBudgetAmt}>
              {c.spent} <Text style={S.mockBudgetOf}>/ {c.limit}</Text>
            </Text>
          </View>
          <View style={S.mockBarBg}>
            <View
              style={[
                S.mockBarFill,
                { width: `${c.pct}%` as any, backgroundColor: c.color },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function BillsMock() {
  const bills = [
    { name: 'Netflix', amt: '$15.99', due: 'Apr 22', icon: 'tv-outline', color: Colors.red },
    { name: 'Spotify', amt: '$10.99', due: 'Apr 25', icon: 'musical-notes-outline', color: Colors.accent },
    { name: 'Electricity', amt: '$120.00', due: 'Apr 30', icon: 'flash-outline', color: Colors.yellow },
  ];
  return (
    <View style={S.mockCard}>
      <Text style={S.mockTitle}>Bills</Text>
      {bills.map((b) => (
        <View key={b.name} style={S.mockBillRow}>
          <View style={[S.mockRowIcon, { backgroundColor: b.color + '22' }]}>
            <Ionicons name={b.icon as any} size={14} color={b.color} />
          </View>
          <View style={S.mockBillInfo}>
            <Text style={S.mockRowLabel}>{b.name}</Text>
            <Text style={S.mockBillDue}>Due {b.due}</Text>
          </View>
          <Text style={S.mockBillAmt}>{b.amt}</Text>
        </View>
      ))}
      <View style={S.mockBillFooter}>
        <Text style={S.mockBillFooterText}>3 bills · $146.98 upcoming</Text>
      </View>
    </View>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  accent,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  accent?: string;
  title: string;
  body: string;
}) {
  const clr = accent ?? Colors.accent;
  return (
    <View style={S.featureCard}>
      <View style={[S.featureIcon, { backgroundColor: clr + '1A', borderColor: clr + '44' }]}>
        <Ionicons name={icon} size={22} color={clr} />
      </View>
      <Text style={S.featureTitle}>{title}</Text>
      <Text style={S.featureBody}>{body}</Text>
    </View>
  );
}

// ─── Pricing card ─────────────────────────────────────────────────────────────
function PricingCard({
  name,
  price,
  sub,
  features,
  featured,
  onChoose,
}: {
  name: string;
  price: string;
  sub: string;
  features: string[];
  featured?: boolean;
  onChoose: () => void;
}) {
  return (
    <View style={[S.priceCard, featured && S.priceCardFeatured]}>
      {featured ? (
        <LinearGradient
          colors={[Colors.accentGlow, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      <View style={S.priceCardInner}>
        {featured ? (
          <View style={S.featuredBadge}>
            <Text style={S.featuredBadgeText}>MOST POPULAR</Text>
          </View>
        ) : null}
        <Text style={S.priceName}>{name}</Text>
        <Text style={S.priceAmt}>{price}</Text>
        <Text style={S.priceSub}>{sub}</Text>
        <View style={S.priceList}>
          {features.map((f) => (
            <View key={f} style={S.priceRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.accentLight} />
              <Text style={S.priceRowText}>{f}</Text>
            </View>
          ))}
        </View>
        {featured ? (
          <GreenBtn label="Get Started" onPress={onChoose} />
        ) : (
          <OutlineBtn label="Get Started" onPress={onChoose} />
        )}
      </View>
    </View>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <View style={S.reviewCard}>
      <View style={S.reviewStars}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Ionicons key={i} name="star" size={13} color={Colors.accent} />
        ))}
      </View>
      <Text style={S.reviewQuote}>"{quote}"</Text>
      <View style={S.reviewFooter}>
        <View style={S.reviewAvatar}>
          <Text style={S.reviewAvatarLetter}>{name[0]}</Text>
        </View>
        <View>
          <Text style={S.reviewName}>{name}</Text>
          <Text style={S.reviewRole}>{role}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={S.faqItem}>
      <Pressable onPress={onToggle} style={S.faqHeader}>
        <Text style={S.faqQ}>{question}</Text>
        <Ionicons
          name={open ? 'remove-circle-outline' : 'add-circle-outline'}
          size={20}
          color={open ? Colors.accent : Colors.textMuted}
        />
      </Pressable>
      {open ? <Text style={S.faqA}>{answer}</Text> : null}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;
  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Partial<Record<SectionKey, number>>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scrollPadTop = insets.top + NAV_HEIGHT;

  const goSignIn = useCallback(() => { setMenuOpen(false); router.push('/auth/sign-in'); }, []);
  const goSignUp = useCallback(() => { setMenuOpen(false); router.push('/auth/sign-up'); }, []);

  const scrollTo = useCallback((key: SectionKey) => {
    setMenuOpen(false);
    const y = sectionY.current[key];
    if (y != null && scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, y - (insets.top + NAV_HEIGHT + 8)), animated: true });
    }
  }, [insets.top]);

  const captureLayout = (key: SectionKey) => (e: LayoutChangeEvent) => {
    sectionY.current[key] = e.nativeEvent.layout.y;
  };

  const navLink = (label: string, key: SectionKey) => (
    <Pressable onPress={() => scrollTo(key)} hitSlop={8}>
      <Text style={S.navLink}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={S.root}>
      {/* ── Sticky Nav ── */}
      <View style={[S.nav, { paddingTop: insets.top }]}>
        <Shell style={S.navShell}>
          <View style={S.navInner}>
            {/* Brand */}
            <Pressable
              onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
              style={S.brandRow}
            >
              <LinearGradient
                colors={[Colors.accentLight, Colors.accentDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={S.brandMark}
              >
                <Ionicons name="leaf" size={18} color="#fff" />
              </LinearGradient>
              <Text style={S.brandName}>BudgetApp</Text>
            </Pressable>

            {isWide ? (
              <View style={S.navLinks}>
                {navLink('Features', 'features')}
                {navLink('Pricing', 'pricing')}
                {navLink('Reviews', 'reviews')}
                {navLink('FAQ', 'faq')}
              </View>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <View style={S.navRight}>
              {isWide ? (
                <>
                  <Pressable onPress={goSignIn} style={S.navSignIn}>
                    <Text style={S.navSignInText}>Sign In</Text>
                  </Pressable>
                  <GreenBtn label="Get Started" onPress={goSignUp} size="sm" />
                </>
              ) : (
                <Pressable
                  onPress={() => setMenuOpen((v) => !v)}
                  style={S.hamburger}
                  accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
                >
                  <Ionicons
                    name={menuOpen ? 'close' : 'menu'}
                    size={24}
                    color={Colors.textPrimary}
                  />
                </Pressable>
              )}
            </View>
          </View>
        </Shell>

        {!isWide && menuOpen ? (
          <View style={S.mobileMenu}>
            {navLink('Features', 'features')}
            {navLink('Pricing', 'pricing')}
            {navLink('Reviews', 'reviews')}
            {navLink('FAQ', 'faq')}
            <View style={S.mobileMenuActions}>
              <OutlineBtn label="Sign In" onPress={goSignIn} />
              <GreenBtn label="Get Started" onPress={goSignUp} />
            </View>
          </View>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        style={S.scroll}
        contentContainerStyle={[S.scrollContent, { paddingTop: scrollPadTop }]}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        {/* ── Hero ── */}
        <View style={S.hero}>
          {/* Glow orbs matching GlowBackground */}
          <View style={S.orbTL} />
          <View style={S.orbTR} />
          <View style={S.orbBL} />
          <LinearGradient
            colors={['transparent', Colors.background]}
            start={{ x: 0.5, y: 0.6 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Shell style={S.heroShell}>
            {/* Badge */}
            <View style={S.heroBadge}>
              <View style={S.heroBadgeDot} />
              <Text style={S.heroBadgeText}>FREE TO START · NO CREDIT CARD REQUIRED</Text>
            </View>
            {/* Headline */}
            <Text style={[S.heroH, isWide ? S.heroHWide : null]}>
              Know where your{'\n'}money goes.
            </Text>
            <Text style={S.heroSub}>
              Track accounts, categorize spending, set monthly budgets, and stay on top of recurring
              bills — all synced to your Supabase account.
            </Text>
            {/* CTAs */}
            <View style={[S.heroCtas, !isWide && S.heroCtasCol]}>
              <GreenBtn label="Get Started Free" onPress={goSignUp} size="lg" />
              <OutlineBtn label="Sign In  →" onPress={goSignIn} size="lg" />
            </View>
          </Shell>
        </View>

        {/* ── App Preview ── */}
        <Shell style={S.previewSection}>
          <Text style={S.sectionKicker}>Inside the app</Text>
          <Text style={S.sectionHeading}>Everything you need in one place</Text>
          <Text style={S.sectionBody}>
            Overview, Budget, Bills, Transactions, and Accounts — each screen shares the same
            month-aware data model so your numbers are always in sync.
          </Text>
          <View style={[S.previewGrid, isWide && S.previewGridWide]}>
            <OverviewMock />
            <BudgetMock />
            <BillsMock />
          </View>
        </Shell>

        {/* ── Features ── */}
        <Anchor id="features">
          <View onLayout={captureLayout('features')} style={S.section}>
            <Shell>
              <Text style={S.sectionKicker}>Features</Text>
              <Text style={S.sectionHeading}>Built for how you actually spend</Text>
              <Text style={S.sectionBody}>
                Every feature maps to a real screen in this app — nothing here is a placeholder.
              </Text>
              <View style={[S.featureGrid, isWide && S.featureGridWide]}>
                <FeatureCard
                  icon="wallet-outline"
                  title="Multi-account tracking"
                  body="Add checking, savings, and credit accounts. Total assets surface on the Overview tab after onboarding."
                />
                <FeatureCard
                  icon="swap-vertical-outline"
                  accent={Colors.blue}
                  title="Transaction history"
                  body="Log income and expenses, filter by month, account, or type, and search across your full history."
                />
                <FeatureCard
                  icon="pie-chart-outline"
                  accent={Colors.purple}
                  title="Category budgets"
                  body="Set per-category monthly limits, watch a live progress bar, and edit any time from the Budget screen."
                />
                <FeatureCard
                  icon="calendar-outline"
                  accent={Colors.orange}
                  title="Bills & recurring"
                  body="Track due dates, mark bills paid, and see total upcoming spend so nothing slips through."
                />
                <FeatureCard
                  icon="trending-up-outline"
                  accent={Colors.teal}
                  title="Spending insights"
                  body="Weekly and daily averages, days left in month, and category breakdowns on the Overview screen."
                />
                <FeatureCard
                  icon="shield-checkmark-outline"
                  accent={Colors.accentLight}
                  title="Secure sync"
                  body="Email + password auth with Supabase. Sessions stored in SecureStore on native, localStorage on web."
                />
              </View>
            </Shell>
          </View>
        </Anchor>

        {/* ── Pricing ── */}
        <Anchor id="pricing">
          <View onLayout={captureLayout('pricing')} style={S.section}>
            <Shell>
              <Text style={S.sectionKicker}>Pricing</Text>
              <Text style={S.sectionHeading}>Simple, honest pricing</Text>
              <Text style={S.pricingNote}>
                Example tiers for a portfolio demo — billing is not wired up in this build.
              </Text>
              <View style={[S.priceGrid, isWide && S.priceGridWide]}>
                <PricingCard
                  name="Starter"
                  price="$0"
                  sub="For individuals getting started."
                  features={['Budgets & bills', 'Supabase sync', 'Mobile + web']}
                  onChoose={goSignUp}
                />
                <PricingCard
                  name="Household"
                  price="$8 / mo"
                  sub="For couples and shared budgets."
                  features={['Everything in Starter', 'Shared view (coming soon)', 'Priority support']}
                  featured
                  onChoose={goSignUp}
                />
                <PricingCard
                  name="Team"
                  price="$18 / mo"
                  sub="For teams wanting full structure."
                  features={['Planned export tools', 'Roles & permissions (planned)', 'Custom categories']}
                  onChoose={goSignUp}
                />
              </View>
            </Shell>
          </View>
        </Anchor>

        {/* ── Reviews ── */}
        <Anchor id="reviews">
          <View onLayout={captureLayout('reviews')} style={S.section}>
            <Shell>
              <Text style={S.sectionKicker}>Reviews</Text>
              <Text style={S.sectionHeading}>Loved by people who care about their money</Text>
              <View style={[S.reviewGrid, isWide && S.reviewGridWide]}>
                <ReviewCard
                  quote="The bills tab finally stopped me from double-paying subscriptions every month."
                  name="Avery Cole"
                  role="Freelance designer"
                />
                <ReviewCard
                  quote="Category budgets with live progress bars are exactly how I wanted to see my spending."
                  name="Jordan Patel"
                  role="Engineering manager"
                />
                <ReviewCard
                  quote="Love that onboarding sets up accounts and categories before dumping you in empty screens."
                  name="Sam Rivera"
                  role="Teacher & parent"
                />
                <ReviewCard
                  quote="Filtering transactions by account is a game changer when you share finances."
                  name="Riley Nguyen"
                  role="Small business owner"
                />
              </View>
              <Text style={S.reviewDisclaimer}>
                Sample testimonials for portfolio purposes — fictional and for layout only.
              </Text>
            </Shell>
          </View>
        </Anchor>

        {/* ── FAQ ── */}
        <Anchor id="faq">
          <View onLayout={captureLayout('faq')} style={S.section}>
            <Shell>
              <Text style={S.sectionKicker}>FAQ</Text>
              <Text style={S.sectionHeading}>Questions & answers</Text>
              <View style={S.faqList}>
                {([
                  ['Where is my data stored?', 'Your budgets, transactions, bills, and accounts are stored in Supabase tables scoped to your user ID. Nothing is stored on third-party servers beyond Supabase.'],
                  ['Do I need a credit card?', 'No. This demo does not collect payment details. The pricing section shows example tiers only.'],
                  ['Does it work on mobile and web?', 'Yes. BudgetApp is built with Expo and React Native so it runs natively on iOS and Android, and in any modern browser via Expo Web.'],
                  ['What happens when I log out?', 'Your local store data is cleared and you return to this marketing page. Your Supabase data remains safe and loads again on next sign-in.'],
                  ['Can I import transactions automatically?', 'There is a deep-link import screen that pre-fills the add-transaction form from supported URL parameters — useful with iOS Shortcuts.'],
                  ['Is voice entry available?', 'The Overview header has a microphone shortcut that opens the add-transaction screen. Speech-to-text relies on your device\'s built-in capabilities.'],
                ] as [string, string][]).map(([q, a], i) => (
                  <FaqItem
                    key={q}
                    question={q}
                    answer={a}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq((prev) => (prev === i ? null : i))}
                  />
                ))}
              </View>
            </Shell>
          </View>
        </Anchor>

        {/* ── Bottom CTA ── */}
        <Shell style={S.ctaShell}>
          <LinearGradient
            colors={[Colors.accentGlowStrong, Colors.accentGlow, 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={S.ctaBlock}>
            <Text style={S.ctaTitle}>Ready to take control of your finances?</Text>
            <Text style={S.ctaSub}>
              Join thousands of people who use BudgetApp to track spending, hit savings goals, and
              never miss a bill.
            </Text>
            <View style={[S.ctaBtns, !isWide && S.ctaBtnsCol]}>
              <GreenBtn label="Get Started Free" onPress={goSignUp} size="lg" />
              <OutlineBtn label="Sign In" onPress={goSignIn} size="lg" />
            </View>
          </View>
        </Shell>

        {/* ── Footer ── */}
        <Shell style={S.footer}>
          <View style={S.footerDivider} />
          <View style={[S.footerInner, isWide && S.footerInnerWide]}>
            <View style={S.footerBrand}>
              <LinearGradient
                colors={[Colors.accentLight, Colors.accentDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={S.footerMark}
              >
                <Ionicons name="leaf" size={14} color="#fff" />
              </LinearGradient>
              <Text style={S.footerBrandName}>BudgetApp</Text>
            </View>
            <Text style={S.footerCopy}>© {new Date().getFullYear()} BudgetApp. All rights reserved.</Text>
            <Text style={S.footerStack}>Expo · React Native · Supabase · Zustand</Text>
          </View>
        </Shell>

        <View style={{ height: insets.bottom + Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // ── Shell / layout
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  shell: {
    width: '100%',
    maxWidth: MAX_W,
    alignSelf: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.massive },

  // ── Nav
  nav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: 'rgba(8, 12, 24, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(14px)' } as object)
      : {}),
  },
  navShell: {
    width: '100%',
    maxWidth: MAX_W,
    alignSelf: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  navInner: {
    minHeight: NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 0,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
  },
  navLinks: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  navLink: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 0,
  },
  navSignIn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  navSignInText: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
  },
  hamburger: {
    padding: Spacing.sm,
    borderRadius: Radii.md,
  },
  mobileMenu: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: 'rgba(8, 12, 24, 0.98)',
  },
  mobileMenuActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },

  // ── Buttons
  greenBtn: {
    borderRadius: Radii.buttonLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenBtnLg: {
    minWidth: 180,
  },
  greenBtnLabel: {
    color: '#0A1F0A',
    fontWeight: FontWeight.bold,
    letterSpacing: 0.2,
  },
  outlineBtn: {
    borderRadius: Radii.buttonLg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  outlineBtnLg: {
    minWidth: 160,
  },
  outlineBtnLabel: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },

  // ── Hero
  hero: {
    width: '100%',
    paddingBottom: Spacing.massive,
    overflow: 'hidden',
    position: 'relative',
  },
  orbTL: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.accentGlow,
  },
  orbTR: {
    position: 'absolute',
    top: 40,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.glowBlue,
  },
  orbBL: {
    position: 'absolute',
    bottom: 0,
    left: '30%',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.glowPurple,
  },
  heroShell: {
    paddingTop: Spacing.massive,
    gap: Spacing.xl,
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
    backgroundColor: Colors.accentGlow,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentLight,
  },
  heroBadgeText: {
    color: Colors.accentLight,
    fontSize: 11,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
  },
  heroH: {
    color: Colors.textPrimary,
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    letterSpacing: -2,
    lineHeight: 56,
    textAlign: 'center',
    maxWidth: 680,
  },
  heroHWide: {
    fontSize: 60,
    lineHeight: 64,
  },
  heroSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 560,
    paddingHorizontal: Spacing.sm,
  },
  heroCtas: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroCtasCol: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    maxWidth: 360,
  },

  // ── App preview
  previewSection: {
    marginTop: Spacing.massive,
    gap: Spacing.md,
  },
  previewGrid: {
    marginTop: Spacing.xl,
    gap: Spacing.lg,
  },
  previewGridWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // ── Mock cards (in-app screen previews)
  mockCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.cardPadding,
    gap: Spacing.md,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 12 },
          elevation: 10,
        }),
  },
  mockTitle: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  mockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mockBadge: {
    color: Colors.accentLight,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  mockSummary: {
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  mockSummaryLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  mockSummaryAmount: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    letterSpacing: -1,
  },
  mockSummaryCents: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  mockSummaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  mockSummaryChip: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: Colors.surfaceBright,
  },
  mockChipGreen: {
    color: Colors.accentLight,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  mockChipRed: {
    color: Colors.red,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  mockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mockRowIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockRowLabel: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  mockRowAmt: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  green: { color: Colors.accentLight },
  red: { color: Colors.red },
  mockBudgetRow: {
    gap: Spacing.xs,
  },
  mockBudgetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mockBudgetName: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  mockBudgetAmt: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  mockBudgetOf: {
    color: Colors.textMuted,
    fontWeight: FontWeight.regular,
  },
  mockBarBg: {
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.surfaceBright,
    overflow: 'hidden',
  },
  mockBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  mockBillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mockBillInfo: {
    flex: 1,
    gap: 2,
  },
  mockBillDue: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  mockBillAmt: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  mockBillFooter: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  mockBillFooterText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },

  // ── Section base
  section: {
    marginTop: Spacing.massive,
  },
  sectionKicker: {
    color: Colors.accentLight,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  sectionHeading: {
    color: Colors.textPrimary,
    fontSize: FontSize.huge,
    fontWeight: FontWeight.black,
    letterSpacing: -1.2,
    lineHeight: 44,
    marginBottom: Spacing.md,
  },
  sectionBody: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 26,
    marginBottom: Spacing.xl,
    maxWidth: 680,
  },

  // ── Features
  featureGrid: { gap: Spacing.lg },
  featureGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureCard: {
    flexBasis: '48%' as any,
    flexGrow: 1,
    minWidth: 240,
    padding: Spacing.cardPaddingLg,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  featureBody: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 21,
  },

  // ── Pricing
  pricingNote: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginBottom: Spacing.xl,
    marginTop: -Spacing.sm,
  },
  priceGrid: { gap: Spacing.lg },
  priceGridWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  priceCard: {
    flexBasis: '30%' as any,
    flexGrow: 1,
    minWidth: 230,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  priceCardFeatured: {
    borderColor: Colors.accent + '66',
    transform: [{ translateY: -6 }],
  },
  priceCardInner: {
    padding: Spacing.cardPaddingLg,
    gap: Spacing.md,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    backgroundColor: Colors.accentGlow,
  },
  featuredBadgeText: {
    color: Colors.accentLight,
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
  },
  priceName: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  priceAmt: {
    color: Colors.textPrimary,
    fontSize: FontSize.huge,
    fontWeight: FontWeight.black,
    letterSpacing: -1,
  },
  priceSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  priceList: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  priceRowText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },

  // ── Reviews
  reviewGrid: { gap: Spacing.lg },
  reviewGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reviewCard: {
    flexBasis: '48%' as any,
    flexGrow: 1,
    minWidth: 230,
    padding: Spacing.cardPaddingLg,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewQuote: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    lineHeight: 22,
    flex: 1,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.accent + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarLetter: {
    color: Colors.accentLight,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  reviewName: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  reviewRole: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  reviewDisclaimer: {
    marginTop: Spacing.lg,
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    lineHeight: 16,
  },

  // ── FAQ
  faqList: { gap: Spacing.sm },
  faqItem: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  faqQ: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  faqA: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 21,
  },

  // ── Bottom CTA
  ctaShell: {
    marginTop: Spacing.massive,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  ctaBlock: {
    padding: Spacing.xxxl,
    gap: Spacing.md,
    alignItems: 'center',
  },
  ctaTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    letterSpacing: -0.8,
    textAlign: 'center',
    maxWidth: 600,
  },
  ctaSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 560,
  },
  ctaBtns: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaBtnsCol: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    maxWidth: 360,
  },

  // ── Footer
  footer: {
    marginTop: Spacing.massive,
    paddingBottom: Spacing.lg,
  },
  footerDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.xxl,
  },
  footerInner: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  footerInnerWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  footerMark: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrandName: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  footerCopy: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  footerStack: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});

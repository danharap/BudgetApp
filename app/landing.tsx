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
import { SecondaryButton } from '../components/ui/SecondaryButton';

const NAV_BAR_HEIGHT = 56;
const BREAKPOINT = 780;

const SECTION_KEYS = ['features', 'pricing', 'reviews', 'faq'] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

function WebSectionAnchor({ id, children }: { id: string; children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return (
      <View nativeID={id} {...({ id } as { id: string })}>
        {children}
      </View>
    );
  }
  return <>{children}</>;
}

function HeroCtaButton({
  label,
  onPress,
  variant = 'primary',
  containerStyle,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  containerStyle?: ViewStyle;
}) {
  if (variant === 'secondary') {
    return (
      <SecondaryButton
        label={label}
        onPress={onPress}
        style={StyleSheet.flatten([styles.heroCtaSecondary, containerStyle])}
        textStyle={{ color: Colors.textPrimary }}
      />
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.heroCtaPrimaryWrap,
        containerStyle,
        { opacity: pressed ? 0.88 : 1 },
      ]}
    >
      <LinearGradient
        colors={['#6366F1', '#4F46E5', '#4338CA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCtaPrimary}
      >
        <Text style={styles.heroCtaPrimaryLabel}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIconWrap}>
        <Ionicons name={icon} size={22} color={Colors.blue} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureBody}>{body}</Text>
    </View>
  );
}

function PricingCard({
  name,
  price,
  blurb,
  highlights,
  emphasized,
  onChoose,
}: {
  name: string;
  price: string;
  blurb: string;
  highlights: string[];
  emphasized?: boolean;
  onChoose: () => void;
}) {
  return (
    <View style={[styles.priceCard, emphasized && styles.priceCardEmphasized]}>
      {emphasized ? (
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.35)', 'rgba(67, 56, 202, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      <View style={styles.priceCardInner}>
        <Text style={styles.priceName}>{name}</Text>
        <Text style={styles.priceAmount}>{price}</Text>
        <Text style={styles.priceBlurb}>{blurb}</Text>
        <View style={styles.priceList}>
          {highlights.map((line) => (
            <View key={line} style={styles.priceRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.accentLight} />
              <Text style={styles.priceRowText}>{line}</Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={onChoose}
          style={({ pressed }) => [
            styles.priceButton,
            emphasized && styles.priceButtonEmphasized,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.priceButtonLabel, emphasized && styles.priceButtonLabelOnAccent]}>
            Get started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ReviewCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <View style={styles.reviewCard}>
      <Ionicons name="chatbox-ellipses-outline" size={20} color={Colors.indigo} />
      <Text style={styles.reviewQuote}>“{quote}”</Text>
      <Text style={styles.reviewName}>{name}</Text>
      <Text style={styles.reviewRole}>{role}</Text>
    </View>
  );
}

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
    <View style={styles.faqItem}>
      <Pressable onPress={onToggle} style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.textMuted} />
      </Pressable>
      {open ? <Text style={styles.faqAnswer}>{answer}</Text> : null}
    </View>
  );
}

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;
  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Partial<Record<SectionKey, number>>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const navPadTop = insets.top;
  const scrollPadTop = navPadTop + NAV_BAR_HEIGHT + Spacing.lg;

  const goAuth = useCallback(() => {
    setMenuOpen(false);
    router.push('/auth/sign-in');
  }, []);

  const scrollToSection = useCallback((key: SectionKey) => {
    setMenuOpen(false);
    const y = sectionY.current[key];
    const offset = navPadTop + NAV_BAR_HEIGHT + Spacing.sm;
    if (y != null && scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, y - offset), animated: true });
    }
  }, [navPadTop]);

  const captureSectionLayout = (key: SectionKey) => (e: LayoutChangeEvent) => {
    sectionY.current[key] = e.nativeEvent.layout.y;
  };

  const openFaqToggle = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const navLink = (label: string, key: SectionKey) => (
    <Pressable onPress={() => scrollToSection(key)} hitSlop={8}>
      <Text style={styles.navLink}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <View style={[styles.navBar, { paddingTop: navPadTop }]}>
        <View style={styles.navInner}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Ionicons name="leaf" size={22} color={Colors.accent} />
            </View>
            <Text style={styles.brandText}>BudgetApp</Text>
          </View>

          {isWide ? (
            <View style={styles.navLinks}>
              {navLink('Features', 'features')}
              {navLink('Pricing', 'pricing')}
              {navLink('Reviews', 'reviews')}
              {navLink('FAQ', 'faq')}
            </View>
          ) : null}

          <View style={styles.navActions}>
            {!isWide ? (
              <Pressable
                onPress={() => setMenuOpen((v) => !v)}
                style={styles.iconBtn}
                accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <Ionicons name={menuOpen ? 'close' : 'menu'} size={24} color={Colors.textPrimary} />
              </Pressable>
            ) : null}
            <Pressable onPress={goAuth} style={styles.signInPill}>
              <Text style={styles.signInPillText}>Sign In</Text>
            </Pressable>
          </View>
        </View>

        {!isWide && menuOpen ? (
          <View style={styles.mobileMenu}>
            {navLink('Features', 'features')}
            {navLink('Pricing', 'pricing')}
            {navLink('Reviews', 'reviews')}
            {navLink('FAQ', 'faq')}
            <Pressable onPress={goAuth} style={styles.mobileMenuCta}>
              <Text style={styles.mobileMenuCtaText}>Get Started</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: scrollPadTop }]}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        {/* Hero */}
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#1E3A8A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroGlow} />
          <Text style={styles.heroKicker}>Household budgeting</Text>
          <Text style={styles.heroTitle}>Know where your money goes—every month.</Text>
          <Text style={styles.heroSub}>
            BudgetApp helps you track accounts, categorize spending, plan monthly limits, and stay
            on top of recurring bills—with your data backed by Supabase.
          </Text>
          <View style={[styles.heroCtas, !isWide && styles.heroCtasCol]}>
            <HeroCtaButton
              label="Get Started"
              onPress={goAuth}
              containerStyle={!isWide ? styles.heroCtaFull : undefined}
            />
            <HeroCtaButton
              label="Sign In"
              onPress={goAuth}
              variant="secondary"
              containerStyle={!isWide ? styles.heroCtaFull : undefined}
            />
          </View>
          <Text style={styles.heroTrust}>No credit card required to create an account.</Text>
        </LinearGradient>

        {/* App preview */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionLabel}>Inside the app</Text>
          <Text style={styles.sectionTitle}>A calm dashboard for real life</Text>
          <Text style={styles.sectionSub}>
            After you sign in, you will see Overview, Transactions, Budget, Bills, and Accounts—each
            wired to the same month-aware data model used throughout the app.
          </Text>
          <View style={styles.previewMock}>
            <View style={styles.previewPhone}>
              <View style={styles.previewTopBar}>
                <Text style={styles.previewTopTitle}>Overview</Text>
                <View style={styles.previewDots}>
                  <View style={styles.previewDot} />
                  <View style={styles.previewDot} />
                </View>
              </View>
              <LinearGradient
                colors={[Colors.surfaceElevated, Colors.surface]}
                style={styles.previewCard}
              >
                <Text style={styles.previewMuted}>This month</Text>
                <Text style={styles.previewBig}>$2,480</Text>
                <Text style={styles.previewMuted}>spent · sample layout</Text>
              </LinearGradient>
              <View style={styles.previewRow}>
                <View style={styles.previewMini}>
                  <Text style={styles.previewMiniLabel}>Food</Text>
                  <View style={styles.previewBarBg}>
                    <View style={[styles.previewBarFill, { width: '62%' }]} />
                  </View>
                </View>
                <View style={styles.previewMini}>
                  <Text style={styles.previewMiniLabel}>Transport</Text>
                  <View style={styles.previewBarBg}>
                    <View style={[styles.previewBarFill, { width: '38%', backgroundColor: Colors.blue }]} />
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.previewPhone, styles.previewPhoneBack]}>
              <Text style={styles.previewBackLabel}>Transactions</Text>
              <View style={styles.previewLine} />
              <View style={styles.previewLineShort} />
              <View style={styles.previewLine} />
            </View>
          </View>
        </View>

        {/* Features */}
        <WebSectionAnchor id="features">
          <View onLayout={captureSectionLayout('features')}>
            <Text style={styles.sectionLabel}>Features</Text>
            <Text style={styles.sectionTitle}>Built around how you actually spend</Text>
            <Text style={styles.sectionSub}>
              These capabilities map to real screens and services in this codebase—not a fictional
              product roadmap.
            </Text>
            <View style={[styles.featureGrid, isWide && styles.featureGridWide]}>
              <FeatureCard
                icon="wallet-outline"
                title="Accounts & balances"
                body="Track multiple accounts from the Accounts tab with total assets surfaced on Home—loaded via Supabase after you finish onboarding."
              />
              <FeatureCard
                icon="swap-vertical-outline"
                title="Transactions you can filter"
                body="Browse income and expenses by month, filter by account or type on the Transactions screen, and add entries from the floating actions."
              />
              <FeatureCard
                icon="pie-chart-outline"
                title="Category budgets"
                body="Set per-category limits for each month on the Budget screen, compare spend against limits, and jump back into onboarding flows when you need to adjust categories."
              />
              <FeatureCard
                icon="calendar-outline"
                title="Bills & recurring expenses"
                body="See upcoming charges, mark bills paid, and keep recurring expenses visible alongside the rest of your month."
              />
              <FeatureCard
                icon="link-outline"
                title="Shortcut-friendly import"
                body="Use the import route to pre-fill add-transaction from supported deep links (see import-transaction in this repo)—handy for iOS Shortcuts-style workflows."
              />
              <FeatureCard
                icon="shield-checkmark-outline"
                title="Secure Supabase auth"
                body="Email and password auth with sessions stored in Secure Store on native and localStorage on web, plus guided onboarding stored in your Supabase profile."
              />
            </View>
          </View>
        </WebSectionAnchor>

        {/* Pricing */}
        <WebSectionAnchor id="pricing">
          <View style={styles.pricingSection} onLayout={captureSectionLayout('pricing')}>
            <Text style={styles.sectionLabel}>Pricing</Text>
            <Text style={styles.sectionTitle}>Pick a lane that fits your household</Text>
            <Text style={styles.pricingHonest}>
              Example pricing for a portfolio demo—Billing is not wired up in this build.
            </Text>
            <View style={[styles.priceGrid, isWide && styles.priceGridWide]}>
              <PricingCard
                name="Starter"
                price="$0"
                blurb="For individuals getting organized."
                highlights={['Core budgeting & bills', 'Supabase-backed sync', 'Mobile + web preview']}
                onChoose={goAuth}
              />
              <PricingCard
                name="Household"
                price="$8 / mo"
                blurb="Share visibility across partners (planned)."
                highlights={['Everything in Starter', 'Shared categories (coming soon)', 'Priority polish pass']}
                emphasized
                onChoose={goAuth}
              />
              <PricingCard
                name="Team"
                price="$18 / mo"
                blurb="For households that want structure at scale (planned)."
                highlights={['Planned export tools', 'Planned roles & permissions', 'White-glove onboarding (planned)']}
                onChoose={goAuth}
              />
            </View>
          </View>
        </WebSectionAnchor>

        {/* Reviews */}
        <WebSectionAnchor id="reviews">
          <View style={styles.reviewsSection} onLayout={captureSectionLayout('reviews')}>
            <Text style={styles.sectionLabel}>Loved by busy households</Text>
            <Text style={styles.sectionTitle}>Stories from people who like a tidy ledger</Text>
            <View style={[styles.reviewGrid, isWide && styles.reviewGridWide]}>
              <ReviewCard
                quote="The bills tab finally stopped me from double-paying subscriptions."
                name="Avery Cole"
                role="Freelance designer"
              />
              <ReviewCard
                quote="Month picker + category cards match how I think about cash flow."
                name="Jordan Patel"
                role="Engineering manager"
              />
              <ReviewCard
                quote="I like that onboarding actually sets up accounts before dumping me in empty states."
                name="Sam Rivera"
                role="Teacher & parent"
              />
              <ReviewCard
                quote="Being able to filter transactions by account keeps partner spending honest."
                name="Riley Nguyen"
                role="Small business owner"
              />
            </View>
            <Text style={styles.reviewsDisclaimer}>
              Sample testimonials for demo purposes—they are fictional and for layout only.
            </Text>
          </View>
        </WebSectionAnchor>

        {/* FAQ */}
        <WebSectionAnchor id="faq">
          <View style={styles.faqSection} onLayout={captureSectionLayout('faq')}>
            <Text style={styles.sectionLabel}>FAQ</Text>
            <Text style={styles.sectionTitle}>Straight answers</Text>
            <FaqItem
              question="How do I sign up and where is my data stored?"
              answer="Create an account with email and password on the auth screens. Budgets, transactions, bills, and accounts load from Supabase tables scoped to your user after onboarding completes."
              open={openFaq === 0}
              onToggle={() => openFaqToggle(0)}
            />
            <FaqItem
              question="Do I need a credit card?"
              answer="No. This demo does not collect payment details; the pricing section is labeled as an example only."
              open={openFaq === 1}
              onToggle={() => openFaqToggle(1)}
            />
            <FaqItem
              question="What happens on a new device?"
              answer="Supabase restores your session from secure storage on native or localStorage on web, then the app reloads your profile onboarding flag and data services."
              open={openFaq === 2}
              onToggle={() => openFaqToggle(2)}
            />
            <FaqItem
              question="Can I import transactions automatically?"
              answer="There is a deep-link import screen that forwards parsed parameters into the add-transaction flow—useful with manual Shortcuts or automations, not a live bank feed."
              open={openFaq === 3}
              onToggle={() => openFaqToggle(3)}
            />
            <FaqItem
              question="Is voice entry built in?"
              answer="The Overview header includes a microphone shortcut that routes to the add-transaction screen—actual speech-to-text depends on your device and is not a separate cloud service in this repo."
              open={openFaq === 4}
              onToggle={() => openFaqToggle(4)}
            />
            <FaqItem
              question="What if I log out?"
              answer="Signing out clears local store data and returns you to this marketing landing page before you choose to authenticate again."
              open={openFaq === 5}
              onToggle={() => openFaqToggle(5)}
            />
          </View>
        </WebSectionAnchor>

        {/* Bottom CTA */}
        <LinearGradient
          colors={['#4338CA', '#312E81']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bottomCta}
        >
          <Text style={styles.bottomCtaTitle}>Ready to plan your next month?</Text>
          <Text style={styles.bottomCtaSub}>
            Jump into the same Overview, Budget, and Bills experience you previewed above.
          </Text>
          <Pressable onPress={goAuth} style={({ pressed }) => [styles.bottomCtaButton, { opacity: pressed ? 0.9 : 1 }]}>
            <Text style={styles.bottomCtaButtonLabel}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="#312E81" />
          </Pressable>
        </LinearGradient>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerCopy}>© {new Date().getFullYear()} BudgetApp. All rights reserved.</Text>
          <Text style={styles.footerStack}>
            Built with Expo, React Native, Supabase, and Zustand.
          </Text>
        </View>

        <View style={{ height: insets.bottom + Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.huge,
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: 'rgba(8, 12, 24, 0.86)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(12px)' } as object)
      : {}),
  },
  navInner: {
    minHeight: NAV_BAR_HEIGHT,
    paddingHorizontal: Spacing.screenHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.accent + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.2,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  navLink: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBtn: {
    padding: Spacing.sm,
    borderRadius: Radii.md,
  },
  signInPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  signInPillText: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
  },
  mobileMenu: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  mobileMenuCta: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radii.button,
    backgroundColor: Colors.indigo,
    alignItems: 'center',
  },
  mobileMenuCtaText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  hero: {
    marginHorizontal: Spacing.screenHorizontal,
    borderRadius: Radii.card,
    padding: Spacing.xxxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
  },
  heroKicker: {
    color: 'rgba(224, 231, 255, 0.85)',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    letterSpacing: -1.6,
    lineHeight: 52,
    marginBottom: Spacing.lg,
  },
  heroSub: {
    color: 'rgba(226, 232, 240, 0.9)',
    fontSize: FontSize.lg,
    lineHeight: 26,
    marginBottom: Spacing.xxxl,
  },
  heroCtas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  heroCtasCol: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  heroCtaPrimaryWrap: {
    borderRadius: Radii.buttonLg,
    overflow: 'hidden',
  },
  heroCtaFull: {
    alignSelf: 'stretch',
  },
  heroCtaPrimary: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
  },
  heroCtaPrimaryLabel: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.lg,
  },
  heroCtaSecondary: {
    minWidth: 160,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroTrust: {
    color: 'rgba(226,232,240,0.75)',
    fontSize: FontSize.sm,
  },
  previewSection: {
    marginTop: Spacing.massive,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.md,
  },
  sectionLabel: {
    color: Colors.blue,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.huge,
    fontWeight: FontWeight.black,
    letterSpacing: -1,
  },
  sectionSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 24,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  previewMock: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPhone: {
    width: 280,
    borderRadius: Radii.card,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
    gap: Spacing.md,
  },
  previewPhoneBack: {
    opacity: 0.85,
    transform: [{ translateY: 12 }],
  },
  previewTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewTopTitle: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  previewDots: {
    flexDirection: 'row',
    gap: 6,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  previewCard: {
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewMuted: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  previewBig: {
    color: Colors.textPrimary,
    fontSize: FontSize.huge,
    fontWeight: FontWeight.black,
    marginVertical: Spacing.xs,
  },
  previewRow: {
    gap: Spacing.md,
  },
  previewMini: {
    gap: Spacing.xs,
  },
  previewMiniLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  previewBarBg: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.surfaceBright,
    overflow: 'hidden',
  },
  previewBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: Colors.accent,
  },
  previewBackLabel: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  previewLine: {
    height: 10,
    borderRadius: 6,
    backgroundColor: Colors.surfaceBright,
  },
  previewLineShort: {
    height: 10,
    borderRadius: 6,
    backgroundColor: Colors.surfaceBright,
    width: '70%',
  },
  featureGrid: {
    marginTop: Spacing.xl,
    gap: Spacing.lg,
  },
  featureGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.lg,
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
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.blueGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
  },
  featureTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  featureBody: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  pricingSection: {
    marginTop: Spacing.massive,
    paddingHorizontal: Spacing.screenHorizontal,
  },
  pricingHonest: {
    marginTop: Spacing.sm,
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  priceGrid: {
    marginTop: Spacing.xxxl,
    gap: Spacing.lg,
  },
  priceGridWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: Spacing.lg,
  },
  priceCard: {
    flexGrow: 1,
    flexBasis: '30%' as any,
    minWidth: 240,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  priceCardEmphasized: {
    borderColor: 'rgba(99,102,241,0.55)',
    transform: [{ translateY: -4 }],
  },
  priceCardInner: {
    padding: Spacing.cardPaddingLg,
    gap: Spacing.md,
  },
  priceName: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  priceAmount: {
    color: Colors.textPrimary,
    fontSize: FontSize.huge,
    fontWeight: FontWeight.black,
    letterSpacing: -1,
  },
  priceBlurb: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  priceList: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  priceRowText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  priceButton: {
    marginTop: Spacing.lg,
    borderRadius: Radii.button,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  priceButtonEmphasized: {
    backgroundColor: Colors.indigo,
    borderColor: Colors.indigo,
  },
  priceButtonLabel: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  priceButtonLabelOnAccent: {
    color: Colors.white,
  },
  reviewsSection: {
    marginTop: Spacing.massive,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.md,
  },
  reviewGrid: {
    marginTop: Spacing.lg,
    gap: Spacing.lg,
  },
  reviewGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reviewCard: {
    flexGrow: 1,
    flexBasis: '48%' as any,
    minWidth: 240,
    padding: Spacing.cardPaddingLg,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  reviewQuote: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  reviewName: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  reviewRole: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  reviewsDisclaimer: {
    marginTop: Spacing.lg,
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    lineHeight: 16,
  },
  faqSection: {
    marginTop: Spacing.massive,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.md,
  },
  faqItem: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  faqQuestion: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  faqAnswer: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  bottomCta: {
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: Spacing.massive,
    borderRadius: Radii.card,
    padding: Spacing.xxxl,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  bottomCtaTitle: {
    color: Colors.white,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    letterSpacing: -0.5,
  },
  bottomCtaSub: {
    color: 'rgba(226,232,240,0.85)',
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  bottomCtaButton: {
    marginTop: Spacing.md,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.buttonLg,
  },
  bottomCtaButtonLabel: {
    color: '#312E81',
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  footer: {
    marginTop: Spacing.xxxl,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.sm,
    alignItems: 'center',
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

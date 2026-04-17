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
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Radii } from '../constants/radii';

const NAV_BAR_HEIGHT = 58;
const BREAKPOINT = 780;
const CONTENT_MAX = 1080;
const HERO_NAVY = '#0F172A';
const HERO_BLUE = '#1D4ED8';
const HERO_MID = '#172554';

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

function PageShell({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.pageShell, style]}>{children}</View>;
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
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.heroCtaGhost,
          containerStyle,
          { opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={styles.heroCtaGhostLabel}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.heroCtaSolidWrap,
        containerStyle,
        { opacity: pressed ? 0.92 : 1 },
      ]}
    >
      <View style={styles.heroCtaSolid}>
        <Text style={styles.heroCtaSolidLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

function BrowserAppPreview({ isWide }: { isWide: boolean }) {
  return (
    <View style={[styles.browserFrame, !isWide && styles.browserFrameNarrow]}>
      <View style={styles.browserChrome}>
        <View style={styles.browserTraffic}>
          <View style={[styles.trafficDot, { backgroundColor: '#FF5F57' }]} />
          <View style={[styles.trafficDot, { backgroundColor: '#FEBC2E' }]} />
          <View style={[styles.trafficDot, { backgroundColor: '#28C840' }]} />
        </View>
        <View style={styles.browserUrlBar}>
          <Text style={styles.browserUrlText} numberOfLines={1}>
            budgetapp.vercel.app/(tabs)
          </Text>
        </View>
      </View>
      <View style={styles.browserBody}>
        <View style={styles.mockSidebar}>
          <View style={styles.mockSidebarActive} />
          <View style={styles.mockSidebarItem} />
          <View style={styles.mockSidebarItem} />
          <View style={styles.mockSidebarItem} />
        </View>
          <View style={styles.mockMain}>
          <View style={styles.mockSearch} />
          <View style={styles.mockRow}>
            <View style={styles.mockBarTrack}>
              <View style={[styles.mockRowBar, { width: '100%' }]} />
            </View>
            <View style={styles.mockPill}>
              <Text style={styles.mockPillText}>Food</Text>
            </View>
          </View>
          <View style={styles.mockRow}>
            <View style={styles.mockBarTrack}>
              <View style={[styles.mockRowBar, { width: '72%' }]} />
            </View>
            <View style={[styles.mockPill, styles.mockPillBlue]}>
              <Text style={styles.mockPillTextBlue}>Bills</Text>
            </View>
          </View>
          <View style={styles.mockRow}>
            <View style={styles.mockBarTrack}>
              <View style={[styles.mockRowBar, { width: '55%' }]} />
            </View>
            <View style={[styles.mockPill, styles.mockPillGreen]}>
              <Text style={styles.mockPillTextGreen}>On track</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
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
          colors={['rgba(30, 64, 175, 0.35)', 'rgba(15, 23, 42, 0.2)']}
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

  const goSignIn = useCallback(() => {
    setMenuOpen(false);
    router.push('/auth/sign-in');
  }, []);

  const goSignUp = useCallback(() => {
    setMenuOpen(false);
    router.push('/auth/sign-up');
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
    <Pressable onPress={() => scrollToSection(key)} hitSlop={8} style={styles.navLinkHit}>
      <Text style={styles.navLink}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <View style={[styles.navBar, { paddingTop: navPadTop }]}>
        <PageShell style={styles.navShell}>
          <View style={styles.navInner}>
            <Pressable onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} style={styles.brandPress}>
              <View style={styles.brandRow}>
                <View style={styles.brandMark}>
                  <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.brandText}>BudgetApp</Text>
              </View>
            </Pressable>

            {isWide ? (
              <View style={styles.navLinksWrap}>
                {navLink('Features', 'features')}
                {navLink('Pricing', 'pricing')}
                {navLink('Reviews', 'reviews')}
                {navLink('FAQ', 'faq')}
              </View>
            ) : (
              <View style={styles.navFlexSpacer} />
            )}

            <View style={styles.navActions}>
              {!isWide ? (
                <Pressable
                  onPress={() => setMenuOpen((v) => !v)}
                  style={styles.iconBtn}
                  accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
                >
                  <Ionicons name={menuOpen ? 'close' : 'menu'} size={24} color={HERO_NAVY} />
                </Pressable>
              ) : null}
              {isWide ? (
                <>
                  <Pressable onPress={goSignIn} style={styles.signInPill}>
                    <Text style={styles.signInPillText}>Sign In</Text>
                  </Pressable>
                  <Pressable onPress={goSignUp} style={styles.navGetStarted}>
                    <Text style={styles.navGetStartedText}>Get Started</Text>
                  </Pressable>
                </>
              ) : null}
            </View>
          </View>
        </PageShell>

        {!isWide && menuOpen ? (
          <View style={styles.mobileMenu}>
            {navLink('Features', 'features')}
            {navLink('Pricing', 'pricing')}
            {navLink('Reviews', 'reviews')}
            {navLink('FAQ', 'faq')}
            <View style={styles.mobileMenuActions}>
              <Pressable onPress={goSignIn} style={styles.mobileGhost}>
                <Text style={styles.mobileGhostText}>Sign In</Text>
              </Pressable>
              <Pressable onPress={goSignUp} style={styles.mobileMenuCta}>
                <Text style={styles.mobileMenuCtaText}>Get Started</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: scrollPadTop }]}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        {/* Hero — full bleed, TaskManager-style */}
        <View style={styles.heroBleed}>
          <LinearGradient
            colors={[HERO_BLUE, HERO_MID, HERO_NAVY, '#020617']}
            locations={[0, 0.35, 0.7, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'transparent', 'rgba(0,0,0,0.2)']}
            locations={[0, 0.35, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <PageShell style={styles.heroShell}>
            <View style={styles.heroCopyBlock}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>FREE TO START · NO CREDIT CARD REQUIRED</Text>
              </View>
              <Text style={styles.heroTitle}>
                Know where your money goes.{'\n'}Every month.
              </Text>
              <Text style={styles.heroSub}>
                Track accounts, categories, recurring bills, and monthly budgets—with Supabase sync
                and a focused mobile + web experience.
              </Text>
              <View style={[styles.heroCtas, !isWide && styles.heroCtasCol]}>
                <HeroCtaButton
                  label="Get Started Free"
                  onPress={goSignUp}
                  containerStyle={!isWide ? styles.heroCtaFull : undefined}
                />
                <HeroCtaButton
                  label="Sign In →"
                  onPress={goSignIn}
                  variant="secondary"
                  containerStyle={!isWide ? styles.heroCtaFull : undefined}
                />
              </View>
            </View>

            <View style={styles.heroPreviewWrap}>
              <BrowserAppPreview isWide={isWide} />
            </View>
          </PageShell>
        </View>

        {/* App preview copy */}
        <PageShell style={[styles.sectionBlock, styles.sectionAfterHero]}>
          <View style={styles.previewIntro}>
            <Text style={styles.sectionLabel}>Inside the app</Text>
            <Text style={styles.sectionTitle}>A calm dashboard for real life</Text>
            <Text style={styles.sectionSubNarrow}>
              Overview, Transactions, Budget, Bills, and Accounts share the same month-aware data
              model—so totals stay consistent as you move between tabs.
            </Text>
          </View>
        </PageShell>

        {/* Features */}
        <WebSectionAnchor id="features">
          <View onLayout={captureSectionLayout('features')} style={styles.sectionBlock}>
            <PageShell>
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
            </PageShell>
          </View>
        </WebSectionAnchor>

        {/* Pricing */}
        <WebSectionAnchor id="pricing">
          <View style={styles.sectionBlock} onLayout={captureSectionLayout('pricing')}>
            <PageShell>
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
                onChoose={goSignUp}
              />
              <PricingCard
                name="Household"
                price="$8 / mo"
                blurb="Share visibility across partners (planned)."
                highlights={['Everything in Starter', 'Shared categories (coming soon)', 'Priority polish pass']}
                emphasized
                onChoose={goSignUp}
              />
              <PricingCard
                name="Team"
                price="$18 / mo"
                blurb="For households that want structure at scale (planned)."
                highlights={['Planned export tools', 'Planned roles & permissions', 'White-glove onboarding (planned)']}
                onChoose={goSignUp}
              />
            </View>
            </PageShell>
          </View>
        </WebSectionAnchor>

        {/* Reviews */}
        <WebSectionAnchor id="reviews">
          <View style={[styles.sectionBlock, styles.reviewsSection]} onLayout={captureSectionLayout('reviews')}>
            <PageShell>
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
            </PageShell>
          </View>
        </WebSectionAnchor>

        {/* FAQ */}
        <WebSectionAnchor id="faq">
          <View style={styles.sectionBlock} onLayout={captureSectionLayout('faq')}>
            <PageShell style={styles.faqShell}>
            <Text style={styles.sectionLabel}>FAQ</Text>
            <Text style={styles.sectionTitle}>Straight answers</Text>
            <View style={styles.faqList}>
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
            </PageShell>
          </View>
        </WebSectionAnchor>

        {/* Bottom CTA */}
        <PageShell style={styles.bottomCtaShell}>
          <LinearGradient
            colors={['#1E40AF', HERO_NAVY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bottomCta}
          >
            <Text style={styles.bottomCtaTitle}>Ready to plan your next month?</Text>
            <Text style={styles.bottomCtaSub}>
              Jump into the same Overview, Budget, and Bills experience you previewed above.
            </Text>
            <Pressable
              onPress={goSignUp}
              style={({ pressed }) => [styles.bottomCtaButton, { opacity: pressed ? 0.9 : 1 }]}
            >
              <Text style={styles.bottomCtaButtonLabel}>Get Started Free</Text>
              <Ionicons name="arrow-forward" size={18} color={HERO_NAVY} />
            </Pressable>
          </LinearGradient>
        </PageShell>

        {/* Footer */}
        <PageShell style={styles.footer}>
          <Text style={styles.footerCopy}>© {new Date().getFullYear()} BudgetApp. All rights reserved.</Text>
          <Text style={styles.footerStack}>
            Built with Expo, React Native, Supabase, and Zustand.
          </Text>
        </PageShell>

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
  pageShell: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.massive,
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 1px 0 rgba(15, 23, 42, 0.06)',
        } as object)
      : {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 3,
          elevation: 2,
        }),
  },
  navShell: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  navInner: {
    minHeight: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  brandPress: {
    flexShrink: 0,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: HERO_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: HERO_NAVY,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.35,
  },
  navLinksWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  navFlexSpacer: {
    flex: 1,
  },
  navLinkHit: {
    paddingVertical: Spacing.xs,
  },
  navLink: {
    color: '#64748B',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 0,
  },
  navGetStarted: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.button,
    backgroundColor: HERO_NAVY,
  },
  navGetStartedText: {
    color: '#FFFFFF',
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  iconBtn: {
    padding: Spacing.sm,
    borderRadius: Radii.md,
  },
  signInPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.button,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  signInPillText: {
    color: HERO_NAVY,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
  },
  mobileMenu: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  mobileMenuActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  mobileGhost: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radii.button,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  mobileGhostText: {
    color: HERO_NAVY,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
  },
  mobileMenuCta: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radii.button,
    backgroundColor: HERO_NAVY,
    alignItems: 'center',
  },
  mobileMenuCtaText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  heroBleed: {
    width: '100%',
    position: 'relative',
    paddingBottom: Spacing.xxxl,
  },
  heroShell: {
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xxxl,
  },
  heroCopyBlock: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.lg,
  },
  heroBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  heroBadgeText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.9,
    textAlign: 'center',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: FontSize.massive,
    fontWeight: FontWeight.black,
    letterSpacing: -1.8,
    lineHeight: 54,
    textAlign: 'center',
    maxWidth: 720,
  },
  heroSub: {
    color: 'rgba(226, 232, 240, 0.92)',
    fontSize: FontSize.lg,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 640,
    paddingHorizontal: Spacing.sm,
  },
  heroPreviewWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  heroCtas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  heroCtasCol: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  heroCtaSolidWrap: {
    borderRadius: Radii.buttonLg,
    overflow: 'hidden',
    minWidth: 200,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' } as object)
      : {}),
  },
  heroCtaSolid: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  heroCtaSolidLabel: {
    color: HERO_NAVY,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.lg,
  },
  heroCtaGhost: {
    minWidth: 160,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Radii.buttonLg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  heroCtaGhostLabel: {
    color: '#FFFFFF',
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.lg,
  },
  heroCtaFull: {
    alignSelf: 'stretch',
  },
  browserFrame: {
    width: '100%',
    maxWidth: 920,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.5)',
    backgroundColor: '#0F172A',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.45,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 20 },
          elevation: 16,
        }),
  },
  browserFrameNarrow: {
    maxWidth: '100%',
  },
  browserChrome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.35)',
  },
  browserTraffic: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  trafficDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  browserUrlBar: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  browserUrlText: {
    color: '#94A3B8',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  browserBody: {
    flexDirection: 'row',
    minHeight: 200,
    backgroundColor: '#F8FAFC',
  },
  mockSidebar: {
    width: 56,
    backgroundColor: '#1E3A8A',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  mockSidebarActive: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  mockSidebarItem: {
    width: 36,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  mockMain: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  mockSearch: {
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    marginBottom: Spacing.xs,
  },
  mockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  mockBarTrack: {
    flex: 1,
    justifyContent: 'center',
  },
  mockRowBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
  },
  mockPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    backgroundColor: '#FFEDD5',
  },
  mockPillBlue: {
    backgroundColor: '#DBEAFE',
  },
  mockPillGreen: {
    backgroundColor: '#DCFCE7',
  },
  mockPillText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#9A3412',
  },
  mockPillTextBlue: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#1D4ED8',
  },
  mockPillTextGreen: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#166534',
  },
  sectionBlock: {
    marginTop: Spacing.massive,
    paddingBottom: Spacing.lg,
  },
  sectionAfterHero: {
    marginTop: Spacing.xxxl,
  },
  previewIntro: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  sectionSubNarrow: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 26,
    marginTop: Spacing.xs,
    maxWidth: 720,
  },
  sectionLabel: {
    color: HERO_BLUE,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.85,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.huge,
    fontWeight: FontWeight.black,
    letterSpacing: -1.1,
    marginTop: Spacing.xs,
  },
  sectionSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 26,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    maxWidth: 720,
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
    borderColor: 'rgba(30, 64, 175, 0.55)',
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
    backgroundColor: HERO_NAVY,
    borderColor: HERO_NAVY,
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
  faqShell: {
    gap: Spacing.sm,
  },
  faqList: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
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
  bottomCtaShell: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
    marginTop: Spacing.massive,
    paddingHorizontal: Spacing.screenHorizontal,
  },
  bottomCta: {
    width: '100%',
    borderRadius: Radii.card,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.lg,
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
    color: HERO_NAVY,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  footer: {
    marginTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
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

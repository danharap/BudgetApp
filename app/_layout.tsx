import { useEffect, useRef } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';
import { onboardingService } from '../features/onboarding/service';

// Remove browser focus outlines on scrollable divs (web only)
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = '* { outline: none !important; }';
  document.head.appendChild(style);
}

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  const isAuthLoading = useAppStore((s) => s.isAuthLoading);
  const isProfileLoaded = useAppStore((s) => s.isProfileLoaded);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const setSession = useAppStore((s) => s.setSession);
  const segments = useSegments();

  // Track which userId we've already loaded profile for so we don't re-fetch.
  const loadedForUser = useRef<string | null>(null);

  // Restore session on mount and listen for auth state changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Whenever a user becomes available, load their profile status from Supabase.
  // This must run in the root layout so the NavigationGuard has the data it
  // needs before making any routing decisions.
  useEffect(() => {
    if (!user) {
      loadedForUser.current = null;
      return;
    }
    if (loadedForUser.current === user.id) return;
    loadedForUser.current = user.id;
    onboardingService.loadOnboardingStatus();
  }, [user?.id]);

  // Route guard — runs after auth state and profile are both settled.
  useEffect(() => {
    // Wait until the Supabase session check resolves.
    if (isAuthLoading) return;

    const rootSegment = segments[0] as string | undefined;
    const inAuthGroup = rootSegment === 'auth';
    const inOnboarding = rootSegment === 'onboarding';

    if (!user) {
      // Not signed in → sign-in screen.
      if (!inAuthGroup) {
        router.replace('/auth/sign-in');
      }
      return;
    }

    // Signed in but profile not yet loaded → don't redirect yet.
    // The loadOnboardingStatus effect above is running; once it resolves
    // isProfileLoaded becomes true and this effect fires again.
    if (!isProfileLoaded) return;

    if (!onboardingComplete) {
      // Signed in but onboarding not done → onboarding flow.
      if (!inOnboarding) {
        router.replace('/onboarding/welcome');
      }
    } else {
      // Fully set up → main app.
      if (inAuthGroup || inOnboarding) {
        router.replace('/(tabs)/' as any);
      }
    }
  }, [user?.id, isAuthLoading, isProfileLoaded, onboardingComplete, segments[0]]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="settings" />
            <Stack.Screen
              name="add-transaction"
              options={{ presentation: 'modal', gestureEnabled: true, gestureDirection: 'vertical' }}
            />
            <Stack.Screen name="add-bill" />
            <Stack.Screen name="edit-budget" />
            <Stack.Screen name="account-detail" />
            <Stack.Screen name="import-transaction" />
          </Stack>
        </NavigationGuard>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

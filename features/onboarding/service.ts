/**
 * Onboarding service — syncs completion status with Supabase profiles table.
 */
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

export const onboardingService = {
  isComplete: (): boolean => useAppStore.getState().onboardingComplete,

  async complete(): Promise<void> {
    const user = useAppStore.getState().user;
    // Mark locally first so the NavigationGuard can react instantly.
    useAppStore.getState().completeOnboarding();
    useAppStore.getState().setProfileLoaded(true);

    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', user.id);
    }
  },

  getStep: (): number => useAppStore.getState().onboardingStep,

  setStep: (step: number): void => useAppStore.getState().setOnboardingStep(step),

  async loadOnboardingStatus(): Promise<void> {
    const user = useAppStore.getState().user;
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single();

    if (data?.onboarding_complete) {
      useAppStore.getState().completeOnboarding();
    }
    // Always mark profile as loaded, even if the query returned nothing —
    // this unblocks the NavigationGuard so it can make a routing decision.
    useAppStore.getState().setProfileLoaded(true);
  },
};

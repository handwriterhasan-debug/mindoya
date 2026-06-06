import { useState, useCallback } from 'react';
import { CVProvider } from '@/context/CVContext';
import { PlanProvider, usePlan } from '@/context/PlanContext';
import { AccessProvider, useAccess } from '@/context/AccessContext';
import LandingPage from '@/components/LandingPage';
import CVBuilder from '@/components/CVBuilder';
import Library from '@/components/Library';
import PricingModal from '@/components/PricingModal';
import Paywall from '@/components/Paywall';
import { CVData } from '@/types/cv';

type View = 'landing' | 'library' | 'builder' | 'paywall';

const InnerApp = () => {
  const [view, setView] = useState<View>('landing');
  const [pendingView, setPendingView] = useState<View | null>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [activeCV, setActiveCV] = useState<{ data: CVData; id: string | null } | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  const { showUpgrade, closeUpgrade } = usePlan();
  const { unlocked } = useAccess();

  const gate = useCallback((target: View) => {
    if (!unlocked && (target === 'builder' || target === 'library')) {
      setPendingView(target);
      setView('paywall');
      return false;
    }
    return true;
  }, [unlocked]);

  const handleStart = useCallback((data?: any) => {
    setOnboardingData(data);
    setActiveCV(null);
    if (gate('builder')) setView('builder');
  }, [gate]);

  const handleOpenLibrary = useCallback(() => {
    if (gate('library')) setView('library');
  }, [gate]);

  const handleGoLanding = useCallback(() => setView('landing'), []);

  const handleNewCVFromLibrary = useCallback(() => {
    setActiveCV(null);
    setOnboardingData(null);
    if (gate('builder')) setView('builder');
  }, [gate]);

  const handleOpenCV = useCallback((data: CVData, id: string) => {
    setActiveCV({ data, id });
    setOnboardingData(null);
    if (gate('builder')) setView('builder');
  }, [gate]);

  // When unlocked from paywall, auto-advance to pending view
  if (view === 'paywall' && unlocked) {
    const next = pendingView ?? 'builder';
    setPendingView(null);
    setView(next);
  }

  return (
    <>
      {view === 'paywall' && (
        <Paywall onBack={() => { setView('landing'); setPendingView(null); }} />
      )}
      {view === 'landing' && (
        <LandingPage
          onStart={handleStart}
          onOpenLibrary={handleOpenLibrary}
          onOpenPricing={() => setPricingOpen(true)}
        />
      )}
      {view === 'library' && (
        <Library
          onBack={handleGoLanding}
          onOpenCV={handleOpenCV}
          onNewCV={handleNewCVFromLibrary}
          onOpenPricing={() => setPricingOpen(true)}
        />
      )}
      {view === 'builder' && (
        <CVProvider
          key={activeCV?.id ?? 'new'}
          initialData={onboardingData}
          loadedCV={activeCV?.data}
          loadedCVId={activeCV?.id ?? null}
        >
          <CVBuilder
            onGoHome={handleGoLanding}
            onOpenLibrary={handleOpenLibrary}
            onOpenPricing={() => setPricingOpen(true)}
          />
        </CVProvider>
      )}

      <PricingModal
        open={pricingOpen || showUpgrade.open}
        onClose={() => { setPricingOpen(false); closeUpgrade(); }}
        reason={showUpgrade.reason}
      />
    </>
  );
};

const Index = () => (
  <PlanProvider>
    <AccessProvider>
      <InnerApp />
    </AccessProvider>
  </PlanProvider>
);

export default Index;

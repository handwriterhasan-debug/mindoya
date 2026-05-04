import { useState, useCallback } from 'react';
import { CVProvider } from '@/context/CVContext';
import { PlanProvider, usePlan } from '@/context/PlanContext';
import LandingPage from '@/components/LandingPage';
import CVBuilder from '@/components/CVBuilder';
import Library from '@/components/Library';
import PricingModal from '@/components/PricingModal';
import { CVData, defaultCVData } from '@/types/cv';

type View = 'landing' | 'library' | 'builder';

const InnerApp = () => {
  const [view, setView] = useState<View>('landing');
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [activeCV, setActiveCV] = useState<{ data: CVData; id: string | null } | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  const { showUpgrade, closeUpgrade } = usePlan();

  const handleStart = useCallback((data?: any) => {
    setOnboardingData(data);
    setActiveCV(null);
    setView('builder');
  }, []);

  const handleOpenLibrary = useCallback(() => setView('library'), []);
  const handleGoLanding = useCallback(() => setView('landing'), []);

  const handleNewCVFromLibrary = useCallback(() => {
    setActiveCV(null);
    setOnboardingData(null);
    setView('builder');
  }, []);

  const handleOpenCV = useCallback((data: CVData, id: string) => {
    setActiveCV({ data, id });
    setOnboardingData(null);
    setView('builder');
  }, []);

  return (
    <>
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
    <InnerApp />
  </PlanProvider>
);

export default Index;

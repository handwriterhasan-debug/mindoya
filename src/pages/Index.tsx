import { useState } from 'react';
import { CVProvider } from '@/context/CVContext';
import LandingPage from '@/components/LandingPage';
import CVBuilder from '@/components/CVBuilder';

const Index = () => {
  const [started, setStarted] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);

  if (!started) {
    return <LandingPage onStart={(data) => {
      setOnboardingData(data);
      setStarted(true);
    }} />;
  }

  return (
    <CVProvider initialData={onboardingData}>
      <CVBuilder />
    </CVProvider>
  );
};

export default Index;

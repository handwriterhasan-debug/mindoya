import { useState } from 'react';
import { CVProvider } from '@/context/CVContext';
import LandingPage from '@/components/LandingPage';
import CVBuilder from '@/components/CVBuilder';

const Index = () => {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  return (
    <CVProvider>
      <CVBuilder />
    </CVProvider>
  );
};

export default Index;

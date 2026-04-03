import { useState, useRef, useEffect, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, GraduationCap, Zap, Globe2, Link, Star, Undo2, Redo2, Eye, Clapperboard, FileText, ChevronLeft, ChevronRight, Palette, Loader2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import PersonalInfoStep from '@/components/steps/PersonalInfoStep';
import ExperienceStep from '@/components/steps/ExperienceStep';
import EducationStep from '@/components/steps/EducationStep';
import SkillsStep from '@/components/steps/SkillsStep';
import LanguagesStep from '@/components/steps/LanguagesStep';
import SocialsStep from '@/components/steps/SocialsStep';
import ExtrasStep from '@/components/steps/ExtrasStep';
import DesignStep from '@/components/steps/DesignStep';
import CVPreview from '@/components/CVPreview';
import ExportPanel from '@/components/ExportPanel';

const steps = [
  { label: 'Personal', icon: User, component: PersonalInfoStep },
  { label: 'Experience', icon: Briefcase, component: ExperienceStep },
  { label: 'Education', icon: GraduationCap, component: EducationStep },
  { label: 'Skills', icon: Zap, component: SkillsStep },
  { label: 'Languages', icon: Globe2, component: LanguagesStep },
  { label: 'Socials', icon: Link, component: SocialsStep },
  { label: 'Extras', icon: Star, component: ExtrasStep },
  { label: 'Design', icon: Palette, component: DesignStep },
];

const CVBuilder = () => {
  const { step, setStep, viewMode, setViewMode, undo, redo, canUndo, canRedo } = useCVContext();
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const CurrentStep = steps[step].component;

  // Auto-scroll active tab into view
  useEffect(() => {
    if (tabBarRef.current) {
      const activeTab = tabBarRef.current.children[step] as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [step]);

  const handleExport = useCallback(() => {
    setShowExport(true);
  }, []);

  const handlePrev = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step, setStep]);

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) setStep(step + 1);
  }, [step, setStep]);

  return (
    <div className="min-h-screen bg-[hsl(var(--ios-bg))]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between h-12 px-3 sm:px-4 max-w-[1400px] mx-auto">
          <h1 className="font-heading font-bold text-base gradient-text">Mindoya</h1>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} className="h-8 w-8">
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} className="h-8 w-8">
              <Redo2 className="w-3.5 h-3.5" />
            </Button>
            <ThemeToggle />
            <div className="hidden sm:flex items-center bg-secondary/60 rounded-lg p-0.5 gap-0.5 ml-1">
              <button
                onClick={() => setViewMode('animated')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${viewMode === 'animated' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                <Clapperboard className="w-3 h-3" /> Live
              </button>
              <button
                onClick={() => setViewMode('static')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${viewMode === 'static' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                <FileText className="w-3 h-3" /> Print
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden h-8 text-xs"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-3.5 h-3.5 mr-1" /> {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              size="sm"
              className="gradient-primary text-primary-foreground h-8 text-xs rounded-lg"
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Thin progress bar */}
        <div className="h-0.5 bg-secondary/40">
          <motion.div
            className="h-full gradient-primary"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-6">
          {/* Left: Form */}
          <div className={`flex flex-col ${showPreview ? 'hidden lg:flex' : ''}`}>
            {/* Step Navigator - horizontal scroll, no overlap */}
            <div
              ref={tabBarRef}
              className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    step === i
                      ? 'gradient-primary text-primary-foreground shadow-md'
                      : i < step
                      ? 'bg-card text-accent-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-card/60'
                  }`}
                  style={{ minWidth: '80px' }}
                >
                  <s.icon className="w-4 h-4 shrink-0 sm:w-[18px] sm:h-[18px]" />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className="ios-card flex-1 overflow-y-auto max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-200px)]">
              <div className="flex items-center gap-2 mb-5">
                {(() => { const Icon = steps[step].icon; return <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center"><Icon className="w-4 h-4 text-primary-foreground" /></div>; })()}
                <div>
                  <h2 className="ios-section-title text-lg">{steps[step].label}</h2>
                  <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</p>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <CurrentStep key={step} />
              </AnimatePresence>
            </div>

            {/* Sticky Navigation */}
            <div className="flex gap-3 pt-3 sticky bottom-0 bg-[hsl(var(--ios-bg))] pb-4 lg:pb-0 z-10">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={handlePrev}
                className="flex-1 h-[52px] rounded-xl text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              {step === steps.length - 1 ? (
                <Button
                  onClick={handleExport}
                  className="flex-1 h-[52px] rounded-xl gradient-primary text-primary-foreground text-sm font-semibold glow-primary-sm"
                >
                  Finish & Export <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-[52px] rounded-xl gradient-primary text-primary-foreground text-sm font-semibold"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-14">
              <div className="bg-card rounded-2xl shadow-lg p-4 overflow-auto max-h-[calc(100vh-80px)] glow-preview">
                <CVPreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showExport && <ExportPanel onClose={() => setShowExport(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default CVBuilder;

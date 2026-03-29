import { useState } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, GraduationCap, Zap, Globe2, Link, Star, Undo2, Redo2, Eye, Clapperboard, FileText, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import PersonalInfoStep from '@/components/steps/PersonalInfoStep';
import ExperienceStep from '@/components/steps/ExperienceStep';
import EducationStep from '@/components/steps/EducationStep';
import SkillsStep from '@/components/steps/SkillsStep';
import LanguagesStep from '@/components/steps/LanguagesStep';
import SocialsStep from '@/components/steps/SocialsStep';
import ExtrasStep from '@/components/steps/ExtrasStep';
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
];

const CVBuilder = () => {
  const { step, setStep, viewMode, setViewMode, undo, redo, canUndo, canRedo } = useCVContext();
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const CurrentStep = steps[step].component;

  return (
    <div className="min-h-screen mesh-gradient">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass-card-strong border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-lg gradient-text">Mindoya</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} className="btn-press" title="Undo">
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} className="btn-press" title="Redo">
              <Redo2 className="w-4 h-4" />
            </Button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-secondary rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => setViewMode('animated')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'animated' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                <Clapperboard className="w-3 h-3" /> Animated
              </button>
              <button
                onClick={() => setViewMode('static')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'static' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                <FileText className="w-3 h-3" /> Static
              </button>
            </div>

            <Button variant="outline" size="sm" className="sm:hidden btn-press" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-1" /> {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button size="sm" className="gradient-primary text-primary-foreground btn-press glow-primary-sm" onClick={() => setShowExport(true)}>
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* Left: Form */}
          <div className={`space-y-4 ${showPreview ? 'hidden lg:block' : ''}`}>
            {/* Step Navigator */}
            <div className="glass-card rounded-xl p-2 flex gap-1 overflow-x-auto scrollbar-hide">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all btn-press ${
                    step === i
                      ? 'gradient-primary text-primary-foreground glow-primary-sm shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Step Content - scrollable */}
            <div className="glass-card-strong rounded-xl p-6 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin">
              <h2 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
                {(() => { const Icon = steps[step].icon; return <Icon className="w-5 h-5 text-primary" />; })()}
                {steps[step].label}
              </h2>
              <AnimatePresence mode="wait">
                <CurrentStep key={step} />
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-3">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)} className="btn-press flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              {step === steps.length - 1 ? (
                <Button onClick={() => setShowExport(true)} className="gradient-primary text-primary-foreground btn-press flex-1 glow-primary-sm">
                  Finish & Export <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={() => setStep(step + 1)} className="gradient-primary text-primary-foreground btn-press flex-1">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-20">
              <div className="glass-card rounded-xl p-4 overflow-auto max-h-[calc(100vh-100px)] glow-preview">
                <CVPreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && <ExportPanel onClose={() => setShowExport(false)} />}
    </div>
  );
};

export default CVBuilder;

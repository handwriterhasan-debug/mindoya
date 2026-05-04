import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, Plus, Copy, Trash2, Pencil, Crown, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlan } from '@/context/PlanContext';
import { CVData, defaultCVData } from '@/types/cv';
import { toast } from '@/hooks/use-toast';
import VorynixBadge from '@/components/VorynixBadge';
import ThemeToggle from '@/components/ThemeToggle';

interface LibraryProps {
  onBack: () => void;
  onOpenCV: (data: CVData, id: string) => void;
  onNewCV: () => void;
  onOpenPricing: () => void;
}

const Library = ({ onBack, onOpenCV, onNewCV, onOpenPricing }: LibraryProps) => {
  const { library, deleteCV, duplicateCV, plan, limits, openUpgrade } = usePlan();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const planBadge = plan === 'free'
    ? { label: 'Free', icon: Sparkles, cls: 'bg-secondary text-secondary-foreground' }
    : plan === 'pro'
    ? { label: 'Pro', icon: Sparkles, cls: 'gradient-primary text-primary-foreground' }
    : { label: 'Premium', icon: Crown, cls: 'bg-gradient-to-r from-amber-500 to-pink-500 text-white' };

  const handleNew = () => {
    if (limits.maxCVs !== -1 && library.length >= limits.maxCVs) {
      openUpgrade('limit');
      return;
    }
    onNewCV();
  };

  const handleDelete = (id: string) => {
    deleteCV(id);
    setConfirmDelete(null);
    toast({ title: 'CV deleted', duration: 2000 });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--ios-bg))]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2">
          <button onClick={onBack} className="flex items-center gap-1.5 font-heading font-bold text-sm sm:text-base gradient-text">
            <ChevronLeft className="w-4 h-4" /> Mindoya
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPricing}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${planBadge.cls}`}
            >
              <planBadge.icon className="w-3 h-3" /> {planBadge.label}
            </button>
            <ThemeToggle />
            <Button onClick={handleNew} size="sm" className="h-9 rounded-xl gradient-primary text-primary-foreground text-xs px-3">
              <Plus className="w-3.5 h-3.5 mr-1" /> New CV
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-3 sm:px-5 py-5 sm:py-8">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">Your CV Library</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {library.length} of {limits.maxCVs === -1 ? '∞' : limits.maxCVs} CVs used · Plan: <span className="font-semibold text-foreground">{plan}</span>
            </p>
          </div>
          <button
            onClick={onOpenPricing}
            className="sm:hidden inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-semibold"
          >
            <planBadge.icon className="w-3.5 h-3.5" /> {planBadge.label} plan · Upgrade
          </button>
        </div>

        {/* Empty state */}
        {library.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-card border border-border/60 p-10 sm:p-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4 glow-primary-sm">
              <FileText className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="font-heading font-bold text-lg">No CVs saved yet</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Build your first resume. We'll save it here so you can come back anytime.
            </p>
            <Button onClick={handleNew} className="mt-5 gradient-primary text-primary-foreground rounded-xl h-11 px-6">
              <Plus className="w-4 h-4 mr-1" /> Create your first CV
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {library.map((cv, i) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative rounded-2xl bg-card border border-border/60 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {/* Preview tile */}
                <button
                  onClick={() => onOpenCV(cv.data, cv.id)}
                  className="block w-full text-left"
                >
                  <div
                    className="aspect-[3/4] w-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${cv.data.design.primaryColor}22, ${cv.data.design.primaryColor}55)`,
                    }}
                  >
                    <div className="absolute inset-4 bg-card/95 rounded-lg shadow-sm p-3 flex flex-col gap-1.5 overflow-hidden">
                      <div className="h-2 w-3/4 rounded" style={{ backgroundColor: cv.data.design.primaryColor }} />
                      <div className="h-1.5 w-1/2 rounded bg-muted" />
                      <div className="h-px bg-border my-1" />
                      <div className="h-1.5 w-full rounded bg-muted/70" />
                      <div className="h-1.5 w-5/6 rounded bg-muted/70" />
                      <div className="h-1.5 w-4/6 rounded bg-muted/70" />
                      <div className="mt-2 h-1.5 w-1/3 rounded" style={{ backgroundColor: cv.data.design.primaryColor }} />
                      <div className="h-1.5 w-full rounded bg-muted/70" />
                      <div className="h-1.5 w-3/4 rounded bg-muted/70" />
                    </div>
                  </div>
                </button>

                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading font-bold text-sm truncate">{cv.name}</h3>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {cv.data.personal.jobTitle || 'Untitled role'} · {new Date(cv.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3">
                    <Button
                      onClick={() => onOpenCV(cv.data, cv.id)}
                      size="sm"
                      className="flex-1 h-8 text-[11px] rounded-lg gradient-primary text-primary-foreground"
                    >
                      <Pencil className="w-3 h-3 mr-1" /> Open
                    </Button>
                    <Button
                      onClick={() => duplicateCV(cv.id)}
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-lg shrink-0"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => setConfirmDelete(cv.id)}
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-lg shrink-0 hover:text-destructive hover:border-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {confirmDelete === cv.id && (
                  <div className="absolute inset-0 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10">
                    <Trash2 className="w-7 h-7 text-destructive mb-2" />
                    <p className="font-semibold text-sm">Delete "{cv.name}"?</p>
                    <p className="text-xs text-muted-foreground mt-1">This can't be undone.</p>
                    <div className="flex gap-2 mt-3 w-full">
                      <Button onClick={() => setConfirmDelete(null)} variant="outline" size="sm" className="flex-1 h-9 text-xs">Cancel</Button>
                      <Button onClick={() => handleDelete(cv.id)} variant="destructive" size="sm" className="flex-1 h-9 text-xs">Delete</Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Add card */}
            <button
              onClick={handleNew}
              className="aspect-[3/4] sm:aspect-auto sm:min-h-[220px] rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-accent/40 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
            >
              {limits.maxCVs !== -1 && library.length >= limits.maxCVs ? (
                <>
                  <Lock className="w-6 h-6" />
                  <span className="font-semibold text-sm">Library full</span>
                  <span className="text-[11px] px-3 text-center">Upgrade to add more CVs</span>
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  <span className="font-semibold text-sm">New CV</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <VorynixBadge />
    </div>
  );
};

export default Library;

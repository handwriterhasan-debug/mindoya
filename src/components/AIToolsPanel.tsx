import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Target, Lock, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePlan } from '@/context/PlanContext';
import { useCVContext } from '@/context/CVContext';
import { toast } from '@/hooks/use-toast';

interface AIToolsPanelProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'writer' | 'ats';

const AIToolsPanel = ({ open, onClose }: AIToolsPanelProps) => {
  const { limits, openUpgrade, plan } = usePlan();
  const { data, updateData } = useCVContext();
  const [tab, setTab] = useState<Tab>('writer');
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const [atsResult, setAtsResult] = useState<{ score: number; missing: string[]; matched: string[]; tips: string[] } | null>(null);
  const [writerResult, setWriterResult] = useState<string>('');

  const locked = !limits.aiWriter || !limits.atsScore;

  // Mock AI: produces deterministic-ish suggestions from CV content
  const runWriter = async () => {
    setLoading(true);
    setWriterResult('');
    await new Promise(r => setTimeout(r, 900));
    const name = data.personal.fullName || 'a professional';
    const role = data.personal.jobTitle || 'their role';
    const skills = data.skills.slice(0, 4).map(s => s.name).filter(Boolean).join(', ') || 'core skills';
    const yrs = data.experience.length;
    const summary = `Results-driven ${role} with ${yrs > 0 ? `${yrs}+ year${yrs > 1 ? 's' : ''} of` : 'demonstrated'} experience delivering measurable impact. Skilled in ${skills}, with a track record of shipping high-quality work, collaborating across teams, and turning complex problems into clear, scalable solutions. Passionate about continuous improvement and outcome-driven craft.`;
    setWriterResult(summary);
    setLoading(false);
  };

  const applyWriter = () => {
    updateData('personal', { ...data.personal, summary: writerResult });
    toast({ title: '✨ Summary updated', description: 'Your CV summary was rewritten.' });
    onClose();
  };

  const runATS = async () => {
    if (!jobDesc.trim()) {
      toast({ title: 'Paste a job description first', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setAtsResult(null);
    await new Promise(r => setTimeout(r, 1100));

    const jdWords = Array.from(new Set(
      jobDesc.toLowerCase().match(/[a-z][a-z+#.-]{2,}/g) || []
    )).filter(w => w.length > 3 && !STOP.has(w));

    const cvText = [
      data.personal.summary,
      data.personal.jobTitle,
      ...data.skills.map(s => s.name),
      ...data.experience.map(e => `${e.position} ${e.company} ${e.description}`),
      ...data.education.map(e => `${e.degree} ${e.field} ${e.institution}`),
    ].join(' ').toLowerCase();

    const matched: string[] = [];
    const missing: string[] = [];
    jdWords.slice(0, 30).forEach(w => {
      if (cvText.includes(w)) matched.push(w);
      else missing.push(w);
    });
    const score = Math.min(98, Math.round((matched.length / Math.max(jdWords.slice(0, 30).length, 1)) * 100));

    const tips: string[] = [];
    if (data.personal.summary.length < 80) tips.push('Add a 2–3 sentence professional summary at the top.');
    if (data.experience.length === 0) tips.push('Add at least one work experience entry with measurable outcomes.');
    if (data.skills.length < 5) tips.push('List 5+ relevant hard skills that mirror the job description.');
    if (missing.length > 0) tips.push(`Weave in keywords like: ${missing.slice(0, 6).join(', ')}.`);
    if (tips.length === 0) tips.push('Strong match — proofread and tailor the summary to this role.');

    setAtsResult({ score, matched: matched.slice(0, 12), missing: missing.slice(0, 12), tips });
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-2xl bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-base">AI Tools</h2>
                  <p className="text-[11px] text-muted-foreground">
                    {plan === 'free' ? 'Pro feature' : `${plan} plan`}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9"><X className="w-4 h-4" /></Button>
            </div>

            {/* Tabs */}
            <div className="px-5 pt-3">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-secondary/60 rounded-xl">
                <button
                  onClick={() => setTab('writer')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${tab === 'writer' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
                >
                  <Wand2 className="w-3.5 h-3.5" /> AI Writer
                </button>
                <button
                  onClick={() => setTab('ats')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${tab === 'ats' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
                >
                  <Target className="w-3.5 h-3.5" /> ATS Score
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {locked ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-lg">AI is a Pro feature</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                    Upgrade to Pro to unlock AI rewriting and ATS job-match scoring.
                  </p>
                  <Button
                    onClick={() => { onClose(); openUpgrade('ai'); }}
                    className="mt-5 gradient-primary text-primary-foreground rounded-xl h-11 px-6"
                  >
                    See plans
                  </Button>
                </div>
              ) : tab === 'writer' ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Generate a polished professional summary based on your CV.
                  </p>
                  <Button
                    onClick={runWriter}
                    disabled={loading}
                    className="w-full h-11 rounded-xl gradient-primary text-primary-foreground"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Wand2 className="w-4 h-4 mr-1.5" /> Generate summary</>}
                  </Button>
                  {writerResult && (
                    <div className="rounded-xl bg-secondary/50 border border-border p-3.5 text-sm leading-relaxed">
                      {writerResult}
                      <Button onClick={applyWriter} size="sm" className="mt-3 h-9 rounded-lg gradient-primary text-primary-foreground text-xs">
                        Apply to my CV
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Paste a job description and we'll score keyword overlap with your CV.
                  </p>
                  <Textarea
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="min-h-[120px] resize-none text-sm"
                  />
                  <Button
                    onClick={runATS}
                    disabled={loading}
                    className="w-full h-11 rounded-xl gradient-primary text-primary-foreground"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Target className="w-4 h-4 mr-1.5" /> Run ATS scan</>}
                  </Button>
                  {atsResult && (
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 flex items-center gap-4">
                        <div className="relative w-20 h-20 shrink-0">
                          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                            <circle
                              cx="18" cy="18" r="15" fill="none"
                              stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
                              strokeDasharray={`${atsResult.score * 0.94} 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-heading font-extrabold text-lg">
                            {atsResult.score}
                          </div>
                        </div>
                        <div>
                          <p className="font-heading font-bold text-sm">
                            {atsResult.score >= 75 ? 'Strong match' : atsResult.score >= 50 ? 'Decent match' : 'Needs work'}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {atsResult.matched.length} keywords matched · {atsResult.missing.length} missing
                          </p>
                        </div>
                      </div>

                      {atsResult.missing.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-1.5">Missing keywords</p>
                          <div className="flex flex-wrap gap-1.5">
                            {atsResult.missing.map(k => (
                              <span key={k} className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-[11px] font-medium">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-semibold mb-1.5">Suggestions</p>
                        <ul className="space-y-1.5">
                          {atsResult.tips.map((t, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const STOP = new Set([
  'the','and','for','with','you','your','our','this','that','have','from','will','are','was','were','their','they','than','then','about','into','over','also','more','most','some','such','what','when','where','which','while','must','should','would','could','able','team','work','role','company','using','use','used','make','made','help','within','across'
]);

export default AIToolsPanel;

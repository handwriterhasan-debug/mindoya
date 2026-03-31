import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 } from '@/lib/utils';

const getLevelLabel = (level: number): string => {
  if (level >= 70) return 'Professional';
  if (level >= 40) return 'Intermediate';
  return 'Beginner';
};

const getLevelColor = (level: number): string => {
  if (level >= 70) return 'text-emerald-600';
  if (level >= 40) return 'text-amber-600';
  return 'text-muted-foreground';
};

const LanguagesStep = () => {
  const { data, updateData } = useCVContext();
  const items = data.languages;

  const add = () => {
    updateData('languages', [...items, { id: v4(), name: '', level: 60, proficiency: getLevelLabel(60) }]);
  };

  const remove = (id: string) => updateData('languages', items.filter(l => l.id !== id));

  const updateLang = (id: string, field: string, value: any) => {
    if (field === 'level') {
      updateData('languages', items.map(l => l.id === id ? { ...l, level: value, proficiency: getLevelLabel(value) } : l));
    } else {
      updateData('languages', items.map(l => l.id === id ? { ...l, [field]: value } : l));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <AnimatePresence>
        {items.map((lang) => (
          <motion.div key={lang.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[hsl(var(--ios-input-bg))] rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Globe2 className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <Input value={lang.name} onChange={e => updateLang(lang.id, 'name', e.target.value)} placeholder="English, Spanish, Arabic..." className="ios-input flex-1" />
              <button onClick={() => remove(lang.id)} className="text-destructive p-1.5 rounded-lg hover:bg-destructive/10 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Slider
                value={[lang.level]}
                onValueChange={([v]) => updateLang(lang.id, 'level', v)}
                max={100}
                step={5}
                className="flex-1"
              />
              <div className="text-right min-w-[80px]">
                <span className="text-xs font-bold text-primary">{lang.level}%</span>
                <span className={`text-[10px] font-medium block ${getLevelColor(lang.level)}`}>
                  {getLevelLabel(lang.level)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: `${lang.level}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <button onClick={add} className="w-full h-14 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors active:scale-[0.98]">
        <Plus className="w-4 h-4" /> Add Language
      </button>
    </motion.div>
  );
};

export default LanguagesStep;

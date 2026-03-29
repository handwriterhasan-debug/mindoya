import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  if (level >= 70) return 'text-success';
  if (level >= 40) return 'text-warning';
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <AnimatePresence>
        {items.map((lang, i) => (
          <motion.div key={lang.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-xl p-4 hover-lift"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <Globe2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <Input value={lang.name} onChange={e => updateLang(lang.id, 'name', e.target.value)} placeholder="English, Spanish, Arabic..." className="text-sm flex-1" />
                <Button variant="ghost" size="icon" onClick={() => remove(lang.id)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
              </div>

              <div className="pl-11 space-y-2">
                <div className="flex items-center gap-3">
                  <Slider
                    value={[lang.level]}
                    onValueChange={([v]) => updateLang(lang.id, 'level', v)}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <div className="text-right min-w-[90px]">
                    <span className="text-xs font-semibold text-primary">{lang.level}%</span>
                    <span className={`text-[10px] font-medium block ${getLevelColor(lang.level)}`}>
                      {getLevelLabel(lang.level)}
                    </span>
                  </div>
                </div>

                {/* Visual progress bar */}
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full gradient-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.level}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button onClick={add} variant="outline" className="w-full border-dashed border-2 hover-lift btn-press">
        <Plus className="w-4 h-4 mr-2" /> Add Language
      </Button>
    </motion.div>
  );
};

export default LanguagesStep;

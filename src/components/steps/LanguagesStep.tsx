import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 } from '@/lib/utils';

const proficiencies = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Native'];

const LanguagesStep = () => {
  const { data, updateData } = useCVContext();
  const items = data.languages;

  const add = () => {
    updateData('languages', [...items, { id: v4(), name: '', level: 60, proficiency: 'Intermediate' }]);
  };

  const remove = (id: string) => updateData('languages', items.filter(l => l.id !== id));
  const update = (id: string, field: string, value: any) => {
    updateData('languages', items.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const getLevelFromProficiency = (level: number): string => {
    if (level >= 90) return 'Native';
    if (level >= 75) return 'Advanced';
    if (level >= 60) return 'Upper Intermediate';
    if (level >= 45) return 'Intermediate';
    if (level >= 25) return 'Elementary';
    return 'Beginner';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <AnimatePresence>
        {items.map((lang, i) => (
          <motion.div key={lang.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-xl p-4 hover-lift"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Globe2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <Input value={lang.name} onChange={e => update(lang.id, 'name', e.target.value)} placeholder="English, Spanish..." className="text-sm" />
                <div className="flex items-center gap-3">
                  <Slider value={[lang.level]} onValueChange={([v]) => { update(lang.id, 'level', v); update(lang.id, 'proficiency', getLevelFromProficiency(v)); }} max={100} step={5} className="flex-1" />
                  <span className="text-xs font-medium text-primary min-w-[100px] text-right">{getLevelFromProficiency(lang.level)}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(lang.id)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
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

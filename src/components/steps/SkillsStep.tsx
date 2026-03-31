import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 } from '@/lib/utils';

const getLevelLabel = (level: number) => {
  if (level >= 70) return 'Professional';
  if (level >= 40) return 'Intermediate';
  return 'Beginner';
};

const getLevelColor = (level: number) => {
  if (level >= 70) return 'text-emerald-600';
  if (level >= 40) return 'text-amber-600';
  return 'text-muted-foreground';
};

const SkillsStep = () => {
  const { data, updateData } = useCVContext();
  const items = data.skills;

  const add = () => {
    updateData('skills', [...items, { id: v4(), name: '', level: 70, category: 'technical' as const }]);
  };

  const remove = (id: string) => updateData('skills', items.filter(s => s.id !== id));
  const update = (id: string, field: string, value: any) => {
    updateData('skills', items.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <AnimatePresence>
        {items.map((skill) => (
          <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[hsl(var(--ios-input-bg))] rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <Input value={skill.name} onChange={e => update(skill.id, 'name', e.target.value)} placeholder="React, Leadership, Photoshop..." className="ios-input flex-1" />
              <button onClick={() => remove(skill.id)} className="text-destructive p-1.5 rounded-lg hover:bg-destructive/10 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Select value={skill.category} onValueChange={v => update(skill.id, 'category', v)}>
                <SelectTrigger className="ios-input w-[120px] h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Slider value={[skill.level]} onValueChange={([v]) => update(skill.id, 'level', v)} max={100} step={5} className="flex-1" />
              <div className="text-right min-w-[80px]">
                <span className="text-xs font-bold text-primary">{skill.level}%</span>
                <span className={`text-[10px] font-medium block ${getLevelColor(skill.level)}`}>{getLevelLabel(skill.level)}</span>
              </div>
            </div>

            {/* Visual bar */}
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <button onClick={add} className="w-full h-14 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors active:scale-[0.98]">
        <Plus className="w-4 h-4" /> Add Skill
      </button>
    </motion.div>
  );
};

export default SkillsStep;

import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <AnimatePresence>
        {items.map((skill, i) => (
          <motion.div key={skill.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.03 }}
            className="glass-card rounded-xl p-4 hover-lift"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <Input value={skill.name} onChange={e => update(skill.id, 'name', e.target.value)} placeholder="React, Leadership, Photoshop..." className="text-sm flex-1" />
                <Button variant="ghost" size="icon" onClick={() => remove(skill.id)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
              </div>
              <div className="flex items-center gap-3 pl-11">
                <Select value={skill.category} onValueChange={v => update(skill.id, 'category', v)}>
                  <SelectTrigger className="text-xs w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Slider value={[skill.level]} onValueChange={([v]) => update(skill.id, 'level', v)} max={100} step={5} className="flex-1" />
                <div className="text-right min-w-[90px]">
                  <span className="text-xs font-semibold text-primary">{skill.level}%</span>
                  <span className="text-[10px] text-muted-foreground block">{getLevelLabel(skill.level)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button onClick={add} variant="outline" className="w-full border-dashed border-2 hover-lift btn-press">
        <Plus className="w-4 h-4 mr-2" /> Add Skill
      </Button>
    </motion.div>
  );
};

export default SkillsStep;

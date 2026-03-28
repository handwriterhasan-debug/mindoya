import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 } from '@/lib/utils';
import { Skill } from '@/types/cv';

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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_120px_1fr] gap-3 items-center">
                <Input value={skill.name} onChange={e => update(skill.id, 'name', e.target.value)} placeholder="React, Leadership..." className="text-sm" />
                <Select value={skill.category} onValueChange={v => update(skill.id, 'category', v)}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Slider value={[skill.level]} onValueChange={([v]) => update(skill.id, 'level', v)} max={100} step={5} className="flex-1" />
                  <span className="text-xs font-medium text-muted-foreground w-8">{skill.level}%</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(skill.id)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
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

import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 } from '@/lib/utils';

const ExperienceStep = () => {
  const { data, updateData } = useCVContext();
  const items = data.experience;

  const add = () => {
    updateData('experience', [...items, {
      id: v4(), company: '', position: '', startDate: '', endDate: '', current: false, description: ''
    }]);
  };

  const remove = (id: string) => updateData('experience', items.filter(e => e.id !== id));
  const update = (id: string, field: string, value: any) => {
    updateData('experience', items.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <AnimatePresence>
        {items.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[hsl(var(--ios-input-bg))] rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-heading font-semibold text-sm">Experience {i + 1}</span>
              </div>
              <button onClick={() => remove(exp.id)} className="text-destructive p-1.5 rounded-lg hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="ios-label">Position</label>
                <Input value={exp.position} onChange={e => update(exp.id, 'position', e.target.value)} placeholder="Software Engineer" className="ios-input w-full" />
              </div>
              <div>
                <label className="ios-label">Company</label>
                <Input value={exp.company} onChange={e => update(exp.id, 'company', e.target.value)} placeholder="Google" className="ios-input w-full" />
              </div>
              <div>
                <label className="ios-label">Start Date</label>
                <Input type="month" value={exp.startDate} onChange={e => update(exp.id, 'startDate', e.target.value)} className="ios-input w-full" />
              </div>
              <div>
                <label className="ios-label">End Date</label>
                <Input type="month" value={exp.endDate} onChange={e => update(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="ios-input w-full" />
                <div className="flex items-center gap-2 mt-2">
                  <Switch checked={exp.current} onCheckedChange={v => update(exp.id, 'current', v)} />
                  <span className="text-xs text-muted-foreground">Currently working here</span>
                </div>
              </div>
            </div>
            <div>
              <label className="ios-label">Description</label>
              <Textarea value={exp.description} onChange={e => update(exp.id, 'description', e.target.value)} placeholder="Describe your responsibilities..." rows={3} className="ios-input h-auto py-3 resize-none w-full" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <button onClick={add} className="w-full h-14 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors active:scale-[0.98]">
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </motion.div>
  );
};

export default ExperienceStep;

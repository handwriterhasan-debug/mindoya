import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
            className="glass-card rounded-xl p-5 space-y-4 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-semibold text-sm">Experience {i + 1}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(exp.id)} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Position</Label>
                <Input value={exp.position} onChange={e => update(exp.id, 'position', e.target.value)} placeholder="Software Engineer" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Company</Label>
                <Input value={exp.company} onChange={e => update(exp.id, 'company', e.target.value)} placeholder="Google" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input type="month" value={exp.startDate} onChange={e => update(exp.id, 'startDate', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input type="month" value={exp.endDate} onChange={e => update(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="mt-1" />
                <div className="flex items-center gap-2 mt-2">
                  <Switch checked={exp.current} onCheckedChange={v => update(exp.id, 'current', v)} />
                  <span className="text-xs text-muted-foreground">Currently working here</span>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea value={exp.description} onChange={e => update(exp.id, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3} className="mt-1 resize-none" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button onClick={add} variant="outline" className="w-full border-dashed border-2 hover-lift btn-press">
        <Plus className="w-4 h-4 mr-2" /> Add Experience
      </Button>
    </motion.div>
  );
};

export default ExperienceStep;

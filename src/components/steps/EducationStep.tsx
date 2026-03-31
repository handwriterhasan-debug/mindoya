import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 } from '@/lib/utils';

const EducationStep = () => {
  const { data, updateData } = useCVContext();
  const items = data.education;

  const add = () => {
    updateData('education', [...items, {
      id: v4(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', grade: '', percentage: '', description: '', current: false
    }]);
  };

  const remove = (id: string) => updateData('education', items.filter(e => e.id !== id));
  const update = (id: string, field: string, value: any) => {
    updateData('education', items.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <AnimatePresence>
        {items.map((edu, i) => (
          <motion.div key={edu.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[hsl(var(--ios-input-bg))] rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-heading font-semibold text-sm">Education {i + 1}</span>
              </div>
              <button onClick={() => remove(edu.id)} className="text-destructive p-1.5 rounded-lg hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="ios-label">Institution</label>
                <Input value={edu.institution} onChange={e => update(edu.id, 'institution', e.target.value)} placeholder="MIT" className="ios-input w-full" />
              </div>
              <div>
                <label className="ios-label">Degree</label>
                <Input value={edu.degree} onChange={e => update(edu.id, 'degree', e.target.value)} placeholder="Bachelor's" className="ios-input w-full" />
              </div>
              <div>
                <label className="ios-label">Field of Study</label>
                <Input value={edu.field} onChange={e => update(edu.id, 'field', e.target.value)} placeholder="Computer Science" className="ios-input w-full" />
              </div>
              <div>
                <label className="ios-label">Grade</label>
                <Select value={edu.grade} onValueChange={v => update(edu.id, 'grade', v)}>
                  <SelectTrigger className="ios-input w-full"><SelectValue placeholder="Select grade" /></SelectTrigger>
                  <SelectContent>
                    {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="ios-label">Start Date</label>
                <Input type="month" value={edu.startDate} onChange={e => update(edu.id, 'startDate', e.target.value)} className="ios-input w-full" />
              </div>
              <div>
                <label className="ios-label">End Date</label>
                <Input type="month" value={edu.endDate} onChange={e => update(edu.id, 'endDate', e.target.value)} disabled={edu.current} className="ios-input w-full" />
                <div className="flex items-center gap-2 mt-2">
                  <Switch checked={edu.current} onCheckedChange={v => update(edu.id, 'current', v)} />
                  <span className="text-xs text-muted-foreground">Currently studying here</span>
                </div>
              </div>
              <div>
                <label className="ios-label">GPA</label>
                <Input value={edu.gpa} onChange={e => update(edu.id, 'gpa', e.target.value)} placeholder="3.9/4.0" className="ios-input w-full" />
              </div>
              <div>
                <label className="ios-label">Percentage</label>
                <Input value={edu.percentage} onChange={e => update(edu.id, 'percentage', e.target.value)} placeholder="95%" className="ios-input w-full" />
              </div>
            </div>
            <div>
              <label className="ios-label">Description</label>
              <Textarea value={edu.description} onChange={e => update(edu.id, 'description', e.target.value)} placeholder="Notable achievements..." rows={2} className="ios-input h-auto py-3 resize-none w-full" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <button onClick={add} className="w-full h-14 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors active:scale-[0.98]">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </motion.div>
  );
};

export default EducationStep;

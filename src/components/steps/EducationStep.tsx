import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 } from '@/lib/utils';

const EducationStep = () => {
  const { data, updateData } = useCVContext();
  const items = data.education;

  const add = () => {
    updateData('education', [...items, {
      id: v4(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', grade: '', percentage: '', description: ''
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
          <motion.div key={edu.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-xl p-5 space-y-4 hover-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-semibold text-sm">Education {i + 1}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(edu.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label className="text-xs">Institution</Label><Input value={edu.institution} onChange={e => update(edu.id, 'institution', e.target.value)} placeholder="MIT" className="mt-1" /></div>
              <div><Label className="text-xs">Degree</Label><Input value={edu.degree} onChange={e => update(edu.id, 'degree', e.target.value)} placeholder="Bachelor's" className="mt-1" /></div>
              <div><Label className="text-xs">Field of Study</Label><Input value={edu.field} onChange={e => update(edu.id, 'field', e.target.value)} placeholder="Computer Science" className="mt-1" /></div>
              <div>
                <Label className="text-xs">Grade</Label>
                <Select value={edu.grade} onValueChange={v => update(edu.id, 'grade', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select grade" /></SelectTrigger>
                  <SelectContent>
                    {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Start Date</Label><Input type="month" value={edu.startDate} onChange={e => update(edu.id, 'startDate', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs">End Date</Label><Input type="month" value={edu.endDate} onChange={e => update(edu.id, 'endDate', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs">GPA</Label><Input value={edu.gpa} onChange={e => update(edu.id, 'gpa', e.target.value)} placeholder="3.9/4.0" className="mt-1" /></div>
              <div><Label className="text-xs">Percentage</Label><Input value={edu.percentage} onChange={e => update(edu.id, 'percentage', e.target.value)} placeholder="95%" className="mt-1" /></div>
            </div>
            <div><Label className="text-xs">Description</Label><Textarea value={edu.description} onChange={e => update(edu.id, 'description', e.target.value)} placeholder="Notable achievements..." rows={2} className="mt-1 resize-none" /></div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button onClick={add} variant="outline" className="w-full border-dashed border-2 hover-lift btn-press">
        <Plus className="w-4 h-4 mr-2" /> Add Education
      </Button>
    </motion.div>
  );
};

export default EducationStep;

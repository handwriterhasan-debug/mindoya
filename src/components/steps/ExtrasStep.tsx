import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Trophy, Heart, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ExtrasStep = () => {
  const { data, updateData } = useCVContext();

  // Hobbies
  const addHobby = (value: string) => {
    if (value.trim() && !data.hobbies.includes(value.trim())) {
      updateData('hobbies', [...data.hobbies, value.trim()]);
    }
  };
  const removeHobby = (h: string) => updateData('hobbies', data.hobbies.filter(x => x !== h));

  // Achievements
  const addAchievement = () => {
    updateData('achievements', [...data.achievements, { id: v4(), title: '', description: '', date: '' }]);
  };
  const removeAchievement = (id: string) => updateData('achievements', data.achievements.filter(a => a.id !== id));
  const updateAchievement = (id: string, field: string, value: string) => {
    updateData('achievements', data.achievements.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  // Custom sections
  const addCustom = () => {
    updateData('customSections', [...data.customSections, { id: v4(), title: '', content: '' }]);
  };
  const removeCustom = (id: string) => updateData('customSections', data.customSections.filter(c => c.id !== id));
  const updateCustom = (id: string, field: string, value: string) => {
    updateData('customSections', data.customSections.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Hobbies */}
      <div>
        <h3 className="font-heading font-semibold flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-primary" /> Hobbies & Interests
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.hobbies.map(h => (
            <Badge key={h} variant="secondary" className="cursor-pointer hover:bg-destructive/10 transition-colors" onClick={() => removeHobby(h)}>
              {h} <span className="ml-1 text-destructive">×</span>
            </Badge>
          ))}
        </div>
        <Input placeholder="Type a hobby and press Enter" className="glass-card"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHobby((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }}
        />
      </div>

      {/* Achievements */}
      <div>
        <h3 className="font-heading font-semibold flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-primary" /> Achievements
        </h3>
        <AnimatePresence>
          {data.achievements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card rounded-xl p-4 mb-3 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Achievement {i + 1}</Label>
                <Button variant="ghost" size="icon" onClick={() => removeAchievement(a.id)} className="text-destructive h-6 w-6"><Trash2 className="w-3 h-3" /></Button>
              </div>
              <Input value={a.title} onChange={e => updateAchievement(a.id, 'title', e.target.value)} placeholder="Title" />
              <Input value={a.description} onChange={e => updateAchievement(a.id, 'description', e.target.value)} placeholder="Description" />
              <Input type="month" value={a.date} onChange={e => updateAchievement(a.id, 'date', e.target.value)} />
            </motion.div>
          ))}
        </AnimatePresence>
        <Button onClick={addAchievement} variant="outline" className="w-full border-dashed border-2 btn-press"><Plus className="w-4 h-4 mr-2" /> Add Achievement</Button>
      </div>

      {/* Custom Sections */}
      <div>
        <h3 className="font-heading font-semibold flex items-center gap-2 mb-3">
          <PenLine className="w-4 h-4 text-primary" /> Custom Sections
        </h3>
        <AnimatePresence>
          {data.customSections.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card rounded-xl p-4 mb-3 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Section {i + 1}</Label>
                <Button variant="ghost" size="icon" onClick={() => removeCustom(c.id)} className="text-destructive h-6 w-6"><Trash2 className="w-3 h-3" /></Button>
              </div>
              <Input value={c.title} onChange={e => updateCustom(c.id, 'title', e.target.value)} placeholder="Section Title" />
              <Textarea value={c.content} onChange={e => updateCustom(c.id, 'content', e.target.value)} placeholder="Content..." rows={3} className="resize-none" />
            </motion.div>
          ))}
        </AnimatePresence>
        <Button onClick={addCustom} variant="outline" className="w-full border-dashed border-2 btn-press"><Plus className="w-4 h-4 mr-2" /> Add Custom Section</Button>
      </div>
    </motion.div>
  );
};

export default ExtrasStep;

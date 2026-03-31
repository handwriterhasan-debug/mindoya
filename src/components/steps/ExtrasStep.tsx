import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Trophy, Heart, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ExtrasStep = () => {
  const { data, updateData } = useCVContext();

  const addHobby = (value: string) => {
    if (value.trim() && !data.hobbies.includes(value.trim())) {
      updateData('hobbies', [...data.hobbies, value.trim()]);
    }
  };
  const removeHobby = (h: string) => updateData('hobbies', data.hobbies.filter(x => x !== h));

  const addAchievement = () => {
    updateData('achievements', [...data.achievements, { id: v4(), title: '', description: '', date: '' }]);
  };
  const removeAchievement = (id: string) => updateData('achievements', data.achievements.filter(a => a.id !== id));
  const updateAchievement = (id: string, field: string, value: string) => {
    updateData('achievements', data.achievements.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const addCustom = () => {
    updateData('customSections', [...data.customSections, { id: v4(), title: '', content: '' }]);
  };
  const removeCustom = (id: string) => updateData('customSections', data.customSections.filter(c => c.id !== id));
  const updateCustom = (id: string, field: string, value: string) => {
    updateData('customSections', data.customSections.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
      {/* Hobbies */}
      <div>
        <label className="ios-label flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-primary" /> Hobbies & Interests
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.hobbies.map(h => (
            <Badge key={h} variant="secondary" className="cursor-pointer hover:bg-destructive/10 transition-colors rounded-xl px-3 py-1.5" onClick={() => removeHobby(h)}>
              {h} <span className="ml-1 text-destructive">×</span>
            </Badge>
          ))}
        </div>
        <Input placeholder="Type a hobby and press Enter" className="ios-input w-full"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHobby((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }}
        />
      </div>

      {/* Achievements */}
      <div>
        <label className="ios-label flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-primary" /> Achievements
        </label>
        <AnimatePresence>
          {data.achievements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-[hsl(var(--ios-input-bg))] rounded-2xl p-4 mb-3 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Achievement {i + 1}</span>
                <button onClick={() => removeAchievement(a.id)} className="text-destructive p-1 rounded-lg hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <Input value={a.title} onChange={e => updateAchievement(a.id, 'title', e.target.value)} placeholder="Title" className="ios-input w-full" />
              <Input value={a.description} onChange={e => updateAchievement(a.id, 'description', e.target.value)} placeholder="Description" className="ios-input w-full" />
              <Input type="month" value={a.date} onChange={e => updateAchievement(a.id, 'date', e.target.value)} className="ios-input w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={addAchievement} className="w-full h-14 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors active:scale-[0.98]">
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {/* Custom Sections */}
      <div>
        <label className="ios-label flex items-center gap-1.5">
          <PenLine className="w-3.5 h-3.5 text-primary" /> Custom Sections
        </label>
        <AnimatePresence>
          {data.customSections.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-[hsl(var(--ios-input-bg))] rounded-2xl p-4 mb-3 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Section {i + 1}</span>
                <button onClick={() => removeCustom(c.id)} className="text-destructive p-1 rounded-lg hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <Input value={c.title} onChange={e => updateCustom(c.id, 'title', e.target.value)} placeholder="Section Title" className="ios-input w-full" />
              <Textarea value={c.content} onChange={e => updateCustom(c.id, 'content', e.target.value)} placeholder="Content..." rows={3} className="ios-input h-auto py-3 resize-none w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={addCustom} className="w-full h-14 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors active:scale-[0.98]">
          <Plus className="w-4 h-4" /> Add Custom Section
        </button>
      </div>
    </motion.div>
  );
};

export default ExtrasStep;

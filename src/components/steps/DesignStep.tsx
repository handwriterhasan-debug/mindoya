import { useCVContext } from '@/context/CVContext';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Palette, Type, Layout } from 'lucide-react';

const colorThemes = [
  { name: 'Purple', value: '#6C5CE7' },
  { name: 'Blue', value: '#0984E3' },
  { name: 'Teal', value: '#00B894' },
  { name: 'Red', value: '#D63031' },
  { name: 'Orange', value: '#E17055' },
  { name: 'Pink', value: '#E84393' },
  { name: 'Dark', value: '#2D3436' },
  { name: 'Navy', value: '#0A3D62' },
  { name: 'Gold', value: '#B8860B' },
  { name: 'Forest', value: '#27AE60' },
];

const fontStyles = [
  { name: 'Modern', value: 'modern' },
  { name: 'Classic', value: 'classic' },
  { name: 'Minimal', value: 'minimal' },
];

const templates = [
  { name: 'Modern', value: 'modern', desc: 'Clean with timeline layout' },
  { name: 'Classic', value: 'classic', desc: 'Traditional professional look' },
  { name: 'Creative', value: 'creative', desc: 'Bold with sidebar accent' },
  { name: 'Minimal', value: 'minimal', desc: 'Simple and elegant' },
];

const DesignStep = () => {
  const { data, updateData } = useCVContext();
  const design = data.design;

  const update = (field: string, value: string) => {
    updateData('design', { ...design, [field]: value });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Template Selection */}
      <div>
        <Label className="text-sm font-heading font-semibold flex items-center gap-2 mb-3">
          <Layout className="w-4 h-4 text-primary" /> Template
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {templates.map(t => (
            <button
              key={t.value}
              onClick={() => update('template', t.value)}
              className={`p-4 rounded-xl text-left transition-all btn-press ${
                design.template === t.value
                  ? 'ring-2 ring-primary bg-accent shadow-md'
                  : 'glass-card hover-lift'
              }`}
            >
              <span className="font-heading font-bold text-sm block">{t.name}</span>
              <span className="text-xs text-muted-foreground">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme */}
      <div>
        <Label className="text-sm font-heading font-semibold flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-primary" /> Color Theme
        </Label>
        <div className="flex flex-wrap gap-3">
          {colorThemes.map(c => (
            <button
              key={c.value}
              onClick={() => update('primaryColor', c.value)}
              className={`w-10 h-10 rounded-full transition-all btn-press hover:scale-110 ${
                design.primaryColor === c.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Custom:</Label>
          <input
            type="color"
            value={design.primaryColor}
            onChange={e => update('primaryColor', e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer border-0"
          />
          <span className="text-xs text-muted-foreground font-mono">{design.primaryColor}</span>
        </div>
      </div>

      {/* Font Style */}
      <div>
        <Label className="text-sm font-heading font-semibold flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-primary" /> Font Style
        </Label>
        <div className="flex gap-3">
          {fontStyles.map(f => (
            <button
              key={f.value}
              onClick={() => update('fontStyle', f.value)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all btn-press ${
                design.fontStyle === f.value
                  ? 'gradient-primary text-primary-foreground glow-primary-sm'
                  : 'glass-card hover-lift text-muted-foreground'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DesignStep;

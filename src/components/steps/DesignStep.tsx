import { useCVContext } from '@/context/CVContext';
import { usePlan, FREE_TEMPLATES, PREMIUM_TEMPLATES } from '@/context/PlanContext';
import { motion } from 'framer-motion';
import { Palette, Type, Layout, Image, Maximize, Lock, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  { name: 'Midnight Blue', value: '#191970' },
  { name: 'Rose Gold', value: '#B76E79' },
  { name: 'Deep Purple', value: '#4A0E78' },
  { name: 'Slate Gray', value: '#708090' },
  { name: 'Burnt Orange', value: '#CC5500' },
  { name: 'Crimson', value: '#DC143C' },
  { name: 'Sage Green', value: '#87AE73' },
  { name: 'Charcoal', value: '#36454F' },
  { name: 'Lavender', value: '#7B68EE' },
  { name: 'Emerald', value: '#046307' },
];

const fontStyles = [
  { name: 'Modern Sans', value: 'modern', sample: 'Clean & modern' },
  { name: 'Classic Serif', value: 'classic', sample: 'Timeless elegance' },
  { name: 'Tech Mono', value: 'mono', sample: 'Developer style' },
  { name: 'Elegant', value: 'elegant', sample: 'Sophisticated feel' },
  { name: 'Bold Impact', value: 'bold', sample: 'Strong & punchy' },
  { name: 'Minimal', value: 'minimal', sample: 'Light & airy' },
  { name: 'Corporate', value: 'corporate', sample: 'Professional look' },
  { name: 'Creative', value: 'creative', sample: 'Unique & fresh' },
];

const templates = [
  { name: 'Modern Timeline', value: 'modern', desc: 'Clean timeline layout' },
  { name: 'Executive Dark', value: 'executive', desc: 'Navy sidebar, gold accents' },
  { name: 'Creative Split', value: 'creative', desc: 'Bold color block with photo' },
  { name: 'Minimal Swiss', value: 'minimal', desc: 'Ultra clean, whitespace' },
  { name: 'Tech/Developer', value: 'tech', desc: 'GitHub-style dark theme' },
  { name: 'Infographic', value: 'infographic', desc: 'Circular charts, visual' },
  { name: 'Magazine', value: 'magazine', desc: 'Editorial, large typography' },
  { name: 'Classic Corporate', value: 'classic', desc: 'ATS-friendly, traditional' },
  { name: 'Two Column', value: 'twocolumn', desc: 'Left info, right content' },
  { name: 'Gradient Header', value: 'gradient', desc: 'Bold gradient top band' },
  { name: 'Sci-Fi Cyber', value: 'scifi', desc: 'Neon glow, dark futuristic' },
  { name: 'Modern AI', value: 'modernai', desc: 'Elegant dark header, clean' },
];

const photoStyles = [
  { name: 'Circle', value: 'circle' as const },
  { name: 'Square', value: 'square' as const },
  { name: 'Hidden', value: 'hidden' as const },
];

const spacingOptions = [
  { name: 'Compact', value: 'compact' as const },
  { name: 'Normal', value: 'normal' as const },
  { name: 'Spacious', value: 'spacious' as const },
];

// Font previews mapped to actual Google Fonts loaded
const fontPreviewStyle: Record<string, React.CSSProperties> = {
  modern: { fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif" },
  classic: { fontFamily: "'Georgia', 'Cambria', serif" },
  mono: { fontFamily: "'Courier New', 'Consolas', monospace" },
  elegant: { fontFamily: "'Georgia', 'Palatino', serif", fontStyle: 'italic' },
  bold: { fontFamily: "'Arial Black', 'Impact', sans-serif", fontWeight: 900 },
  minimal: { fontFamily: "'Helvetica Neue', 'Arial', sans-serif", fontWeight: 300 },
  corporate: { fontFamily: "'Segoe UI', 'Calibri', sans-serif" },
  creative: { fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif" },
};

const DesignStep = () => {
  const { data, updateData } = useCVContext();
  const { isTemplateLocked, openUpgrade, plan } = usePlan();
  const design = data.design;

  const update = (field: string, value: string) => {
    updateData('design', { ...design, [field]: value });
  };

  const handleTemplate = (value: string) => {
    if (isTemplateLocked(value)) {
      const reason = PREMIUM_TEMPLATES.includes(value) ? 'Premium' : 'Pro';
      toast({ title: `🔒 ${reason} template`, description: `Upgrade to ${reason} to unlock this design.` });
      openUpgrade('template');
      return;
    }
    update('template', value);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
      {/* Templates */}
      <div>
        <label className="ios-label flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-primary" /> Template
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {templates.map(t => {
            const locked = isTemplateLocked(t.value);
            const isPremium = PREMIUM_TEMPLATES.includes(t.value);
            return (
              <button
                key={t.value}
                onClick={() => handleTemplate(t.value)}
                className={`relative p-3.5 rounded-xl text-left transition-all active:scale-[0.97] ${
                  design.template === t.value
                    ? 'ring-2 ring-primary bg-accent shadow-md'
                    : 'bg-[hsl(var(--ios-input-bg))] hover:bg-secondary'
                } ${locked ? 'opacity-70' : ''}`}
              >
                {locked && (
                  <span className={`absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isPremium ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white' : 'bg-foreground/80 text-background'}`}>
                    {isPremium ? <Crown className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                    {isPremium ? 'Premium' : 'Pro'}
                  </span>
                )}
                <span className="font-heading font-bold text-xs block pr-12">{t.name}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{t.desc}</span>
              </button>
            );
          })}
        </div>
        {plan === 'free' && (
          <p className="text-[10px] text-muted-foreground mt-2">
            Free plan unlocks 3 starter templates. Upgrade for the rest.
          </p>
        )}
      </div>

      {/* Colors */}
      <div>
        <label className="ios-label flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-primary" /> Color Theme
        </label>
        <div className="flex flex-wrap gap-2.5">
          {colorThemes.map(c => (
            <button
              key={c.value}
              onClick={() => update('primaryColor', c.value)}
              className={`w-9 h-9 rounded-full transition-all active:scale-90 hover:scale-105 ${
                design.primaryColor === c.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'ring-1 ring-border/30'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Custom</span>
          <input
            type="color"
            value={design.primaryColor}
            onChange={e => update('primaryColor', e.target.value)}
            className="w-7 h-7 rounded-lg cursor-pointer border-0"
          />
          <span className="text-[10px] text-muted-foreground font-mono">{design.primaryColor}</span>
        </div>
      </div>

      {/* Fonts - with live preview of each font */}
      <div>
        <label className="ios-label flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-primary" /> Font Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {fontStyles.map(f => (
            <button
              key={f.value}
              onClick={() => update('fontStyle', f.value)}
              className={`py-3 px-3 rounded-xl text-left transition-all active:scale-[0.97] ${
                design.fontStyle === f.value
                  ? 'ring-2 ring-primary bg-accent shadow-md'
                  : 'bg-[hsl(var(--ios-input-bg))] hover:bg-secondary'
              }`}
            >
              <span className="block text-sm font-semibold" style={fontPreviewStyle[f.value]}>{f.name}</span>
              <span className="text-[10px] text-muted-foreground" style={fontPreviewStyle[f.value]}>{f.sample}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Photo Style */}
      <div>
        <label className="ios-label flex items-center gap-1.5">
          <Image className="w-3.5 h-3.5 text-primary" /> Photo Style
        </label>
        <div className="flex gap-2">
          {photoStyles.map(p => (
            <button
              key={p.value}
              onClick={() => update('photoStyle', p.value)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.97] ${
                design.photoStyle === p.value
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-[hsl(var(--ios-input-bg))] text-muted-foreground'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <label className="ios-label flex items-center gap-1.5">
          <Maximize className="w-3.5 h-3.5 text-primary" /> Spacing
        </label>
        <div className="flex gap-2">
          {spacingOptions.map(s => (
            <button
              key={s.value}
              onClick={() => update('spacing', s.value)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.97] ${
                design.spacing === s.value
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-[hsl(var(--ios-input-bg))] text-muted-foreground'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DesignStep;

import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Globe, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const PersonalInfoStep = () => {
  const { data, updateData } = useCVContext();
  const p = data.personal;

  const update = (field: string, value: string) => {
    updateData('personal', { ...p, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('profileImage', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const fields = [
    { key: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe' },
    { key: 'jobTitle', label: 'Job Title', icon: User, placeholder: 'Senior Software Engineer' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'john@example.com', type: 'email' },
    { key: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 234 567 890' },
    { key: 'location', label: 'Location', icon: MapPin, placeholder: 'New York, USA' },
    { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://johndoe.com' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <label className="cursor-pointer inline-block group">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center mx-auto overflow-hidden hover-lift group-hover:border-primary/60 transition-colors">
            {p.profileImage ? (
              <img src={p.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <p className="text-sm text-muted-foreground mt-2">Upload photo</p>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Label className="text-sm font-medium mb-1.5 flex items-center gap-2">
              <f.icon className="w-3.5 h-3.5 text-primary" />
              {f.label}
            </Label>
            <Input
              value={(p as any)[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              type={f.type || 'text'}
              className="glass-card border-border/50 focus:glow-primary-sm transition-shadow"
            />
          </motion.div>
        ))}
      </div>

      <div>
        <Label className="text-sm font-medium mb-1.5">Professional Summary</Label>
        <Textarea
          value={p.summary || ''}
          onChange={(e) => update('summary', e.target.value)}
          placeholder="Brief professional summary highlighting your key strengths..."
          rows={4}
          className="glass-card border-border/50 focus:glow-primary-sm transition-shadow resize-none"
        />
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;

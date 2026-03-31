import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Photo upload */}
      <div className="flex justify-center">
        <label className="cursor-pointer group">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors bg-[hsl(var(--ios-input-bg))]">
            {p.profileImage ? (
              <img src={p.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-7 h-7 text-muted-foreground" />
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <p className="text-[11px] text-muted-foreground mt-1.5 text-center">Upload photo</p>
        </label>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <label className="ios-label flex items-center gap-1.5">
              <f.icon className="w-3 h-3 text-primary" />
              {f.label}
            </label>
            <Input
              value={(p as any)[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              type={f.type || 'text'}
              className="ios-input w-full"
            />
          </motion.div>
        ))}
      </div>

      <div>
        <label className="ios-label">Professional Summary</label>
        <Textarea
          value={p.summary || ''}
          onChange={(e) => update('summary', e.target.value)}
          placeholder="Brief professional summary highlighting your key strengths..."
          rows={4}
          className="ios-input h-auto py-3 resize-none"
        />
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;

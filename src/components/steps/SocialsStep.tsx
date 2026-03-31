import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Plus, X, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaGithub, FaFacebook, FaReddit, FaBehance, FaPinterest } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const platformDetect = (url: string): string => {
  const lower = url.toLowerCase();
  if (lower.includes('linkedin.com')) return 'LinkedIn';
  if (lower.includes('instagram.com')) return 'Instagram';
  if (lower.includes('github.com')) return 'GitHub';
  if (lower.includes('facebook.com')) return 'Facebook';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'Twitter/X';
  if (lower.includes('reddit.com')) return 'Reddit';
  if (lower.includes('behance.net')) return 'Behance';
  if (lower.includes('pinterest.com')) return 'Pinterest';
  return 'Website';
};

export const getPlatformIcon = (platform: string) => {
  const icons: Record<string, any> = {
    'LinkedIn': FaLinkedin, 'Instagram': FaInstagram, 'GitHub': FaGithub,
    'Facebook': FaFacebook, 'Twitter/X': FaXTwitter, 'Reddit': FaReddit,
    'Behance': FaBehance, 'Pinterest': FaPinterest,
  };
  const Icon = icons[platform] || LinkIcon;
  return <Icon className="w-4 h-4" />;
};

const SocialsStep = () => {
  const { data, updateData } = useCVContext();
  const items = data.socials;

  const add = () => updateData('socials', [...items, { platform: '', url: '' }]);
  const remove = (i: number) => updateData('socials', items.filter((_, idx) => idx !== i));
  const update = (i: number, url: string) => {
    const platform = platformDetect(url);
    updateData('socials', items.map((s, idx) => idx === i ? { platform, url } : s));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <p className="text-xs text-muted-foreground">Paste full profile URLs — platforms are detected automatically.</p>
      <AnimatePresence>
        {items.map((social, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[hsl(var(--ios-input-bg))] rounded-2xl p-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
              {getPlatformIcon(social.platform)}
            </div>
            <div className="flex-1 min-w-0">
              <Input value={social.url} onChange={e => update(i, e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="ios-input w-full" />
              {social.platform && <span className="text-[10px] text-primary font-medium mt-0.5 block">{social.platform} detected</span>}
            </div>
            <button onClick={() => remove(i)} className="text-destructive p-1.5 rounded-lg hover:bg-destructive/10 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <button onClick={add} className="w-full h-14 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors active:scale-[0.98]">
        <Plus className="w-4 h-4" /> Add Social Link
      </button>
    </motion.div>
  );
};

export default SocialsStep;

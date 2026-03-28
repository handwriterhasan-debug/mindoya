import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaGithub, FaFacebook, FaReddit, FaBehance, FaPinterest } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SocialLink } from '@/types/cv';

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <p className="text-sm text-muted-foreground">Paste full profile URLs — platforms are detected automatically.</p>
      <AnimatePresence>
        {items.map((social, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="glass-card rounded-xl p-3 hover-lift flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
              {getPlatformIcon(social.platform)}
            </div>
            <div className="flex-1">
              <Input value={social.url} onChange={e => update(i, e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="text-sm" />
              {social.platform && <span className="text-xs text-primary font-medium mt-1 block">{social.platform} detected</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(i)} className="text-destructive shrink-0"><X className="w-4 h-4" /></Button>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button onClick={add} variant="outline" className="w-full border-dashed border-2 hover-lift btn-press">
        <Plus className="w-4 h-4 mr-2" /> Add Social Link
      </Button>
    </motion.div>
  );
};

export default SocialsStep;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Crown, Zap, Lock, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlan, Plan } from '@/context/PlanContext';
import { toast } from '@/hooks/use-toast';

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  reason?: string;
}

const plans: Array<{
  id: Plan;
  name: string;
  price: string;
  priceLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  features: string[];
  cta: string;
}> = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceLabel: 'forever',
    icon: Sparkles,
    features: [
      '2 CVs in your library',
      '3 starter templates',
      'PDF export',
      'Mindoya watermark',
    ],
    cta: 'Current plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$3',
    priceLabel: '/ month',
    icon: Zap,
    highlight: true,
    features: [
      '5 CVs in your library',
      'All 8 standard templates',
      'AI CV writer & enhancer',
      'ATS score & job match',
      'No watermark',
    ],
    cta: 'Go Pro',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$10',
    priceLabel: '/ month',
    icon: Crown,
    features: [
      'Unlimited CVs',
      'All templates + 4 premium exclusives',
      'Everything in Pro',
      'Priority support',
      'Early access to new features',
    ],
    cta: 'Go Premium',
  },
];

const PricingModal = ({ open, onClose, reason }: PricingModalProps) => {
  const { plan, setPlan, redeemCoupon, planExpiresAt } = usePlan();
  const [coupon, setCoupon] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const handleRedeem = () => {
    if (!coupon.trim()) return;
    setRedeeming(true);
    const res = redeemCoupon(coupon);
    setRedeeming(false);
    if (res.ok) {
      toast({ title: res.message, description: 'Active for 30 days.' });
      setCoupon('');
      onClose();
    } else {
      toast({ title: '❌ Invalid code', description: res.message, variant: 'destructive' });
    }
  };

  const handleSelect = (target: Plan) => {
    if (target === plan) return;
    setPlan(target);
    toast({
      title: target === 'free' ? 'Switched to Free' : `🎉 Welcome to ${target === 'pro' ? 'Pro' : 'Premium'}`,
      description: target === 'free'
        ? 'Some features are now limited.'
        : 'All plan features are now unlocked.',
    });
    onClose();
  };

  const reasonText = reason === 'limit'
    ? 'You\'ve reached your CV library limit. Upgrade to save more CVs.'
    : reason === 'template'
    ? 'This template is locked. Upgrade to unlock it.'
    : reason === 'ai'
    ? 'AI writer & ATS score are part of Pro.'
    : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-4xl bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur-xl border-b border-border/50 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-heading font-bold text-lg sm:text-xl">Choose your plan</h2>
                <p className="text-xs text-muted-foreground">Mock pricing · upgrade is instant</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {reasonText && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-accent text-accent-foreground text-xs flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{reasonText}</span>
              </div>
            )}

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map(p => {
                const isCurrent = p.id === plan;
                return (
                  <div
                    key={p.id}
                    className={`relative rounded-2xl border-2 p-5 flex flex-col transition-all ${
                      p.highlight
                        ? 'border-primary bg-accent/40 shadow-lg'
                        : isCurrent
                        ? 'border-foreground/20 bg-secondary/40'
                        : 'border-border bg-card'
                    }`}
                  >
                    {p.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                        Most popular
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                        <p.icon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <h3 className="font-heading font-bold text-base">{p.name}</h3>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-heading font-extrabold text-3xl">{p.price}</span>
                      <span className="text-xs text-muted-foreground">{p.priceLabel}</span>
                    </div>
                    <ul className="mt-4 space-y-2 flex-1">
                      {p.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-xs">
                          <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSelect(p.id)}
                      disabled={isCurrent}
                      className={`mt-5 w-full h-10 rounded-xl text-sm font-semibold ${
                        p.highlight
                          ? 'gradient-primary text-primary-foreground glow-primary-sm'
                          : ''
                      }`}
                      variant={p.highlight ? 'default' : isCurrent ? 'secondary' : 'outline'}
                    >
                      {isCurrent ? 'Current plan' : p.cta}
                    </Button>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-muted-foreground text-center px-5 pb-5">
              Mock subscription · no real charges. Real Stripe billing can be added later.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;

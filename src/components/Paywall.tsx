import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Sparkles, ShieldCheck, Smartphone, Building2, CreditCard, Ticket, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccess } from '@/context/AccessContext';
import { toast } from '@/hooks/use-toast';
import VorynixBadge from '@/components/VorynixBadge';

interface PaywallProps {
  onBack?: () => void;
  reason?: string;
}

const METHODS = [
  { id: 'jazzcash', name: 'JazzCash', icon: Smartphone, detail: '0300-1234567', color: 'from-orange-500 to-red-500' },
  { id: 'easypaisa', name: 'EasyPaisa', icon: Smartphone, detail: '0300-7654321', color: 'from-green-500 to-emerald-600' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, detail: 'Meezan Bank · 0123-456789', color: 'from-blue-500 to-indigo-600' },
  { id: 'card', name: 'Card / Stripe', icon: CreditCard, detail: 'Visa · Mastercard', color: 'from-purple-500 to-pink-600' },
];

const FEATURES = [
  'Lifetime access — pay once, use forever',
  'All CV templates & designs unlocked',
  'AI CV writer, ATS score & translator',
  'High-res PDF & PNG exports (no watermark)',
  'Unlimited CVs in your library',
  'Multi-language CV translation (12 languages)',
  'Priority support from Vorynix team',
];

const VALID_COUPONS = ['lefttricks', '1856hk', 'mindoyavip'];

const Paywall = ({ onBack, reason }: PaywallProps) => {
  const { unlock } = useAccess();
  const [selected, setSelected] = useState<string | null>(null);
  const [txnId, setTxnId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [coupon, setCoupon] = useState('');

  const handlePay = () => {
    if (!selected) {
      toast({ title: 'Select a payment method', variant: 'destructive' });
      return;
    }
    if (!txnId.trim() || txnId.trim().length < 4) {
      toast({ title: 'Enter your transaction / reference ID', description: 'Minimum 4 characters.', variant: 'destructive' });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      unlock(selected);
      setProcessing(false);
      toast({ title: '🎉 Payment verified', description: 'Lifetime access unlocked. Welcome to Mindoya!' });
    }, 1400);
  };

  const handleCoupon = () => {
    const n = coupon.trim().toLowerCase();
    if (VALID_COUPONS.includes(n)) {
      unlock('coupon:' + n);
      toast({ title: '🎁 Coupon redeemed', description: 'Lifetime access unlocked.' });
    } else {
      toast({ title: 'Invalid coupon', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between border-b border-border/40 bg-card/40 backdrop-blur-xl sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Secure checkout</span>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto w-full">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" /> One-time payment · Lifetime access
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight mb-3">
            Unlock the full CV builder
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            {reason || 'Pay once and keep using Mindoya forever — every template, AI tool and export, with no recurring fees.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-5 sm:gap-6">
          {/* Plan summary */}
          <motion.div
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-2 rounded-3xl border-2 border-primary/30 bg-card p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Lifetime Plan</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading font-extrabold text-5xl">210</span>
                <span className="font-heading font-bold text-2xl text-muted-foreground">PKR</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">One-time · No subscription · No hidden fees</p>

              <div className="space-y-2.5 mb-6">
                {FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground">100% money-back guarantee.</strong> If Mindoya doesn't help you land interviews within 30 days, contact Vorynix for a full refund.
              </div>
            </div>
          </motion.div>

          {/* Payment section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-3 space-y-5"
          >
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <h2 className="font-heading font-bold text-lg mb-1">Choose payment method</h2>
              <p className="text-xs text-muted-foreground mb-4">Send <strong className="text-foreground">210 PKR</strong> to any account below, then enter the transaction ID.</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {METHODS.map(m => {
                  const active = selected === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        active ? 'border-primary bg-accent/40 shadow-md scale-[1.02]' : 'border-border hover:border-primary/40 bg-card'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-2`}>
                        <m.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="font-semibold text-sm">{m.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 break-all">{m.detail}</div>
                    </button>
                  );
                })}
              </div>

              <label className="block text-xs font-semibold mb-1.5">Transaction / Reference ID</label>
              <Input
                value={txnId}
                onChange={e => setTxnId(e.target.value)}
                placeholder="e.g. TXN123456789"
                className="h-11 rounded-xl mb-4"
              />

              <Button
                onClick={handlePay}
                disabled={processing}
                className="w-full h-12 rounded-xl text-base font-bold gradient-primary text-primary-foreground glow-primary-sm"
              >
                {processing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying payment…</>
                ) : (
                  <>Pay 210 PKR & Unlock</>
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                Payments are verified manually within minutes. By paying you accept Vorynix' terms.
              </p>
            </div>

            {/* Coupon */}
            <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-bold text-sm">Have a coupon?</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCoupon(); }}
                  placeholder="Enter coupon code"
                  className="h-10 rounded-xl text-sm"
                />
                <Button onClick={handleCoupon} disabled={!coupon.trim()} variant="outline" className="h-10 rounded-xl px-4 text-sm font-semibold">
                  Redeem
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <VorynixBadge />
    </div>
  );
};

export default Paywall;

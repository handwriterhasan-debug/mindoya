import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Sparkles, ShieldCheck, Smartphone, Building2, CreditCard, Ticket, ArrowLeft, Loader2, Wallet, Globe, Send, FileText, X, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAccess } from '@/context/AccessContext';
import { toast } from '@/hooks/use-toast';
import VorynixBadge from '@/components/VorynixBadge';

type PolicyKind = 'terms' | 'privacy' | 'refund';

const POLICIES: Record<PolicyKind, { title: string; icon: any; body: string[] }> = {
  terms: {
    title: 'Terms & Conditions',
    icon: FileText,
    body: [
      'Mindoya (operated by Vorynix Studio) provides a CV-building tool on a one-time lifetime-access basis for 210 PKR.',
      'You may use the platform to create and export CVs for personal, non-commercial job-search purposes only.',
      'All content you enter (work history, education, photos, contact details) belongs to you. You are solely responsible for its accuracy, legality, and any consequences of submitting it to employers.',
      'You agree not to misuse the platform — including reverse-engineering, mass scraping, reselling, or sharing your unlocked account.',
      'Vorynix may update templates, features, pricing or these terms at any time. Lifetime access stays valid for the original buyer.',
      'Violating these terms may result in your access being suspended without refund.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    icon: ShieldCheck,
    body: [
      'Your CV data is stored locally in your browser (localStorage). We do not upload or sell your personal information.',
      'AI tools (writer, ATS score, translator) send only the necessary text to our AI provider over an encrypted connection. The text is processed for your request and is not stored or used to train models.',
      'Payment details (transaction ID, method) are used only to verify your purchase and are not shared with third parties.',
      'Anonymous, aggregated usage analytics may be collected to improve the product. No personal CV content is included.',
      'You can clear all stored data at any time by clearing your browser storage.',
      'Questions about your data? Contact support@vorynix.com.',
    ],
  },
  refund: {
    title: 'Refund Policy',
    icon: RotateCcw,
    body: [
      'We offer a 3-day money-back guarantee. If Mindoya does not work for you, request a refund within 3 days of purchase and we will return the full 210 PKR — no questions asked.',
      'After 3 days, all sales are final and non-refundable.',
      'Refunds are processed back to the original payment method within 5–7 business days after approval.',
      'Coupon-based unlocks are promotional and not eligible for cash refunds.',
      'IMPORTANT: Vorynix and Mindoya are NOT responsible for any outcomes related to your CV — including but not limited to job rejections, formatting issues at the employer\'s end, ATS misreads, missing interview calls, or data you entered yourself. The tool is provided "as is".',
      'To request a refund, email support@vorynix.com with your transaction ID and payment method.',
    ],
  },
};

interface PaywallProps {
  onBack?: () => void;
  reason?: string;
}

const METHODS = [
  { id: 'jazzcash', name: 'JazzCash', icon: Smartphone, detail: '0300-1234567', color: 'from-orange-500 to-red-500' },
  { id: 'easypaisa', name: 'EasyPaisa', icon: Smartphone, detail: '0300-7654321', color: 'from-green-500 to-emerald-600' },
  { id: 'sadapay', name: 'SadaPay', icon: Wallet, detail: '0300-1112233', color: 'from-violet-500 to-purple-600' },
  { id: 'nayapay', name: 'NayaPay', icon: Wallet, detail: 'username@nayapay', color: 'from-cyan-500 to-blue-600' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, detail: 'Meezan Bank · 0123-456789', color: 'from-blue-500 to-indigo-600' },
  { id: 'card', name: 'Card / Stripe', icon: CreditCard, detail: 'Visa · Mastercard', color: 'from-purple-500 to-pink-600' },
  { id: 'paypal', name: 'PayPal', icon: Globe, detail: 'pay@vorynix.com', color: 'from-sky-500 to-blue-700' },
  { id: 'payoneer', name: 'Payoneer', icon: Send, detail: 'vorynix@payoneer.com', color: 'from-amber-500 to-orange-600' },
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
  const [agreed, setAgreed] = useState(false);
  const [openPolicy, setOpenPolicy] = useState<PolicyKind | null>(null);

  const handlePay = () => {
    if (!agreed) {
      toast({ title: 'Please accept the policies', description: 'Tick the Terms, Privacy & Refund box to continue.', variant: 'destructive' });
      return;
    }
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
    if (!agreed) {
      toast({ title: 'Please accept the policies first', variant: 'destructive' });
      return;
    }
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
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

              {/* Disclaimer + policies */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3 mb-3 flex gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-foreground/80">
                  <strong>3-day refund window.</strong> After 3 days all sales are final. Vorynix is <strong>not responsible</strong> for any outcome related to your CV (job rejections, ATS issues, content errors, etc.) — the tool is provided as-is.
                </p>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-border bg-secondary/30 mb-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                <Checkbox
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(v === true)}
                  className="mt-0.5"
                />
                <span className="text-[11px] leading-relaxed">
                  I have read and agree to the{' '}
                  <button type="button" onClick={() => setOpenPolicy('terms')} className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80">Terms & Conditions</button>,{' '}
                  <button type="button" onClick={() => setOpenPolicy('privacy')} className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80">Privacy Policy</button> and{' '}
                  <button type="button" onClick={() => setOpenPolicy('refund')} className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80">Refund Policy</button>.
                </span>
              </label>

              <Button
                onClick={handlePay}
                disabled={processing || !agreed}
                className="w-full h-12 rounded-xl text-base font-bold gradient-primary text-primary-foreground glow-primary-sm disabled:opacity-50"
              >
                {processing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying payment…</>
                ) : (
                  <>Pay 210 PKR & Unlock</>
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                Payments are verified manually within minutes.
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

      {/* Footer policy links */}
      <footer className="px-5 py-4 border-t border-border/40 text-center text-[11px] text-muted-foreground">
        <button onClick={() => setOpenPolicy('terms')} className="hover:text-foreground underline-offset-2 hover:underline">Terms</button>
        <span className="mx-2">·</span>
        <button onClick={() => setOpenPolicy('privacy')} className="hover:text-foreground underline-offset-2 hover:underline">Privacy</button>
        <span className="mx-2">·</span>
        <button onClick={() => setOpenPolicy('refund')} className="hover:text-foreground underline-offset-2 hover:underline">Refund Policy</button>
      </footer>

      {/* Policy modal */}
      <AnimatePresence>
        {openPolicy && (() => {
          const p = POLICIES[openPolicy];
          const Icon = p.icon;
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm sm:p-4"
              onClick={() => setOpenPolicy(null)}
            >
              <motion.div
                initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                onClick={e => e.stopPropagation()}
                className="w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[88vh] flex flex-col"
              >
                <div className="px-5 py-4 flex items-center justify-between border-b border-border/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h2 className="font-heading font-bold text-base">{p.title}</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setOpenPolicy(null)} className="h-9 w-9">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="px-5 py-4 overflow-y-auto flex-1 space-y-3">
                  {p.body.map((line, i) => (
                    <p key={i} className="text-xs leading-relaxed text-foreground/80">{line}</p>
                  ))}
                  <p className="text-[10px] text-muted-foreground pt-2 border-t border-border/50">
                    Last updated: June 2026 · Mindoya by Vorynix Studio
                  </p>
                </div>
                <div className="px-5 py-4 border-t border-border/50 flex gap-2">
                  <Button variant="outline" onClick={() => setOpenPolicy(null)} className="flex-1 h-10 rounded-xl">Close</Button>
                  <Button
                    onClick={() => { setAgreed(true); setOpenPolicy(null); toast({ title: '✓ Policies accepted' }); }}
                    className="flex-1 h-10 rounded-xl gradient-primary text-primary-foreground font-semibold"
                  >
                    I accept
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <VorynixBadge />
    </div>
  );
};

export default Paywall;

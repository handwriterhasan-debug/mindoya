import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, FileText, Zap, Globe, Instagram, ArrowLeft, User, MapPin, Mail, Calendar } from 'lucide-react';

interface OnboardingData {
  fullName: string;
  age: string;
  country: string;
  email: string;
}

const LandingPage = ({ onStart }: { onStart: (data?: OnboardingData) => void }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [form, setForm] = useState<OnboardingData>({ fullName: '', age: '', country: '', email: '' });

  const handleSubmit = () => {
    if (!form.fullName.trim()) return;
    onStart(form);
  };

  return (
    <div className="min-h-screen mesh-gradient overflow-hidden">
      {/* Nav */}
      <nav className="container flex items-center justify-between py-4 px-4">
        <h1 className="font-heading font-extrabold text-2xl gradient-text">Mindoya</h1>
        <Button onClick={() => setShowOnboarding(true)} className="gradient-primary text-primary-foreground btn-press glow-primary-sm">
          Build CV <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </nav>

      <AnimatePresence mode="wait">
        {showOnboarding ? (
          <motion.section
            key="onboarding"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="container px-4 pt-12 pb-20"
          >
            <div className="glass-card-strong rounded-2xl p-8 max-w-md mx-auto">
              <Button variant="ghost" size="sm" onClick={() => setShowOnboarding(false)} className="mb-4 -ml-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <h2 className="font-heading font-bold text-2xl mb-1">Welcome to Mindoya</h2>
              <p className="text-sm text-muted-foreground mb-6">Let's get to know you before building your CV.</p>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                    <User className="w-3.5 h-3.5 text-primary" /> Full Name *
                  </Label>
                  <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" className="h-11" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> Age
                    </Label>
                    <Input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="25" className="h-11" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Country
                    </Label>
                    <Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="USA" className="h-11" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Email (optional)
                  </Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="h-11" />
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={!form.fullName.trim()} className="w-full mt-6 h-12 gradient-primary text-primary-foreground btn-press glow-primary-sm text-base">
                Start Building <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.section>
        ) : (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Hero */}
            <section className="container px-4 pt-16 pb-20 text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" /> AI-Powered Resume Builder
                </div>
                <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl max-w-3xl mx-auto leading-tight text-balance">
                  Create a <span className="gradient-text">Stunning CV</span> in Minutes
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-6 text-balance">
                  Build professional, ATS-friendly resumes with beautiful infographics, AI enhancements, and instant PDF export.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  <Button onClick={() => setShowOnboarding(true)} size="lg" className="gradient-primary text-primary-foreground btn-press glow-primary h-12 px-8 text-base">
                    Start Building <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 max-w-3xl mx-auto">
                {[
                  { icon: FileText, title: 'Beautiful Templates', desc: 'Professional designs that stand out' },
                  { icon: Zap, title: 'AI Enhancement', desc: 'Smart suggestions and ATS optimization' },
                  { icon: Globe, title: 'Instant Export', desc: 'PDF, shareable link & QR code' },
                ].map((f, i) => (
                  <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="glass-card rounded-2xl p-6 text-center hover-lift"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3 glow-primary-sm">
                      <f.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading font-bold text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* About Creator */}
            <section className="container px-4 py-16">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass-card-strong rounded-2xl p-8 max-w-2xl mx-auto text-center"
              >
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-2xl glow-primary">
                  🧑‍💻
                </div>
                <h2 className="font-heading font-bold text-xl">Hasan Zai</h2>
                <p className="text-sm text-primary font-medium mt-1">AI Builder · Video Editor · 3D Animator</p>
                <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto text-balance">
                  17-year-old creator building powerful tools to help people succeed globally.
                </p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button variant="outline" size="sm" className="btn-press" asChild>
                    <a href="https://www.instagram.com/haxan_zai/?hl=en" target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 mr-1" /> Instagram
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="btn-press" asChild>
                    <a href="https://www.instagram.com/haxan_zai/?hl=en" target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-1" /> Website
                    </a>
                  </Button>
                </div>
              </motion.div>
            </section>

            {/* Footer */}
            <footer className="container px-4 py-8 text-center border-t border-border">
              <p className="text-sm text-muted-foreground">Made with passion by <span className="font-semibold text-foreground">Hasan</span> ❤️</p>
              <p className="text-xs text-muted-foreground mt-1">© 2026 Mindoya. All rights reserved.</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;

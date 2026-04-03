import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Instagram, Mail, Phone, Globe, ExternalLink } from 'lucide-react';
import vorynixLogo from '@/assets/vorynix-logo.png';

const VorynixBadge = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1a1145]/90 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 hover:border-purple-400/50 transition-all duration-300 group"
      >
        <img src={vorynixLogo} alt="Vorynix" className="w-6 h-6 rounded-md" />
        <span className="text-[11px] font-semibold text-purple-200 group-hover:text-white transition-colors">
          Powered by <span className="text-purple-400 font-bold">Vorynix</span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md border-purple-500/20 bg-gradient-to-b from-[#1a1145] to-[#0f0a2e] text-white p-0 overflow-hidden">
          <div className="relative">
            {/* Header with logo */}
            <div className="flex flex-col items-center pt-8 pb-4 px-6">
              <img src={vorynixLogo} alt="Vorynix" className="w-24 h-24 rounded-2xl shadow-2xl shadow-purple-500/30 mb-4" />
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold text-white tracking-tight">
                  Vorynix
                </DialogTitle>
              </DialogHeader>
              <p className="text-purple-300 text-xs font-medium mt-1">By Hasan</p>
            </div>

            {/* Description */}
            <div className="px-6 pb-4">
              <p className="text-sm text-purple-100/80 text-center leading-relaxed">
                Vorynix is a next-generation AI studio founded by <strong className="text-white">Hasan</strong>, a 17-year-old developer from Pakistan. We craft powerful SaaS apps, web tools, and digital experiences — where innovation meets intelligence.
              </p>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-purple-500/20" />

            {/* Contact links */}
            <div className="p-6 space-y-2.5">
              <a
                href="mailto:itxhasanzai@gmail.com"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-300">Email</p>
                  <p className="text-sm font-medium text-white truncate">itxhasanzai@gmail.com</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-purple-400/50 group-hover:text-purple-300 transition-colors" />
              </a>

              <a
                href="tel:+923353055355"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-300">Phone</p>
                  <p className="text-sm font-medium text-white">+92 335 3055355</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-purple-400/50 group-hover:text-purple-300 transition-colors" />
              </a>

              <a
                href="https://www.instagram.com/hasanzai.official"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-pink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-300">Instagram</p>
                  <p className="text-sm font-medium text-white">@hasanzai.official</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-purple-400/50 group-hover:text-purple-300 transition-colors" />
              </a>

              <a
                href="https://www.hasancreates3d.com/en_GB"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-300">Website</p>
                  <p className="text-sm font-medium text-white">hasancreates3d.com</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-purple-400/50 group-hover:text-purple-300 transition-colors" />
              </a>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-1">
              <p className="text-[10px] text-purple-400/50 text-center">
                © 2026 Vorynix. All rights reserved.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VorynixBadge;

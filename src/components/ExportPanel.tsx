import { useState } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Link2, QrCode, X, PartyPopper } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from '@/hooks/use-toast';

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { data } = useCVContext();

  const shareUrl = window.location.href;

  const exportPDF = async () => {
    setExporting(true);
    try {
      const el = document.getElementById('cv-output');
      if (!el) throw new Error('CV not found');

      // Capture at high resolution
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Multi-page support
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${data.personal.fullName || 'resume'}-cv.pdf`);

      setDone(true);
      toast({ title: '🎉 Your CV is ready!', description: 'Go get that job 🚀' });
    } catch (err) {
      toast({ title: 'Export failed', description: 'Please try again', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: '✓ Link copied!', duration: 2000 });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card-strong rounded-2xl p-6 max-w-md w-full space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl">Export CV</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        {done ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
            <PartyPopper className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="font-heading font-bold text-xl gradient-text">Your CV is Ready!</h3>
            <p className="text-muted-foreground mt-2">Go get that job 🚀</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <Button onClick={exportPDF} disabled={exporting} className="w-full gradient-primary text-primary-foreground btn-press glow-primary-sm h-12">
              <Download className="w-4 h-4 mr-2" /> {exporting ? 'Generating PDF...' : 'Download PDF'}
            </Button>
            <Button onClick={copyLink} variant="outline" className="w-full hover-lift btn-press h-12">
              <Link2 className="w-4 h-4 mr-2" /> Copy Shareable Link
            </Button>
            <Button onClick={() => setShowQR(!showQR)} variant="outline" className="w-full hover-lift btn-press h-12">
              <QrCode className="w-4 h-4 mr-2" /> {showQR ? 'Hide' : 'Show'} QR Code
            </Button>
          </div>
        )}

        <AnimatePresence>
          {showQR && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="flex justify-center overflow-hidden"
            >
              <div className="bg-card p-4 rounded-xl">
                <QRCodeSVG value={shareUrl} size={160} level="H" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ExportPanel;

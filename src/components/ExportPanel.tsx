import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PartyPopper, Loader2, FileText, Camera, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { data } = useCVContext();

  const fileName = data.personal.fullName?.trim().replace(/\s+/g, '_') || 'resume';

  const captureCV = useCallback(async (scale = 2) => {
    const el = document.getElementById('cv-output');
    if (!el) throw new Error('CV preview not found');
    
    // Collect all ancestors that might be hiding or clipping the CV
    const hiddenAncestors: { el: HTMLElement; display: string }[] = [];
    let ancestor = el.parentElement;
    while (ancestor) {
      const computed = window.getComputedStyle(ancestor);
      if (computed.display === 'none') {
        hiddenAncestors.push({ el: ancestor, display: ancestor.style.display });
        ancestor.style.display = 'block';
      }
      ancestor = ancestor.parentElement;
    }

    // Temporarily remove max-height/overflow constraints for full capture
    const parent = el.closest('.overflow-auto') as HTMLElement | null;
    const origStyles: { maxHeight: string; overflow: string } | null = parent ? {
      maxHeight: parent.style.maxHeight,
      overflow: parent.style.overflow,
    } : null;
    
    if (parent) {
      parent.style.maxHeight = 'none';
      parent.style.overflow = 'visible';
    }

    try {
      // Wait a frame for layout to settle after un-hiding
      await new Promise(r => requestAnimationFrame(r));
      
      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });
      return canvas;
    } finally {
      if (parent && origStyles) {
        parent.style.maxHeight = origStyles.maxHeight;
        parent.style.overflow = origStyles.overflow;
      }
      // Restore hidden ancestors
      for (const item of hiddenAncestors) {
        item.el.style.display = item.display;
      }
    }
  }, []);

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = useCallback(async () => {
    if (exporting) return;
    setExporting('pdf');
    try {
      const canvas = await captureCV(3);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgW = pdfW;
      const imgH = (canvas.height * pdfW) / canvas.width;

      let heightLeft = imgH;
      let pos = 0;

      // Use JPEG for smaller file size
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      pdf.addImage(imgData, 'JPEG', 0, pos, imgW, imgH);
      heightLeft -= pdfH;

      while (heightLeft > 0) {
        pos -= pdfH;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, pos, imgW, imgH);
        heightLeft -= pdfH;
      }

      pdf.save(`${fileName}-cv.pdf`);
      setDone(true);
      toast({ title: '🎉 PDF exported!', description: 'Print-ready A4 PDF downloaded.' });
    } catch (err: any) {
      console.error('PDF export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not generate PDF.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  }, [exporting, captureCV, fileName]);

  const exportPNG = useCallback(async () => {
    if (exporting) return;
    setExporting('png');
    try {
      const canvas = await captureCV(2);
      // Use toBlob for reliable, non-corrupted output
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create PNG blob'));
        }, 'image/png');
      });
      downloadBlob(blob, `${fileName}-cv.png`);
      setDone(true);
      toast({ title: '🎉 PNG exported!', description: 'High quality PNG downloaded.' });
    } catch (err: any) {
      console.error('PNG export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not generate PNG.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  }, [exporting, captureCV, fileName]);

  const exportScreenshot = useCallback(async () => {
    if (exporting) return;
    setExporting('screenshot');
    try {
      const canvas = await captureCV(2);
      
      // A4 ratio screenshot
      const a4W = 1190;
      const a4H = 1684;
      const sc = document.createElement('canvas');
      sc.width = a4W;
      sc.height = a4H;
      const ctx = sc.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, a4W, a4H);
      
      const scale = Math.min(a4W / canvas.width, a4H / canvas.height);
      const ox = (a4W - canvas.width * scale) / 2;
      ctx.drawImage(canvas, ox, 0, canvas.width * scale, canvas.height * scale);
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        sc.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create screenshot blob'));
        }, 'image/png');
      });
      downloadBlob(blob, `${fileName}-screenshot.png`);
      toast({ title: '🎉 Screenshot exported!', description: 'A4-sized screenshot downloaded.' });
    } catch (err: any) {
      console.error('Screenshot export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not capture.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  }, [exporting, captureCV, fileName]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ios-card rounded-2xl p-6 max-w-md w-full space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg">Export CV</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
            <PartyPopper className="w-14 h-14 mx-auto text-primary mb-3" />
            <h3 className="font-heading font-bold text-lg gradient-text">Your CV is Ready!</h3>
            <p className="text-sm text-muted-foreground mt-1">Go get that job 🚀</p>
            <Button variant="outline" className="mt-4" onClick={() => setDone(false)}>Export Again</Button>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            <Button onClick={exportPDF} disabled={!!exporting}
              className="w-full gradient-primary text-primary-foreground h-[52px] rounded-xl text-sm font-semibold">
              {exporting === 'pdf' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
              {exporting === 'pdf' ? 'Generating PDF...' : 'Download PDF (A4 Print)'}
            </Button>
            <Button onClick={exportPNG} disabled={!!exporting} variant="outline"
              className="w-full h-[52px] rounded-xl text-sm font-semibold">
              {exporting === 'png' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Image className="w-4 h-4 mr-2" />}
              {exporting === 'png' ? 'Generating PNG...' : 'Download PNG (High Quality)'}
            </Button>
            <Button onClick={exportScreenshot} disabled={!!exporting} variant="outline"
              className="w-full h-12 rounded-xl text-sm font-semibold">
              {exporting === 'screenshot' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
              {exporting === 'screenshot' ? 'Capturing...' : 'Screenshot (A4 Size)'}
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExportPanel;

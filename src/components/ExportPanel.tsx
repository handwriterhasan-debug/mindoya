import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, PartyPopper, Loader2, FileText, Image as ImageIcon, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const safeColor = (color: string, fallback = '#6C5CE7'): string => {
  if (!color || typeof color !== 'string') return fallback;
  const trimmed = color.trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) return trimmed;
  if (/^rgba?\(/.test(trimmed)) return trimmed;
  return fallback;
};

const sanitizeGradients = (root: HTMLElement, color: string) => {
  const safe = safeColor(color);
  const all = root.querySelectorAll<HTMLElement>('*');
  all.forEach((el) => {
    const fixGradient = (val: string) =>
      val.replace(/#([0-9a-fA-F]{6})([0-9a-fA-F]{2})\b/g, (_, hex, alpha) => {
        const a = parseInt(alpha, 16) / 255;
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r},${g},${b},${a.toFixed(3)})`;
      });
    if (el.style.background) el.style.background = fixGradient(el.style.background);
    if (el.style.backgroundImage) el.style.backgroundImage = fixGradient(el.style.backgroundImage);
  });
};

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { viewMode, setViewMode, data } = useCVContext();

  const renderCVToPng = useCallback(async (): Promise<{ dataUrl: string; width: number; height: number }> => {
    const previousViewMode = viewMode;
    if (previousViewMode !== 'static') {
      setViewMode('static');
      await wait(400);
    }

    setHidden(true);
    await wait(80);

    // Force-show preview if hidden (mobile layout hides it)
    const cv = document.getElementById('cv-output');
    const previewParent = cv?.parentElement?.parentElement?.parentElement as HTMLElement | null;
    let wasHidden = false;
    if (previewParent && previewParent.classList.contains('hidden')) {
      wasHidden = true;
      previewParent.classList.remove('hidden');
      previewParent.classList.add('block');
      await wait(200);
    }

    if (!cv) {
      setHidden(false);
      if (wasHidden && previewParent) {
        previewParent.classList.add('hidden');
        previewParent.classList.remove('block');
      }
      if (previousViewMode !== 'static') setViewMode(previousViewMode);
      throw new Error('Resume preview not found. Make sure the preview is visible.');
    }

    if ('fonts' in document) {
      try { await (document as any).fonts.ready; } catch {}
    }
    await wait(200);

    const scale = 3;
    const width = cv.scrollWidth;
    const height = cv.scrollHeight;
    const color = safeColor(data?.design?.primaryColor);

    try {
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cv, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width,
        height,
        windowWidth: width,
        windowHeight: height,
        onclone: (clonedDoc: Document) => {
          const clonedEl = clonedDoc.getElementById('cv-output');
          if (clonedEl) {
            sanitizeGradients(clonedEl, color);
          }
        },
      });

      return {
        dataUrl: canvas.toDataURL('image/png', 1.0),
        width: canvas.width,
        height: canvas.height,
      };
    } finally {
      setHidden(false);
      if (wasHidden && previewParent) {
        previewParent.classList.add('hidden');
        previewParent.classList.remove('block');
      }
      if (previousViewMode !== 'static') setViewMode(previousViewMode);
    }
  }, [viewMode, setViewMode, data]);

  const exportPDF = useCallback(async () => {
    if (exporting) return;
    setExporting('pdf');
    try {
      const { dataUrl, width: imgPxW, height: imgPxH } = await renderCVToPng();

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (imgPxH * imgWidth) / imgPxW;

      if (imgHeight <= pageHeight) {
        pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
        }
      }

      pdf.save('resume.pdf');
      setDone(true);
      toast({ title: '✅ PDF downloaded!', description: 'resume.pdf saved successfully.' });
    } catch (err: any) {
      console.error('PDF export error:', err);
      toast({
        title: 'Export failed',
        description: err?.message || 'Could not generate PDF. Try the Print option instead.',
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  }, [exporting, renderCVToPng]);

  const exportPNG = useCallback(async () => {
    if (exporting) return;
    setExporting('png');
    try {
      const { dataUrl } = await renderCVToPng();
      const link = document.createElement('a');
      link.download = 'resume.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDone(true);
      toast({ title: '✅ PNG downloaded!', description: 'High-resolution resume.png saved.' });
    } catch (err: any) {
      console.error('PNG export error:', err);
      toast({
        title: 'Export failed',
        description: err?.message || 'Could not generate PNG.',
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  }, [exporting, renderCVToPng]);

  const printResume = useCallback(async () => {
    if (exporting) return;
    setExporting('print');
    const previousViewMode = viewMode;
    try {
      if (previousViewMode !== 'static') {
        setViewMode('static');
        await wait(300);
      }
      setHidden(true);
      await wait(100);
      document.body.classList.add('printing-cv');
      window.print();
      await wait(500);
    } finally {
      document.body.classList.remove('printing-cv');
      setHidden(false);
      if (previousViewMode !== 'static') setViewMode(previousViewMode);
      setExporting(null);
    }
  }, [exporting, viewMode, setViewMode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: hidden ? 0 : 1 }}
      exit={{ opacity: 0 }}
      style={{ pointerEvents: hidden ? 'none' : 'auto', visibility: hidden ? 'hidden' : 'visible' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4 no-print"
      onClick={onClose}
      data-no-print
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ios-card rounded-2xl p-6 max-w-md w-full space-y-5"
        onClick={(e) => e.stopPropagation()}
        data-no-print
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
            <p className="text-sm text-muted-foreground mt-1">Check your downloads folder.</p>
            <Button variant="outline" className="mt-4" onClick={() => setDone(false)}>Export Again</Button>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              High-resolution A4 export at <strong>3× scale</strong> — gradient-safe, full-page capture.
            </p>

            <Button
              onClick={exportPDF}
              disabled={!!exporting}
              className="w-full gradient-primary text-primary-foreground h-[52px] rounded-xl text-sm font-semibold"
            >
              {exporting === 'pdf' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
              {exporting === 'pdf' ? 'Generating PDF…' : 'Download PDF (A4)'}
            </Button>

            <Button
              onClick={exportPNG}
              disabled={!!exporting}
              variant="outline"
              className="w-full h-[52px] rounded-xl text-sm font-semibold"
            >
              {exporting === 'png' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
              {exporting === 'png' ? 'Generating PNG…' : 'Download PNG (HD)'}
            </Button>

            <Button
              onClick={printResume}
              disabled={!!exporting}
              variant="outline"
              className="w-full h-[52px] rounded-xl text-sm font-semibold"
            >
              {exporting === 'print' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
              {exporting === 'print' ? 'Opening…' : 'Print Resume'}
            </Button>

            <p className="text-[11px] text-muted-foreground/80 pt-1">
              Tip: Switch to <em>Print</em> view mode for the cleanest export.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExportPanel;

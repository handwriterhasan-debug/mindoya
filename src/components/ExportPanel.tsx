import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, PartyPopper, Loader2, FileText, Image as ImageIcon, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
// @ts-ignore - no official types
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const A4_RATIO = 297 / 210; // height / width

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { viewMode, setViewMode } = useCVContext();

  /**
   * Render the #cv-output node to a high-resolution PNG data URL using
   * dom-to-image-more. This library handles CSS gradients, web fonts and
   * cross-origin images far more reliably than html2canvas (which throws
   * "addColorStop ... non-finite" on certain gradient stops).
   */
  const renderCVToPng = useCallback(async (): Promise<{ dataUrl: string; width: number; height: number }> => {
    // Ensure we capture the static (print) view so layout matches expectations
    const previousViewMode = viewMode;
    if (previousViewMode !== 'static') {
      setViewMode('static');
      await wait(300);
    }

    // Hide this modal so it never appears in the capture/print
    setHidden(true);
    await wait(50);

    const cv = document.getElementById('cv-output');
    if (!cv) {
      setHidden(false);
      throw new Error('Resume preview not found. Open the preview first.');
    }

    if ('fonts' in document) {
      try { await (document as any).fonts.ready; } catch {}
    }
    await wait(150);

    const width = cv.scrollWidth;
    const height = cv.scrollHeight;
    const scale = 3; // ~HD / print quality

    try {
      const dataUrl: string = await domtoimage.toPng(cv, {
        bgcolor: '#ffffff',
        width: width * scale,
        height: height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${width}px`,
          height: `${height}px`,
          background: '#ffffff',
        },
        cacheBust: true,
        imagePlaceholder: undefined,
        // Skip elements explicitly marked no-print (modals, toolbars)
        filter: (node: any) => {
          if (!(node instanceof HTMLElement)) return true;
          if (node.dataset && node.dataset.noPrint !== undefined) return false;
          if (node.classList && node.classList.contains('no-print')) return false;
          return true;
        },
      });

      return { dataUrl, width: width * scale, height: height * scale };
    } finally {
      setHidden(false);
      if (previousViewMode !== 'static') setViewMode(previousViewMode);
    }
  }, [viewMode, setViewMode]);

  const exportPDF = useCallback(async () => {
    if (exporting) return;
    setExporting('pdf');
    try {
      const { dataUrl, width: imgPxW, height: imgPxH } = await renderCVToPng();

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();   // 210
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297

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
      toast({ title: '✅ PDF downloaded', description: 'resume.pdf saved at A4 size.' });
    } catch (err: any) {
      console.error('PDF export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not generate PDF.', variant: 'destructive' });
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
      toast({ title: '✅ PNG downloaded', description: 'High-resolution resume.png saved.' });
    } catch (err: any) {
      console.error('PNG export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not generate PNG.', variant: 'destructive' });
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
        await wait(250);
      }
      // Hide this modal so the print preview doesn't show a blank overlay page
      setHidden(true);
      await wait(80);

      document.body.classList.add('printing-cv');
      window.print();
      await wait(400);
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
            <p className="text-sm text-muted-foreground mt-1">
              Check your downloads folder for the file.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setDone(false)}>Export Again</Button>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              High-resolution A4 export at <strong>3× scale</strong> using dom-to-image + jsPDF —
              gradient-safe, full-page capture with multi-page support.
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

            <p className="text-[11px] text-muted-foreground/80 leading-relaxed pt-1">
              Tip: Switch to <em>Print</em> view mode for the cleanest export.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExportPanel;

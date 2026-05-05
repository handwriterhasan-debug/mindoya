import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, PartyPopper, Loader2, FileText, Image as ImageIcon, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { viewMode, setViewMode } = useCVContext();

  const captureCanvas = useCallback(async () => {
    const previousViewMode = viewMode;
    if (previousViewMode !== 'static') {
      setViewMode('static');
      await wait(250);
    }

    const cv = document.getElementById('cv-output');
    if (!cv) throw new Error('Resume preview not found. Open the preview first.');

    if ('fonts' in document) {
      try { await (document as any).fonts.ready; } catch {}
    }
    await wait(200);

    const canvas = await html2canvas(cv, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: cv.scrollWidth,
      windowHeight: cv.scrollHeight,
    });

    if (previousViewMode !== 'static') {
      setViewMode(previousViewMode);
    }

    return canvas;
  }, [viewMode, setViewMode]);

  const exportPDF = useCallback(async () => {
    if (exporting) return;
    setExporting('pdf');
    try {
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // A4 in mm
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();   // 210
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        // Multi-page: slice the image across A4 pages
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
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
  }, [exporting, captureCanvas]);

  const exportPNG = useCallback(async () => {
    if (exporting) return;
    setExporting('png');
    try {
      const canvas = await captureCanvas();
      const link = document.createElement('a');
      link.download = 'resume.png';
      link.href = canvas.toDataURL('image/png');
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
  }, [exporting, captureCanvas]);

  const printResume = useCallback(async () => {
    if (exporting) return;
    setExporting('print');
    try {
      const previousViewMode = viewMode;
      if (previousViewMode !== 'static') {
        setViewMode('static');
        await wait(200);
      }
      document.body.classList.add('printing-cv');
      window.print();
      await wait(300);
      document.body.classList.remove('printing-cv');
      if (previousViewMode !== 'static') setViewMode(previousViewMode);
    } finally {
      setExporting(null);
    }
  }, [exporting, viewMode, setViewMode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4 no-print"
      onClick={onClose}
      data-no-print
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ios-card rounded-2xl p-6 max-w-md w-full space-y-5"
        onClick={(e) => e.stopPropagation()}
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
              High-resolution A4 export at <strong>3× scale</strong> using html2canvas + jsPDF —
              captures the full resume with multi-page support.
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

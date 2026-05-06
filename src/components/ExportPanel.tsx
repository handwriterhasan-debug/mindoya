import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, PartyPopper, Loader2, FileText, Image as ImageIcon, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { viewMode, setViewMode } = useCVContext();

  // ✅ FINAL FIXED RENDER FUNCTION
  const renderCVToPng = useCallback(async () => {
    const prevMode = viewMode;

    if (prevMode !== 'static') {
      setViewMode('static');
      await wait(300);
    }

    const cv = document.getElementById('cv-output');
    if (!cv) throw new Error('CV not found');

    // 🔥 Force A4 size
    cv.style.width = '794px';
    cv.style.maxWidth = '794px';
    cv.style.minHeight = 'auto';
    cv.style.overflow = 'visible';

    // 🔥 Stop animations
    document.querySelectorAll('*').forEach((node) => {
      const el = node as HTMLElement;
      el.style.animation = 'none';
      el.style.transition = 'none';
    });

    // 🔥 Fix skill bars
    document.querySelectorAll('.skill-bar').forEach((bar) => {
      const el = bar as HTMLElement;
      const width = el.getAttribute('data-width') || '100%';
      el.style.width = width;
    });

    // 🔥 Fix SVG charts
    document.querySelectorAll('circle').forEach((c) => {
      (c as SVGCircleElement).style.strokeDashoffset = '0';
    });

    await wait(200);

    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(cv, {
      scale: 3, // ⭐ HD
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: cv.scrollHeight,
      windowWidth: 794,
      windowHeight: cv.scrollHeight,
    });

    if (prevMode !== 'static') {
      setViewMode(prevMode);
    }

    return {
      dataUrl: canvas.toDataURL('image/png', 1),
      width: canvas.width,
      height: canvas.height,
    };
  }, [viewMode, setViewMode]);

  // ✅ FIXED PDF (NO BLANK PAGES)
  const exportPDF = useCallback(async () => {
    if (exporting) return;
    setExporting('pdf');

    try {
      const { dataUrl, width, height } = await renderCVToPng();

      const pdf = new jsPDF({
        unit: 'px',
        format: [794, height], // 🔥 dynamic height
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 794, height);
      pdf.save('resume.pdf');

      setDone(true);
      toast({ title: '✅ PDF downloaded!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message });
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
      link.click();

      setDone(true);
      toast({ title: '✅ PNG downloaded!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message });
    } finally {
      setExporting(null);
    }
  }, [exporting, renderCVToPng]);

  const printResume = useCallback(() => {
    window.print();
  }, []);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-xl w-[350px] space-y-4">

        <h2 className="text-lg font-bold">Export CV</h2>

        <Button onClick={exportPDF} disabled={!!exporting}>
          {exporting === 'pdf' ? 'Loading...' : 'Download PDF'}
        </Button>

        <Button onClick={exportPNG} disabled={!!exporting}>
          {exporting === 'png' ? 'Loading...' : 'Download PNG'}
        </Button>

        <Button onClick={printResume}>
          Print
        </Button>

        <Button onClick={onClose} variant="outline">
          Close
        </Button>

      </div>
    </motion.div>
  );
};

export default ExportPanel;

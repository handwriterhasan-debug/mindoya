import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, PartyPopper, Image, Loader2, FileText, Camera } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { data } = useCVContext();

  const getCanvas = useCallback(async (scale = 2) => {
    const el = document.getElementById('cv-output');
    if (!el) throw new Error('CV preview not found. Make sure preview is visible.');
    return html2canvas(el, {
      scale,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      allowTaint: true,
    });
  }, []);

  const fileName = data.personal.fullName?.trim() || 'resume';

  const exportPDF = useCallback(async () => {
    if (exporting) return;
    setExporting('pdf');
    try {
      const canvas = await getCanvas(3);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

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

      pdf.save(`${fileName}-cv.pdf`);
      setDone(true);
      toast({ title: '🎉 PDF exported!', description: 'Print-ready A4 PDF downloaded.' });
    } catch (err: any) {
      console.error('PDF export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not generate PDF.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  }, [exporting, getCanvas, fileName]);

  const exportPNG = useCallback(async () => {
    if (exporting) return;
    setExporting('png');
    try {
      const canvas = await getCanvas(2);
      const link = document.createElement('a');
      link.download = `${fileName}-cv.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: '🎉 PNG exported!', description: 'High quality PNG downloaded.' });
    } catch (err: any) {
      console.error('PNG export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not generate PNG.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  }, [exporting, getCanvas, fileName]);

  const exportScreenshot = useCallback(async () => {
    if (exporting) return;
    setExporting('screenshot');
    try {
      const canvas = await getCanvas(2);
      
      // Create A4-ratio screenshot (210mm x 297mm = ~595 x 842 at 72dpi, we use 2x)
      const a4Width = 1190;
      const a4Height = 1684;
      const screenshotCanvas = document.createElement('canvas');
      screenshotCanvas.width = a4Width;
      screenshotCanvas.height = a4Height;
      const ctx = screenshotCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, a4Width, a4Height);
      
      // Scale and draw content to fit A4
      const scaleX = a4Width / canvas.width;
      const scaleY = a4Height / canvas.height;
      const scale = Math.min(scaleX, scaleY);
      const offsetX = (a4Width - canvas.width * scale) / 2;
      const offsetY = 0;
      
      ctx.drawImage(canvas, offsetX, offsetY, canvas.width * scale, canvas.height * scale);
      
      const link = document.createElement('a');
      link.download = `${fileName}-screenshot.png`;
      link.href = screenshotCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: '🎉 Screenshot exported!', description: 'A4-sized screenshot downloaded.' });
    } catch (err: any) {
      console.error('Screenshot export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not generate screenshot.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  }, [exporting, getCanvas, fileName]);

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
            <Button
              onClick={exportPDF}
              disabled={!!exporting}
              className="w-full gradient-primary text-primary-foreground h-[52px] rounded-xl text-sm font-semibold"
            >
              {exporting === 'pdf' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
              {exporting === 'pdf' ? 'Generating PDF...' : 'Download PDF (A4 Print Quality)'}
            </Button>
            <Button
              onClick={exportPNG}
              disabled={!!exporting}
              variant="outline"
              className="w-full h-[52px] rounded-xl text-sm font-semibold"
            >
              {exporting === 'png' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Image className="w-4 h-4 mr-2" />}
              {exporting === 'png' ? 'Generating PNG...' : 'Download PNG (High Quality)'}
            </Button>
            <Button
              onClick={exportScreenshot}
              disabled={!!exporting}
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-semibold"
            >
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

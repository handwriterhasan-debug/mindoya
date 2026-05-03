import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, PartyPopper, Loader2, FileText, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { viewMode, setViewMode } = useCVContext();

  const triggerPrint = useCallback(async (label: string) => {
    if (exporting) return;
    setExporting(label);

    const previousViewMode = viewMode;
    if (previousViewMode !== 'static') {
      setViewMode('static');
    }

    // Make sure CV is in DOM
    const cv = document.getElementById('cv-output');
    if (!cv) {
      toast({
        title: 'CV preview not found',
        description: 'Open the preview first, then try again.',
        variant: 'destructive',
      });
      setExporting(null);
      return;
    }

    try {
      // Wait for fonts and a couple of frames so layout settles
      if ('fonts' in document) {
        try { await (document as any).fonts.ready; } catch {}
      }
      await wait(150);

      document.body.classList.add('printing-cv');

      // Use the browser's native print → "Save as PDF" produces vector PDF at A4
      window.print();

      // Cleanup shortly after print dialog closes
      await wait(300);
      document.body.classList.remove('printing-cv');

      setDone(true);
      toast({
        title: '🖨️ Print dialog opened',
        description: 'Choose "Save as PDF" and A4 paper size for a vector resume.',
      });
    } catch (err: any) {
      console.error('Print export error:', err);
      toast({
        title: 'Export failed',
        description: err?.message || 'Could not open print dialog.',
        variant: 'destructive',
      });
    } finally {
      if (previousViewMode !== 'static') {
        setViewMode(previousViewMode);
      }
      setExporting(null);
    }
  }, [exporting, setViewMode, viewMode]);

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
              In the print dialog, choose <strong>Save as PDF</strong> and <strong>A4</strong> paper size.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setDone(false)}>Export Again</Button>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generates a real <strong>vector A4 PDF</strong> using your browser's print engine —
              sharp text, multi-page support, and zero image compression.
            </p>
            <Button
              onClick={() => triggerPrint('pdf')}
              disabled={!!exporting}
              className="w-full gradient-primary text-primary-foreground h-[52px] rounded-xl text-sm font-semibold"
            >
              {exporting === 'pdf' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {exporting === 'pdf' ? 'Opening Print Dialog...' : 'Download PDF (A4 — Save as PDF)'}
            </Button>
            <Button
              onClick={() => triggerPrint('print')}
              disabled={!!exporting}
              variant="outline"
              className="w-full h-[52px] rounded-xl text-sm font-semibold"
            >
              {exporting === 'print' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Printer className="w-4 h-4 mr-2" />
              )}
              {exporting === 'print' ? 'Opening...' : 'Print Resume'}
            </Button>
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed pt-1">
              Tip: In the print dialog, set <em>Margins → Default</em>, <em>Scale → 100%</em>,
              and enable <em>Background graphics</em> for full-color export.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExportPanel;

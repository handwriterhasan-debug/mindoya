import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, PartyPopper, Loader2, FileText, Camera, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const waitForFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const waitForImages = async (root: HTMLElement) => {
  const images = Array.from(root.querySelectorAll('img'));

  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const finish = () => resolve();
        img.addEventListener('load', finish, { once: true });
        img.addEventListener('error', finish, { once: true });
      });
    })
  );
};

const isCanvasBlank = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  const columns = 16;
  const rows = 24;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const x = Math.min(canvas.width - 1, Math.floor((canvas.width - 1) * (col / Math.max(columns - 1, 1))));
      const y = Math.min(canvas.height - 1, Math.floor((canvas.height - 1) * (row / Math.max(rows - 1, 1))));
      const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
      const isWhitePixel = a > 0 && r > 245 && g > 245 && b > 245;

      if (!isWhitePixel) {
        return false;
      }
    }
  }

  return true;
};

const ExportPanel = ({ onClose }: { onClose: () => void }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { data, viewMode, setViewMode } = useCVContext();

  const fileName = data.personal.fullName?.trim().replace(/\s+/g, '_') || 'resume';

  const captureCV = useCallback(async (scale = 2) => {
    const previousViewMode = viewMode;

    if (previousViewMode !== 'static') {
      setViewMode('static');
      await waitForFrame();
      await waitForFrame();
      await wait(80);
    }

    let el = document.getElementById('cv-output') as HTMLElement | null;
    if (!el) throw new Error('CV preview not found');

    await document.fonts.ready;
    await waitForImages(el);

    el = document.getElementById('cv-output') as HTMLElement | null;
    if (!el) throw new Error('CV preview not found');

    const savedElementStyles = {
      width: el.style.width,
      maxWidth: el.style.maxWidth,
      minHeight: el.style.minHeight,
      overflow: el.style.overflow,
      transform: el.style.transform,
      opacity: el.style.opacity,
      visibility: el.style.visibility,
      background: el.style.background,
      WebkitPrintColorAdjust: el.style.getPropertyValue('-webkit-print-color-adjust'),
      printColorAdjust: el.style.getPropertyValue('print-color-adjust'),
    };

    const savedAncestors: Array<{
      el: HTMLElement;
      display: string;
      visibility: string;
      overflow: string;
      maxHeight: string;
      height: string;
      opacity: string;
      transform: string;
      filter: string;
      contain: string;
      contentVisibility: string;
    }> = [];

    let ancestor = el.parentElement as HTMLElement | null;
    while (ancestor && ancestor !== document.body) {
      savedAncestors.push({
        el: ancestor,
        display: ancestor.style.display,
        visibility: ancestor.style.visibility,
        overflow: ancestor.style.overflow,
        maxHeight: ancestor.style.maxHeight,
        height: ancestor.style.height,
        opacity: ancestor.style.opacity,
        transform: ancestor.style.transform,
        filter: ancestor.style.filter,
        contain: ancestor.style.contain,
        contentVisibility: ancestor.style.contentVisibility,
      });

      const computed = window.getComputedStyle(ancestor);
      if (computed.display === 'none') ancestor.style.display = 'block';
      if (computed.visibility === 'hidden') ancestor.style.visibility = 'visible';
      ancestor.style.overflow = 'visible';
      ancestor.style.maxHeight = 'none';
      if (computed.height === '0px') ancestor.style.height = 'auto';
      ancestor.style.opacity = '1';
      ancestor.style.transform = 'none';
      ancestor.style.filter = 'none';
      ancestor.style.contain = 'none';
      ancestor.style.contentVisibility = 'visible';

      ancestor = ancestor.parentElement as HTMLElement | null;
    }

    const targetWidth = Math.max(el.scrollWidth, el.offsetWidth, A4_WIDTH_PX);
    const targetHeight = Math.max(el.scrollHeight, el.offsetHeight, A4_HEIGHT_PX);

    el.style.width = `${targetWidth}px`;
    el.style.maxWidth = 'none';
    el.style.minHeight = `${targetHeight}px`;
    el.style.overflow = 'visible';
    el.style.transform = 'none';
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    // Don't override background - templates have their own backgrounds
    el.style.setProperty('-webkit-print-color-adjust', 'exact');
    el.style.setProperty('print-color-adjust', 'exact');

    try {
      await waitForFrame();
      await waitForFrame();
      await wait(120);
      await document.fonts.ready;
      await waitForImages(el);

      const renderCanvas = async (renderScale: number) => {
        const canvas = await html2canvas(el as HTMLElement, {
          scale: renderScale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          width: targetWidth,
          height: targetHeight,
          windowWidth: targetWidth,
          windowHeight: targetHeight,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            const style = clonedDoc.createElement('style');
            style.textContent = `
              *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                caret-color: transparent !important;
              }

              #cv-output, #cv-output * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              #cv-output {
                width: ${targetWidth}px !important;
                max-width: none !important;
                min-height: ${targetHeight}px !important;
                overflow: visible !important;
                opacity: 1 !important;
                visibility: visible !important;
                transform: none !important;
              }
            `;
            clonedDoc.head.appendChild(style);

            const clonedEl = clonedDoc.getElementById('cv-output') as HTMLElement | null;
            if (clonedEl) {
              clonedEl.style.width = `${targetWidth}px`;
              clonedEl.style.maxWidth = 'none';
              clonedEl.style.minHeight = `${targetHeight}px`;
              clonedEl.style.overflow = 'visible';
              clonedEl.style.opacity = '1';
              clonedEl.style.visibility = 'visible';
              clonedEl.style.transform = 'none';

              // Sanitize radial-gradient backgrounds that cause html2canvas addColorStop errors
              const allEls = clonedEl.querySelectorAll('*');
              allEls.forEach((child) => {
                const el = child as HTMLElement;
                const bg = el.style.backgroundImage || '';
                const computedBg = window.getComputedStyle(el).backgroundImage || '';
                if (computedBg.includes('radial-gradient') || bg.includes('radial-gradient')) {
                  el.style.backgroundImage = 'none';
                }
              });
              // Also check the cv-output element itself
              const cvBg = window.getComputedStyle(clonedEl).backgroundImage || '';
              if (cvBg.includes('radial-gradient')) {
                clonedEl.style.backgroundImage = 'none';
              }
            }
          },
        });

        return canvas;
      };

      let canvas = await renderCanvas(scale);
      if (isCanvasBlank(canvas)) {
        await wait(120);
        canvas = await renderCanvas(Math.max(scale, 3));
      }

      if (isCanvasBlank(canvas)) {
        throw new Error('The CV export rendered blank. Please open Preview once and try again.');
      }

      return canvas;
    } finally {
      el.style.width = savedElementStyles.width;
      el.style.maxWidth = savedElementStyles.maxWidth;
      el.style.minHeight = savedElementStyles.minHeight;
      el.style.overflow = savedElementStyles.overflow;
      el.style.transform = savedElementStyles.transform;
      el.style.opacity = savedElementStyles.opacity;
      el.style.visibility = savedElementStyles.visibility;
      el.style.background = savedElementStyles.background;
      el.style.setProperty('-webkit-print-color-adjust', savedElementStyles.WebkitPrintColorAdjust);
      el.style.setProperty('print-color-adjust', savedElementStyles.printColorAdjust);

      for (const item of savedAncestors) {
        item.el.style.display = item.display;
        item.el.style.visibility = item.visibility;
        item.el.style.overflow = item.overflow;
        item.el.style.maxHeight = item.maxHeight;
        item.el.style.height = item.height;
        item.el.style.opacity = item.opacity;
        item.el.style.transform = item.transform;
        item.el.style.filter = item.filter;
        item.el.style.contain = item.contain;
        item.el.style.contentVisibility = item.contentVisibility;
      }

      if (previousViewMode !== 'static') {
        setViewMode(previousViewMode);
      }
    }
  }, [setViewMode, viewMode]);

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
      const canvas = await captureCV(2);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgW = pdfW;
      const imgH = (canvas.height * pdfW) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      let heightLeft = imgH;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
      heightLeft -= pdfH;

      while (heightLeft > 0) {
        position -= pdfH;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
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
  }, [captureCV, exporting, fileName]);

  const exportPNG = useCallback(async () => {
    if (exporting) return;
    setExporting('png');

    try {
      const canvas = await captureCV(2);
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
  }, [captureCV, exporting, fileName]);

  const exportScreenshot = useCallback(async () => {
    if (exporting) return;
    setExporting('screenshot');

    try {
      const canvas = await captureCV(2);
      const a4W = 1190;
      const a4H = 1684;
      const sc = document.createElement('canvas');
      sc.width = a4W;
      sc.height = a4H;
      const ctx = sc.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, a4W, a4H);

      const canvasScale = Math.min(a4W / canvas.width, a4H / canvas.height);
      const ox = (a4W - canvas.width * canvasScale) / 2;
      ctx.drawImage(canvas, ox, 0, canvas.width * canvasScale, canvas.height * canvasScale);

      const blob = await new Promise<Blob>((resolve, reject) => {
        sc.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create screenshot blob'));
        }, 'image/png');
      });

      downloadBlob(blob, `${fileName}-screenshot.png`);
      setDone(true);
      toast({ title: '🎉 Screenshot exported!', description: 'A4-sized screenshot downloaded.' });
    } catch (err: any) {
      console.error('Screenshot export error:', err);
      toast({ title: 'Export failed', description: err?.message || 'Could not capture.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  }, [captureCV, exporting, fileName]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
      onClick={onClose}
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
              {exporting === 'pdf' ? 'Generating PDF...' : 'Download PDF (A4 Print)'}
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

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

/**
 * Stabilize the cloned CV DOM for consistent export across all templates.
 * - Force 794px width on the root and any nested CV containers
 * - Freeze percentage-based progress bars at their final pixel widths
 * - Freeze SVG circular charts (strokeDashoffset animations) at final values
 * - Prevent flex/grid children from collapsing or reflowing
 * NOTE: Receives BOTH the live source element (to read computed values from)
 * and the cloned target element (to mutate). This guarantees we capture the
 * truly-rendered final state regardless of any in-flight CSS animation.
 */
const stabilizeForExport = (
  sourceRoot: HTMLElement,
  cloneRoot: HTMLElement,
  targetWidth: number,
) => {
  // 1. Force fixed width on root + any inner CV wrapper
  cloneRoot.style.setProperty('width', `${targetWidth}px`, 'important');
  cloneRoot.style.setProperty('max-width', `${targetWidth}px`, 'important');
  cloneRoot.style.setProperty('min-width', `${targetWidth}px`, 'important');
  cloneRoot.style.setProperty('overflow', 'visible', 'important');

  const innerWrappers = cloneRoot.querySelectorAll<HTMLElement>(
    '.cv-content-wrapper, [data-cv-page], [data-cv-root]'
  );
  innerWrappers.forEach((w) => {
    w.style.setProperty('width', `${targetWidth}px`, 'important');
    w.style.setProperty('max-width', `${targetWidth}px`, 'important');
    w.style.setProperty('min-width', `${targetWidth}px`, 'important');
    w.style.setProperty('overflow', 'visible', 'important');
  });

  const sourceAll = Array.from(sourceRoot.querySelectorAll<HTMLElement>('*'));
  const cloneAll = Array.from(cloneRoot.querySelectorAll<HTMLElement>('*'));
  const len = Math.min(sourceAll.length, cloneAll.length);

  for (let i = 0; i < len; i++) {
    const src = sourceAll[i];
    const dst = cloneAll[i];
    if (!src || !dst) continue;

    const cs = window.getComputedStyle(src);

    // 2. Kill all transitions/animations in the clone for stable capture
    dst.style.setProperty('transition', 'none', 'important');
    dst.style.setProperty('animation', 'none', 'important');

    // 3. Freeze progress-bar-like elements (percent widths inside narrow bars)
    //    Heuristic: small height, percentage-driven width, or framer-motion bars.
    const isProgressBar =
      dst.matches('[data-progress-bar], .progress-bar, [role="progressbar"] > *') ||
      (cs.width.endsWith('%') && parseFloat(cs.height) > 0 && parseFloat(cs.height) <= 12);

    if (isProgressBar || (src.style && src.style.width && src.style.width.includes('%'))) {
      const finalWidthPx = src.getBoundingClientRect().width;
      if (Number.isFinite(finalWidthPx) && finalWidthPx > 0) {
        dst.style.setProperty('width', `${finalWidthPx}px`, 'important');
      }
    }

    // 4. Stabilize flex/grid: prevent children from collapsing
    const display = cs.display;
    if (display === 'flex' || display === 'inline-flex' || display === 'grid' || display === 'inline-grid') {
      const srcChildren = Array.from(src.children) as HTMLElement[];
      const dstChildren = Array.from(dst.children) as HTMLElement[];
      const cLen = Math.min(srcChildren.length, dstChildren.length);
      for (let j = 0; j < cLen; j++) {
        const dc = dstChildren[j];
        if (!dc) continue;
        dc.style.setProperty('flex-shrink', '0', 'important');
        dc.style.setProperty('box-sizing', 'border-box', 'important');
      }
    }
  }

  // 5. Freeze SVG circular charts: copy computed strokeDasharray/Dashoffset
  const srcCircles = sourceRoot.querySelectorAll<SVGCircleElement>('svg circle, svg path');
  const dstCircles = cloneRoot.querySelectorAll<SVGCircleElement>('svg circle, svg path');
  const sLen = Math.min(srcCircles.length, dstCircles.length);
  for (let i = 0; i < sLen; i++) {
    const s = srcCircles[i];
    const d = dstCircles[i];
    if (!s || !d) continue;
    const cs = window.getComputedStyle(s as unknown as Element);
    const dashArray = cs.strokeDasharray;
    const dashOffset = cs.strokeDashoffset;
    if (dashArray && dashArray !== 'none') {
      (d as unknown as HTMLElement).style.setProperty('stroke-dasharray', dashArray, 'important');
      d.setAttribute('stroke-dasharray', dashArray);
    }
    if (dashOffset) {
      (d as unknown as HTMLElement).style.setProperty('stroke-dashoffset', dashOffset, 'important');
      d.setAttribute('stroke-dashoffset', dashOffset);
    }
    (d as unknown as HTMLElement).style.setProperty('animation', 'none', 'important');
    (d as unknown as HTMLElement).style.setProperty('transition', 'none', 'important');
  }
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

    // Wait for all fonts (incl. DM Sans / Plus Jakarta Sans) to be fully ready
    if ('fonts' in document) {
      try { await (document as any).fonts.ready; } catch {}
    }
    // Extra delay so custom fonts are applied + any layout settles
    await wait(500);

    const scale = 3;
    const A4_WIDTH = 794;          // CSS px
    const TARGET_PX_WIDTH = 2382;  // 794 * 3 — identical for every template
    const color = safeColor(data?.design?.primaryColor);

    // Force A4 width on the LIVE node so scrollHeight reflects 794px layout.
    // The panel hides the preview during capture, so the user sees no UI change.
    const prevWidth = cv.style.width;
    const prevMaxWidth = cv.style.maxWidth;
    const prevMinWidth = cv.style.minWidth;
    cv.style.setProperty('width', A4_WIDTH + 'px', 'important');
    cv.style.setProperty('max-width', A4_WIDTH + 'px', 'important');
    cv.style.setProperty('min-width', A4_WIDTH + 'px', 'important');
    await wait(200);
    const contentHeight = cv.scrollHeight;

    try {
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cv, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: A4_WIDTH,
        height: contentHeight,
        windowWidth: A4_WIDTH,
        windowHeight: contentHeight,
        onclone: (clonedDoc: Document) => {
          const clonedEl = clonedDoc.getElementById('cv-output');
          if (clonedEl) {
            // 1. Sanitize gradients (8-digit hex → rgba) to avoid addColorStop NaN
            sanitizeGradients(clonedEl, color);
            // 2. Stabilize: fixed width, freeze bars/SVG, lock flex/grid children
            stabilizeForExport(cv, clonedEl, A4_WIDTH);
          }
        },
      });

      cv.style.width = prevWidth;
      cv.style.maxWidth = prevMaxWidth;
      cv.style.minWidth = prevMinWidth;

      // Guarantee identical output width across templates: normalize to 2382px
      let outDataUrl = canvas.toDataURL('image/png', 1.0);
      let outWidth = canvas.width;
      let outHeight = canvas.height;

      if (canvas.width !== TARGET_PX_WIDTH) {
        const ratio = TARGET_PX_WIDTH / canvas.width;
        const normalized = document.createElement('canvas');
        normalized.width = TARGET_PX_WIDTH;
        normalized.height = Math.round(canvas.height * ratio);
        const ctx = normalized.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, normalized.width, normalized.height);
          ctx.drawImage(canvas, 0, 0, normalized.width, normalized.height);
          outDataUrl = normalized.toDataURL('image/png', 1.0);
          outWidth = normalized.width;
          outHeight = normalized.height;
        }
      }

      return { dataUrl: outDataUrl, width: outWidth, height: outHeight };
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

      // Only add pages that have actual content - no blank pages
      if (imgHeight <= pageHeight) {
        // Fits on one page - trim PDF height to content
        const singlePagePdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pageWidth, imgHeight] });
        singlePagePdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        singlePagePdf.save('resume.pdf');
        setDone(true);
        toast({ title: '✅ PDF downloaded!', description: 'resume.pdf saved successfully.' });
        return;
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        while (heightLeft > 2) {
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

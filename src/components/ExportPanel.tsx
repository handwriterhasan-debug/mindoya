import { useState, useCallback } from 'react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, PartyPopper, Loader2, FileText, Image as ImageIcon, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const A4_EXPORT_WIDTH = 794;

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

const LAYOUT_SNAPSHOT_PROPS = [
  'display',
  'position',
  'box-sizing',
  'width',
  'height',
  'min-width',
  'max-width',
  'min-height',
  'max-height',
  'flex',
  'flex-basis',
  'flex-grow',
  'flex-shrink',
  'flex-wrap',
  'align-items',
  'align-self',
  'justify-content',
  'gap',
  'row-gap',
  'column-gap',
  'grid-template-columns',
  'grid-template-rows',
  'grid-column',
  'grid-row',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-radius',
  'overflow',
  'overflow-x',
  'overflow-y',
  'white-space',
  'line-height',
  'font-size',
  'font-weight',
  'font-family',
  'letter-spacing',
  'text-align',
  'text-transform',
  'object-fit',
  'object-position',
  'vertical-align',
  'transform',
  'transform-origin',
] as const;

const freezeExportSnapshot = (liveRoot: HTMLElement, clonedRoot: HTMLElement) => {
  const liveNodes = [liveRoot, ...Array.from(liveRoot.querySelectorAll<HTMLElement>(' *'.trim()))];
  const clonedNodes = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll<HTMLElement>(' *'.trim()))];

  liveNodes.forEach((liveNode, index) => {
    const clonedNode = clonedNodes[index];
    if (!clonedNode) return;

    const computed = window.getComputedStyle(liveNode);
    LAYOUT_SNAPSHOT_PROPS.forEach((prop) => {
      clonedNode.style.setProperty(prop, computed.getPropertyValue(prop));
    });

    clonedNode.style.setProperty('animation', 'none', 'important');
    clonedNode.style.setProperty('transition', 'none', 'important');

    if (liveNode instanceof HTMLImageElement && clonedNode instanceof HTMLImageElement) {
      clonedNode.width = liveNode.width;
      clonedNode.height = liveNode.height;
      clonedNode.style.setProperty('object-fit', computed.objectFit || 'cover');
    }

    if (liveNode instanceof SVGElement && clonedNode instanceof SVGElement) {
      const width = liveNode.getBoundingClientRect().width;
      const height = liveNode.getBoundingClientRect().height;
      if (width) clonedNode.setAttribute('width', `${width}`);
      if (height) clonedNode.setAttribute('height', `${height}`);
    }

    if (liveNode instanceof SVGCircleElement && clonedNode instanceof SVGCircleElement) {
      const dashArray = liveNode.getAttribute('stroke-dasharray') || window.getComputedStyle(liveNode).strokeDasharray;
      const dashOffset = liveNode.getAttribute('stroke-dashoffset') || window.getComputedStyle(liveNode).strokeDashoffset;
      if (dashArray && dashArray !== 'none') clonedNode.setAttribute('stroke-dasharray', dashArray);
      if (dashOffset && dashOffset !== 'none') clonedNode.setAttribute('stroke-dashoffset', dashOffset);
    }
  });
};

const lockAlignmentSensitiveNodes = (liveRoot: HTMLElement, clonedRoot: HTMLElement) => {
  const selectors = [
    '[data-export-lock-size]',
    '[data-export-inline-row]',
    '[data-export-inline-item]',
  ];

  selectors.forEach((selector) => {
    const liveNodes = Array.from(liveRoot.querySelectorAll<HTMLElement>(selector));
    const clonedNodes = Array.from(clonedRoot.querySelectorAll<HTMLElement>(selector));

    liveNodes.forEach((liveNode, index) => {
      const clonedNode = clonedNodes[index];
      if (!clonedNode) return;

      const rect = liveNode.getBoundingClientRect();
      const computed = window.getComputedStyle(liveNode);

      if (rect.width) {
        clonedNode.style.width = `${rect.width}px`;
        clonedNode.style.minWidth = `${rect.width}px`;
        clonedNode.style.maxWidth = `${rect.width}px`;
      }

      if (rect.height) {
        clonedNode.style.height = `${rect.height}px`;
        clonedNode.style.minHeight = `${rect.height}px`;
      }

      if (liveNode.hasAttribute('data-export-inline-row')) {
        clonedNode.style.display = 'flex';
        clonedNode.style.flexWrap = computed.flexWrap;
        clonedNode.style.alignItems = computed.alignItems;
        clonedNode.style.justifyContent = computed.justifyContent;
        clonedNode.style.columnGap = computed.columnGap;
        clonedNode.style.rowGap = computed.rowGap;
      }

      if (liveNode.hasAttribute('data-export-inline-item')) {
        clonedNode.style.display = 'inline-flex';
        clonedNode.style.alignItems = 'center';
        clonedNode.style.flexShrink = '0';
        clonedNode.style.whiteSpace = 'nowrap';
        clonedNode.style.lineHeight = computed.lineHeight;
      }

      if (computed.display.includes('grid')) {
        clonedNode.style.display = computed.display;
        clonedNode.style.gridTemplateColumns = computed.gridTemplateColumns;
        clonedNode.style.gridTemplateRows = computed.gridTemplateRows;
        clonedNode.style.columnGap = computed.columnGap;
        clonedNode.style.rowGap = computed.rowGap;
      }

      if (computed.display.includes('flex')) {
        clonedNode.style.display = computed.display;
        clonedNode.style.flexDirection = computed.flexDirection;
      }
    });
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

    const captureWidth = A4_EXPORT_WIDTH;
    const contentHeight = Math.max(cv.scrollHeight, cv.offsetHeight, Math.round((A4_EXPORT_WIDTH * 1123) / 794));
    const scale = 3;
    const color = safeColor(data?.design?.primaryColor);
    await wait(300); // wait for reflow

    try {
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cv, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: captureWidth,
        height: contentHeight,
        windowWidth: captureWidth,
        windowHeight: contentHeight,
        onclone: (clonedDoc: Document) => {
          const clonedEl = clonedDoc.getElementById('cv-output');
          if (clonedEl) {
            clonedEl.classList.add('export-mode');
            clonedEl.style.width = captureWidth + 'px';
            clonedEl.style.maxWidth = captureWidth + 'px';
            clonedEl.style.minWidth = captureWidth + 'px';
            clonedEl.style.minHeight = `${contentHeight}px`;
            clonedEl.style.height = 'auto';
            clonedEl.style.overflow = 'visible';
            clonedEl.style.transform = 'none';
            clonedEl.style.background = '#ffffff';

            // Kill all animations/transitions
            const killStyle = clonedDoc.createElement('style');
            killStyle.textContent = `
              #cv-output, #cv-output *, #cv-output *::before, #cv-output *::after {
                animation: none !important;
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition: none !important;
                transition-duration: 0s !important;
              }
              #cv-output { min-height: 0 !important; }
            `;
            clonedDoc.head.appendChild(killStyle);

            freezeExportSnapshot(cv, clonedEl);
            lockAlignmentSensitiveNodes(cv, clonedEl);
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

      // Use dynamic page size matching the canvas exactly — single page, no blank space
      const pageWidthMm = 210; // A4 width
      const pageHeightMm = (imgPxH * pageWidthMm) / imgPxW;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pageWidthMm, pageHeightMm],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'FAST');
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
      const cv = document.getElementById('cv-output');
      if (cv) {
        cv.style.width = `${A4_EXPORT_WIDTH}px`;
        cv.style.minWidth = `${A4_EXPORT_WIDTH}px`;
        cv.style.maxWidth = `${A4_EXPORT_WIDTH}px`;
      }
      window.print();
      await wait(500);
    } finally {
      const cv = document.getElementById('cv-output');
      if (cv) {
        cv.style.removeProperty('width');
        cv.style.removeProperty('min-width');
        cv.style.removeProperty('max-width');
      }
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

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
const A4_EXPORT_WIDTH_PX = 2480;
const A4_EXPORT_HEIGHT_PX = 3508;
const PDF_PAGE_WIDTH_MM = 210;
const PDF_PAGE_HEIGHT_MM = 297;
const MIN_EXPORT_WIDTH_PX = 1920;

const waitForFrame = (targetWindow: Window = window) =>
  new Promise<void>((resolve) => targetWindow.requestAnimationFrame(() => resolve()));
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const waitForFonts = async (targetDocument: Document) => {
  if ('fonts' in targetDocument && targetDocument.fonts) {
    await targetDocument.fonts.ready;
  }
};

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

const isTransparentColor = (value?: string | null) => {
  if (!value) return true;
  const normalized = value.replace(/\s+/g, '').toLowerCase();
  return normalized === 'transparent' || normalized === 'rgba(0,0,0,0)';
};

const getCaptureTarget = () => {
  const direct = document.getElementById('cv-output') as HTMLElement | null;
  if (direct) {
    return {
      element: direct,
      targetDocument: direct.ownerDocument,
      targetWindow: direct.ownerDocument.defaultView || window,
    };
  }

  const frames = Array.from(document.querySelectorAll('iframe'));
  for (const frame of frames) {
    try {
      const frameDocument = frame.contentDocument;
      const frameWindow = frame.contentWindow;
      const frameElement = frameDocument?.getElementById('cv-output') as HTMLElement | null;

      if (frameElement && frameDocument && frameWindow) {
        return {
          element: frameElement,
          targetDocument: frameDocument,
          targetWindow: frameWindow,
        };
      }
    } catch {
      continue;
    }
  }

  throw new Error('CV preview not found');
};

const getEffectiveBackgroundColor = (root: HTMLElement, targetWindow: Window) => {
  const candidates = [
    root,
    ...(root.firstElementChild instanceof HTMLElement ? [root.firstElementChild] : []),
  ];

  for (const candidate of candidates) {
    const color = targetWindow.getComputedStyle(candidate).backgroundColor;
    if (!isTransparentColor(color)) return color;
  }

  return '#ffffff';
};

const sanitizeExportTree = (
  root: HTMLElement,
  targetWindow: Window,
  targetWidth: number,
  targetHeight: number,
  backgroundColor: string
) => {
  root.id = 'cv-output-export';
  root.style.width = `${targetWidth}px`;
  root.style.maxWidth = 'none';
  root.style.minHeight = `${targetHeight}px`;
  root.style.overflow = 'visible';
  root.style.opacity = '1';
  root.style.visibility = 'visible';
  root.style.transform = 'none';
  root.style.borderRadius = '0';
  root.style.boxShadow = 'none';
  root.style.backgroundColor = backgroundColor;
  root.style.setProperty('-webkit-print-color-adjust', 'exact');
  root.style.setProperty('print-color-adjust', 'exact');

  const allElements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];

  allElements.forEach((node) => {
    const computed = targetWindow.getComputedStyle(node);

    node.style.animation = 'none';
    node.style.transition = 'none';
    node.style.caretColor = 'transparent';
    node.style.contentVisibility = 'visible';
    node.style.setProperty('-webkit-print-color-adjust', 'exact');
    node.style.setProperty('print-color-adjust', 'exact');

    const backgroundImage = computed.backgroundImage || '';
    if (backgroundImage.includes('radial-gradient') || backgroundImage.includes('conic-gradient')) {
      node.style.backgroundImage = 'none';
    }

    if (computed.backdropFilter && computed.backdropFilter !== 'none') {
      node.style.backdropFilter = 'none';
      node.style.setProperty('-webkit-backdrop-filter', 'none');
    }

    if (computed.filter && computed.filter !== 'none' && computed.filter.includes('blur')) {
      node.style.filter = 'none';
    }

    if (computed.mixBlendMode && computed.mixBlendMode !== 'normal') {
      node.style.mixBlendMode = 'normal';
    }

    if ((computed as CSSStyleDeclaration).maskImage && (computed as CSSStyleDeclaration).maskImage !== 'none') {
      node.style.maskImage = 'none';
    }
  });
};

const createDetachedCaptureRoot = (
  sourceElement: HTMLElement,
  targetDocument: Document,
  targetWindow: Window,
  initialWidth: number
) => {
  const sandbox = targetDocument.createElement('div');
  sandbox.setAttribute('data-export-sandbox', 'true');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-200vw';
  sandbox.style.top = '0';
  sandbox.style.width = `${initialWidth}px`;
  sandbox.style.overflow = 'visible';
  sandbox.style.opacity = '1';
  sandbox.style.pointerEvents = 'none';
  sandbox.style.zIndex = '-1';
  sandbox.style.background = 'transparent';
  sandbox.style.isolation = 'isolate';

  const clone = sourceElement.cloneNode(true) as HTMLElement;
  const backgroundColor = getEffectiveBackgroundColor(sourceElement, targetWindow);

  sanitizeExportTree(clone, targetWindow, initialWidth, A4_HEIGHT_PX, backgroundColor);
  sandbox.appendChild(clone);
  targetDocument.body.appendChild(sandbox);

  return { sandbox, clone, backgroundColor };
};

const isCanvasBlank = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  const columns = 16;
  const rows = 24;
  let hasVisiblePixel = false;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const x = Math.min(canvas.width - 1, Math.floor((canvas.width - 1) * (col / Math.max(columns - 1, 1))));
      const y = Math.min(canvas.height - 1, Math.floor((canvas.height - 1) * (row / Math.max(rows - 1, 1))));
      const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
      const isTransparentPixel = a === 0;
      const isWhitePixel = a > 0 && r > 245 && g > 245 && b > 245;

      if (!isTransparentPixel && !isWhitePixel) {
        return false;
      }

      if (!isTransparentPixel) {
        hasVisiblePixel = true;
      }
    }
  }

  return !hasVisiblePixel;
};

const collectSectionBreaks = (clone: HTMLElement, targetWindow: Window) => {
  const templateRoot = clone.firstElementChild instanceof HTMLElement ? clone.firstElementChild : clone;
  const rootRect = clone.getBoundingClientRect();
  const candidates = new Set<HTMLElement>();

  const addChildren = (container: HTMLElement, depth: number) => {
    Array.from(container.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;

      const rect = child.getBoundingClientRect();
      const computed = targetWindow.getComputedStyle(child);
      const isFloating = computed.position === 'absolute' || computed.position === 'fixed';

      if (!isFloating && rect.height >= 48) {
        candidates.add(child);
      }

      const shouldDive =
        depth < 1 &&
        child.children.length > 1 &&
        (computed.display.includes('flex') || computed.display.includes('grid') || rect.height > A4_HEIGHT_PX * 0.55);

      if (shouldDive) {
        addChildren(child, depth + 1);
      }
    });
  };

  addChildren(templateRoot, 0);

  return Array.from(candidates)
    .map((node) => Math.round(node.getBoundingClientRect().top - rootRect.top))
    .filter((offset) => offset > 48 && offset < clone.scrollHeight - 48)
    .sort((a, b) => a - b)
    .filter((offset, index, values) => index === 0 || offset - values[index - 1] > 24);
};

const buildPdfSlices = (canvasHeight: number, pageHeightPx: number, pageBreaks: number[]) => {
  const slices: Array<{ startY: number; height: number }> = [];
  let startY = 0;

  while (startY < canvasHeight) {
    const remainingHeight = canvasHeight - startY;
    if (remainingHeight <= pageHeightPx) {
      slices.push({ startY, height: remainingHeight });
      break;
    }

    const preferredEnd = startY + pageHeightPx;
    const minBreak = startY + Math.floor(pageHeightPx * 0.72);
    const maxBreak = startY + Math.floor(pageHeightPx * 1.04);

    const bestBreak = pageBreaks
      .filter((point) => point > minBreak && point < maxBreak)
      .reduce<number | null>((best, point) => {
        if (best === null) return point;
        return Math.abs(point - preferredEnd) < Math.abs(best - preferredEnd) ? point : best;
      }, null);

    const endY = bestBreak && bestBreak - startY > 120 ? bestBreak : preferredEnd;
    slices.push({ startY, height: endY - startY });
    startY = endY;
  }

  return slices;
};

const createPageCanvas = (sourceCanvas: HTMLCanvasElement, startY: number, height: number) => {
  const pageCanvas = document.createElement('canvas');
  pageCanvas.width = sourceCanvas.width;
  pageCanvas.height = height;

  const ctx = pageCanvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(sourceCanvas, 0, startY, sourceCanvas.width, height, 0, 0, sourceCanvas.width, height);
  return pageCanvas;
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
      await wait(100);
    }

    const { element: sourceElement, targetDocument, targetWindow } = getCaptureTarget();

    await waitForFonts(targetDocument);
    await waitForImages(sourceElement);

    const initialWidth = Math.max(
      MIN_EXPORT_WIDTH_PX,
      A4_WIDTH_PX,
      Math.round(sourceElement.getBoundingClientRect().width || parseFloat(sourceElement.style.width) || A4_WIDTH_PX)
    );

    const { sandbox, clone, backgroundColor } = createDetachedCaptureRoot(
      sourceElement,
      targetDocument,
      targetWindow,
      initialWidth
    );

    try {
      await waitForFonts(targetDocument);
      await waitForImages(clone);
      await waitForFrame(targetWindow);
      await waitForFrame(targetWindow);
      await wait(100);

      const targetWidth = Math.max(
        MIN_EXPORT_WIDTH_PX,
        A4_WIDTH_PX,
        Math.ceil(clone.scrollWidth || clone.offsetWidth || initialWidth)
      );
      clone.style.width = `${targetWidth}px`;
      clone.style.maxWidth = 'none';

      await waitForFrame(targetWindow);
      await wait(60);

      const targetHeight = Math.max(A4_HEIGHT_PX, Math.ceil(clone.scrollHeight || clone.offsetHeight || A4_HEIGHT_PX));
      sanitizeExportTree(clone, targetWindow, targetWidth, targetHeight, backgroundColor);

      const pageBreaks = collectSectionBreaks(clone, targetWindow);

      await waitForFrame(targetWindow);
      await wait(80);
      await waitForFonts(targetDocument);
      await waitForImages(clone);

      const renderCanvas = async (renderScale: number) => {
        const canvas = await html2canvas(clone, {
          scale: renderScale,
          useCORS: true,
          allowTaint: true,
          backgroundColor,
          logging: false,
          foreignObjectRendering: false,
          width: targetWidth,
          height: targetHeight,
          windowWidth: Math.max(targetWidth, targetWindow.innerWidth),
          windowHeight: Math.max(targetHeight, targetWindow.innerHeight),
          scrollX: 0,
          scrollY: -targetWindow.scrollY,
          onclone: (clonedDoc) => {
            const style = clonedDoc.createElement('style');
            style.textContent = `
              *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                caret-color: transparent !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              #cv-output-export {
                width: ${targetWidth}px !important;
                max-width: none !important;
                min-height: ${targetHeight}px !important;
                overflow: visible !important;
                opacity: 1 !important;
                visibility: visible !important;
                transform: none !important;
                border-radius: 0 !important;
                box-shadow: none !important;
              }
            `;
            clonedDoc.head.appendChild(style);

            const exportRoot = clonedDoc.getElementById('cv-output-export') as HTMLElement | null;
            if (exportRoot) {
              exportRoot.style.backgroundColor = backgroundColor;
              exportRoot.style.backgroundImage = exportRoot.style.backgroundImage || 'none';
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
        throw new Error('The resume export is still rendering blank. Please open the preview, then try download again.');
      }

      return {
        canvas,
        targetWidth,
        targetHeight,
        pageBreaks: pageBreaks.map((point) => Math.round(point * scale)),
        backgroundColor,
      };
    } finally {
      sandbox.remove();

      if (previousViewMode !== 'static') {
        setViewMode(previousViewMode);
      }
    }
  }, [setViewMode, viewMode]);

  const downloadBlob = async (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);

    await new Promise<void>((resolve) => {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = name;
      anchor.rel = 'noopener';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);

      requestAnimationFrame(() => {
        anchor.click();
        window.setTimeout(() => {
          document.body.removeChild(anchor);
          URL.revokeObjectURL(url);
          resolve();
        }, 800);
      });
    });
  };

  const exportPDF = useCallback(async () => {
    if (exporting) return;
    setExporting('pdf');

    try {
      const { canvas, pageBreaks } = await captureCV(2);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageHeightPx = Math.round((canvas.width * PDF_PAGE_HEIGHT_MM) / PDF_PAGE_WIDTH_MM);
      const slices = buildPdfSlices(canvas.height, pageHeightPx, pageBreaks);

      slices.forEach((slice, index) => {
        if (index > 0) pdf.addPage();

        const pageCanvas = createPageCanvas(canvas, slice.startY, slice.height);
        const pageHeightMm = (slice.height * PDF_PAGE_WIDTH_MM) / canvas.width;

        pdf.addImage(
          pageCanvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          PDF_PAGE_WIDTH_MM,
          Math.min(PDF_PAGE_HEIGHT_MM, pageHeightMm),
          undefined,
          'FAST'
        );
      });

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
      const { canvas } = await captureCV(3);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create PNG blob'));
        }, 'image/png');
      });

      await downloadBlob(blob, `${fileName}-cv.png`);
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
      const { canvas, backgroundColor } = await captureCV(2);
      const screenshotHeight = Math.max(
        A4_EXPORT_HEIGHT_PX,
        Math.round((canvas.height * A4_EXPORT_WIDTH_PX) / canvas.width)
      );
      const screenshotCanvas = document.createElement('canvas');
      screenshotCanvas.width = A4_EXPORT_WIDTH_PX;
      screenshotCanvas.height = screenshotHeight;
      const ctx = screenshotCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, A4_EXPORT_WIDTH_PX, screenshotHeight);

      const canvasScale = A4_EXPORT_WIDTH_PX / canvas.width;
      const drawWidth = canvas.width * canvasScale;
      const drawHeight = canvas.height * canvasScale;
      const offsetX = (A4_EXPORT_WIDTH_PX - drawWidth) / 2;
      const offsetY = 0;

      ctx.drawImage(canvas, offsetX, offsetY, drawWidth, drawHeight);

      const blob = await new Promise<Blob>((resolve, reject) => {
        screenshotCanvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create screenshot blob'));
        }, 'image/png');
      });

      await downloadBlob(blob, `${fileName}-screenshot.png`);
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

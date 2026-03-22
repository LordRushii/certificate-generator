"use client";

import { useRef, useEffect, useCallback } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

const PDFJS_VERSION = "5.5.207";
GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

type PdfCanvasProps = {
  url: string;
  onPageDimensions?: (width: number, height: number) => void;
};

export function PdfCanvas({ url, onPageDimensions }: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<PDFPageProxy | null>(null);
  const renderTaskRef = useRef<{ cancel(): void } | null>(null);
  const onDimsRef = useRef(onPageDimensions);
  onDimsRef.current = onPageDimensions;

  const renderToCanvas = useCallback(() => {
    const page = pageRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!page || !canvas || !container) return;

    renderTaskRef.current?.cancel();

    const containerWidth = container.clientWidth;
    if (containerWidth === 0) return;

    const baseVp = page.getViewport({ scale: 1 });
    const scale = containerWidth / baseVp.width;
    const viewport = page.getViewport({ scale });

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // @ts-expect-error - pdfjs-dist types incorrectly require canvas property in this version
    renderTaskRef.current = page.render({ canvasContext: ctx, viewport });
  }, []);

  useEffect(() => {
    let pdfDoc: PDFDocumentProxy | null = null;
    let cancelled = false;

    const loadingTask = getDocument(url);
    loadingTask.promise
      .then(async (doc) => {
        if (cancelled) {
          doc.destroy();
          return;
        }
        pdfDoc = doc;
        const page = await doc.getPage(1);
        if (cancelled) return;

        pageRef.current = page;
        const vp = page.getViewport({ scale: 1 });
        onDimsRef.current?.(vp.width, vp.height);
        renderToCanvas();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      loadingTask.destroy().catch(() => {});
      renderTaskRef.current?.cancel();
      pdfDoc?.destroy();
      pageRef.current = null;
    };
  }, [url, renderToCanvas]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => renderToCanvas());
    observer.observe(container);
    return () => observer.disconnect();
  }, [renderToCanvas]);

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

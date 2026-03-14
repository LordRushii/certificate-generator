"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MousePointerClick } from "lucide-react";
import { PdfCanvas } from "./PdfCanvas";

export type NamePosition = {
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  font: string;
};

type NamePositionerProps = {
  templateUrl: string;
  templateType: "pdf" | "png" | "jpg";
  position: NamePosition;
  onChange: (position: NamePosition) => void;
};

export const FONT_OPTIONS = [
  { value: "Helvetica",            label: "Helvetica",              css: { fontFamily: "Helvetica, Arial, sans-serif",              fontWeight: "normal", fontStyle: "normal"  } },
  { value: "HelveticaBold",        label: "Helvetica Bold",         css: { fontFamily: "Helvetica, Arial, sans-serif",              fontWeight: "bold",   fontStyle: "normal"  } },
  { value: "HelveticaOblique",     label: "Helvetica Italic",       css: { fontFamily: "Helvetica, Arial, sans-serif",              fontWeight: "normal", fontStyle: "italic"  } },
  { value: "HelveticaBoldOblique", label: "Helvetica Bold Italic",  css: { fontFamily: "Helvetica, Arial, sans-serif",              fontWeight: "bold",   fontStyle: "italic"  } },
  { value: "TimesRoman",           label: "Times Roman",            css: { fontFamily: "'Times New Roman', Times, serif",           fontWeight: "normal", fontStyle: "normal"  } },
  { value: "TimesRomanBold",       label: "Times Bold",             css: { fontFamily: "'Times New Roman', Times, serif",           fontWeight: "bold",   fontStyle: "normal"  } },
  { value: "TimesRomanItalic",     label: "Times Italic",           css: { fontFamily: "'Times New Roman', Times, serif",           fontWeight: "normal", fontStyle: "italic"  } },
  { value: "TimesRomanBoldItalic", label: "Times Bold Italic",      css: { fontFamily: "'Times New Roman', Times, serif",           fontWeight: "bold",   fontStyle: "italic"  } },
  { value: "Courier",              label: "Courier",                css: { fontFamily: "'Courier New', Courier, monospace",         fontWeight: "normal", fontStyle: "normal"  } },
  { value: "CourierBold",          label: "Courier Bold",           css: { fontFamily: "'Courier New', Courier, monospace",         fontWeight: "bold",   fontStyle: "normal"  } },
  { value: "CourierOblique",       label: "Courier Italic",         css: { fontFamily: "'Courier New', Courier, monospace",         fontWeight: "normal", fontStyle: "italic"  } },
] as const;

function getNameOverlayStyle(
  position: NamePosition,
  computedFontSize: number
): React.CSSProperties {
  const fontOption = FONT_OPTIONS.find((f) => f.value === position.font);
  const fontCss = fontOption?.css ?? { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: "bold", fontStyle: "normal" };
  return {
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: "translate(-50%, -50%)",
    fontSize: `${computedFontSize}px`,
    color: position.fontColor,
    textShadow: "0 0 6px rgba(255,255,255,0.9), 0 0 3px rgba(255,255,255,0.9)",
    whiteSpace: "nowrap",
    ...fontCss,
  };
}

export function NamePositioner({
  templateUrl,
  templateType,
  position,
  onChange,
}: NamePositionerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewName, setPreviewName] = useState("John Doe");
  const [containerWidth, setContainerWidth] = useState(0);
  const [pdfPageWidth, setPdfPageWidth] = useState(0);

  const isPdf = templateType === "pdf";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePdfDimensions = useCallback((width: number, _height: number) => {
    setPdfPageWidth(width);
  }, []);

  const computedFontSize =
    isPdf && pdfPageWidth > 0 && containerWidth > 0
      ? Math.max(8, Math.round((containerWidth / pdfPageWidth) * position.fontSize))
      : Math.max(8, Math.round(position.fontSize * 0.35));

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
      onChange({ ...position, x, y });
    },
    [position, onChange]
  );

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border bg-muted cursor-crosshair select-none"
        onClick={handleClick}
      >
        {isPdf ? (
          <PdfCanvas url={templateUrl} onPageDimensions={handlePdfDimensions} />
        ) : (
          <img
            src={templateUrl}
            alt="Certificate template"
            className="w-full object-contain"
            draggable={false}
          />
        )}
        <div
          className="absolute pointer-events-none"
          style={getNameOverlayStyle(position, computedFontSize)}
        >
          {previewName}
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MousePointerClick className="size-3.5" />
        Click on the template to set the name position
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label>X Position (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={position.x}
            onChange={(e) =>
              onChange({ ...position, x: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label>Y Position (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={position.y}
            onChange={(e) =>
              onChange({ ...position, y: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label>Font Size (pt)</Label>
          <Input
            type="number"
            min={8}
            max={120}
            step={1}
            value={position.fontSize}
            onChange={(e) =>
              onChange({ ...position, fontSize: parseInt(e.target.value) || 24 })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label>Font Color</Label>
          <Input
            type="color"
            value={position.fontColor}
            onChange={(e) => onChange({ ...position, fontColor: e.target.value })}
            className="h-8 cursor-pointer px-1 py-0.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Font</Label>
          <select
            value={position.font}
            onChange={(e) => onChange({ ...position, font: e.target.value })}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Preview Name</Label>
          <Input
            value={previewName}
            onChange={(e) => setPreviewName(e.target.value)}
            placeholder="Enter a name to preview"
          />
        </div>
      </div>
    </div>
  );
}

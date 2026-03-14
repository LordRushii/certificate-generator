type NamePosition = {
  x: number;
  y: number;
  fontSize: number;
  fontColor?: string;
};

type CertificatePreviewProps = {
  templateUrl: string;
  templateType: "pdf" | "png" | "jpg";
  namePosition: NamePosition;
  previewName?: string;
  naturalWidth?: number;
  naturalHeight?: number;
};

export function CertificatePreview({
  templateUrl,
  templateType,
  namePosition,
  previewName = "John Doe",
  naturalWidth,
  naturalHeight,
}: CertificatePreviewProps) {
  const isImage = templateType === "png" || templateType === "jpg";

  const computedFontSize =
    naturalHeight && naturalWidth
      ? Math.round(namePosition.fontSize * 0.4)
      : Math.max(10, namePosition.fontSize * 0.3);

  return (
    <div className="relative overflow-hidden rounded-lg border bg-muted">
      {isImage ? (
        <>
          <img
            src={templateUrl}
            alt="Certificate preview"
            className="w-full object-contain"
            draggable={false}
          />
          <div
            className="absolute pointer-events-none select-none font-bold"
            style={{
              left: `${namePosition.x}%`,
              top: `${namePosition.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${computedFontSize}px`,
              color: namePosition.fontColor ?? "#000000",
              textShadow: "0 0 6px rgba(255,255,255,0.8)",
              whiteSpace: "nowrap",
            }}
          >
            {previewName}
          </div>
        </>
      ) : (
        <iframe
          src={templateUrl}
          className="w-full h-[500px]"
          title="Certificate template PDF preview"
        />
      )}
    </div>
  );
}

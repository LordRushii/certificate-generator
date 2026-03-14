"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

type TemplateType = "pdf" | "png" | "jpg";

type TemplateUploaderProps = {
  eventId: Id<"events">;
  hasExisting: boolean;
};

function getTemplateType(file: File): TemplateType | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "png") return "png";
  if (ext === "jpg" || ext === "jpeg") return "jpg";
  return null;
}

export function TemplateUploader({ eventId, hasExisting }: TemplateUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.events.generateUploadUrl);
  const updateEvent = useMutation(api.events.updateEvent);

  const handleFile = async (file: File) => {
    const templateType = getTemplateType(file);
    if (!templateType) {
      toast.error("Only PDF, PNG, and JPG/JPEG files are supported.");
      return;
    }

    setIsLoading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { storageId } = (await response.json()) as {
        storageId: Id<"_storage">;
      };

      await updateEvent({
        eventId,
        templateStorageId: storageId,
        templateType,
      });

      toast.success("Template uploaded.");
    } catch {
      toast.error("Failed to upload template. Please try again.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {hasExisting ? (
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => fileInputRef.current?.click()}
        >
          <RefreshCw className="size-3.5" />
          {isLoading ? "Uploading..." : "Replace Template"}
        </Button>
      ) : (
        <div
          className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-8 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">
              {isLoading ? "Uploading..." : "Click to upload certificate template"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, PNG, or JPG — design with Canva, Illustrator, or any tool
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Browse File
          </Button>
        </div>
      )}
    </div>
  );
}

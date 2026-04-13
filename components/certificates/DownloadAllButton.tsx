"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

type Participant = {
  _id: string;
  name: string;
  certificateUrl: string | null;
};

type DownloadAllButtonProps = {
  participants: Participant[];
  eventName: string;
};

export function DownloadAllButton({ participants, eventName }: DownloadAllButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const generatedParticipants = participants.filter((p) => p.certificateUrl);
    
    if (generatedParticipants.length === 0) {
      toast.error("No certificates generated yet.");
      return;
    }

    setIsDownloading(true);
    toast.info(`Preparing ${generatedParticipants.length} certificates...`);

    try {
      const zip = new JSZip();

      // Fetch all PDFs and add to zip
      const fetchPromises = generatedParticipants.map(async (participant) => {
        try {
          const response = await fetch(participant.certificateUrl!);
          if (!response.ok) throw new Error("Failed to fetch certificate");
          const blob = await response.blob();
          
          // Format filename: Keep exact name but remove invalid OS characters
          const safeName = participant.name.replace(/[\\/:"*?<>|]/g, "_").trim();
          const fileName = `${safeName}.pdf`;
          
          zip.file(fileName, blob);
        } catch (error) {
          console.error(`Failed to download certificate for ${participant.name}`, error);
        }
      });

      await Promise.all(fetchPromises);

      // Generate the zip binary file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Create a temporary link to download the zip
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `${eventName.replace(/[^a-zA-Z0-9 \-_]/g, "").trim()}_certificates.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);

      toast.success("Download started successfully!");
    } catch (error) {
      console.error("Failed to generate zip file:", error);
      toast.error("Failed to download certificates as ZIP.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={isDownloading || participants.filter((p) => p.certificateUrl).length === 0}
      className="gap-1.5"
    >
      {isDownloading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      Download All ZIP
    </Button>
  );
}

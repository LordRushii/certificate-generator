"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

type GenerateButtonProps = {
  eventId: Id<"events">;
  isReady: boolean;
  isGenerating: boolean;
};

export function GenerateButton({
  eventId,
  isReady,
  isGenerating,
}: GenerateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const generateCertificates = useAction(api.certificates.generateCertificates);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      await generateCertificates({ eventId });
      toast.success("All certificates generated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate certificates."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const busy = isLoading || isGenerating;

  return (
    <Button
      onClick={handleGenerate}
      disabled={!isReady || busy}
      size="lg"
    >
      {busy ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="size-4" />
          Generate Certificates
        </>
      )}
    </Button>
  );
}

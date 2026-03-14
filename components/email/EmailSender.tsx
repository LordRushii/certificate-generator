"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

type EmailSenderProps = {
  eventId: Id<"events">;
  pendingCount: number;
  isSending: boolean;
  isCompleted: boolean;
};

export function EmailSender({
  eventId,
  pendingCount,
  isSending,
  isCompleted,
}: EmailSenderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const sendCertificateEmails = useAction(api.emails.sendCertificateEmails);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await sendCertificateEmails({ eventId });
      toast.success("Emails sent successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send emails."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const busy = isLoading || isSending;

  if (isCompleted && pendingCount === 0) {
    return (
      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
        All certificates have been emailed.
      </p>
    );
  }

  return (
    <Button onClick={handleSend} disabled={busy || pendingCount === 0} size="lg">
      {busy ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="size-4" />
          Send {pendingCount > 0 ? `${pendingCount} Email${pendingCount !== 1 ? "s" : ""}` : "Emails"}
        </>
      )}
    </Button>
  );
}

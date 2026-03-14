import { CheckCircle2, Clock, Loader2 } from "lucide-react";

type EventStatus =
  | "draft"
  | "generating"
  | "generated"
  | "emailing"
  | "completed";

type GenerationProgressProps = {
  status: EventStatus;
  totalParticipants: number;
  generatedCount: number;
};

export function GenerationProgress({
  status,
  totalParticipants,
  generatedCount,
}: GenerationProgressProps) {
  const percentage =
    totalParticipants > 0
      ? Math.round((generatedCount / totalParticipants) * 100)
      : 0;

  if (status === "draft") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="size-4" />
        Ready to generate — click the button above to start.
      </div>
    );
  }

  if (status === "generating") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin text-primary" />
          Generating certificates...
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {generatedCount} / {totalParticipants} completed
        </p>
      </div>
    );
  }

  if (
    status === "generated" ||
    status === "emailing" ||
    status === "completed"
  ) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle2 className="size-4" />
        {generatedCount} certificate{generatedCount !== 1 ? "s" : ""} generated
        successfully.
      </div>
    );
  }

  return null;
}

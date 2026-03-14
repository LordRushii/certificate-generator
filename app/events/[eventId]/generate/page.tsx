"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenerateButton } from "@/components/certificates/GenerateButton";
import { GenerationProgress } from "@/components/certificates/GenerationProgress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ParticipantTable } from "@/components/participants/ParticipantTable";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

type GeneratePageProps = {
  params: Promise<{ eventId: string }>;
};

export default function GeneratePage({ params }: GeneratePageProps) {
  const { eventId } = use(params);

  const event = useQuery(api.events.getEvent, {
    eventId: eventId as Id<"events">,
  });

  const participants = useQuery(api.participants.listParticipants, {
    eventId: eventId as Id<"events">,
  });

  if (event === undefined || participants === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!event) return null;

  const hasParticipants = participants.length > 0;
  const hasTemplate = !!event.templateStorageId;
  const hasPosition = !!event.namePosition;
  const isReady = hasParticipants && hasTemplate && hasPosition;
  const isGenerating = event.status === "generating";
  const isGenerated =
    event.status === "generated" ||
    event.status === "emailing" ||
    event.status === "completed";

  const generatedCount = participants.filter(
    (p) => p.certificateStorageId
  ).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Certificates</CardTitle>
          <CardDescription>
            Generate PDF certificates for all {participants.length} participant
            {participants.length !== 1 ? "s" : ""}. This may take a moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isReady && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm dark:border-yellow-900/30 dark:bg-yellow-900/10">
              <p className="flex items-center gap-1.5 font-medium text-yellow-800 dark:text-yellow-400">
                <AlertCircle className="size-4" />
                Prerequisites not met
              </p>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-500 pl-6 list-disc">
                {!hasParticipants && (
                  <li>
                    <Link
                      href={`/events/${eventId}/participants`}
                      className="underline"
                    >
                      Upload participants
                    </Link>
                  </li>
                )}
                {!hasTemplate && (
                  <li>
                    <Link
                      href={`/events/${eventId}/template`}
                      className="underline"
                    >
                      Upload a certificate template
                    </Link>
                  </li>
                )}
                {!hasPosition && (
                  <li>
                    <Link
                      href={`/events/${eventId}/template`}
                      className="underline"
                    >
                      Set the name position
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          <GenerationProgress
            status={event.status}
            totalParticipants={participants.length}
            generatedCount={generatedCount}
          />
        </CardContent>
        <CardFooter className="gap-3">
          <GenerateButton
            eventId={eventId as Id<"events">}
            isReady={isReady}
            isGenerating={isGenerating}
          />
          {isGenerated && (
            <Link
              href={`/events/${eventId}/email`}
              className={cn(buttonVariants(), "gap-1.5")}
            >
              Next: Send Emails <ChevronRight className="size-4" />
            </Link>
          )}
        </CardFooter>
      </Card>

      {participants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <ParticipantTable participants={participants} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

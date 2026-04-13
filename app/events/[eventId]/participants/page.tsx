"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ExcelUploader } from "@/components/participants/ExcelUploader";
import { ParticipantTable } from "@/components/participants/ParticipantTable";
import { DownloadAllButton } from "@/components/certificates/DownloadAllButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

type ParticipantsPageProps = {
  params: Promise<{ eventId: string }>;
};

export default function ParticipantsPage({ params }: ParticipantsPageProps) {
  const { eventId } = use(params);
  const participants = useQuery(api.participants.listParticipants, {
    eventId: eventId as Id<"events">,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Participants</CardTitle>
          <CardDescription>
            Upload an Excel or CSV file with participant names and emails. The
            file must have <strong>Name</strong> and <strong>Email</strong>{" "}
            columns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExcelUploader eventId={eventId as Id<"events">} />
        </CardContent>
      </Card>

      {participants !== undefined && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>
                  Participants{" "}
                  {participants.length > 0 && (
                    <span className="text-muted-foreground font-normal text-base">
                      ({participants.length})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Click a name to edit it inline. Changes are saved immediately.
                </CardDescription>
              </div>
              {participants.length > 0 && (
                <div className="flex items-center gap-3">
                  <DownloadAllButton participants={participants} eventName="Certificates" />
                  <Link
                    href={`/events/${eventId}/template`}
                    className={cn(buttonVariants(), "gap-1.5")}
                  >
                    Next: Template <ChevronRight className="size-4" />
                  </Link>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ParticipantTable participants={participants} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

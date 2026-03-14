"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmailSender } from "@/components/email/EmailSender";
import { EmailStatusBadge } from "@/components/email/EmailStatusBadge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, FileDown } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

type EmailPageProps = {
  params: Promise<{ eventId: string }>;
};

export default function EmailPage({ params }: EmailPageProps) {
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

  const hasGeneratedCerts = participants.some((p) => p.certificateStorageId);
  const pendingCount = participants.filter(
    (p) => p.emailStatus !== "sent" && p.certificateStorageId
  ).length;
  const isSending = event.status === "emailing";
  const isCompleted = event.status === "completed";

  const sentCount = participants.filter((p) => p.emailStatus === "sent").length;
  const failedCount = participants.filter(
    (p) => p.emailStatus === "failed"
  ).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Certificates by Email</CardTitle>
          <CardDescription>
            Send each participant their certificate as a PDF attachment. The
            system will skip participants who have already been sent their
            certificate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasGeneratedCerts && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm dark:border-yellow-900/30 dark:bg-yellow-900/10">
              <p className="flex items-center gap-1.5 font-medium text-yellow-800 dark:text-yellow-400">
                <AlertCircle className="size-4" />
                No certificates generated yet.{" "}
                <Link
                  href={`/events/${eventId}/generate`}
                  className="underline"
                >
                  Go to Generate step
                </Link>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-muted-foreground">
              Total: <strong className="text-foreground">{participants.length}</strong>
            </span>
            <span className="text-green-600 dark:text-green-400">
              Sent: <strong>{sentCount}</strong>
            </span>
            {failedCount > 0 && (
              <span className="text-red-600 dark:text-red-400">
                Failed: <strong>{failedCount}</strong>
              </span>
            )}
            <span className="text-muted-foreground">
              Pending: <strong>{pendingCount}</strong>
            </span>
          </div>

          <EmailSender
            eventId={eventId as Id<"events">}
            pendingCount={pendingCount}
            isSending={isSending}
            isCompleted={isCompleted}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participant Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Email Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, index) => (
                  <TableRow key={participant._id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {participant.email}
                    </TableCell>
                    <TableCell>
                      {participant.certificateUrl ? (
                        <a
                          href={participant.certificateUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className={cn(buttonVariants({ variant: "outline", size: "icon-xs" }))}
                          aria-label="Download certificate"
                        >
                          <FileDown className="size-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not generated
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <EmailStatusBadge status={participant.emailStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

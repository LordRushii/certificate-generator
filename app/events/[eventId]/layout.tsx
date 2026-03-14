"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EventStepper } from "@/components/events/EventStepper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Id } from "@/convex/_generated/dataModel";

type EventLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
};

export default function EventLayout({ children, params }: EventLayoutProps) {
  const { eventId } = use(params);

  const event = useQuery(api.events.getEvent, {
    eventId: eventId as Id<"events">,
  });

  const participants = useQuery(api.participants.listParticipants, {
    eventId: eventId as Id<"events">,
  });

  if (event === undefined || participants === undefined) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Event not found.{" "}
        <Link href="/events" className="text-primary underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Link
          href="/events"
          className="mt-1 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Back to events"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-bold truncate">{event.name}</h1>
          {event.description && (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {event.description}
            </p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <EventStepper
          eventId={eventId}
          event={event}
          participantCount={participants.length}
        />
      </div>

      <div>{children}</div>
    </div>
  );
}

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EventCard } from "./EventCard";
import { CalendarPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

export function EventList() {
  const events = useQuery(api.events.listEvents);
  const deleteEvent = useMutation(api.events.deleteEvent);

  const handleDelete = async (eventId: Id<"events">) => {
    if (!confirm("Delete this event and all its data? This cannot be undone.")) return;
    try {
      await deleteEvent({ eventId });
      toast.success("Event deleted.");
    } catch {
      toast.error("Failed to delete event.");
    }
  };

  if (events === undefined) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <CalendarPlus className="size-12 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">No events yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first event to get started.
          </p>
        </div>
        <Link href="/events/new" className={buttonVariants()}>
          Create Event
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event._id} event={event} onDelete={handleDelete} />
      ))}
    </div>
  );
}

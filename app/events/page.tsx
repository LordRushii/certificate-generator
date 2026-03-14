"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EventList } from "@/components/events/EventList";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage certificate generation for your events.
          </p>
        </div>
        <Link href="/events/new" className={cn(buttonVariants(), "gap-1.5")}>
          <Plus className="size-4" />
          New Event
        </Link>
      </div>

      <EventList />
    </div>
  );
}

import Link from "next/link";
import { Users, FileText, Mail, ChevronRight, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

type EventStatus =
  | "draft"
  | "generating"
  | "generated"
  | "emailing"
  | "completed";

type Event = {
  _id: Id<"events">;
  name: string;
  description?: string;
  status: EventStatus;
  templateStorageId?: Id<"_storage">;
  participantCount?: number;
};

type EventCardProps = {
  event: Event;
  onDelete: (eventId: Id<"events">) => void;
};

const STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Draft",
  generating: "Generating...",
  generated: "Generated",
  emailing: "Sending Emails...",
  completed: "Completed",
};

const STATUS_COLORS: Record<EventStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  generating:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  generated:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  emailing:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{event.name}</CardTitle>
            {event.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {event.description}
              </CardDescription>
            )}
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[event.status]}`}
          >
            {STATUS_LABELS[event.status]}
          </span>
        </div>
      </CardHeader>

      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {event.participantCount !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {event.participantCount}
            </span>
          )}
          {event.templateStorageId && (
            <span className="flex items-center gap-1">
              <FileText className="size-3.5" />
              Template
            </span>
          )}
          {event.status === "completed" && (
            <span className="flex items-center gap-1">
              <Mail className="size-3.5" />
              Sent
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(event._id)}
            aria-label="Delete event"
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
          <Link
            href={`/events/${event._id}`}
            className={cn(buttonVariants({ size: "sm" }), "gap-1")}
          >
            Manage <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

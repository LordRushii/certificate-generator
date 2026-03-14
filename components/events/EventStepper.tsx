"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type EventStatus =
  | "draft"
  | "generating"
  | "generated"
  | "emailing"
  | "completed";

type Event = {
  status: EventStatus;
  templateStorageId?: string;
  namePosition?: unknown;
};

type Step = {
  label: string;
  href: string;
  isComplete: boolean;
};

type EventStepperProps = {
  eventId: string;
  event: Event;
  participantCount: number;
};

export function EventStepper({ eventId, event, participantCount }: EventStepperProps) {
  const pathname = usePathname();

  const steps: Step[] = [
    {
      label: "Participants",
      href: `/events/${eventId}/participants`,
      isComplete: participantCount > 0,
    },
    {
      label: "Template",
      href: `/events/${eventId}/template`,
      isComplete: !!event.templateStorageId && !!event.namePosition,
    },
    {
      label: "Generate",
      href: `/events/${eventId}/generate`,
      isComplete:
        event.status === "generated" ||
        event.status === "emailing" ||
        event.status === "completed",
    },
    {
      label: "Email",
      href: `/events/${eventId}/email`,
      isComplete: event.status === "completed",
    },
  ];

  return (
    <nav aria-label="Event steps">
      <ol className="flex items-center gap-0">
        {steps.map((step, index) => {
          const isActive = pathname.startsWith(step.href);
          return (
            <li key={step.href} className="flex items-center">
              <Link
                href={step.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : step.isComplete
                      ? "text-foreground hover:bg-muted"
                      : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    isActive
                      ? "border-primary-foreground/50 text-primary-foreground"
                      : step.isComplete
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                  )}
                >
                  {step.isComplete && !isActive ? (
                    <Check className="size-3" />
                  ) : (
                    index + 1
                  )}
                </span>
                {step.label}
              </Link>
              {index < steps.length - 1 && (
                <span className="mx-1 h-px w-6 bg-border" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

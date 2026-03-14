"use client";

import { use, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TemplateUploader } from "@/components/template/TemplateUploader";
import { NamePositioner, type NamePosition } from "@/components/template/NamePositioner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

const DEFAULT_POSITION: NamePosition = {
  x: 50,
  y: 60,
  fontSize: 36,
  fontColor: "#000000",
  font: "HelveticaBold",
};

type TemplatePageProps = {
  params: Promise<{ eventId: string }>;
};

export default function TemplatePage({ params }: TemplatePageProps) {
  const { eventId } = use(params);
  const event = useQuery(api.events.getEvent, {
    eventId: eventId as Id<"events">,
  });
  const updateEvent = useMutation(api.events.updateEvent);

  const [position, setPosition] = useState<NamePosition>(DEFAULT_POSITION);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event?.namePosition) {
      setPosition({
        x: event.namePosition.x,
        y: event.namePosition.y,
        fontSize: event.namePosition.fontSize,
        fontColor: event.namePosition.fontColor ?? "#000000",
        font: event.namePosition.font ?? "HelveticaBold",
      });
    }
  }, [event?._id]);

  if (event === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (event === null) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateEvent({
        eventId: eventId as Id<"events">,
        namePosition: position,
      });
      toast.success("Name position saved.");
    } catch {
      toast.error("Failed to save name position.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Certificate Template</CardTitle>
          <CardDescription>
            Upload a certificate template (PDF, PNG, or JPG). The template
            should contain everything except the participant name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateUploader
            eventId={eventId as Id<"events">}
            hasExisting={!!event.templateStorageId}
          />
        </CardContent>
      </Card>

      {event.templateStorageId && event.templateUrl && event.templateType && (
        <Card>
          <CardHeader>
            <CardTitle>Position Participant Name</CardTitle>
            <CardDescription>
              {event.templateType === "pdf"
                ? "Set the X/Y position for the participant name. Coordinates are percentages of the page size."
                : "Click on the template to position the name, or adjust the values manually."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NamePositioner
              templateUrl={event.templateUrl}
              templateType={event.templateType}
              position={position}
              onChange={setPosition}
            />
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Position"}
            </Button>
            {event.namePosition && (
              <Link
                href={`/events/${eventId}/generate`}
                className={cn(buttonVariants(), "gap-1.5")}
              >
                Next: Generate <ChevronRight className="size-4" />
              </Link>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

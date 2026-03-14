"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pencil, Trash2, Check, X, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

type Participant = {
  _id: Id<"participants">;
  name: string;
  email: string;
  emailStatus: "pending" | "sent" | "failed";
  certificateUrl: string | null;
};

const EMAIL_STATUS_STYLES = {
  pending: "bg-muted text-muted-foreground",
  sent: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

type ParticipantRowProps = {
  participant: Participant;
  index: number;
};

export function ParticipantRow({ participant, index }: ParticipantRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(participant.name);
  const updateName = useMutation(api.participants.updateParticipantName);
  const deleteParticipant = useMutation(api.participants.deleteParticipant);

  const handleSave = async () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      toast.error("Name cannot be empty.");
      return;
    }
    try {
      await updateName({ participantId: participant._id, name: trimmed });
      setIsEditing(false);
      toast.success("Name updated.");
    } catch {
      toast.error("Failed to update name.");
    }
  };

  const handleCancel = () => {
    setEditName(participant.name);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteParticipant({ participantId: participant._id });
    } catch {
      toast.error("Failed to delete participant.");
    }
  };

  return (
    <TableRow>
      <TableCell className="text-muted-foreground text-xs w-8">
        {index + 1}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="h-7 text-sm"
              autoFocus
            />
            <Button size="icon-xs" onClick={handleSave}>
              <Check className="size-3" />
            </Button>
            <Button size="icon-xs" variant="outline" onClick={handleCancel}>
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-1.5 text-left hover:text-foreground"
          >
            {participant.name}
            <Pencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">{participant.email}</TableCell>
      <TableCell>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${EMAIL_STATUS_STYLES[participant.emailStatus]}`}
        >
          {participant.emailStatus.charAt(0).toUpperCase() +
            participant.emailStatus.slice(1)}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {participant.certificateUrl && (
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
          )}
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={handleDelete}
            aria-label="Delete participant"
          >
            <Trash2 className="size-3 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

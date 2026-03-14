"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParticipantRow } from "./ParticipantRow";
import { Users } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

type Participant = {
  _id: Id<"participants">;
  name: string;
  email: string;
  emailStatus: "pending" | "sent" | "failed";
  certificateUrl: string | null;
};

type ParticipantTableProps = {
  participants: Participant[];
};

export function ParticipantTable({ participants }: ParticipantTableProps) {
  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Users className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No participants yet. Upload an Excel file to add them.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Email Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant, index) => (
            <ParticipantRow
              key={participant._id}
              participant={participant}
              index={index}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

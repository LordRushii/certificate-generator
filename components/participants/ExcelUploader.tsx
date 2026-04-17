"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { parseParticipantsExcel } from "@/lib/excel/parser";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

type ExcelUploaderProps = {
  eventId: Id<"events">;
};

export function ExcelUploader({ eventId }: ExcelUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [parseErrors, setParseErrors] = useState<
    { row: number; message: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upsertParticipants = useMutation(api.participants.upsertParticipants);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setParseErrors([]);
    try {
      const buffer = await file.arrayBuffer();
      const { valid, errors } = parseParticipantsExcel(buffer);

      if (valid.length === 0) {
        toast.error(
          "No valid participants found. Make sure your file has a column with participant names.",
        );
        setParseErrors(errors);
        return;
      }

      if (errors.length > 0) {
        setParseErrors(errors);
        toast.warning(`${errors.length} row(s) had errors and were skipped.`);
      }

      const participantsToInsert = valid.map((p) => ({
        name: p.name,
        email: p.email || "",
      }));

      await upsertParticipants({ eventId, participants: participantsToInsert });
      toast.success(`${valid.length} participants imported.`);
    } catch {
      toast.error(
        "Failed to read file. Make sure it is a valid Excel or CSV file.",
      );
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div
        className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">
            {isLoading ? "Importing..." : "Click to upload Excel or CSV"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Automatically detects <strong>Name</strong> and{" "}
            <strong>Email</strong> columns
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Browse File
        </Button>
      </div>

      {parseErrors.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
          <p className="text-xs font-medium text-destructive flex items-center gap-1">
            <AlertCircle className="size-3.5" />
            Rows with errors (skipped):
          </p>
          <ul className="text-xs text-destructive/80 space-y-0.5 pl-5 list-disc">
            {parseErrors.slice(0, 5).map((err) => (
              <li key={err.row}>
                Row {err.row}: {err.message}
              </li>
            ))}
            {parseErrors.length > 5 && (
              <li>...and {parseErrors.length - 5} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

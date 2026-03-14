import * as XLSX from "xlsx";
import { participantRowSchema } from "@/lib/validators/participant";
import type { ParticipantRow } from "@/lib/validators/participant";

export type ParseResult = {
  valid: ParticipantRow[];
  errors: { row: number; message: string }[];
};

export function parseParticipantsExcel(file: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(file, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  const valid: ParticipantRow[] = [];
  const errors: { row: number; message: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const normalized = {
      name: String(
        row["Name"] ?? row["name"] ?? row["NAME"] ?? ""
      ).trim(),
      email: String(
        row["Email"] ?? row["email"] ?? row["EMAIL"] ?? ""
      )
        .trim()
        .toLowerCase(),
    };

    const result = participantRowSchema.safeParse(normalized);
    if (result.success) {
      valid.push(result.data);
    } else {
      errors.push({
        row: i + 2,
        message: result.error.issues[0]?.message ?? "Invalid row",
      });
    }
  }

  return { valid, errors };
}

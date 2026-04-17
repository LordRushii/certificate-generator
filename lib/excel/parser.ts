import * as XLSX from "xlsx";
import { participantRowSchema } from "@/lib/validators/participant";
import type { ParticipantRow } from "@/lib/validators/participant";

export type ParseResult = {
  valid: ParticipantRow[];
  errors: { row: number; message: string }[];
};

/**
 * Find a column that matches the given keywords (case-insensitive, partial match)
 */
function findColumn(headers: string[], keywords: string[]): string | null {
  const lowerHeaders = headers.map((h) => h.toLowerCase());

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();

    // First try exact match
    const exactMatch = headers.find((h, i) => lowerHeaders[i] === lowerKeyword);
    if (exactMatch) return exactMatch;

    // Then try partial match (contains)
    const partialMatch = headers.find((h, i) =>
      lowerHeaders[i].includes(lowerKeyword),
    );
    if (partialMatch) return partialMatch;
  }

  return null;
}

export function parseParticipantsExcel(file: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(file, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  if (rows.length === 0) {
    return {
      valid: [],
      errors: [{ row: 0, message: "File is empty or has no data rows" }],
    };
  }

  // Get all column headers from the first row
  const headers = Object.keys(rows[0] || {});

  if (headers.length === 0) {
    return {
      valid: [],
      errors: [{ row: 0, message: "No columns found in the file" }],
    };
  }

  // Find name and email columns with flexible matching
  const nameColumn = findColumn(headers, [
    "name",
    "full name",
    "fullname",
    "participant name",
    "participant",
    "student name",
    "student",
    "attendee",
    "attendee name",
  ]);

  const emailColumn = findColumn(headers, [
    "email",
    "e-mail",
    "mail",
    "email address",
    "e-mail address",
    "participant email",
    "student email",
    "attendee email",
  ]);

  if (!nameColumn) {
    return {
      valid: [],
      errors: [
        {
          row: 0,
          message: `Could not find a 'Name' column. Available columns: ${headers.join(", ")}`,
        },
      ],
    };
  }

  const valid: ParticipantRow[] = [];
  const errors: { row: number; message: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Extract name from the identified column
    const nameValue = row[nameColumn];
    const name = String(nameValue ?? "").trim();

    // Extract email from the identified column (if it exists)
    let email: string | undefined = undefined;
    if (emailColumn) {
      const emailValue = row[emailColumn];
      const emailStr = String(emailValue ?? "")
        .trim()
        .toLowerCase();
      email = emailStr.length > 0 ? emailStr : undefined;
    }

    const normalized = {
      name,
      email,
    };

    const result = participantRowSchema.safeParse(normalized);
    if (result.success) {
      valid.push(result.data);
    } else {
      errors.push({
        row: i + 2, // +2 because Excel rows are 1-indexed and we skip header
        message: result.error.issues[0]?.message ?? "Invalid row",
      });
    }
  }

  return { valid, errors };
}

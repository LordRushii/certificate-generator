"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const generateCertificates = action({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.runQuery(api.events.getEvent, { eventId });
    if (!event) throw new Error("Event not found");
    if (!event.templateStorageId) throw new Error("No template uploaded");
    if (!event.namePosition) throw new Error("Name position not configured");

    const participants = await ctx.runQuery(api.participants.listParticipants, {
      eventId,
    });
    if (participants.length === 0) throw new Error("No participants found");

    await ctx.runMutation(api.events.updateEvent, {
      eventId,
      status: "generating",
    });

    try {
      const templateBlob = await ctx.storage.get(event.templateStorageId);
      if (!templateBlob) throw new Error("Template file not found in storage");

      const templateBuffer = await templateBlob.arrayBuffer();

      for (const participant of participants) {
        const pdfBytes = await buildCertificatePdf(
          templateBuffer,
          event.templateType ?? "pdf",
          participant.name,
          event.namePosition
        );

        const pdfBlob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
        const storageId = await ctx.storage.store(pdfBlob);

        await ctx.runMutation(api.participants.updateParticipantCertificate, {
          participantId: participant._id,
          certificateStorageId: storageId,
        });
      }

      await ctx.runMutation(api.events.updateEvent, {
        eventId,
        status: "generated",
      });
    } catch (error) {
      await ctx.runMutation(api.events.updateEvent, {
        eventId,
        status: "draft",
      });
      throw error;
    }
  },
});

const STANDARD_FONT_MAP: Record<string, StandardFonts> = {
  Helvetica: StandardFonts.Helvetica,
  HelveticaBold: StandardFonts.HelveticaBold,
  HelveticaOblique: StandardFonts.HelveticaOblique,
  HelveticaBoldOblique: StandardFonts.HelveticaBoldOblique,
  TimesRoman: StandardFonts.TimesRoman,
  TimesRomanBold: StandardFonts.TimesRomanBold,
  TimesRomanItalic: StandardFonts.TimesRomanItalic,
  TimesRomanBoldItalic: StandardFonts.TimesRomanBoldItalic,
  Courier: StandardFonts.Courier,
  CourierBold: StandardFonts.CourierBold,
  CourierOblique: StandardFonts.CourierOblique,
};

async function buildCertificatePdf(
  templateBuffer: ArrayBuffer,
  templateType: string,
  name: string,
  position: { x: number; y: number; fontSize: number; fontColor?: string; font?: string }
): Promise<Uint8Array> {
  let pdfDoc: PDFDocument;

  if (templateType === "pdf") {
    pdfDoc = await PDFDocument.load(templateBuffer);
  } else {
    pdfDoc = await PDFDocument.create();
    let image;
    if (templateType === "png") {
      image = await pdfDoc.embedPng(templateBuffer);
    } else {
      image = await pdfDoc.embedJpg(templateBuffer);
    }
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  const selectedFont =
    STANDARD_FONT_MAP[position.font ?? "HelveticaBold"] ??
    StandardFonts.HelveticaBold;
  const font = await pdfDoc.embedFont(selectedFont);

  let color = rgb(0, 0, 0);
  if (position.fontColor) {
    const hex = position.fontColor.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    color = rgb(r, g, b);
  }

  const textWidth = font.widthOfTextAtSize(name, position.fontSize);
  const pdfX = (position.x / 100) * width - textWidth / 2;
  const pdfY = (1 - position.y / 100) * height - position.fontSize / 2;

  page.drawText(name, {
    x: pdfX,
    y: pdfY,
    size: position.fontSize,
    font,
    color,
  });

  return pdfDoc.save();
}

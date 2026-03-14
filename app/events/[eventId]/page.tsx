import { redirect } from "next/navigation";

type EventPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { eventId } = await params;
  redirect(`/events/${eventId}/participants`);
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreateEventForm } from "@/components/events/CreateEventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Set up a new event to generate and send certificates to participants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateEventForm />
        </CardContent>
      </Card>
    </div>
  );
}

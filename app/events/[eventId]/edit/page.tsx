import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { EditEventForm } from "@/components/event/EditEventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await getAuthSession();

  if (!session.data?.user) {
    redirect("/login");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    notFound();
  }

  if (event.plannerId !== session.data.user.id) {
    redirect(`/events/${eventId}`);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Event</h1>
        <p className="text-sm text-muted-foreground">
          Update the details for your event.
        </p>
      </div>

      <EditEventForm
        eventId={event.id}
        defaultValues={{
          title: event.title,
          description: event.description ?? "",
          location: event.location ?? "",
          eventDate: event.date ? event.date.toISOString().split("T")[0] : "",
        }}
      />
    </div>
  );
}

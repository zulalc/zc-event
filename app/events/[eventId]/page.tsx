import { redirect } from "next/navigation";
import EventDetails from "@/components/event/EventDetails";
import { getAuthSession } from "@/lib/auth/server";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const session = await getAuthSession();

  if (!session.data?.user) {
    redirect("/sign-in");
  }

  return <EventDetails userId={session.data.user.id} eventId={eventId} />;
}

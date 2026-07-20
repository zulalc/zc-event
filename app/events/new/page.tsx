import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/server";
import { EventForm } from "@/components/EventForm";

export default async function NewEventPage() {
  const session = await getAuthSession();

  if (!session.data?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details for your new event.
        </p>
      </div>

      <EventForm />
    </div>
  );
}

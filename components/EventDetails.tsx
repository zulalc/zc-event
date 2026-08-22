import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { getEventById } from "@/lib/actions/events";
import { deleteEventAction } from "@/lib/actions/events";
import { MapPin, CalendarDays, Pencil, ArrowLeft } from "lucide-react";
import BreadCrumbs from "./BreadCrumbs";
import { InviteCard } from "./InviteCard";

type EventDetailsProps = {
  userId: string;
  eventId: string;
};

const STATUS_STYLES: Record<string, string> = {
  ACCEPTED: "bg-(--brand)/10 text-(--brand)",
  MAYBE: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300",
  PENDING: "border border-zinc-200 dark:border-zinc-800 text-zinc-500",
  DECLINED: "text-zinc-400",
};

const STATUS_LABEL: Record<string, string> = {
  ACCEPTED: "Going",
  MAYBE: "Maybe",
  PENDING: "Pending",
  DECLINED: "Declined",
};

export default async function EventDetails({
  userId,
  eventId,
}: EventDetailsProps) {
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const isPlanner = event.plannerId === userId;

  const formattedDate = event.date
    ? event.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const counts = { ACCEPTED: 0, DECLINED: 0, MAYBE: 0, PENDING: 0 };
  event.rsvps.forEach((r) => counts[r.status]++);

  const inviteUrl = event.invite?.token
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.invite.token}`
    : null;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <BreadCrumbs
        name={event.title}
        color={isPlanner ? "#4ade80" : "#facc15"}
      />

      <div className="flex items-start justify-between gap-4 mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {event.title}
        </h1>

        {isPlanner && (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/events/${event.id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Pencil className="size-3.5" />
              Edit
            </Link>
            <form action={deleteEventAction.bind(null, event.id)}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                Delete
              </Button>
            </form>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500 mb-8">
        {formattedDate && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {formattedDate}
          </span>
        )}
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {event.location}
          </span>
        )}
      </div>

      {event.description && (
        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap mb-8">
          {event.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-6">
        <span
          className={`text-xs font-medium rounded-full px-2.5 py-1 ${STATUS_STYLES.ACCEPTED}`}
        >
          {counts.ACCEPTED} going
        </span>
        <span
          className={`text-xs font-medium rounded-full px-2.5 py-1 ${STATUS_STYLES.MAYBE}`}
        >
          {counts.MAYBE} maybe
        </span>
        <span
          className={`text-xs font-medium rounded-full px-2.5 py-1 ${STATUS_STYLES.PENDING}`}
        >
          {counts.PENDING} pending
        </span>
        {counts.DECLINED > 0 && (
          <span
            className={`text-xs font-medium rounded-full px-2.5 py-1 ${STATUS_STYLES.DECLINED}`}
          >
            {counts.DECLINED} declined
          </span>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-500 mb-3">
          Guests · {event.rsvps.length}
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden"></div>
      </div>

      <InviteCard eventId={event.id} url={inviteUrl} />
    </div>
  );
}

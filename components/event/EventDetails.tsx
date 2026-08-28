import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { getEventById, getRsvpByEventId } from "@/lib/actions/events";
import { deleteEventAction } from "@/lib/actions/events";
import { MapPin, CalendarDays, Pencil, ArrowLeft } from "lucide-react";
import BreadCrumbs from "../BreadCrumbs";
import { InviteCard } from "../invite/InviteCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EventDetailsProps = {
  userId: string;
  eventId: string;
};

const STATUS_STYLES: Record<string, string> = {
  ACCEPTED: "bg-primary/10 text-primary",
  MAYBE: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300",
  PENDING: "border border-zinc-200 dark:border-zinc-800 text-zinc-500",
  DECLINED: "text-zinc-400",
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

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

  const attendees = await getRsvpByEventId(event.id);

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4">
      <BreadCrumbs
        name={event.title}
        color={isPlanner ? "#4ade80" : "#facc15"}
      />

      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 mt-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight wrap-break-word">
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
                className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
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
            <CalendarDays className="size-4 shrink-0" />
            {formattedDate}
          </span>
        )}
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            {event.location}
          </span>
        )}
      </div>

      {event.description && (
        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap mb-8 wrap-break-word">
          {event.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-6">
        <span
          className={`text-xs font-medium rounded-full px-2.5 py-1 ${STATUS_STYLES.ACCEPTED}`}
        >
          {counts.ACCEPTED} accepted
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

      <div className="mb-4">
        <InviteCard eventId={event.id} url={inviteUrl} />
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-500 mb-3">
          Attendees · {event.rsvps.length}
        </h2>

        {isPlanner &&
          (attendees.length > 0 ? (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell text-right">
                      Responded
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell className="max-w-36 sm:max-w-none">
                        <p className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {attendee.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate md:hidden">
                          {attendee.email}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:hidden">
                          {attendee.respondedAt
                            ? new Date(attendee.respondedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "No response"}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-zinc-500 dark:text-zinc-400">
                        {attendee.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-medium rounded-full px-2.5 py-1 whitespace-nowrap ${STATUS_STYLES[attendee.status]}`}
                        >
                          {capitalize(attendee.status)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {attendee.respondedAt
                          ? new Date(attendee.respondedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "No response"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 text-center">
              No attendees yet.
            </p>
          ))}
      </div>
    </div>
  );
}

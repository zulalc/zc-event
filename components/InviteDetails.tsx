import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, Check, MapPin } from "lucide-react";
import { RsvpForm } from "./RsvpForm";

export async function InviteDetails({
  token,
  submitted,
}: {
  token: string;
  submitted: boolean;
}) {
  const row = await prisma.eventInvite.findUnique({
    where: { token },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          location: true,
        },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const e = row.event;

  const event = {
    title: e.title,
    description: e.description,
    date: e.date
      ? e.date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,
    location: e.location,
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-(--brand)">
          You're invited
        </p>
        <CardTitle className="text-xl">{event.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-(--muted-foreground)">
          {event.date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{event.date}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-(--foreground)/80 leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="border-t border-(--border) pt-4">
          {submitted ? (
            <div className="flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm text-(--foreground)">
              <Check className="h-4 w-4 text-(--brand)" />
              You're on the list.
            </div>
          ) : (
            <RsvpForm token={token} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

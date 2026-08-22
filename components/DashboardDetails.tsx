import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function DashboardDetails({ userId }: { userId: string }) {
  const events = await prisma.event.findMany({
    where: { plannerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      date: true,
      location: true,
      rsvps: { select: { status: true } },
    },
  });

  const totals = { ACCEPTED: 0, DECLINED: 0, MAYBE: 0, PENDING: 0 };
  events.forEach((e) => e.rsvps.forEach((r) => totals[r.status]++));

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            {events.length} event{events.length !== 1 && "s"}
          </p>
        </div>

        <Button asChild>
          <Link href="/events/new">
            <Plus className="size-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Going" value={totals.ACCEPTED} />
        <StatCard label="Maybe" value={totals.MAYBE} />
        <StatCard label="Declined" value={totals.DECLINED} />
        <StatCard label="Pending" value={totals.PENDING} />
      </div>

      {/* Event list */}
      {events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-zinc-500">
            No events yet. Create your first one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const counts = { ACCEPTED: 0, DECLINED: 0, MAYBE: 0, PENDING: 0 };
            event.rsvps.forEach((r) => counts[r.status]++);

            return (
              <Link href={`/events/${event.id}`} key={event.id}>
                <Card
                  key={event.id}
                  className="border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-zinc-900 dark:text-zinc-50">
                      {event.title}
                    </CardTitle>
                    <div className="flex flex-col gap-1 text-xs text-zinc-500 mt-1">
                      {event.date && (
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          {event.date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="secondary"
                      className="bg-(--brand)/10 text-(--brand) hover:bg-(--brand)/10"
                    >
                      {counts.ACCEPTED} going
                    </Badge>
                    <Badge variant="secondary">{counts.MAYBE} maybe</Badge>
                    <Badge variant="outline">{counts.PENDING} pending</Badge>
                    {counts.DECLINED > 0 && (
                      <Badge variant="outline" className="text-zinc-400">
                        {counts.DECLINED} declined
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-1">
        {value}
      </p>
    </div>
  );
}

"use server";

import { redirect } from "next/navigation";
import { getAuthSession } from "../auth/server";
import { prisma } from "../prisma";
import { eventSchema } from "../schemas/event";
import { revalidatePath } from "next/cache";
import { parseRsvp } from "../schemas/invites";
import { RsvpStatus } from "@/app/generated/prisma/enums";

const statusMap = {
  pending: RsvpStatus.PENDING,
  accepted: RsvpStatus.ACCEPTED,
  maybe: RsvpStatus.MAYBE,
  declined: RsvpStatus.DECLINED,
} as const;

export async function createEventAction(formData: FormData) {
  const session = await getAuthSession();
  const userId = session.data!.user.id;

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    eventDate: formData.get("eventDate"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { title, description, location, eventDate } = parsed.data;

  const event = await prisma.event.create({
    data: {
      plannerId: userId,
      title,
      description: description || null,
      location: location || null,
      date: new Date(eventDate),
    },
  });

  redirect(`/events/${event.id}`);
}

export async function getEventById(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      invite: { select: { token: true } },
      rsvps: { select: { status: true } },
    },
  });

  return event;
}

export async function deleteEventAction(eventId: string) {
  const session = await getAuthSession();
  const userId = session.data!.user.id;

  await prisma.event.deleteMany({
    where: { id: eventId, plannerId: userId },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createInviteLinkAction(
  eventId: string,
  _prevState: unknown,
  _formData: FormData,
) {
  try {
    const session = await getAuthSession();
    if (!session.data?.user) {
      return { error: "Not authenticated." };
    }
    const userId = session.data.user.id;

    const planner = await prisma.event.findUnique({
      where: { id: eventId, plannerId: userId },
      select: { id: true },
    });

    if (!planner) {
      return {
        error:
          "You are not authorized to create an invite link for this event.",
      };
    }

    const token = crypto.randomUUID().replace(/-/g, "");

    await prisma.eventInvite.upsert({
      where: { eventId },
      update: { token },
      create: { eventId, token },
    });

    revalidatePath(`/events/${eventId}`);

    return { error: null, success: true };
  } catch (err) {
    return { error: "Something went wrong generating the link." };
  }
}

export async function submitOrUpdateRsvpForToken(
  token: string,
  formData: FormData,
) {
  const parsed = parseRsvp(formData);

  if (!parsed.success) {
    return { error: "Invalid form data." };
  }

  const input = parsed.data;

  const invite = await prisma.eventInvite.findFirst({
    where: { token },
    select: {
      id: true,
      event: { select: { id: true } },
    },
  });

  if (!invite) {
    return { error: "Invite link is invalid." };
  }

  const eventId = invite.event.id;
  const emailNormalized = input.email.toLowerCase();

  await prisma.eventRsvp.upsert({
    where: {
      eventId_emailNormalized: { eventId, emailNormalized },
    },
    create: {
      eventId,
      inviteId: invite.id,
      name: input.name,
      email: input.email,
      emailNormalized,
      status: statusMap[input.status],
    },
    update: {
      name: input.name,
      status: statusMap[input.status],
      respondedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  redirect(`/invite/${token}?submitted=1`);
}

export async function getRsvpByEventId(eventId: string) {
  const rsvps = await prisma.eventRsvp.findMany({
    where: { eventId },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      respondedAt: true,
    },
  });

  return rsvps;
}

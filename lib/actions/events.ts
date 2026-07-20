"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthSession } from "../auth/server";
import { prisma } from "../prisma";
import { eventSchema } from "../schemas/event";

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

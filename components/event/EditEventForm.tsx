"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editEventAction } from "@/lib/actions/events";
import { eventSchema } from "@/lib/schemas/event";
import Link from "next/link";

type FormValues = z.infer<typeof eventSchema>;

export function EditEventForm({
  eventId,
  defaultValues,
}: {
  eventId: string;
  defaultValues: FormValues;
}) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("description", values.description ?? "");
      formData.set("location", values.location ?? "");
      formData.set("eventDate", values.eventDate ?? "");

      const result = await editEventAction(eventId, formData);

      if (result?.error) {
        form.setError("root", { message: result.error });
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Event title"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="eventDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Date</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="date"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Location</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Optional"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Optional"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Link
            href={`/events/${eventId}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}

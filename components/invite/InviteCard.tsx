"use client";
import { useActionState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { createInviteLinkAction } from "@/lib/actions/events";
import { Copy } from "lucide-react";

export function InviteCard({
  eventId,
  url,
}: {
  eventId: string;
  url: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    createInviteLinkAction.bind(null, eventId),
    null,
  );
  return (
    <Card>
      <CardHeader>Invite Link</CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-(--muted-foreground)">
          Share this link with others to invite them without creating an
          account.
        </p>

        {url ? (
          <div className="flex items-center gap-2 rounded-md border border-(--border) bg-surface px-3 py-2">
            <code className="flex-1 truncate text-sm text-(--foreground)">
              {url}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-(--muted-foreground) hover:text-(--foreground)"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3 rounded-md border border-dashed border-(--border) px-3 py-3">
            <p className="text-sm text-(--muted-foreground)">
              No invite link generated yet.
            </p>
            <form action={formAction}>
              <Button type="submit" disabled={isPending} size="sm">
                {isPending ? "Generating..." : "Generate Link"}
              </Button>
            </form>
          </div>
        )}

        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
      </CardContent>
    </Card>
  );
}

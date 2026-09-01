"use client";

import * as React from "react";
import { Link2, Copy, Check, ArrowRight, ArrowUpRight } from "lucide-react";

const GUESTS = [
  { name: "Matilda", status: "going" as const },
  { name: "Eleanor", status: "going" as const },
  { name: "Luke", status: "maybe" as const },
  { name: "Peter", status: "pending" as const },
];

const STATUS_STYLES: Record<string, string> = {
  going: "bg-primary/10 text-primary",
  maybe: "bg-muted text-foreground/70",
  pending: "border border-border text-muted-foreground",
  declined: "text-muted-foreground/60",
};

const STATUS_LABEL: Record<string, string> = {
  going: "Going",
  maybe: "Maybe",
  pending: "Pending",
  declined: "Declined",
};

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setValue(target);
      return;
    }
    let start: number | null = null;
    let frame: number;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return value;
}

function InviteLinkCard() {
  const [copied, setCopied] = React.useState(false);
  const going = useCountUp(14);
  const maybe = useCountUp(3);
  const declined = useCountUp(2);
  const inviteLink = "zc-event/events/rooftop-summer-party";

  function handleCopy() {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 basis-full sm:basis-0">
          <Link2 className="size-4 text-primary shrink-0" />
          <span className="font-mono text-sm text-foreground/90 truncate">
            zc-event/events/rooftop-summer-party
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {copied ? (
            <>
              <Check className="size-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Copy
            </>
          )}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-primary/10 py-3">
          <div className="text-xl font-semibold text-primary tabular-nums">
            {going}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            accepted
          </div>
        </div>
        <div className="rounded-xl bg-muted py-3">
          <div className="text-xl font-semibold text-foreground/80 tabular-nums">
            {maybe}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">maybe</div>
        </div>
        <div className="rounded-xl border border-border py-3">
          <div className="text-xl font-semibold text-muted-foreground tabular-nums">
            {declined}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            can't go
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,500&display=swap');
        .accent-serif { font-family: 'Fraunces', serif; font-style: italic; }
      `}</style>

      <header className="max-w-6xl mx-auto px-6 pt-10 pb-24 grid md:grid-cols-2 gap-14 items-center">
        <div className="min-w-0">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08]">
            Send <span className="accent-serif text-primary">one link.</span>
            <br />
            Watch who's in.
          </h1>
          <p className="mt-5 text-muted-foreground text-base leading-relaxed max-w-md">
            Create an event, share a single invite link, and see RSVPs land in
            real time. Your guests don't need an account — just the link.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/events/new"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Create an event <ArrowRight className="size-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>
        <div className="min-w-0">
          <InviteLinkCard />
        </div>
      </header>

      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-border"
      >
        <h2 className="text-sm font-medium text-muted-foreground mb-10">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              n: "01",
              title: "Create",
              body: "Set the date, time, and location. Takes about a minute.",
            },
            {
              n: "02",
              title: "Share",
              body: "Send the link by text, email, or anywhere else — it just works.",
            },
            {
              n: "03",
              title: "Track",
              body: "Watch RSVPs roll in live. No spreadsheets, no chasing replies.",
            },
          ].map((step) => (
            <div key={step.n}>
              <span className="font-mono text-xs text-primary">{step.n}</span>
              <h3 className="text-lg font-medium mt-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Every reply,{" "}
              <span className="accent-serif text-primary">in one place.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-sm">
              No more piecing together replies from three group chats. Every
              guest who opens your link shows up here, with their status updated
              the moment they answer.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {GUESTS.map((guest) => (
              <div
                key={guest.name}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-medium text-foreground/80">
                    {guest.name[0]}
                  </div>
                  <span className="text-sm">{guest.name}</span>
                </div>
                <span
                  className={`text-xs font-medium rounded-full px-2.5 py-1 ${STATUS_STYLES[guest.status]}`}
                >
                  {STATUS_LABEL[guest.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Your next event is{" "}
            <span className="accent-serif text-primary">one link away.</span>
          </h2>
          <a
            href="/events/new"
            className="mt-7 inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create an event <ArrowUpRight className="size-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-(--card)">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1.5px, transparent 1.5px)",
          backgroundSize: "10px 100%",
          backgroundRepeat: "repeat-x",
        }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white font-semibold tracking-wide"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          ZC-EVENT
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-(--muted-foreground) transition-colors hover:text-(--foreground)"
          >
            Dashboard
          </Link>
          <a
            href="mailto:hello@zc-event.app"
            className="text-sm text-(--muted-foreground) transition-colors hover:text-(--foreground)"
          >
            Contact
          </a>
        </nav>

        <span className="text-xs text-(--muted-foreground)">
          © {new Date().getFullYear()} ZC-EVENT
        </span>
      </div>
    </footer>
  );
}

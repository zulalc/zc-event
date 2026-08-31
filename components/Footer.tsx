import Image from "next/image";
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
          className="flex items-center gap-2 text-sm font-semibold tracking-wide text-(--foreground)"
        >
          <Image
            src="/icon.svg"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4"
          />
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
            href="mailto:zulalc.swe@gmail.com"
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

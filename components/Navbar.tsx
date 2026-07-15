import { UserButton } from "@neondatabase/auth/react";
import Link from "next/link";

function Navbar() {
  return (
    <header className="relative bg-(--card)">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-wide"
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
          <UserButton size="icon" />
        </nav>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1.5px, transparent 1.5px)",
          backgroundSize: "10px 100%",
          backgroundRepeat: "repeat-x",
        }}
      />
    </header>
  );
}

export default Navbar;

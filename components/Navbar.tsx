import { UserButton } from "@neondatabase/auth/react";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <header className="relative bg-(--card)">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-(--foreground) font-semibold tracking-wide"
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
          <UserButton size="icon" className="cursor-pointer" />
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

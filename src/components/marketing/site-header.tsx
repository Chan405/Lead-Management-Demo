"use client";

import { useState } from "react";
import Link from "next/link";
import { DASHBOARD_HREF } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { IconClose, IconMenu } from "@/components/ui/icons";
import { primaryButtonClass } from "@/components/ui/styles";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={close}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent font-display text-lg text-accent-foreground">
            L
          </span>
          <span className="truncate font-display text-lg tracking-tight">LeadFlow</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Overview">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              {link.label}
            </a>
          ))}
          <Link href={DASHBOARD_HREF} className={cn(primaryButtonClass, "ml-2")}>
            View Demo
          </Link>
        </nav>

        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-foreground hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 lg:hidden"
          aria-expanded={open}
          aria-controls="overview-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open ? (
        <nav id="overview-menu" className="border-t border-line px-5 py-4 lg:hidden" aria-label="Overview">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-black/[0.04]"
                  onClick={close}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link href={DASHBOARD_HREF} className={cn(primaryButtonClass, "w-full")} onClick={close}>
                View Demo
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

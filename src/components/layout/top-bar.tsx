"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { DEMO_TODAY, WORKSPACE } from "@/lib/demo";
import { formatDate, formatWeekdayDate } from "@/lib/format";
import { isFollowUpToday } from "@/lib/leads";
import { useLeads } from "@/components/leads/leads-context";
import { IconBell, IconMenu, IconSearch } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";

export function TopBar({
  title,
  onMenu,
  notificationsOpen,
  onToggleNotifications,
  onCloseNotifications,
}: {
  title: string;
  onMenu: () => void;
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
  onCloseNotifications: () => void;
}) {
  const { search, setSearch, leads, openLead } = useLeads();
  const panelRef = useRef<HTMLDivElement>(null);
  const dueToday = leads
    .filter((lead) => isFollowUpToday(lead))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

  useEffect(() => {
    if (!notificationsOpen) return;

    function onPointer(event: MouseEvent) {
      if (!(event.target instanceof Node)) return;
      if (!panelRef.current?.contains(event.target)) onCloseNotifications();
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseNotifications();
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [notificationsOpen, onCloseNotifications]);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-lg p-2 text-foreground hover:bg-black/[0.04] lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <IconMenu className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight sm:flex-none sm:text-lg">
          {title}
        </h1>
        <div className="order-last w-full sm:order-none sm:w-auto sm:min-w-0 sm:flex-1">
          <label className="relative mx-auto block sm:max-w-md">
            <span className="sr-only">Search leads</span>
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, company, email, or phone"
              className="h-10 w-full rounded-lg border border-line bg-white pr-3 pl-9 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </label>
        </div>
        <p className="hidden text-sm text-muted lg:block">{formatDate(DEMO_TODAY)}</p>
        <div className="relative" ref={panelRef}>
          <button
            type="button"
            className="relative rounded-lg p-2 text-foreground hover:bg-black/[0.04]"
            aria-label={
              dueToday.length > 0
                ? `Notifications, ${dueToday.length} follow-ups today`
                : "Notifications"
            }
            aria-expanded={notificationsOpen}
            onClick={onToggleNotifications}
          >
            <IconBell className="h-5 w-5" />
            {dueToday.length > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                {dueToday.length}
              </span>
            ) : null}
          </button>
          {notificationsOpen ? (
            <div className="absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-line bg-card shadow-lg">
              <div className="border-b border-line px-4 py-3">
                <p className="text-sm font-medium">Follow-ups today</p>
                <p className="text-xs text-muted">{formatWeekdayDate(DEMO_TODAY)}</p>
              </div>
              {dueToday.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted">Nothing is scheduled for today.</p>
              ) : (
                <ul>
                  {dueToday.slice(0, 5).map((lead) => (
                    <li key={lead.id} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-black/[0.03]"
                        onClick={() => {
                          openLead(lead.id);
                          onCloseNotifications();
                        }}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{lead.name}</span>
                          <span className="block truncate text-xs text-muted">{lead.company}</span>
                        </span>
                        <StatusBadge status={lead.status} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/leads?due=today"
                className="block border-t border-line px-4 py-3 text-sm font-medium text-accent hover:bg-black/[0.02]"
                onClick={onCloseNotifications}
              >
                View all follow-ups
              </Link>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
            {WORKSPACE.initials}
          </span>
          <span className="hidden leading-tight md:block">
            <span className="block text-sm font-medium">{WORKSPACE.owner}</span>
            <span className="block text-xs text-muted">{WORKSPACE.role}</span>
          </span>
        </div>
      </div>
    </header>
  );
}

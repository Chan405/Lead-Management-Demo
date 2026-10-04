"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORKSPACE } from "@/lib/demo";
import { DASHBOARD_HREF, NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import {
  IconCustomers,
  IconDashboard,
  IconLeads,
  IconReports,
  IconSettings,
} from "@/components/ui/icons";

const ICONS = {
  "/dashboard": IconDashboard,
  "/leads": IconLeads,
  "/customers": IconCustomers,
  "/reports": IconReports,
  "/settings": IconSettings,
} as const;

export function Sidebar({
  mobileOpen,
  onNavigate,
}: {
  mobileOpen: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-line bg-surface",
        mobileOpen ? "flex" : "hidden lg:flex",
      )}
    >
      <div className="px-5 py-5">
        <Link href={DASHBOARD_HREF} className="flex items-center gap-3" onClick={onNavigate}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-lg text-accent-foreground">
            L
          </span>
          <span>
            <span className="block font-display text-lg leading-none tracking-tight">
              {WORKSPACE.product}
            </span>
            <span className="mt-1 block text-xs text-muted">{WORKSPACE.company}</span>
          </span>
        </Link>
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
        >
          Back to overview
        </Link>
      </div>

      <nav className="flex-1 px-3" aria-label="Primary">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.href];
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-foreground/80 hover:bg-black/[0.04] hover:text-foreground",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-5 py-4">
        <p className="text-sm font-medium">{WORKSPACE.owner}</p>
        <p className="text-xs text-muted">{WORKSPACE.role}</p>
      </div>
    </aside>
  );
}

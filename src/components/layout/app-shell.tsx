"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { pageTitle } from "@/lib/navigation";
import { AddLeadModal } from "@/components/leads/add-lead-modal";
import { LeadDrawer } from "@/components/leads/lead-drawer";
import { useLeads } from "@/components/leads/leads-context";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { notice, dismissNotice, addOpen, selectedId } = useLeads();
  const [navOpen, setNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!navOpen && !addOpen && !selectedId) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [addOpen, navOpen, selectedId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      {navOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-stone-900/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
      <Sidebar mobileOpen={navOpen} onNavigate={() => setNavOpen(false)} />
      <div className="min-w-0 lg:pl-64">
        <TopBar
          title={pageTitle(pathname)}
          onMenu={() => setNavOpen(true)}
          notificationsOpen={notificationsOpen}
          onToggleNotifications={() => setNotificationsOpen((open) => !open)}
          onCloseNotifications={() => setNotificationsOpen(false)}
        />
        <main id="main" tabIndex={-1} className="px-4 py-6 sm:px-6 lg:px-8">
          {notice ? (
            <div
              role="status"
              className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-accent/15 bg-accent-soft px-4 py-3 text-sm text-accent"
            >
              <p>{notice}</p>
              <button type="button" className="font-medium" onClick={dismissNotice}>
                Dismiss
              </button>
            </div>
          ) : null}
          {children}
        </main>
      </div>
      <LeadDrawer />
      <AddLeadModal />
    </div>
  );
}

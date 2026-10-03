"use client";

import Link from "next/link";
import { DEMO_TODAY, WORKSPACE } from "@/lib/demo";
import { formatCurrency, formatPercent, formatWeekdayDate } from "@/lib/format";
import { dashboardMetrics, isFollowUpToday, leadMatchesQuery, recentLeads } from "@/lib/leads";
import { cn } from "@/lib/cn";
import { useLeads } from "@/components/leads/leads-context";
import { FollowUpDate } from "@/components/leads/follow-up-date";
import { StatCard } from "@/components/dashboard/stat-card";
import { IconPlus } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { cardClass, primaryButtonClass } from "@/components/ui/styles";

export function DashboardView() {
  const { leads, search, openLead, openAddLead } = useLeads();
  const metrics = dashboardMetrics(leads);
  const query = search.trim();
  const matchCount = query ? leads.filter((lead) => leadMatchesQuery(lead, query)).length : null;
  const latest = recentLeads(leads, search, 8);
  const dueToday = leads
    .filter((lead) => isFollowUpToday(lead))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="font-display text-2xl leading-tight text-foreground sm:text-[1.75rem]">
            Keep your leads, follow-ups, and customer information in one place.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {WORKSPACE.company} tracks every inquiry from Facebook, Instagram, WhatsApp, referrals,
            and the website — who owns it, when to follow up, and what the work is worth.
          </p>
        </div>
        <button type="button" className={cn(primaryButtonClass, "w-full sm:w-auto")} onClick={openAddLead}>
          <IconPlus className="h-4 w-4" />
          Add lead
        </button>
      </header>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Total leads"
          value={String(metrics.total)}
          detail="All statuses, every channel"
          href="/leads"
        />
        <StatCard
          label="New leads"
          value={String(metrics.newLeads)}
          detail="Waiting for a first reply"
          href="/leads?status=New"
        />
        <StatCard
          label="Contacted"
          value={String(metrics.contacted)}
          detail="A conversation is open"
          href="/leads?status=Contacted"
        />
        <StatCard
          label="Won"
          value={String(metrics.won)}
          detail="Closed and counted"
          href="/leads?status=Won"
        />
      </section>

      {metrics.other > 0 ? (
        <p className="-mt-2 text-sm text-muted">
          {metrics.other} more {metrics.other === 1 ? "is" : "are"} qualified, in proposal, or lost.{" "}
          <Link href="/leads" className="font-medium text-accent hover:underline">
            See every lead
          </Link>
        </p>
      ) : null}

      <section className={cn(cardClass, "grid sm:grid-cols-3")}>
        <MetricLink
          href="/leads?status=Won"
          label="Conversion rate"
          value={formatPercent(metrics.conversion)}
          detail="Won leads divided by total leads"
        />
        <MetricLink
          href="/leads?due=today"
          label="Follow-ups today"
          value={String(metrics.followUpsToday)}
          detail={formatWeekdayDate(DEMO_TODAY)}
          bordered
        />
        <MetricLink
          href="/leads?status=Won"
          label="Revenue from won leads"
          value={formatCurrency(metrics.revenue)}
          detail="Estimated value of won work"
          emphasize
          bordered
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className={cn(cardClass, "order-2 min-w-0 xl:order-1")}>
          <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-base font-semibold">{query ? "Matching leads" : "Recent leads"}</h2>
              <p className="mt-1 text-sm text-muted">
                {matchCount === null
                  ? "Latest inquiries across every channel"
                  : `Showing ${latest.length} of ${matchCount} ${matchCount === 1 ? "match" : "matches"}`}
              </p>
            </div>
            <Link href="/leads" className="shrink-0 text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          {latest.length === 0 ? (
            <p className="px-5 py-12 text-sm text-muted">No leads match that search.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">Recent leads</caption>
                <thead>
                  <tr className="text-xs font-medium text-muted">
                    <th className="px-4 py-3 font-medium sm:px-5">Name</th>
                    <th className="hidden px-3 py-3 font-medium sm:table-cell">Company</th>
                    <th className="hidden px-3 py-3 font-medium md:table-cell">Source</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="hidden px-3 py-3 font-medium lg:table-cell">Assigned to</th>
                    <th className="px-3 py-3 font-medium">Follow-up</th>
                    <th className="px-4 py-3 text-right font-medium sm:px-5">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {latest.map((lead) => (
                    <tr
                      key={lead.id}
                      className="cursor-pointer border-t border-line hover:bg-black/[0.025]"
                      onClick={() => openLead(lead.id)}
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <button
                          type="button"
                          className="text-left text-sm font-medium hover:underline"
                          onClick={() => openLead(lead.id)}
                        >
                          {lead.name}
                        </button>
                      </td>
                      <td className="hidden px-3 py-3 text-sm text-muted sm:table-cell">{lead.company}</td>
                      <td className="hidden px-3 py-3 text-sm md:table-cell">{lead.source}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="hidden px-3 py-3 text-sm lg:table-cell">{lead.assignedTo}</td>
                      <td className="px-3 py-3 text-sm">
                        <FollowUpDate lead={lead} />
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium tabular-nums sm:px-5">
                        {formatCurrency(lead.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={cn(cardClass, "order-1 xl:order-2")}>
          <div className="border-b border-line px-4 py-4 sm:px-5">
            <h2 className="text-base font-semibold">Follow-ups today</h2>
            <p className="mt-1 text-sm text-muted">{formatWeekdayDate(DEMO_TODAY)}</p>
          </div>
          {dueToday.length === 0 ? (
            <p className="px-5 py-8 text-sm leading-6 text-muted">
              Nothing is scheduled for today. A lead shows up here when its follow-up date is today
              and it is still open.
            </p>
          ) : (
            <ul>
              {dueToday.map((lead) => (
                <li key={lead.id} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-black/[0.03] sm:px-5"
                    onClick={() => openLead(lead.id)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{lead.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {lead.company} · {lead.assignedTo}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <StatusBadge status={lead.status} />
                      <span className="mt-1 block text-xs text-muted tabular-nums">
                        {formatCurrency(lead.value)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function MetricLink({
  href,
  label,
  value,
  detail,
  emphasize = false,
  bordered = false,
}: {
  href: string;
  label: string;
  value: string;
  detail: string;
  emphasize?: boolean;
  bordered?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block px-5 py-4 transition hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/30",
        bordered && "border-t border-line sm:border-t-0 sm:border-l",
      )}
    >
      <p className="text-sm text-muted">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums",
          emphasize ? "text-accent" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </Link>
  );
}

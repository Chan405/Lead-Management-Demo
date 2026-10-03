"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, displayText } from "@/lib/format";
import {
  filterLeads,
  sortLeads,
  type DueFilter,
  type LeadSort,
} from "@/lib/leads";
import { cn } from "@/lib/cn";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  isLeadSource,
  isLeadStatus,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "@/lib/types";
import { useLeads } from "@/components/leads/leads-context";
import { FollowUpDate } from "@/components/leads/follow-up-date";
import { IconPlus } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { cardClass, controlClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/styles";

const PAGE_SIZE = 10;

const SORT_OPTIONS: Array<{ value: LeadSort; label: string }> = [
  { value: "recent", label: "Newest" },
  { value: "followUpAsc", label: "Follow-up date (soonest)" },
  { value: "followUpDesc", label: "Follow-up date (latest)" },
  { value: "valueDesc", label: "Value (high to low)" },
  { value: "valueAsc", label: "Value (low to high)" },
];

function isLeadSort(value: string): value is LeadSort {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function resultSummary(
  count: number,
  status: LeadStatus | "all",
  source: LeadSource | "all",
  due: DueFilter,
  query: string,
): string {
  const parts = [`${count} ${count === 1 ? "lead" : "leads"}`];
  if (status !== "all") parts.push(status);
  if (source !== "all") parts.push(source);
  if (due === "today") parts.push("due today");
  if (query.trim()) parts.push(`matching “${query.trim()}”`);
  return parts.join(" · ");
}

function parseStatus(value: string): LeadStatus | "all" {
  return isLeadStatus(value) ? value : "all";
}

function parseSource(value: string): LeadSource | "all" {
  return isLeadSource(value) ? value : "all";
}

function parseDue(value: string): DueFilter {
  return value === "today" ? "today" : "any";
}

export function LeadsView({
  initialStatus,
  initialSource,
  initialDue,
}: {
  initialStatus: string;
  initialSource: string;
  initialDue: string;
}) {
  const router = useRouter();
  const { leads, search, setSearch, openLead, openAddLead, selectedId } = useLeads();
  const [sort, setSort] = useState<LeadSort>("recent");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LeadStatus | "all">(parseStatus(initialStatus));
  const [source, setSource] = useState<LeadSource | "all">(parseSource(initialSource));
  const [due, setDue] = useState<DueFilter>(parseDue(initialDue));

  const incomingFilters = `${initialStatus}|${initialSource}|${initialDue}`;
  const [appliedFilters, setAppliedFilters] = useState(incomingFilters);
  if (appliedFilters !== incomingFilters) {
    setAppliedFilters(incomingFilters);
    setStatus(parseStatus(initialStatus));
    setSource(parseSource(initialSource));
    setDue(parseDue(initialDue));
  }

  const [seenLeadCount, setSeenLeadCount] = useState(leads.length);
  if (leads.length !== seenLeadCount) {
    setSeenLeadCount(leads.length);
    setStatus("all");
    setSource("all");
    setDue("any");
  }

  const filterKey = `${search}|${status}|${source}|${due}|${sort}|${leads.length}`;
  const [trackedKey, setTrackedKey] = useState(filterKey);
  if (trackedKey !== filterKey) {
    setTrackedKey(filterKey);
    setPage(1);
  }

  const filtered = useMemo(
    () => sortLeads(filterLeads(leads, { query: search, status, source, due }), sort),
    [due, leads, search, sort, source, status],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (trackedKey === filterKey && page > pageCount) {
    setPage(pageCount);
  }
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const hasFilters = status !== "all" || source !== "all" || due === "today" || search.trim().length > 0;

  function replaceFilters(next: {
    status?: LeadStatus | "all";
    source?: LeadSource | "all";
    due?: DueFilter;
  }) {
    const nextStatus = next.status ?? status;
    const nextSource = next.source ?? source;
    const nextDue = next.due ?? due;
    if (next.status !== undefined) setStatus(next.status);
    if (next.source !== undefined) setSource(next.source);
    if (next.due !== undefined) setDue(next.due);

    const params = new URLSearchParams();
    if (nextStatus !== "all") params.set("status", nextStatus);
    if (nextSource !== "all") params.set("source", nextSource);
    if (nextDue === "today") params.set("due", "today");
    const query = params.toString();
    router.replace(query ? `/leads?${query}` : "/leads", { scroll: false });
  }

  function clearFilters() {
    setSearch("");
    setSort("recent");
    setStatus("all");
    setSource("all");
    setDue("any");
    router.replace("/leads", { scroll: false });
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Facebook, Instagram, WhatsApp, the website, and referrals — one list, with an owner and a
          next follow-up on every row.
        </p>
        <button type="button" className={cn(primaryButtonClass, "w-full sm:w-auto")} onClick={openAddLead}>
          <IconPlus className="h-4 w-4" />
          Add lead
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label>
          <span className={labelClass}>Status</span>
          <select
            className={controlClass}
            value={status}
            onChange={(event) => {
              replaceFilters({ status: parseStatus(event.target.value) });
            }}
          >
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Source</span>
          <select
            className={controlClass}
            value={source}
            onChange={(event) => {
              replaceFilters({ source: parseSource(event.target.value) });
            }}
          >
            <option value="all">All sources</option>
            {LEAD_SOURCES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Follow-up</span>
          <select
            className={controlClass}
            value={due}
            onChange={(event) => {
              replaceFilters({ due: parseDue(event.target.value) });
            }}
          >
            <option value="any">Any date</option>
            <option value="today">Due today</option>
          </select>
        </label>
        <label>
          <span className={labelClass}>Sort</span>
          <select
            className={controlClass}
            value={sort}
            onChange={(event) => {
              const next = event.target.value;
              if (isLeadSort(next)) setSort(next);
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {resultSummary(filtered.length, status, source, due, search)}
        </p>
        {hasFilters ? (
          <button type="button" className="text-sm font-medium text-accent hover:underline" onClick={clearFilters}>
            Clear filters
          </button>
        ) : null}
      </div>

      <section className={cn(cardClass, "min-w-0")}>
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium">No leads match this view</p>
            <p className="mt-1 text-sm text-muted">Try another status, source, or search.</p>
            {hasFilters ? (
              <button type="button" className={cn(secondaryButtonClass, "mt-4")} onClick={clearFilters}>
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="divide-y divide-line md:hidden">
              {rows.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  selected={selectedId === lead.id}
                  onOpen={() => openLead(lead.id)}
                />
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[960px] border-collapse text-left">
                <caption className="sr-only">Leads</caption>
                <thead>
                  <tr className="text-xs font-medium text-muted">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Company</th>
                    <th className="px-3 py-3 font-medium">Email</th>
                    <th className="px-3 py-3 font-medium">Phone</th>
                    <th className="px-3 py-3 font-medium">Source</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Assigned to</th>
                    <th className="px-3 py-3 font-medium">Follow-up date</th>
                    <th className="px-3 py-3 text-right font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((lead) => (
                    <tr
                      key={lead.id}
                      className={cn(
                        "cursor-pointer border-t border-line hover:bg-black/[0.025]",
                        selectedId === lead.id && "bg-accent-soft",
                      )}
                      onClick={() => openLead(lead.id)}
                    >
                      <td className="px-4 py-3 text-sm font-medium">{lead.name}</td>
                      <td className="px-3 py-3 text-sm">{displayText(lead.company)}</td>
                      <td className="px-3 py-3 text-sm">
                        {lead.email.trim() ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-accent hover:underline"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {lead.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-3 text-sm whitespace-nowrap">
                        {lead.phone.trim() ? (
                          <a
                            href={`tel:${lead.phone.replace(/\D/g, "")}`}
                            className="hover:underline"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {lead.phone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-3 text-sm whitespace-nowrap">{lead.source}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-3 py-3 text-sm whitespace-nowrap">{lead.assignedTo}</td>
                      <td className="px-3 py-3 text-sm">
                        <FollowUpDate lead={lead} />
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-medium tabular-nums">
                        {formatCurrency(lead.value)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-sm font-medium text-accent hover:underline"
                          onClick={(event) => {
                            event.stopPropagation();
                            openLead(lead.id);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Showing {start + 1}–{start + rows.length} of {filtered.length}
              </p>
              {pageCount > 1 ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={secondaryButtonClass}
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  <p className="px-1 text-sm text-muted tabular-nums">
                    {currentPage} / {pageCount}
                  </p>
                  <button
                    type="button"
                    className={secondaryButtonClass}
                    disabled={currentPage === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function LeadCard({
  lead,
  selected,
  onOpen,
}: {
  lead: Lead;
  selected: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn("block w-full px-4 py-4 text-left", selected && "bg-accent-soft")}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{lead.name}</span>
          <span className="mt-0.5 block truncate text-sm text-muted">{displayText(lead.company)}</span>
        </span>
        <StatusBadge status={lead.status} />
      </span>
      <span className="mt-3 grid gap-1 text-sm text-muted">
        <span className="truncate">{displayText(lead.email)}</span>
        <span>{displayText(lead.phone)}</span>
      </span>
      <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span>{lead.source}</span>
        <span className="text-muted">{lead.assignedTo}</span>
      </span>
      <span className="mt-3 flex items-center justify-between gap-3 text-sm">
        <FollowUpDate lead={lead} />
        <span className="font-medium tabular-nums">{formatCurrency(lead.value)}</span>
      </span>
      <span className="mt-3 block text-sm font-medium text-accent">View details</span>
    </button>
  );
}

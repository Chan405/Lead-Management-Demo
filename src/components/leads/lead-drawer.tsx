"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { displayText, formatCurrency } from "@/lib/format";
import { followUpTone } from "@/lib/leads";
import { LEAD_STATUSES, isLeadStatus, type Lead, type LeadStatus } from "@/lib/types";
import { useLeads } from "@/components/leads/leads-context";
import { FollowUpDate } from "@/components/leads/follow-up-date";
import { IconClose } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { controlClass, labelClass } from "@/components/ui/styles";

const TONE_NOTE: Record<ReturnType<typeof followUpTone>, string> = {
  today: "Due today",
  overdue: "Overdue",
  scheduled: "Scheduled",
  closed: "Closed",
};

export function LeadDrawer() {
  const { leads, selectedId, closeLead, updateStatus } = useLeads();
  const lead = leads.find((item) => item.id === selectedId);

  if (!lead) return null;

  return (
    <LeadDrawerPanel
      key={lead.id}
      lead={lead}
      onClose={closeLead}
      onStatus={(status) => updateStatus(lead.id, status)}
    />
  );
}

function LeadDrawerPanel({
  lead,
  onClose,
  onStatus,
}: {
  lead: Lead;
  onClose: () => void;
  onStatus: (status: LeadStatus) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const tone = followUpTone(lead);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/40"
        aria-label="Close lead details"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-card shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted">{lead.id}</p>
            <h2 id="lead-drawer-title" className="mt-1 truncate text-xl font-semibold tracking-tight">
              {lead.name}
            </h2>
            <p className="mt-1 truncate text-sm text-muted">{displayText(lead.company)}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-black/[0.04] hover:text-foreground"
            aria-label="Close"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={lead.status} />
            <p className="text-sm font-medium tabular-nums">{formatCurrency(lead.value)}</p>
          </div>

          <label className="mt-5 block">
            <span className={labelClass}>Status</span>
            <select
              className={controlClass}
              value={lead.status}
              onChange={(event) => {
                const next = event.target.value;
                if (isLeadStatus(next)) onStatus(next);
              }}
            >
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs leading-5 text-muted">
              Updates the dashboard counts for this session.
            </span>
          </label>

          <dl className="mt-6 border-t border-line">
            <Detail label="Email">
              {lead.email.trim() ? (
                <a className="break-all text-accent hover:underline" href={`mailto:${lead.email}`}>
                  {lead.email}
                </a>
              ) : (
                "—"
              )}
            </Detail>
            <Detail label="Phone">
              {lead.phone.trim() ? (
                <a className="text-accent hover:underline" href={`tel:${lead.phone.replace(/\D/g, "")}`}>
                  {lead.phone}
                </a>
              ) : (
                "—"
              )}
            </Detail>
            <Detail label="Source">{lead.source}</Detail>
            <Detail label="Assigned to">{lead.assignedTo}</Detail>
            <Detail label="Follow-up">
              <FollowUpDate lead={lead} />
              <span className="mt-1 block text-xs text-muted">{TONE_NOTE[tone]}</span>
            </Detail>
            <Detail label="Estimated value">{formatCurrency(lead.value)}</Detail>
          </dl>

          <section className="mt-6">
            <h3 className="text-sm font-medium">Notes</h3>
            <p
              className={
                lead.notes.trim()
                  ? "mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground"
                  : "mt-2 text-sm leading-6 text-muted"
              }
            >
              {lead.notes.trim() ? lead.notes : "No notes yet."}
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 border-b border-line py-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 text-foreground">{children}</dd>
    </div>
  );
}

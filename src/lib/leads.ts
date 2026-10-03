import { DEMO_TODAY } from "@/lib/demo";
import type { Lead, LeadSource, LeadStatus } from "@/lib/types";

export type DueFilter = "any" | "today";
export type LeadSort = "recent" | "followUpAsc" | "followUpDesc" | "valueDesc" | "valueAsc";

export function isFollowUpToday(lead: Lead, today = DEMO_TODAY): boolean {
  return lead.followUpDate === today && lead.status !== "Won" && lead.status !== "Lost";
}

export function followUpTone(
  lead: Lead,
  today = DEMO_TODAY,
): "today" | "overdue" | "scheduled" | "closed" {
  if (lead.status === "Won" || lead.status === "Lost") return "closed";
  if (lead.followUpDate === today) return "today";
  if (lead.followUpDate < today) return "overdue";
  return "scheduled";
}

export function leadMatchesQuery(lead: Lead, query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const haystack = [lead.name, lead.company, lead.email, lead.phone].join(" ").toLowerCase();
  if (haystack.includes(trimmed)) return true;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 3) {
    return lead.phone.replace(/\D/g, "").includes(digits);
  }

  return false;
}

export function filterLeads(
  leads: Lead[],
  filters: {
    query: string;
    status: LeadStatus | "all";
    source: LeadSource | "all";
    due: DueFilter;
  },
): Lead[] {
  return leads.filter((lead) => {
    if (filters.status !== "all" && lead.status !== filters.status) return false;
    if (filters.source !== "all" && lead.source !== filters.source) return false;
    if (filters.due === "today" && !isFollowUpToday(lead)) return false;
    return leadMatchesQuery(lead, filters.query);
  });
}

export function sortLeads(leads: Lead[], sort: LeadSort): Lead[] {
  const copy = [...leads];
  copy.sort((a, b) => {
    if (sort === "recent") {
      return b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id);
    }
    if (sort === "valueDesc") return b.value - a.value || a.name.localeCompare(b.name);
    if (sort === "valueAsc") return a.value - b.value || a.name.localeCompare(b.name);
    if (sort === "followUpDesc") {
      return b.followUpDate.localeCompare(a.followUpDate) || a.name.localeCompare(b.name);
    }
    return a.followUpDate.localeCompare(b.followUpDate) || a.name.localeCompare(b.name);
  });
  return copy;
}

export function recentLeads(leads: Lead[], query: string, limit: number): Lead[] {
  return leads
    .filter((lead) => leadMatchesQuery(lead, query))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id))
    .slice(0, limit);
}

export function dashboardMetrics(leads: Lead[]) {
  const total = leads.length;
  const count = (status: LeadStatus) => leads.filter((lead) => lead.status === status).length;
  const newLeads = count("New");
  const contacted = count("Contacted");
  const won = count("Won");
  const revenue = leads
    .filter((lead) => lead.status === "Won")
    .reduce((sum, lead) => sum + lead.value, 0);
  const conversion = total === 0 ? 0 : (won / total) * 100;

  return {
    total,
    newLeads,
    contacted,
    won,
    other: total - newLeads - contacted - won,
    conversion,
    followUpsToday: leads.filter((lead) => isFollowUpToday(lead)).length,
    revenue,
  };
}

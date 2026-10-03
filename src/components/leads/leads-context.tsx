"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { seedLeads } from "@/data/leads";
import { DEMO_TODAY } from "@/lib/demo";
import type { Lead, LeadStatus, NewLeadInput } from "@/lib/types";

type LeadsContextValue = {
  leads: Lead[];
  search: string;
  setSearch: (value: string) => void;
  addLead: (input: NewLeadInput) => void;
  updateStatus: (id: string, status: LeadStatus) => void;
  selectedId: string | null;
  openLead: (id: string) => void;
  closeLead: () => void;
  addOpen: boolean;
  openAddLead: () => void;
  closeAddLead: () => void;
  notice: string | null;
  dismissNotice: () => void;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

function nextLeadId(leads: Lead[]): string {
  const max = leads.reduce((highest, lead) => {
    const value = Number(lead.id.replace(/\D/g, ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 1000);
  return `LF-${max + 1}`;
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [leads, setLeads] = useState<Lead[]>(() => seedLeads.map((lead) => ({ ...lead })));
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const value = useMemo<LeadsContextValue>(
    () => ({
      leads,
      search,
      setSearch,
      addLead: (input) => {
        const lead: Lead = {
          ...input,
          id: nextLeadId(leads),
          createdAt: DEMO_TODAY,
        };
        setLeads((current) => [lead, ...current]);
        setSearch("");
        setSelectedId(lead.id);
        setAddOpen(false);
        setNotice(`${lead.name} was added to the pipeline.`);
        if (pathname === "/leads") {
          router.replace("/leads", { scroll: false });
        }
      },
      updateStatus: (id, status) => {
        setLeads((current) =>
          current.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
        );
      },
      selectedId,
      openLead: (id) => {
        setSelectedId(id);
        setAddOpen(false);
      },
      closeLead: () => setSelectedId(null),
      addOpen,
      openAddLead: () => {
        setAddOpen(true);
        setSelectedId(null);
      },
      closeAddLead: () => setAddOpen(false),
      notice,
      dismissNotice: () => setNotice(null),
    }),
    [addOpen, leads, notice, pathname, router, search, selectedId],
  );

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads(): LeadsContextValue {
  const value = useContext(LeadsContext);
  if (!value) {
    throw new Error("useLeads must be used within LeadsProvider");
  }
  return value;
}

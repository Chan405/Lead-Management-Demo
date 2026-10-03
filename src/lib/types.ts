export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
] as const;

export const LEAD_SOURCES = [
  "Facebook",
  "Instagram",
  "WhatsApp",
  "Website",
  "Referral",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  followUpDate: string;
  value: number;
  notes: string;
  createdAt: string;
};

export type NewLeadInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  followUpDate: string;
  value: number;
  notes: string;
};

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export function isLeadSource(value: string): value is LeadSource {
  return (LEAD_SOURCES as readonly string[]).includes(value);
}

import { DEMO_TODAY, TEAM_MEMBERS } from "@/lib/demo";
import { isFollowUpToday } from "@/lib/leads";
import { LEAD_SOURCES, type Lead, type LeadSource, type LeadStatus } from "@/lib/types";

const FIRST_NAMES = [
  "Owen",
  "Nora",
  "Felix",
  "Camille",
  "Jonah",
  "Ruth",
  "Andre",
  "Leila",
  "Hugo",
  "Sofia",
  "Patrick",
  "Imani",
  "Theo",
  "Clara",
  "Victor",
  "Nadia",
  "Elliot",
  "Helena",
  "Malik",
  "June",
  "Oscar",
  "Willa",
  "Bennett",
  "Aisha",
  "Colin",
  "Freya",
  "Isaac",
  "Marisol",
  "Peter",
  "Yara",
  "Simon",
  "Beatrice",
  "Adrian",
  "Lila",
  "George",
  "Noor",
  "Henry",
  "Celia",
  "Roman",
  "Esme",
] as const;

const LAST_NAMES = [
  "Adler",
  "Castillo",
  "Doyle",
  "Edwards",
  "Farrell",
  "Gupta",
  "Hoffman",
  "Ibarra",
  "Jensen",
  "Khan",
  "Lindstrom",
  "Moreau",
  "Nguyen",
  "Olsen",
  "Patel",
  "Quintero",
  "Rossi",
  "Schmidt",
  "Tran",
  "Ueda",
  "Walsh",
  "Xu",
  "Young",
  "Zimmer",
  "Almeida",
  "Berg",
  "Costa",
  "Diaz",
  "Fischer",
  "Grant",
  "Hassan",
  "Ito",
  "Keller",
  "Lambert",
  "Morales",
  "Novak",
  "Park",
] as const;

const COMPANIES = [
  "North Block Rentals",
  "Harbor Light Cafe",
  "Pine Street Dental",
  "West Elm Flats",
  "Cinder & Co.",
  "Maple Court Condos",
  "Larkspur Studio",
  "Oak & Iron Supply",
  "Sunset Childcare",
  "Bellweather Books",
  "Kinship Veterinary",
  "Redwood Property",
  "Hearthside Bakery",
  "Lane Avenue Offices",
  "Copper Kettle Catering",
  "Fairview Apartments",
  "Moss & Timber",
  "Cedar Row Homes",
  "Bright Hour Yoga",
  "Little River Inn",
  "Quarry Hill HOA",
  "Sable Salon",
  "Greenline Auto",
  "Willow Creek Clinic",
] as const;

const ESTIMATES = [
  220, 340, 480, 560, 640, 720, 860, 940, 1100, 1280, 1450, 1680, 1840, 2100, 2400, 2750, 390, 510,
  780, 990,
] as const;

const GENERATED_WON_VALUES = [
  180, 220, 240, 260, 280, 300, 320, 350, 380, 410, 440, 160, 200, 275, 310, 360, 190, 230, 420, 150,
  290, 330, 480, 210, 255, 540,
] as const;

const FOLLOW_UP_OFFSETS = [-18, -14, -11, -9, -6, -4, -2, 1, 2, 3, 5, 6, 8, 11, 13, 16, 20] as const;
const TODAY_INDEXES = new Set([3, 40, 72, 80]);

function shiftDate(isoDate: string, days: number): string {
  const year = Number(isoDate.slice(0, 4));
  const month = Number(isoDate.slice(5, 7));
  const day = Number(isoDate.slice(8, 10));
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function emailFor(first: string, last: string, company: string): string {
  const local = `${first}.${last}`.toLowerCase();
  const domain = company.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "");
  return `${local}@${domain}.com`;
}

function phoneFor(index: number): string {
  return `(503) 555-${2200 + index}`;
}

function statusFor(index: number): LeadStatus {
  if (index < 30) return "New";
  if (index < 69) return "Contacted";
  if (index < 78) return "Qualified";
  if (index < 84) return "Proposal";
  if (index < 110) return "Won";
  return "Lost";
}

function noteFor(
  status: LeadStatus,
  first: string,
  company: string,
  source: LeadSource,
): string {
  if (status === "Won") {
    return `${first} approved the scope for ${company}. The deposit is in, and the crew is on the calendar.`;
  }
  if (status === "Lost") {
    return `${first} paused the ${company} project and asked Brightpath not to follow up this season.`;
  }
  if (status === "Proposal") {
    return `The proposal for ${company} is with ${first}. It went out after a ${source} inquiry. Confirm the scope still fits before the price expires.`;
  }
  if (status === "Qualified") {
    return `${first} has a budget and a start window for ${company}. The next step is a site visit before pricing the work.`;
  }
  if (status === "Contacted") {
    return `Spoke with ${first} after the ${source} inquiry about ${company}. They want a clearer range before booking a walkthrough.`;
  }
  return `New ${source} inquiry from ${first} about ${company}. Nobody has replied yet.`;
}

const featured: Lead[] = [
  {
    id: "LF-2410",
    name: "Marcus Webb",
    company: "Webb Property Group",
    email: "marcus@webbproperty.com",
    phone: "(503) 555-0178",
    source: "Website",
    status: "New",
    assignedTo: "Maya Ellis",
    followUpDate: "2026-10-03",
    value: 2400,
    notes:
      "Website form this morning. Marcus manages three rentals and wants a walkthrough for a hallway and bath update at the Belmont house before the unit turns over.",
    createdAt: "2026-10-03",
  },
  {
    id: "LF-2409",
    name: "Grace Okonkwo",
    company: "Okonkwo Residence",
    email: "grace.okonkwo@gmail.com",
    phone: "(503) 555-0160",
    source: "Referral",
    status: "New",
    assignedTo: "Sam Ortiz",
    followUpDate: "2026-10-03",
    value: 320,
    notes:
      "Referred by a past exterior client. Grace wants a quote to repair water damage in the hallway before relatives visit in November. Evenings are the best time to call.",
    createdAt: "2026-10-03",
  },
  {
    id: "LF-2408",
    name: "Elena Vasquez",
    company: "Vasquez Bakery",
    email: "elena@vasquezbakery.com",
    phone: "(503) 555-0142",
    source: "Instagram",
    status: "Proposal",
    assignedTo: "Priya Shah",
    followUpDate: "2026-10-03",
    value: 1280,
    notes:
      "Instagram message about a spring kitchen refresh. Elena needs the proposal before Friday and asked whether the crew can work around bakery hours.",
    createdAt: "2026-10-02",
  },
  {
    id: "LF-2407",
    name: "Amina Rahman",
    company: "Rahman Interiors",
    email: "amina@rahmaninteriors.com",
    phone: "(503) 555-0116",
    source: "WhatsApp",
    status: "Contacted",
    assignedTo: "Sam Ortiz",
    followUpDate: "2026-10-04",
    value: 860,
    notes:
      "WhatsApp thread with photos of a living room. Amina is comparing paint, built-ins, and a realistic budget before she brings the client on site.",
    createdAt: "2026-10-02",
  },
  {
    id: "LF-2406",
    name: "Luis Ortega",
    company: "Ortega Homes",
    email: "luis@ortegahomes.com",
    phone: "(503) 555-0194",
    source: "Referral",
    status: "Qualified",
    assignedTo: "Chris Adeyemi",
    followUpDate: "2026-10-03",
    value: 1750,
    notes:
      "Referred by Kenji Sato. Full exterior repaint on a 1912 craftsman. Budget is qualified. Waiting on a site visit to confirm siding repairs.",
    createdAt: "2026-10-01",
  },
  {
    id: "LF-2405",
    name: "Hannah Brooks",
    company: "Brooks & Lane",
    email: "hannah@brooksandlane.com",
    phone: "(503) 555-0133",
    source: "Facebook",
    status: "Contacted",
    assignedTo: "Maya Ellis",
    followUpDate: "2026-10-06",
    value: 540,
    notes:
      "Facebook lead from the neighborhood group. Hannah asked about a small bath remodel and whether Brightpath takes projects under $1,000.",
    createdAt: "2026-10-01",
  },
  {
    id: "LF-2404",
    name: "Daniel Cho",
    company: "Cho Kitchen Co.",
    email: "daniel@chokitchen.co",
    phone: "(503) 555-0127",
    source: "Facebook",
    status: "Proposal",
    assignedTo: "Chris Adeyemi",
    followUpDate: "2026-10-07",
    value: 1960,
    notes:
      "Facebook lead. Daniel runs a meal-prep kitchen and needs a durable floor and backsplash. The proposal is drafted. Follow up after he reviews it with his partner.",
    createdAt: "2026-09-30",
  },
  {
    id: "LF-2403",
    name: "Kenji Sato",
    company: "Sato Dental",
    email: "kenji@satodental.com",
    phone: "(503) 555-0108",
    source: "Website",
    status: "Won",
    assignedTo: "Priya Shah",
    followUpDate: "2026-09-28",
    value: 640,
    notes:
      "Won. Reception desk surround and waiting-room paint for Sato Dental. Deposit received. Crew is scheduled the week of October 13.",
    createdAt: "2026-09-29",
  },
];

function buildGeneratedLeads(): Lead[] {
  let wonIndex = 0;

  return Array.from({ length: 116 }, (_, index) => {
    const first = FIRST_NAMES[index % FIRST_NAMES.length] ?? "Alex";
    const last = LAST_NAMES[index % LAST_NAMES.length] ?? "Reed";
    const company = COMPANIES[index % COMPANIES.length] ?? "Local Client";
    const source = LEAD_SOURCES[index % LEAD_SOURCES.length] ?? "Website";
    const status = statusFor(index);
    const assignedTo = TEAM_MEMBERS[(index + 2) % TEAM_MEMBERS.length] ?? TEAM_MEMBERS[0];

    let value: number;
    if (status === "Won") {
      const wonValue = GENERATED_WON_VALUES[wonIndex];
      wonIndex += 1;
      if (wonValue === undefined) {
        throw new Error("Lead seed is missing a won-lead value.");
      }
      value = wonValue;
    } else {
      value = ESTIMATES[index % ESTIMATES.length] ?? 480;
    }

    const followUpDate = TODAY_INDEXES.has(index)
      ? DEMO_TODAY
      : shiftDate(DEMO_TODAY, FOLLOW_UP_OFFSETS[index % FOLLOW_UP_OFFSETS.length] ?? 4);

    return {
      id: `LF-${1101 + index}`,
      name: `${first} ${last}`,
      company,
      email: emailFor(first, last, company),
      phone: phoneFor(index),
      source,
      status,
      assignedTo,
      followUpDate,
      value,
      notes: noteFor(status, first, company, source),
      createdAt: shiftDate("2026-08-12", index % 44),
    };
  });
}

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function assertSeed(leads: Lead[]): void {
  const count = (status: LeadStatus) => leads.filter((lead) => lead.status === status).length;
  const wonRevenue = leads
    .filter((lead) => lead.status === "Won")
    .reduce((sum, lead) => sum + lead.value, 0);
  const followUps = leads.filter((lead) => isFollowUpToday(lead)).length;
  const problems: string[] = [];

  if (leads.length !== 124) problems.push(`total ${leads.length}`);
  if (count("New") !== 32) problems.push(`new ${count("New")}`);
  if (count("Contacted") !== 41) problems.push(`contacted ${count("Contacted")}`);
  if (count("Qualified") !== 10) problems.push(`qualified ${count("Qualified")}`);
  if (count("Proposal") !== 8) problems.push(`proposal ${count("Proposal")}`);
  if (count("Won") !== 27) problems.push(`won ${count("Won")}`);
  if (count("Lost") !== 6) problems.push(`lost ${count("Lost")}`);
  if (wonRevenue !== 8420) problems.push(`revenue ${wonRevenue}`);
  if (followUps !== 8) problems.push(`followUps ${followUps}`);

  const duplicateIds = duplicateValues(leads.map((lead) => lead.id));
  if (duplicateIds.length > 0) problems.push(`duplicate ids ${duplicateIds.join(",")}`);

  const duplicateEmails = duplicateValues(leads.map((lead) => lead.email));
  if (duplicateEmails.length > 0) problems.push(`duplicate emails ${duplicateEmails.join(",")}`);

  const duplicateNames = duplicateValues(leads.map((lead) => lead.name));
  if (duplicateNames.length > 0) problems.push(`duplicate names ${duplicateNames.join(",")}`);

  if (problems.length > 0) {
    throw new Error(`Lead seed mismatch: ${problems.join("; ")}`);
  }
}

export const seedLeads: Lead[] = [...featured, ...buildGeneratedLeads()];

assertSeed(seedLeads);

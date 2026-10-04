import Link from "next/link";
import { DASHBOARD_HREF } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { SiteHeader } from "@/components/marketing/site-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { cardClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/styles";
import type { LeadStatus } from "@/lib/types";

const DEMO_MAIL = "mailto:hello@leadflow.demo?subject=Book%20a%20LeadFlow%20demo";

const MANUAL_TOOLS = [
  { name: "Facebook messages", note: "Inquiries sit in a page inbox." },
  { name: "WhatsApp chats", note: "Quotes disappear into a thread." },
  { name: "Google Sheets", note: "Someone has to remember to update the row." },
  { name: "Excel files", note: "The latest copy is on one computer." },
  { name: "Manual follow-ups", note: "Dates live in memory or a notebook." },
  { name: "Scattered customer information", note: "The phone number is never where you look first." },
] as const;

const FLOW = [
  { name: "Leads", note: "Every inquiry, with the channel it came from." },
  { name: "Follow-ups", note: "The next date, before it slips past." },
  { name: "Customers", note: "Won work, still attached to the person." },
  { name: "Reports", note: "A read on what is moving, without exporting a sheet." },
] as const;

const BENEFITS = [
  {
    title: "Never lose track of leads",
    body: "Keep every inquiry organized in one place.",
  },
  {
    title: "Know who needs follow-up",
    body: "See upcoming and overdue follow-ups clearly.",
  },
  {
    title: "See what's converting",
    body: "Track lead status, opportunities, and revenue.",
  },
] as const;

const PLAN_FEATURES = [
  "Lead dashboard",
  "Lead/customer management",
  "Search & filters",
  "Follow-up tracking",
  "Basic reporting",
  "Deployment",
  "1 round of changes",
] as const;

const SAMPLE_FOLLOW_UPS: { source: string; detail: string; status: LeadStatus }[] = [
  { source: "WhatsApp", detail: "Kitchen remodel", status: "Contacted" },
  { source: "Instagram", detail: "Window quote", status: "New" },
  { source: "Referral", detail: "Deck repair", status: "Won" },
];

export function OverviewPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="content">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-14 pb-16 sm:px-8 sm:pt-20 sm:pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:pt-24 lg:pb-28">
          <div>
            <p className="text-sm font-medium text-accent">LeadFlow for small businesses</p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Manage your leads. Never miss a follow-up.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Keep leads, customer information, follow-ups, and sales opportunities in one simple
              dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={DASHBOARD_HREF} className={cn(primaryButtonClass, "w-full sm:w-auto")}>
                View Demo
              </Link>
              <a href="#how-it-works" className={cn(secondaryButtonClass, "w-full sm:w-auto")}>
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-sm text-muted">Opens the working dashboard. Nothing to install.</p>
          </div>

          <aside className={cn(cardClass, "p-5 sm:p-6")} aria-label="Sample follow-ups in the dashboard">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium">Sample follow-ups</p>
              <p className="text-xs text-muted">Example</p>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {SAMPLE_FOLLOW_UPS.map((item) => (
                <li key={item.detail} className="flex items-center justify-between gap-3 py-3.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{item.detail}</span>
                    <span className="block text-xs text-muted">{item.source}</span>
                  </span>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Still managing leads across different tools?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              A new job can start in a Facebook message, move to WhatsApp, and wait for a follow-up
              date that only exists in a spreadsheet.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MANUAL_TOOLS.map((tool) => (
                <li key={tool.name} className={cn(cardClass, "px-5 py-5")}>
                  <p className="text-base font-medium">{tool.name}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{tool.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Keep everything in one place.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              The same inquiry stays in LeadFlow from the first reply through the customer record.
            </p>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {FLOW.map((step, index) => (
                <li key={step.name}>
                  <p className="font-display text-3xl tracking-tight">
                    {index > 0 ? (
                      <span className="text-muted" aria-hidden="true">
                        →{" "}
                      </span>
                    ) : null}
                    {step.name}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              What the dashboard keeps in front of you
            </h2>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit.title} className={cn(cardClass, "px-6 py-7")}>
                  <h3 className="font-display text-2xl leading-tight tracking-tight">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{benefit.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Simple setup. No complicated software.
            </h2>
            <div className={cn(cardClass, "mt-10 grid overflow-hidden lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]")}>
              <div className="border-b border-line px-6 py-8 sm:px-8 lg:border-r lg:border-b-0">
                <p className="text-sm font-medium tracking-[0.14em] text-muted uppercase">Starter</p>
                <p className="mt-4 font-display text-5xl tracking-tight">$149</p>
                <p className="mt-2 text-sm text-muted">One-time setup for one workspace.</p>
                <p className="mt-5 inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
                  Ready in 3–5 days
                </p>
                <a href="#contact" className={cn(primaryButtonClass, "mt-8 w-full sm:w-auto")}>
                  Book a Demo
                </a>
              </div>
              <ul className="grid gap-x-8 gap-y-4 px-6 py-8 sm:grid-cols-2 sm:px-8">
                {PLAN_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-1 h-4 w-4 shrink-0 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path d="M5 12.5 9.2 17 19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                Book a Demo
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                Bring the places inquiries show up today — a Facebook page, a WhatsApp chat, a
                spreadsheet — and walk through them on the dashboard.
              </p>
              <a href={DEMO_MAIL} className={cn(primaryButtonClass, "mt-8 w-full sm:w-auto")}>
                Book a Demo
              </a>
              <p className="mt-4 text-sm text-muted">
                <a href={DEMO_MAIL} className="font-medium text-accent hover:underline">
                  hello@leadflow.demo
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-muted">LeadFlow · Lead management for small businesses</p>
          <Link href={DASHBOARD_HREF} className="text-sm font-medium text-accent hover:underline">
            View Demo
          </Link>
        </div>
      </footer>
    </div>
  );
}

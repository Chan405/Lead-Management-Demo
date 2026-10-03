import { cn } from "@/lib/cn";
import type { LeadStatus } from "@/lib/types";

const STATUS_CLASS: Record<LeadStatus, string> = {
  New: "bg-stone-100 text-stone-700",
  Contacted: "bg-amber-50 text-amber-900",
  Qualified: "bg-sky-50 text-sky-900",
  Proposal: "bg-violet-50 text-violet-900",
  Won: "bg-emerald-50 text-emerald-900",
  Lost: "bg-rose-50 text-rose-800",
};

const DOT_CLASS: Record<LeadStatus, string> = {
  New: "bg-stone-400",
  Contacted: "bg-amber-500",
  Qualified: "bg-sky-500",
  Proposal: "bg-violet-500",
  Won: "bg-emerald-600",
  Lost: "bg-rose-400",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_CLASS[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASS[status])} />
      {status}
    </span>
  );
}

import { formatDate } from "@/lib/format";
import { followUpTone, isFollowUpToday } from "@/lib/leads";
import { cn } from "@/lib/cn";
import type { Lead } from "@/lib/types";

const TONE_CLASS = {
  today: "font-medium text-accent",
  overdue: "text-amber-800",
  scheduled: "text-foreground",
  closed: "text-muted",
} as const;

export function FollowUpDate({ lead }: { lead: Lead }) {
  const tone = followUpTone(lead);

  return (
    <span className={cn("whitespace-nowrap", TONE_CLASS[tone])}>
      {formatDate(lead.followUpDate)}
      {isFollowUpToday(lead) ? <span className="ml-1.5 text-xs font-medium">Today</span> : null}
    </span>
  );
}

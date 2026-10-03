import Link from "next/link";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  detail,
  href,
}: {
  label: string;
  value: string;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-2xl border border-line bg-card p-4 shadow-[0_1px_2px_rgba(31,30,27,0.04)] transition hover:border-accent/30 sm:p-5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
      )}
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      <p className="mt-2 text-sm leading-5 text-muted">{detail}</p>
    </Link>
  );
}

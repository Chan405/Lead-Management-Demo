import Link from "next/link";
import { cardClass } from "@/components/ui/styles";

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  points,
}: {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <section className={`${cardClass} mx-auto max-w-2xl px-6 py-10 sm:px-10 sm:py-12`}>
      <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight text-foreground">{title}</h2>
      <p className="mt-4 text-sm leading-6 text-muted">{description}</p>
      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-6 text-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <Link href="/leads" className="mt-8 inline-flex text-sm font-medium text-accent hover:underline">
        Return to leads
      </Link>
    </section>
  );
}

import type { Metadata } from "next";
import { LeadsView } from "@/components/leads/leads-view";

export const metadata: Metadata = {
  title: "Leads",
};

type LeadsSearchParams = {
  status?: string | string[];
  source?: string | string[];
  due?: string | string[];
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<LeadsSearchParams>;
}) {
  const params = await searchParams;
  return (
    <LeadsView
      initialStatus={firstParam(params.status)}
      initialSource={firstParam(params.source)}
      initialDue={firstParam(params.due)}
    />
  );
}

import type { Metadata } from "next";
import { OverviewPage } from "@/components/marketing/overview-page";

export const metadata: Metadata = {
  title: "Manage your leads",
  description:
    "Keep leads, customer information, follow-ups, and sales opportunities in one simple dashboard.",
};

export default function HomePage() {
  return <OverviewPage />;
}

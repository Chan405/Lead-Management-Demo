import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder/placeholder-page";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <PlaceholderPage
      eyebrow="Preview"
      title="See which channels actually bring work"
      description="Reports will turn the pipeline into a weekly read on where leads come from, how many you win, and what that work is worth. The dashboard is the live snapshot for this workspace."
      points={[
        "Lead volume and win rate by Facebook, Instagram, WhatsApp, website, and referral",
        "Follow-ups that slipped past their date",
        "Revenue from won work, by month and by teammate",
      ]}
    />
  );
}

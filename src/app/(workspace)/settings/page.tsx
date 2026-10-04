import type { Metadata } from "next";
import { WORKSPACE } from "@/lib/demo";
import { PlaceholderPage } from "@/components/placeholder/placeholder-page";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Preview"
      title="Workspace settings stay out of the way"
      description={`${WORKSPACE.company} would manage the team, lead sources, and reminder defaults here. This demo keeps the workspace as ${WORKSPACE.owner} left it so you can walk the pipeline first.`}
      points={[
        "Team members and who new leads are assigned to",
        "The sources you actually use, from Instagram to referrals",
        "Follow-up reminders before a date slips",
      ]}
    />
  );
}

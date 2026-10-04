import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder/placeholder-page";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomersPage() {
  return (
    <PlaceholderPage
      eyebrow="Preview"
      title="Customer records come after a lead is won"
      description="LeadFlow keeps the conversation on the lead until the work is won. This view will hold the people and companies you already work with, so the team is not searching old messages for a phone number."
      points={[
        "Won leads become customers without retyping the contact details",
        "Past jobs stay attached to the person or company",
        "Notes from the original inquiry carry over",
      ]}
    />
  );
}

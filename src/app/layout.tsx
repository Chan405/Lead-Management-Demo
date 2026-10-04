import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { LeadsProvider } from "@/components/leads/leads-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LeadFlow",
    template: "%s · LeadFlow",
  },
  description:
    "Keep leads, customer information, follow-ups, and sales opportunities in one simple dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <LeadsProvider>{children}</LeadsProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { LeadsProvider } from "@/components/leads/leads-context";
import { AppShell } from "@/components/layout/app-shell";
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
  description: "Keep your leads, follow-ups, and customer information in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <LeadsProvider>
          <AppShell>{children}</AppShell>
        </LeadsProvider>
      </body>
    </html>
  );
}

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/customers", label: "Customers" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
] as const;

export function pageTitle(pathname: string): string {
  const match = NAV_ITEMS.find((item) => item.href === pathname);
  return match?.label ?? "LeadFlow";
}

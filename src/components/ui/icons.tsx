import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconDashboard(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.5" />
      <rect x="13.5" y="11" width="7" height="9.5" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}

export function IconLeads(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 7.5h11" />
      <path d="M8 12h11" />
      <path d="M8 16.5h7" />
      <path d="M4.5 7.5h.01" />
      <path d="M4.5 12h.01" />
      <path d="M4.5 16.5h.01" />
    </IconBase>
  );
}

export function IconCustomers(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 19.5v-1.2A3.3 3.3 0 0 0 12.7 15H7.3A3.3 3.3 0 0 0 4 18.3v1.2" />
      <circle cx="10" cy="8" r="3" />
      <path d="M20 19.5v-1.1a2.8 2.8 0 0 0-2.1-2.7" />
      <path d="M16.2 5.2a2.6 2.6 0 0 1 0 4.9" />
    </IconBase>
  );
}

export function IconReports(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 19.5h16" />
      <path d="M7 16.5v-4" />
      <path d="M12 16.5V7.5" />
      <path d="M17 16.5v-6" />
    </IconBase>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2" />
      <path d="M12 18.3v2.2" />
      <path d="M3.5 12h2.2" />
      <path d="M18.3 12h2.2" />
      <path d="M6 6l1.6 1.6" />
      <path d="M16.4 16.4 18 18" />
      <path d="M18 6l-1.6 1.6" />
      <path d="M7.6 16.4 6 18" />
    </IconBase>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </IconBase>
  );
}

export function IconBell(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 16.5h12l-1.2-2.1V10a4.8 4.8 0 0 0-9.6 0v4.4L6 16.5Z" />
      <path d="M10 16.5a2 2 0 0 0 4 0" />
    </IconBase>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}

export function IconClose(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </IconBase>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  );
}

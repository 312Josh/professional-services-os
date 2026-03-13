import Link from "next/link";
import type { CSSProperties } from "react";
import { appConfig } from "@/lib/app-config";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/customers", label: "Customers" },
  { href: "/jobs", label: "Jobs" },
  { href: "/invoices", label: "Invoices" },
  { href: "/activity", label: "Activity" }
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const freshLeadSince = new Date(Date.now() - appConfig.ownerOps.newLeadAlertMinutes * 60 * 1000);
  const [unworkedLeadCount, freshLeadCount] = await Promise.all([
    prisma.lead.count({ where: { status: "new" } }),
    prisma.lead.count({ where: { status: "new", createdAt: { gte: freshLeadSince } } })
  ]);
  const brandThemeStyle = {
    "--accent": appConfig.brand.accentColor,
    "--accent-2": appConfig.brand.successColor,
    "--danger": appConfig.brand.dangerColor,
    "--surface-tint": appConfig.brand.surfaceTintColor,
    "--nav-muted-accent": appConfig.brand.accentColorMuted
  } as CSSProperties;

  return (
    <div className="shell" style={brandThemeStyle}>
      <aside className="sidebar">
        <h2>{appConfig.brand.appShortTitle}</h2>
        <small>{admin.name}</small>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="sidebar-link">
              <span>{item.label}</span>
              {item.href === "/leads" && unworkedLeadCount > 0 ? (
                <span className={`nav-badge ${freshLeadCount > 0 ? "hot" : ""}`}>
                  {freshLeadCount > 0 ? `${freshLeadCount} new now` : `${unworkedLeadCount} open`}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <form method="post" action="/api/logout" style={{ marginTop: "1rem" }}>
          <button type="submit" className="secondary">
            Log out
          </button>
        </form>
      </aside>
      <main>{children}</main>
    </div>
  );
}

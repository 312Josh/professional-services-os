import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

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

  return (
    <div className="shell">
      <aside className="sidebar">
        <h2>BluePipe Ops</h2>
        <small>{admin.name}</small>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} style={{ marginTop: "1rem" }}>
          <button type="submit" className="secondary">
            Log out
          </button>
        </form>
      </aside>
      <main>{children}</main>
    </div>
  );
}

import Link from "next/link";
import { appConfig } from "@/lib/app-config";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LayoutDashboard, Users, Briefcase, FileText, Clock, UserCircle, LogOut, Scale } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Inquiries", icon: Scale },
  { href: "/customers", label: "Clients", icon: Users },
  { href: "/jobs", label: "Engagements", icon: Briefcase },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/activity", label: "Activity", icon: Clock },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const freshLeadSince = new Date(Date.now() - appConfig.ownerOps.newLeadAlertMinutes * 60 * 1000);
  const [unworkedLeadCount, freshLeadCount] = await Promise.all([
    prisma.lead.count({ where: { status: "new" } }),
    prisma.lead.count({ where: { status: "new", createdAt: { gte: freshLeadSince } } }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-[#0f1f35] text-white border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
              <Scale className="w-4 h-4 text-[#0f1f35]" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold tracking-tight">{appConfig.brand.appShortTitle}</h2>
              <p className="text-[11px] text-slate-400">Firm Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-0.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors group">
              <span className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition-colors" />
                {item.label}
              </span>
              {item.href === "/leads" && unworkedLeadCount > 0 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${freshLeadCount > 0 ? "bg-red-500/20 text-red-300" : "bg-white/10 text-slate-400"}`}>
                  {freshLeadCount > 0 ? `${freshLeadCount} new` : unworkedLeadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <UserCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{admin.email}</p>
            </div>
          </div>
          <form method="post" action="/api/logout">
            <button type="submit" className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </form>
        </div>

        <div className="px-4 pb-3">
          <p className="text-[10px] text-slate-600 text-center">Powered by <a href="https://cogrow.ai" className="text-slate-500 hover:text-amber-300 transition-colors">CoGrow</a></p>
        </div>
      </aside>

      <main className="p-4 lg:p-6 overflow-x-hidden">{children}</main>
    </div>
  );
}

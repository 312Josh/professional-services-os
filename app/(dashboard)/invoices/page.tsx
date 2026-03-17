export const dynamic = "force-dynamic";
import Link from "next/link";
import { getInvoiceStatusLabel } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { FileText, Plus, ArrowRight } from "lucide-react";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { customer: true, job: true },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    draft: "bg-slate-50 text-slate-600 border-slate-200",
    sent: "bg-blue-50 text-blue-700 border-blue-200",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    overdue: "bg-red-50 text-red-700 border-red-200",
    cancelled: "bg-red-50 text-red-500 border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900">Invoices</h1>
              <p className="text-xs text-slate-400 mt-0.5">Draft, send, track payments</p>
            </div>
          </div>
          <Link href="/invoices/new" className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-5 py-2.5 rounded-lg shadow-sm shadow-amber-500/20 transition-all">
            <Plus className="w-4 h-4" /> Create Invoice
          </Link>
        </div>
      </div>

      {/* Invoice Register */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 lg:px-6 py-4 border-b border-slate-100">
          <h2 className="font-display text-lg font-bold text-slate-900">Invoice Register</h2>
          <p className="text-xs text-slate-400 mt-0.5">{invoices.length} invoices</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 pl-5 lg:pl-6 pr-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Invoice</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">Job</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden md:table-cell">Due</th>
                <th className="text-right py-3 pr-5 lg:pr-6 pl-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 pl-5 lg:pl-6 pr-3">
                    <Link href={`/invoices/${invoice.id}`} className="font-semibold text-blue-600 hover:text-blue-500 transition-colors text-[13px]">
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-slate-700 text-[13px]">{invoice.customer.name}</td>
                  <td className="py-3 px-3 text-slate-500 text-[13px] hidden sm:table-cell">{invoice.job?.title || "—"}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[invoice.status] || statusColor.draft}`}>
                      {getInvoiceStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900 text-[13px]">{formatCurrency(invoice.totalCents)}</td>
                  <td className="py-3 px-3 text-slate-500 text-[13px] hidden md:table-cell">{formatDate(invoice.dueDate)}</td>
                  <td className="py-3 pr-5 lg:pr-6 pl-3 text-right">
                    <Link href={`/invoices/${invoice.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors">
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
import { INVOICE_STATUSES, INVOICE_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { FileText } from "lucide-react";
import { LineItemEditor } from "@/app/(dashboard)/_components/line-item-editor";

export default async function NewInvoicePage() {
  const [customers, jobs] = await Promise.all([
    prisma.customer.findMany({ orderBy: { name: "asc" } }),
    prisma.job.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const due30 = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  return (
    <div className="max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-slate-400" />
          <h1 className="font-display text-lg font-bold text-slate-900">Create Invoice</h1>
        </div>

        <form method="post" action="/api/invoices">
          {/* Row 1: Customer + Job */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Customer *</label>
              <select name="customerId" required defaultValue="" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white">
                <option value="" disabled>Select customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Related Job (optional)</label>
              <select name="jobId" defaultValue="" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white">
                <option value="">No job</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} ({j.customer.name})</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Dates + Status */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Issue Date</label>
              <input name="issueDate" type="date" defaultValue={today} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
              <input name="dueDate" type="date" defaultValue={due30} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select name="status" defaultValue="draft" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white">
                {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{INVOICE_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Line Items</label>
            <LineItemEditor defaultTaxRate={8.25} />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Internal Notes</label>
            <textarea name="notes" rows={3} placeholder="Optional notes (internal only, not shown to customer)" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white resize-y min-h-[80px]" />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <a href="/invoices" className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
              Cancel
            </a>
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer">
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

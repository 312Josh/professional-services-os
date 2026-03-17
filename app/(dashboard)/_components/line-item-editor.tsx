"use client";

import { useState, useCallback } from "react";
import { Plus, X } from "lucide-react";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

const PRESET_ITEMS = [
  { description: "Service Call", unitPrice: 95 },
  { description: "Emergency Fee", unitPrice: 150 },
  { description: "Travel Fee", unitPrice: 45 },
  { description: "Labor (per hour)", unitPrice: 80 },
  { description: "Diagnostic Fee", unitPrice: 75 },
  { description: "Permit Fee", unitPrice: 125 },
  { description: "Parts & Materials", unitPrice: 0 },
  { description: "Drain Cleaning", unitPrice: 195 },
  { description: "Water Heater Flush", unitPrice: 120 },
  { description: "Fixture Installation", unitPrice: 250 },
];

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatMoney(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export function LineItemEditor({ defaultTaxRate = 8.25 }: { defaultTaxRate?: number }) {
  const [items, setItems] = useState<LineItem[]>([
    { id: newId(), description: "Service Call", quantity: 1, unitPrice: 9500 },
  ]);
  const [taxRate, setTaxRate] = useState(defaultTaxRate);
  const [showPresets, setShowPresets] = useState<string | null>(null);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, { id: newId(), description: "", quantity: 1, unitPrice: 0 }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === "unitPrice") {
          return { ...item, unitPrice: Math.round(Number(value) * 100) };
        }
        if (field === "quantity") {
          return { ...item, quantity: Number(value) || 0 };
        }
        return { ...item, [field]: value };
      })
    );
  }, []);

  const selectPreset = useCallback((itemId: string, preset: typeof PRESET_ITEMS[0]) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, description: preset.description, unitPrice: preset.unitPrice * 100 }
          : item
      )
    );
    setShowPresets(null);
  }, []);

  const subtotalCents = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxCents = Math.round(subtotalCents * (taxRate / 100));
  const totalCents = subtotalCents + taxCents;

  // Serialize line items for the form submission (pipe-delimited format the API expects)
  const serialized = items
    .filter((item) => item.description)
    .map((item) => `${item.description}|${item.quantity}|${(item.unitPrice / 100).toFixed(2)}`)
    .join("\n");

  return (
    <div>
      {/* Hidden field for form submission */}
      <input type="hidden" name="lineItems" value={serialized} />
      <input type="hidden" name="taxRatePercent" value={taxRate} />

      {/* Line items table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-2.5 pl-4 pr-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Description</th>
              <th className="text-center py-2.5 px-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-20">Qty</th>
              <th className="text-right py-2.5 px-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-28">Unit Price</th>
              <th className="text-right py-2.5 px-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-28">Total</th>
              <th className="py-2.5 pr-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 group">
                <td className="py-1.5 pl-4 pr-2 relative">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    onFocus={() => setShowPresets(item.id)}
                    onBlur={() => setTimeout(() => setShowPresets(null), 200)}
                    placeholder="Type to search items..."
                    className="w-full px-2.5 py-1.5 border border-transparent hover:border-slate-200 focus:border-amber-400 rounded-md text-sm bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                  {/* Preset dropdown */}
                  {showPresets === item.id && (
                    <div className="absolute left-4 right-2 top-full z-20 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {PRESET_ITEMS.filter((p) =>
                        !item.description || p.description.toLowerCase().includes(item.description.toLowerCase())
                      ).map((preset) => (
                        <button
                          key={preset.description}
                          type="button"
                          onMouseDown={() => selectPreset(item.id, preset)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-slate-700">{preset.description}</span>
                          {preset.unitPrice > 0 && <span className="text-slate-400 text-xs">${preset.unitPrice.toFixed(2)}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-1.5 px-2">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                    className="w-full px-2 py-1.5 border border-transparent hover:border-slate-200 focus:border-amber-400 rounded-md text-sm text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </td>
                <td className="py-1.5 px-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={(item.unitPrice / 100).toFixed(2)}
                      onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 border border-transparent hover:border-slate-200 focus:border-amber-400 rounded-md text-sm text-right bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-all"
                    />
                  </div>
                </td>
                <td className="py-1.5 px-2 text-right font-semibold text-slate-700 text-sm">
                  {formatMoney(item.quantity * item.unitPrice)}
                </td>
                <td className="py-1.5 pr-3">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="w-6 h-6 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add item button */}
        <button
          type="button"
          onClick={addItem}
          className="w-full py-2.5 text-sm text-slate-400 hover:text-amber-600 hover:bg-amber-50/50 transition-colors flex items-center justify-center gap-1.5 border-t border-slate-100 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add line item
        </button>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">{formatMoney(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600 items-center gap-2">
            <span className="flex items-center gap-1.5">
              Tax
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 border border-slate-200 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              />
              <span className="text-xs text-slate-400">%</span>
            </span>
            <span className="font-medium">{formatMoney(taxCents)}</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{formatMoney(totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileMenuButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-lg bg-brand-slate text-white flex items-center justify-center shadow-lg cursor-pointer"
        aria-label="Menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar drawer on mobile */}
      <div className={`lg:hidden fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div onClick={() => setOpen(false)}>
          {children}
        </div>
      </div>
    </>
  );
}

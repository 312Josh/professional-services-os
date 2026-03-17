"use client";

import { useState, useCallback } from "react";
import { X, Calendar, Clock, CheckCircle2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SERVICES = [
  "Emergency Plumbing",
  "HVAC Repair",
  "Drain Cleaning",
  "Water Heater Service",
  "Sewer & Water Lines",
  "General Inquiry",
];

function getNext14Days(): { label: string; value: string; day: string; date: number }[] {
  const days: { label: string; value: string; day: string; date: number }[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(Date.now() + i * 86400000);
    days.push({
      label: `${dayNames[d.getDay()]} ${monthNames[d.getMonth()]} ${d.getDate()}`,
      value: d.toISOString().split("T")[0],
      day: dayNames[d.getDay()],
      date: d.getDate(),
    });
  }
  return days;
}

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

export function BookingModal({ trigger, brandColor = "#f59e0b" }: { trigger: React.ReactNode; brandColor?: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"date" | "details" | "confirm">("date");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");

  const days = getNext14Days();

  const reset = useCallback(() => {
    setStep("date");
    setSelectedDate("");
    setSelectedTime("");
    setName("");
    setPhone("");
    setService("");
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(reset, 300);
  }, [reset]);

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">{trigger}</span>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={close}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: brandColor }} />
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      {step === "confirm" ? "Booking Confirmed" : "Book a Service Call"}
                    </h2>
                  </div>
                  <button onClick={close} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="p-5">
                  {/* Step 1: Date & Time */}
                  {step === "date" && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">Select a date</p>
                      <div className="grid grid-cols-7 gap-1.5 mb-5">
                        {days.map((d) => (
                          <button
                            key={d.value}
                            onClick={() => setSelectedDate(d.value)}
                            className={`flex flex-col items-center py-2 rounded-lg text-center transition-all cursor-pointer ${
                              selectedDate === d.value
                                ? "text-white shadow-md"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                            }`}
                            style={selectedDate === d.value ? { backgroundColor: brandColor } : {}}
                          >
                            <span className="text-[10px] font-medium">{d.day}</span>
                            <span className="text-sm font-bold">{d.date}</span>
                          </button>
                        ))}
                      </div>

                      {selectedDate && (
                        <>
                          <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" /> Select a time
                          </p>
                          <div className="grid grid-cols-4 gap-2 mb-5">
                            {TIME_SLOTS.map((t) => (
                              <button
                                key={t}
                                onClick={() => setSelectedTime(t)}
                                className={`py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                  selectedTime === t
                                    ? "text-white shadow-md"
                                    : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                                }`}
                                style={selectedTime === t ? { backgroundColor: brandColor } : {}}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {selectedDate && selectedTime && (
                        <button
                          onClick={() => setStep("details")}
                          className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: brandColor }}
                        >
                          Continue
                        </button>
                      )}
                    </div>
                  )}

                  {/* Step 2: Details */}
                  {step === "details" && (
                    <div>
                      <div className="bg-slate-50 rounded-lg p-3 mb-5 flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-medium">{days.find((d) => d.value === selectedDate)?.label} at {selectedTime}</span>
                        <button onClick={() => setStep("date")} className="text-xs text-blue-600 hover:text-blue-500 ml-auto cursor-pointer">Change</button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name *</label>
                          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone *</label>
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Needed</label>
                          <select value={service} onChange={(e) => setService(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 bg-white">
                            <option value="">Select a service...</option>
                            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => { if (name && phone) setStep("confirm"); }}
                        disabled={!name || !phone}
                        className="w-full py-3 rounded-xl text-white font-bold text-sm mt-5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: brandColor }}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {step === "confirm" && (
                    <div className="text-center py-4">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="font-display text-xl font-bold text-slate-900 mb-2">You&apos;re Booked</h3>
                      <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-600 space-y-1">
                        <p><strong>{days.find((d) => d.value === selectedDate)?.label}</strong> at <strong>{selectedTime}</strong></p>
                        <p>{name} · {phone}</p>
                        {service && <p>{service}</p>}
                      </div>
                      <p className="text-sm text-slate-500 mb-4">
                        You&apos;ll receive a confirmation text and a reminder before your appointment.
                      </p>
                      <button onClick={close} className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer text-white" style={{ backgroundColor: brandColor }}>
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

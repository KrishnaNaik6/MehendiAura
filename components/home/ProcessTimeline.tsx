import React from "react";
import { Search, MessageSquare, CalendarCheck, Sparkles } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Browse Collections",
    desc: "Explore our catalog of bridal mehendi packages and rental jewellery sets.",
    icon: Search,
  },
  {
    step: "02",
    title: "Direct WhatsApp / Call",
    desc: "Click 'Enquire on WhatsApp' or 'Call Now' for instant date availability.",
    icon: MessageSquare,
  },
  {
    step: "03",
    title: "Confirm Booking",
    desc: "Finalize event date, custom design preferences, and rental deposit terms.",
    icon: CalendarCheck,
  },
  {
    step: "04",
    title: "Doorstep Service",
    desc: "Our artists deliver doorstep bridal application and pristine rental sets.",
    icon: Sparkles,
  },
];

export function ProcessTimeline() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
      {STEPS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft relative flex flex-col justify-between group hover:shadow-gold-glow hover:-translate-y-1 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif font-bold text-3xl text-gold-500/40 group-hover:text-gold-500 transition-colors">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg text-brand-900 mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-brand-700 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-6 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}

import React from "react";
import { Search, MessageSquare, CalendarCheck, Sparkles } from "lucide-react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";

interface ProcessTimelineProps {
  locale?: Locale;
}

export function ProcessTimeline({ locale = "en" }: ProcessTimelineProps) {
  const dictionary = getDictionary(locale);

  const steps = [
    {
      step: "01",
      title: dictionary.home.step1Title,
      desc: dictionary.home.step1Desc,
      icon: Search,
    },
    {
      step: "02",
      title: dictionary.home.step2Title,
      desc: dictionary.home.step2Desc,
      icon: MessageSquare,
    },
    {
      step: "03",
      title: dictionary.home.step3Title,
      desc: dictionary.home.step3Desc,
      icon: CalendarCheck,
    },
    {
      step: "04",
      title: dictionary.home.step4Title,
      desc: dictionary.home.step4Desc,
      icon: Sparkles,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
      {steps.map((item, idx) => {
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

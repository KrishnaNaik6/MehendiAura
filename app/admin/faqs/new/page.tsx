"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { createFaq } from "../actions";

export default function NewFaqPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createFaq(formData);
      if (res.error) {
        toast.error("Creation Failed", { description: res.error });
      } else {
        toast.success("FAQ Question Added!");
        router.push("/admin/faqs");
      }
    } catch {
      toast.error("Failed to add FAQ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <Link
        href="/admin/faqs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to FAQs List</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-900">
              Add FAQ Question &amp; Answer
            </h1>
            <p className="text-xs text-brand-600">
              Create an expandable accordion item with English and Kannada text.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                name="category"
                defaultValue="General"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="General">General Inquiries</option>
                <option value="Mehendi">Mehendi &amp; Stain Care</option>
                <option value="Jewellery">Rental Jewellery &amp; Deposit</option>
                <option value="Booking">Booking &amp; Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Display Order Priority
              </label>
              <input
                type="number"
                name="display_order"
                defaultValue={1}
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-cream-200">
            {/* English FAQ */}
            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider block">
                🇬🇧 English Question &amp; Answer
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Question (English) *
                </label>
                <input
                  type="text"
                  name="question_en"
                  required
                  placeholder="How long does the bridal mehendi stain last?"
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Answer (English) *
                </label>
                <textarea
                  name="answer_en"
                  required
                  rows={3}
                  placeholder="With proper natural aftercare, our 100% organic henna stain peaks at 24-48 hours and lasts 10 to 14 days."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            {/* Kannada FAQ */}
            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                🇮🇳 Kannada Question &amp; Answer (ಕನ್ನಡ)
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಪ್ರಶ್ನೆ (Kannada Question)
                </label>
                <input
                  type="text"
                  name="question_kn"
                  placeholder="ಬ್ರೈಡಲ್ ಮೆಹೆಂದಿ ಬಣ್ಣ ಎಷ್ಟು ದಿನಗಳ ಕಾಲ ಇರುತ್ತದೆ?"
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಉತ್ತರ (Kannada Answer)
                </label>
                <textarea
                  name="answer_kn"
                  rows={3}
                  placeholder="ಸೂಕ್ತವಾದ ನೈಸರ್ಗಿಕ ಕಾಳಜಿಯೊಂದಿಗೆ, ನಮ್ಮ 100% ನೈಸರ್ಗಿಕ ಮೆಹೆಂದಿ ಬಣ್ಣವು 10 ರಿಂದ 14 ದಿನಗಳ ಕಾಲ ಗಾಢವಾಗಿ ಇರುತ್ತದೆ."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
              <input type="checkbox" name="active" value="true" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
              <span>Active Status (Visible on Homepage)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
            <Link href="/admin/faqs">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="gold" type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
              Save FAQ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

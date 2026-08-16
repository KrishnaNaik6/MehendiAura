"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { FAQ } from "@/types/database";
import { toggleFaqActive, deleteFaq } from "./actions";

interface FaqsTableProps {
  initialFaqs: FAQ[];
}

export function FaqsTable({ initialFaqs }: FaqsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState(initialFaqs);
  const router = useRouter();

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = async (item: FAQ) => {
    try {
      const res = await toggleFaqActive(item.id, item.active);
      if (res.error) {
        toast.error("Status Update Failed", { description: res.error });
      } else {
        toast.success(`FAQ ${!item.active ? "Activated" : "Deactivated"}`);
        setFaqs((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, active: !f.active } : f))
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (item: FAQ) => {
    if (!confirm(`Are you sure you want to delete FAQ "${item.question}"?`)) return;

    try {
      const res = await deleteFaq(item.id);
      if (res.error) {
        toast.error("Delete Failed", { description: res.error });
      } else {
        toast.success("FAQ Deleted");
        setFaqs((prev) => prev.filter((f) => f.id !== item.id));
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gold-300/30 shadow-soft overflow-hidden space-y-4 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-cream-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="text-xs text-brand-700 font-semibold">
          Total FAQs: <span className="text-gold-700 font-bold">{filtered.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-xs font-semibold text-gold-700 uppercase tracking-wider bg-cream-50/50">
              <th className="py-3 px-4">Question</th>
              <th className="py-3 px-4">Answer</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-brand-600 text-sm">
                  No FAQs found. Click "Add Question &amp; Answer" to create one!
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-cream-50/80 transition-colors">
                  <td className="py-4 px-4 font-semibold text-brand-900 max-w-xs">
                    {item.question}
                  </td>
                  <td className="py-4 px-4 text-xs text-brand-700 max-w-sm truncate">
                    {item.answer}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-800/10 text-brand-900 border border-brand-800/20">
                      {item.category || "General"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        item.active
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                          : "bg-red-500/10 text-red-700 border-red-500/30"
                      }`}
                    >
                      {item.active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-500/10 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Star, Edit, Trash2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Service } from "@/types/database";
import { toggleServiceActive, toggleServiceFeatured, deleteService } from "./actions";

interface ServicesTableProps {
  initialServices: Service[];
}

export function ServicesTable({ initialServices }: ServicesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState(initialServices);
  const router = useRouter();

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await toggleServiceActive(service.id, service.active);
      if (res.error) {
        toast.error("Status Update Failed", { description: res.error });
      } else {
        toast.success(
          `Service ${!service.active ? "Activated" : "Deactivated"}`
        );
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, active: !s.active } : s))
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleToggleFeatured = async (service: Service) => {
    try {
      const res = await toggleServiceFeatured(service.id, service.featured);
      if (res.error) {
        toast.error("Featured Update Failed", { description: res.error });
      } else {
        toast.success(
          `Service ${!service.featured ? "Featured" : "Unfeatured"}`
        );
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, featured: !s.featured } : s))
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to toggle featured status");
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) return;

    try {
      const res = await deleteService(service.id);
      if (res.error) {
        toast.error("Delete Failed", { description: res.error });
      } else {
        toast.success("Service Deleted");
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gold-300/30 shadow-soft overflow-hidden space-y-4 p-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-cream-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="text-xs text-brand-700 font-semibold">
          Total Services: <span className="text-gold-700 font-bold">{filteredServices.length}</span>
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-xs font-semibold text-gold-700 uppercase tracking-wider bg-cream-50/50">
              <th className="py-3 px-4">Service Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-center">Active Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-brand-600 text-sm">
                  No services found. Click "Add New Service" to create one!
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-cream-50/80 transition-colors">
                  <td className="py-4 px-4 font-semibold text-brand-900">
                    <div className="flex flex-col">
                      <span>{service.name}</span>
                      <span className="text-[11px] text-brand-600 font-mono font-normal">
                        /{service.slug}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-800/10 text-brand-900 border border-brand-800/20">
                      {service.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gold-700">
                    {service.price || "Contact for Price"}
                  </td>
                  <td className="py-4 px-4 text-brand-700 text-xs">
                    {service.duration || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(service)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        service.featured
                          ? "bg-gold-500/20 text-gold-700 border-gold-400"
                          : "bg-cream-100 text-cream-400 border-cream-300 hover:text-gold-600"
                      }`}
                      title={service.featured ? "Featured on Home" : "Click to Feature"}
                    >
                      <Star className={`w-4 h-4 ${service.featured ? "fill-gold-500 text-gold-500" : ""}`} />
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        service.active
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                          : "bg-red-500/10 text-red-700 border-red-500/30"
                      }`}
                    >
                      {service.active ? (
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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/services/${service.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-brand-700 hover:text-brand-900 hover:bg-cream-200 transition-colors"
                        title="View Public Service Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="p-2 rounded-lg text-gold-700 hover:text-gold-900 hover:bg-gold-500/10 transition-colors"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service)}
                        className="p-2 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-500/10 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

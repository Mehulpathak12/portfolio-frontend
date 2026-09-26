"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { X, Save, Edit3, AlertCircle, CheckCircle2 } from "lucide-react";

export default function UniversalSectionModal() {
  const { activeEditModal, activeEditItem, closeEditModal, refreshPortfolio, getAuthHeaders } = useAdmin();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (activeEditItem) {
      setFormData({ ...activeEditItem });
    } else {
      setFormData({});
    }
    setStatusMessage(null);
  }, [activeEditItem, activeEditModal]);

  // Only render if it's a section modal (not item modals like 'project', 'experience', 'certificate')
  const isSectionModal = activeEditModal && !["project", "experience", "certificate"].includes(activeEditModal);
  if (!isSectionModal) return null;

  const sectionName = activeEditModal;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/admin/section/${sectionName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: "Section updated successfully!" });
        await refreshPortfolio();
        setTimeout(() => {
          closeEditModal();
        }, 800);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to update section" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 capitalize">
                Edit Section: {sectionName}
              </h2>
              <p className="text-xs text-neutral-500">Changes update directly to MongoDB</p>
            </div>
          </div>
          <button
            onClick={closeEditModal}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Render input fields dynamically according to keys in formData */}
          {Object.entries(formData).map(([key, val]) => {
            if (key === "_id" || key === "id") return null;

            // Render array of cards or categories or simple string tags
            if (Array.isArray(val)) {
              if (val.length === 0 || typeof val[0] === "string") {
                const arrayLabel = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());
                return (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      {arrayLabel} (comma separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(val) ? val.join(", ") : String(val || "")}
                      onChange={(e) => {
                        const arr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        setFormData({ ...formData, [key]: arr });
                      }}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    />
                  </div>
                );
              }

              return (
                <div key={key} className="col-span-full p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                    {key} ({val.length} items)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {val.map((item: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-2 text-xs">
                        <span className="text-[10px] font-bold text-neutral-400 block uppercase">Item {idx + 1}</span>
                        {Object.entries(item).map(([subK, subV]) => (
                          <div key={subK}>
                            <label className="text-[10px] font-semibold text-neutral-500 uppercase block mb-1">
                              {subK}
                            </label>
                            {Array.isArray(subV) ? (
                              <input
                                type="text"
                                value={subV.join(", ")}
                                onChange={(e) => {
                                  const newArr = [...val];
                                  newArr[idx][subK] = e.target.value.split(",").map((s) => s.trim());
                                  setFormData({ ...formData, [key]: newArr });
                                }}
                                className="w-full px-2.5 py-1 text-xs rounded border border-neutral-200"
                              />
                            ) : (
                              <input
                                type="text"
                                value={String(subV || "")}
                                onChange={(e) => {
                                  const newArr = [...val];
                                  newArr[idx][subK] = e.target.value;
                                  setFormData({ ...formData, [key]: newArr });
                                }}
                                className="w-full px-2.5 py-1 text-xs rounded border border-neutral-200"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (typeof val === "object" && val !== null) return null;

            const isMultiline = key.toLowerCase().includes("bio") || key.toLowerCase().includes("subtitle") || key.toLowerCase().includes("description");
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            return (
              <div key={key}>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {label}
                </label>
                {isMultiline ? (
                  <textarea
                    rows={4}
                    value={String(val || "")}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                ) : (
                  <input
                    type="text"
                    value={String(val || "")}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                )}
              </div>
            );
          })}

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

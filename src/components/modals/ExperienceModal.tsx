"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { X, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ExperienceModal() {
  const { activeEditModal, activeEditItem, closeEditModal, refreshPortfolio, getAuthHeaders } = useAdmin();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    company: "",
    type: "Internship",
    location: "Remote",
    startDate: "",
    endDate: "Present",
    current: false,
    description: "",
    technologies: "",
    link: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (activeEditModal === "experience" && activeEditItem) {
      setFormData({
        id: activeEditItem.id || activeEditItem._id || "",
        title: activeEditItem.title || "",
        company: activeEditItem.company || "",
        type: activeEditItem.type || "Internship",
        location: activeEditItem.location || "Remote",
        startDate: activeEditItem.startDate || "",
        endDate: activeEditItem.endDate || "Present",
        current: Boolean(activeEditItem.current),
        description: Array.isArray(activeEditItem.description)
          ? activeEditItem.description.join("\n")
          : (activeEditItem.description || ""),
        technologies: Array.isArray(activeEditItem.technologies)
          ? activeEditItem.technologies.join(", ")
          : (activeEditItem.technologies || ""),
        link: activeEditItem.link || "",
        order: activeEditItem.order !== undefined ? Number(activeEditItem.order) : 0,
      });
    } else if (activeEditModal === "experience") {
      setFormData({
        id: "",
        title: "",
        company: "",
        type: "Internship",
        location: "Remote",
        startDate: "",
        endDate: "Present",
        current: false,
        description: "Built key features and integrated REST APIs.\nCollaborated with cross-functional teams to ship on schedule.",
        technologies: "React, Node.js, Git",
        link: "",
        order: 0,
      });
    }
    setStatusMessage(null);
  }, [activeEditModal, activeEditItem]);

  if (activeEditModal !== "experience") return null;

  const handleCurrentChange = (checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, current: true, endDate: "Present" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        current: false,
        endDate: prev.endDate.trim().toLowerCase() === "present" ? "" : prev.endDate,
      }));
    }
  };

  const handleEndDateChange = (val: string) => {
    const isPresent = val.trim().toLowerCase() === "present";
    setFormData((prev) => ({
      ...prev,
      endDate: val,
      current: isPresent,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const cleanEndDate = (formData.endDate || "").trim();
    let isCurrent = Boolean(formData.current);
    let finalEndDate = cleanEndDate;

    if (cleanEndDate && cleanEndDate.toLowerCase() !== "present") {
      isCurrent = false;
      finalEndDate = cleanEndDate;
    } else if (isCurrent || !cleanEndDate || cleanEndDate.toLowerCase() === "present") {
      isCurrent = true;
      finalEndDate = "Present";
    }

    const payload = {
      ...formData,
      current: isCurrent,
      endDate: finalEndDate,
    };

    try {
      const res = await fetch("/api/admin/experience/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: "Experience saved successfully!" });
        await refreshPortfolio();
        setTimeout(() => closeEditModal(), 800);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to save experience" });
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {formData.id ? "Edit Experience" : "Add Experience"}
            </h2>
            <p className="text-xs text-neutral-500">Record practical work, internships, and hackathons</p>
          </div>
          <button
            onClick={closeEditModal}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Job Title / Role
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Software Developer Intern"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Tech Innovators Ltd"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Role Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract / Freelance">Contract / Freelance</option>
                <option value="Hackathon Team Lead">Hackathon Team Lead</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Remote / On-site"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="Jan 2025"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                placeholder="Present or e.g. Dec 2024"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentRole"
              checked={formData.current}
              onChange={(e) => handleCurrentChange(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
            />
            <label htmlFor="currentRole" className="text-xs font-medium text-neutral-700 cursor-pointer">
              I am currently working in this role (sets End Date to "Present")
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Key Contributions & Highlights (one bullet per line)
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Technologies Used (comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Saving..." : "Save Experience"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

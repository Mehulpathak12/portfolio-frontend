"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { X, Save, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

export default function CertificateModal() {
  const { activeEditModal, activeEditItem, closeEditModal, refreshPortfolio, getAuthHeaders } = useAdmin();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    provider: "",
    image: "/image/certificate/git-certificate.jpg",
    date: "",
    link: "#",
    order: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (activeEditModal === "certificate" && activeEditItem) {
      setFormData({
        id: activeEditItem.id || activeEditItem._id || "",
        title: activeEditItem.title || "",
        provider: activeEditItem.provider || "",
        image: activeEditItem.image || "/image/certificate/git-certificate.jpg",
        date: activeEditItem.date || "",
        link: activeEditItem.link || "#",
        order: activeEditItem.order !== undefined ? Number(activeEditItem.order) : 0,
      });
    } else if (activeEditModal === "certificate") {
      setFormData({
        id: "",
        title: "",
        provider: "",
        image: "/image/certificate/git-certificate.jpg",
        date: "",
        link: "#",
        order: 0,
      });
    }
    setStatusMessage(null);
  }, [activeEditModal, activeEditItem]);

  if (activeEditModal !== "certificate") return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        setStatusMessage({ type: "success", text: "Certificate image uploaded!" });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/certificates/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: "Certificate saved successfully!" });
        await refreshPortfolio();
        setTimeout(() => closeEditModal(), 800);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to save certificate" });
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
        className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {formData.id ? "Edit Certificate" : "Add Certificate"}
            </h2>
            <p className="text-xs text-neutral-500">Record verified credentials and achievements</p>
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

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Certificate Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Git and GitHub Certification"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Provider / Issuer
              </label>
              <input
                type="text"
                required
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="Udemy / Coursera / Google"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Issue Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="June 2025"
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

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Verification Link
            </label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Certificate Image / Badge
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <label className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
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
              disabled={loading || uploadingImage}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Saving..." : "Save Certificate"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

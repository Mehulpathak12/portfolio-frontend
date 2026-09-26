"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Edit3, Clock } from "lucide-react";

export default function ContactSection() {
  const { portfolio, isAdmin, openEditModal } = useAdmin();
  const contact = portfolio?.siteConfig?.contact || {
    eyebrow: "Get in Touch",
    title: "Let's build something together.",
    subtitle:
      "Whether you have an exciting software role, a freelance project, or just want to talk about full-stack web apps or AI tools, my inbox is always open.",
    email: "mehulpathak48@gmail.com",
    location: "Ajmer, Rajasthan, India",
  };

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been safely received. I will reply shortly.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again or email directly.",
        });
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Network error. Please try again or email directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              {contact.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              {contact.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {contact.subtitle}
            </p>
          </div>

          {isAdmin && (
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => openEditModal("contact", contact)}
                className="apple-edit-btn"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Contact</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-neutral-900">
                Direct Contact Channels
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-neutral-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Email</span>
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{contact.email}</span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Location</span>
                    <span className="text-sm font-bold text-neutral-900">{contact.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Response Time</span>
                    <span className="text-sm font-bold text-neutral-900">Typically within 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500 leading-relaxed">
                Open to full-time software engineering roles, full-stack internships, and ambitious freelance projects.
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7">
            <div className="apple-card p-6 sm:p-10">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Send a Message
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mb-6">
                Your message is stored securely and dispatched immediately.
              </p>

              {status && (
                <div
                  className={`p-4 rounded-2xl border mb-6 flex items-start gap-3 text-xs leading-relaxed ${
                    status.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your role or project..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 hover:bg-black text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending Message..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

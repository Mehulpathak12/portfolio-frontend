"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Briefcase, Calendar, MapPin, Plus, Edit3, Trash2, ExternalLink } from "lucide-react";

export default function ExperienceSection() {
  const { portfolio, isAdmin, openEditModal, refreshPortfolio } = useAdmin();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const expHeader = portfolio?.siteConfig?.experience || {
    eyebrow: "Journey & Roles",
    title: "Experience & Practical Work.",
    subtitle: "Real projects, hackathons, client work, and hands-on software development.",
  };

  const experiences = portfolio?.experiences || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshPortfolio();
      }
    } catch (err) {
      console.error("Failed to delete experience:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="experience" className="py-20 sm:py-28 bg-[#f5f5f7]/50 border-t border-neutral-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              {expHeader.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              {expHeader.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {expHeader.subtitle}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => openEditModal("experience", expHeader)}
                  className="apple-edit-btn"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Header</span>
                </button>
                <button
                  onClick={() => openEditModal("experience")}
                  className="apple-edit-btn bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Experience</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Timeline List */}
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          {experiences.length === 0 ? (
            <div className="text-center py-12 apple-card p-8">
              <p className="text-sm text-neutral-500">No experience records found.</p>
            </div>
          ) : (
            experiences.map((exp: any, idx: number) => {
              const expId = exp.id || exp._id;
              const descList = Array.isArray(exp.description)
                ? exp.description
                : (exp.description ? [exp.description] : []);
              const techList = Array.isArray(exp.technologies)
                ? exp.technologies
                : (exp.technologies ? exp.technologies.split(",").map((t: string) => t.trim()) : []);

              return (
                <div
                  key={expId || idx}
                  className="apple-card p-6 sm:p-8 relative transition-all group"
                >
                  {/* Action buttons if admin */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
                      <button
                        onClick={() => openEditModal("experience", exp)}
                        className="apple-edit-btn"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(expId)}
                        disabled={deletingId === expId}
                        className="apple-delete-btn"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{deletingId === expId ? "..." : "Delete"}</span>
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                          {exp.title}
                        </h3>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/50">
                          {exp.type || "Internship"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-neutral-700 mt-1">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{exp.startDate} – {exp.endDate || (exp.current ? "Present" : "")}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bullet points */}
                  {descList.length > 0 && (
                    <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 mb-5 pl-4 list-disc marker:text-neutral-400">
                      {descList.map((item: string, i: number) => (
                        <li key={i} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech stack & optional link */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {exp.link && (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>View Project / Reference</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}

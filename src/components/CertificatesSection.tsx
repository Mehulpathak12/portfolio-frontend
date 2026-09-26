"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Award, ExternalLink, Plus, Edit3, Trash2 } from "lucide-react";

export default function CertificatesSection() {
  const { portfolio, isAdmin, openEditModal, refreshPortfolio } = useAdmin();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const certHeader = portfolio?.siteConfig?.certificates || {
    eyebrow: "Learning & Credentials",
    title: "Certificates & Achievements.",
    subtitle: "Verified credentials from Google Developer Groups, Coursera, and Udemy.",
  };

  const certificates = portfolio?.certificates || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshPortfolio();
      }
    } catch (err) {
      console.error("Failed to delete certificate:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="certificates" className="py-20 sm:py-28 bg-[#f5f5f7]/50 border-t border-neutral-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              {certHeader.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              {certHeader.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {certHeader.subtitle}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => openEditModal("certificates", certHeader)}
                  className="apple-edit-btn"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Header</span>
                </button>
                <button
                  onClick={() => openEditModal("certificate")}
                  className="apple-edit-btn bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Certificate</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.length === 0 ? (
            <div className="col-span-full text-center py-12 apple-card">
              <p className="text-sm text-neutral-500">No certificates added yet.</p>
            </div>
          ) : (
            certificates.map((cert: any, idx: number) => {
              const certId = cert.id || cert._id;

              return (
                <div
                  key={certId || idx}
                  className="apple-card overflow-hidden flex flex-col justify-between group relative"
                >
                  {/* Admin controls */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-md">
                      <button
                        onClick={() => openEditModal("certificate", cert)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Edit Certificate"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(certId)}
                        disabled={deletingId === certId}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="aspect-[4/3] w-full bg-neutral-100 overflow-hidden relative border-b border-neutral-100">
                    <img
                      src={cert.image || "/image/certificate/git-certificate.jpg"}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => {
                        e.target.src = "/image/certificate/git-certificate.jpg";
                      }}
                    />
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-neutral-800 backdrop-blur-md shadow-xs">
                        {cert.provider}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
                        {cert.title}
                      </h3>
                      {cert.date && (
                        <p className="text-xs text-neutral-400 font-medium mb-4">
                          Issued {cert.date}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-neutral-100">
                      {cert.link && cert.link !== "#" ? (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Verify Credential</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-neutral-400 block text-center py-2">
                          Verified Completion
                        </span>
                      )}
                    </div>
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

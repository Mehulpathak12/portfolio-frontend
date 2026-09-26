"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { ExternalLink, Plus, Edit3, Trash2, Sparkles, Eye } from "lucide-react";
import { GitHubIcon } from "@/components/Icons";

const CATEGORIES = ["All", "Full Stack", "AI & Tools", "Backend & APIs", "Desktop Apps"];

export default function ProjectsSection() {
  const { portfolio, isAdmin, openEditModal, refreshPortfolio } = useAdmin();
  const [activeCategory, setActiveCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const projectsHeader = portfolio?.siteConfig?.projects || {
    eyebrow: "Selected Works",
    title: "Projects.",
    subtitle: "Full-stack web applications, AI tools, desktop utilities, and open-source contributions.",
  };

  const rawProjects = portfolio?.projects || [];

  // Filter projects by category
  const filteredProjects = rawProjects.filter((p: any) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "AI & Tools") {
      return (
        p.category === "AI & Tools" ||
        p.category === "AI & Full Stack" ||
        p.category === "AI & Desktop" ||
        (Array.isArray(p.tools) && p.tools.some((t: string) => t.toLowerCase().includes("ai") || t.toLowerCase().includes("rag") || t.toLowerCase().includes("python")))
      );
    }
    return p.category === activeCategory;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshPortfolio();
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="projects" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              {projectsHeader.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              {projectsHeader.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {projectsHeader.subtitle}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => openEditModal("projects", projectsHeader)}
                  className="apple-edit-btn"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Header</span>
                </button>
                <button
                  onClick={() => openEditModal("project")}
                  className="apple-edit-btn bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Project</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16 apple-card">
              <p className="text-sm text-neutral-500">No projects found in this category.</p>
            </div>
          ) : (
            filteredProjects.map((project: any, idx: number) => {
              const projId = project.id || project._id;
              const toolsList = Array.isArray(project.tools)
                ? project.tools
                : (project.tools ? project.tools.split(",").map((t: string) => t.trim()) : []);

              return (
                <div
                  key={projId || idx}
                  onClick={() => setSelectedProject(project)}
                  className="apple-card overflow-hidden flex flex-col justify-between group cursor-pointer relative"
                >
                  {/* Admin Edit/Delete */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-md">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal("project", project);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(projId, e)}
                        disabled={deletingId === projId}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Thumbnail Image */}
                  <div className="relative aspect-video w-full bg-neutral-100 overflow-hidden border-b border-neutral-100">
                    <img
                      src={project.image || "/image/project/skill.png"}
                      alt={project.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => {
                        e.target.src = "/image/project/skill.png";
                      }}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/95 text-neutral-800 backdrop-blur-md shadow-xs">
                        {project.category || "Full Stack"}
                      </span>
                      {project.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/90 text-white backdrop-blur-md shadow-xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {/* Tools Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {toolsList.slice(0, 4).map((tool: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-600"
                          >
                            {tool}
                          </span>
                        ))}
                        {toolsList.length > 4 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-400">
                            +{toolsList.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                        {project.liveLink && project.liveLink !== "#" ? (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-black transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : null}

                        {project.codeLink && project.codeLink !== "#" ? (
                          <a
                            href={project.codeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5"
                          >
                            <GitHubIcon className="w-3 h-3" />
                            <span>Code</span>
                          </a>
                        ) : null}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                          className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-neutral-100">
              <img
                src={selectedProject.image || "/image/project/skill.png"}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src = "/image/project/skill.png";
                }}
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200/50">
                  {selectedProject.category}
                </span>
                {selectedProject.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200/50">
                    Featured Project
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                {selectedProject.title}
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                {selectedProject.detailedDescription || selectedProject.description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Stack & Tooling
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedProject.tools) ? selectedProject.tools : (selectedProject.tools || "").split(",")).map((tool: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700"
                    >
                      {tool.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-neutral-100">
                {selectedProject.liveLink && selectedProject.liveLink !== "#" && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 text-center rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch Live Application</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.codeLink && selectedProject.codeLink !== "#" && (
                  <a
                    href={selectedProject.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 text-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <GitHubIcon className="w-3.5 h-3.5" />
                    <span>View GitHub Source</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

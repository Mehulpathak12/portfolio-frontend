"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { Layers, BrainCircuit, Database, Terminal, Edit3 } from "lucide-react";

export default function SkillsSection() {
  const { portfolio, isAdmin, openEditModal } = useAdmin();
  const skills = portfolio?.siteConfig?.skills || {
    eyebrow: "Tech Stack & Toolkit",
    title: "Tools and technologies I use to build.",
    subtitle: "A practical blend of web development frameworks, AI tooling, core languages, and developer utilities.",
    categories: [
      {
        title: "Full Stack Web",
        description: "Designing responsive, accessible user interfaces and connecting them with clean RESTful backends.",
        tags: ["React", "Node.js", "Express", "Tailwind CSS", "JavaScript (ES6+)", "Next.js", "REST APIs"],
      },
      {
        title: "AI & Intelligent Tooling",
        description: "Building document retrieval pipelines, experimenting with vector embeddings, and integrating local LLM inference.",
        tags: ["Python", "FastAPI", "RAG Pipelines", "Ollama / Local LLMs", "Vector Embeddings", "Prompt Design"],
      },
      {
        title: "Core & Databases",
        description: "Object-oriented programming, data structure fundamentals, and persistent database modeling.",
        tags: ["Java", "DSA (LeetCode 120+)", "MongoDB Atlas", "MySQL", "OOP Fundamentals", "C++ Basics"],
      },
      {
        title: "DevOps & Developer Tools",
        description: "Version control, API debugging, containerization basics, and cloud deployment pipelines.",
        tags: ["Git & GitHub", "Postman", "Docker Basics", "Linux CLI", "VPS & Hostinger", "VS Code"],
      },
    ],
  };

  const categoryIcons = [
    <Layers key="web" className="w-5 h-5 text-blue-600" />,
    <BrainCircuit key="ai" className="w-5 h-5 text-purple-600" />,
    <Database key="db" className="w-5 h-5 text-emerald-600" />,
    <Terminal key="tools" className="w-5 h-5 text-neutral-800" />,
  ];

  return (
    <section id="skills" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              {skills.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              {skills.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {skills.subtitle}
            </p>
          </div>

          {isAdmin && (
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => openEditModal("skills", skills)}
                className="apple-edit-btn"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Skills</span>
              </button>
            </div>
          )}
        </div>

        {/* 4 Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {skills.categories?.map((cat: any, idx: number) => (
            <div
              key={cat.title || idx}
              className="apple-card p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                    {categoryIcons[idx % categoryIcons.length]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{cat.title}</h3>
                    <span className="text-xs text-neutral-400 font-medium">{cat.tags?.length || 0} Core Technologies</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 mb-6 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100">
                {cat.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-700 bg-neutral-100/80 border border-neutral-200/50 hover:bg-neutral-200/80 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

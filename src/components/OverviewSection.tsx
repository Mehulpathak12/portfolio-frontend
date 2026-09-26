"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { Code2, Brain, Database, Cpu, Edit3 } from "lucide-react";

export default function OverviewSection() {
  const { portfolio, isAdmin, openEditModal } = useAdmin();
  const overview = portfolio?.siteConfig?.overview || {
    eyebrow: "At a Glance",
    title: "What I bring to the table.",
    subtitle: "Hands-on experience across the entire software stack — from intuitive interfaces to intelligent backend workflows.",
    cards: [
      {
        eyebrow: "Full Stack Web",
        title: "Modern Web Apps",
        description: "Building interactive frontends with React and Tailwind CSS, backed by modular Node.js and Express REST services.",
        badge: "Frontend & Backend",
      },
      {
        eyebrow: "Applied AI",
        title: "RAG & LLM Tooling",
        description: "Integrating vector search, document embeddings, and local Ollama models into everyday developer workflows.",
        badge: "Intelligent Systems",
      },
      {
        eyebrow: "Data & APIs",
        title: "Schemas & Storage",
        description: "Designing structured collections in MongoDB, relational tables in MySQL, and testing robust endpoints with Postman.",
        badge: "Architecture",
      },
      {
        eyebrow: "Core Engineering",
        title: "Java DSA & Algorithms",
        description: "120+ solved LeetCode challenges focusing on arrays, strings, two-pointers, hash tables, and clean algorithmic thinking.",
        badge: "Problem Solving",
      },
    ],
  };

  const icons = [
    <Code2 key="code" className="w-5 h-5 text-blue-600" />,
    <Brain key="brain" className="w-5 h-5 text-purple-600" />,
    <Database key="data" className="w-5 h-5 text-emerald-600" />,
    <Cpu key="cpu" className="w-5 h-5 text-amber-600" />,
  ];

  return (
    <section id="overview" className="py-20 sm:py-28 bg-[#f5f5f7]/60 border-y border-neutral-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              {overview.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              {overview.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {overview.subtitle}
            </p>
          </div>

          {isAdmin && (
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => openEditModal("overview", overview)}
                className="apple-edit-btn"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Overview</span>
              </button>
            </div>
          )}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overview.cards?.map((card: any, idx: number) => (
            <div
              key={card.title || idx}
              className="apple-card p-6 sm:p-7 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {icons[idx % icons.length]}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">
                    {card.badge}
                  </span>
                </div>

                <span className="text-xs font-semibold text-neutral-400 block mb-1">
                  {card.eyebrow}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center text-xs font-medium text-neutral-400">
                <span>Domain 0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

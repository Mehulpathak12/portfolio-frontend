"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { ArrowDown, FileText, Edit3, Sparkles } from "lucide-react";

export default function HeroSection() {
  const { portfolio, isAdmin, openEditModal } = useAdmin();
  const hero = portfolio?.siteConfig?.hero || {
    eyebrow: "",
    title: "Crafting web apps, AI tools,",
    titleMuted: "and dependable software systems.",
    subtitle:
      "Hi, I'm Mehul Pathak. I build responsive full-stack applications with React and Node.js, experiment with AI & RAG tooling in Python, and solve algorithmic challenges in Java.",
    primaryBtnText: "Explore My Work",
    resumeLink: "https://drive.google.com/file/d/1N4h7X_MrmL1xsn-TegPZyhJ_S239UE2L/view",
    techStackTitle: "Core Engineering Stack & Tools",
    techStack: ["Next.js", "React 19", "Node.js & Express", "Python (FastAPI & RAG)", "Java DSA", "MongoDB Atlas", "Tailwind CSS"],
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-100/60 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* On-Page Edit Button */}
        {isAdmin && (
          <div className="absolute top-0 right-4 sm:right-6">
            <button
              onClick={() => openEditModal("hero", hero)}
              className="apple-edit-btn"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Hero</span>
            </button>
          </div>
        )}

        {/* Optional Custom Eyebrow */}
        {hero.eyebrow && hero.eyebrow !== "Full Stack & Software Developer • Open to Roles" && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100/80 border border-neutral-200/80 mb-6 sm:mb-8 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-neutral-700 tracking-tight">
              {hero.eyebrow}
            </span>
          </div>
        )}

        {/* Hero Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.08] sm:leading-[1.08] max-w-4xl mx-auto">
          {hero.title}{" "}
          <span className="text-neutral-400 font-semibold block sm:inline mt-1 sm:mt-0">
            {hero.titleMuted}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          {hero.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#projects"
            className="px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-neutral-900 hover:bg-black transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>{hero.primaryBtnText}</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href={hero.resumeLink || "https://drive.google.com/file/d/1N4h7X_MrmL1xsn-TegPZyhJ_S239UE2L/view"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full text-sm font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-200/90 transition-all shadow-xs hover:shadow hover:-translate-y-0.5 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-neutral-500" />
            <span>View Resume</span>
          </a>
        </div>

        {/* Quick Tech Highlights */}
        <div className="mt-14 sm:mt-20 pt-8 border-t border-neutral-200/60 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
              {hero.techStackTitle || "Core Engineering Stack & Tools"}
            </p>
            {isAdmin && (
              <button
                onClick={() => openEditModal("hero", hero)}
                className="p-1 rounded-md text-neutral-400 hover:text-blue-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Edit Core Engineering Stack & Tools"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-neutral-700">
            {(Array.isArray(hero.techStack)
              ? hero.techStack
              : (hero.techStack
                  ? hero.techStack.split(",").map((t: string) => t.trim()).filter(Boolean)
                  : ["Next.js", "React 19", "Node.js & Express", "Python (FastAPI & RAG)", "Java DSA", "MongoDB Atlas", "Tailwind CSS"]
                )
            ).map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full bg-white border border-neutral-200/70 shadow-xs hover:border-neutral-300 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

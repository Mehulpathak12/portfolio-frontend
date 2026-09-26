"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { MapPin, Mail, Code, Edit3, GraduationCap } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterXIcon, LeetCodeIcon } from "@/components/Icons";

export default function AboutSection() {
  const { portfolio, isAdmin, openEditModal } = useAdmin();
  const about = portfolio?.siteConfig?.about || {
    name: "Mehul Pathak",
    role: "Full Stack & Software Developer",
    headline: "Building web applications, exploring applied AI, and writing clean, reliable code.",
    bio1: "I'm a developer based in Ajmer, India, with a solid computer science background from MDS University. I love building full-stack web applications that look clean on the surface and run reliably underneath. Recently, I've been spending much of my time building practical AI tools — from RAG document search systems to local LLM-assisted desktop utilities.",
    bio2: "When I'm not writing JavaScript or Python, you'll find me solving data structure and algorithm puzzles on LeetCode with Java (120+ solved and counting), studying how modern web apps scale, or experimenting with new browser ideas. I value simple code, thoughtful UX, and shipping things that actually work.",
    location: "Ajmer, Rajasthan, India",
    email: "mehulpathak48@gmail.com",
    image: "/image/about1.jpg",
    github: "https://github.com/Mehulpathak12",
    linkedin: "https://www.linkedin.com/in/mehul-2004-10-pathak",
    leetcode: "https://leetcode.com/u/mehulpathak",
    twitter: "https://x.com/mehulpathak2004",
  };

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#f5f5f7]/50 border-t border-neutral-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              About Me
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              Background & Philosophy.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {about.headline}
            </p>
          </div>

          {isAdmin && (
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => openEditModal("about", about)}
                className="apple-edit-btn"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit About</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Photo & Quick Facts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="apple-card overflow-hidden p-3 bg-white">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100">
                <img
                  src={about.image || "/image/about1.jpg"}
                  alt={about.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e: any) => {
                    e.target.src = "/image/about1.jpg";
                  }}
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-neutral-900">{about.name}</h3>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">{about.role}</p>
              </div>
            </div>

            {/* Quick Details Card */}
            <div className="apple-card p-5 space-y-3.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{about.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>B.Sc. Computer Science • MDS University</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`mailto:${about.email}`} className="text-blue-600 hover:underline">
                  {about.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Socials */}
          <div className="lg:col-span-8 space-y-6">
            <div className="apple-card p-6 sm:p-10 space-y-5">
              <h3 className="text-xl font-bold text-neutral-900">
                Hello! I&apos;m Mehul Pathak.
              </h3>
              
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {about.bio1}
              </p>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {about.bio2}
              </p>

              {/* Social Channels */}
              <div className="pt-6 border-t border-neutral-100">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Connect & Social Channels
                </h4>
                <div className="flex flex-wrap gap-3">
                  {about.github && (
                    <a
                      href={about.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center gap-2 transition-all"
                    >
                      <GitHubIcon className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {about.linkedin && (
                    <a
                      href={about.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-2 transition-all"
                    >
                      <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {about.leetcode && (
                    <a
                      href={about.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-800 text-xs font-semibold flex items-center gap-2 transition-all"
                    >
                      <LeetCodeIcon className="w-4 h-4 text-amber-600" />
                      <span>LeetCode</span>
                    </a>
                  )}
                  {about.twitter && (
                    <a
                      href={about.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center gap-2 transition-all"
                    >
                      <TwitterXIcon className="w-4 h-4 text-neutral-700" />
                      <span>X / Twitter</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

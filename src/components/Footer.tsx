"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Code } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterXIcon, LeetCodeIcon } from "@/components/Icons";
import { useAdmin } from "@/context/AdminContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { portfolio } = useAdmin();
  const sections = portfolio?.sections || {};

  const social = portfolio?.siteConfig?.socialLinks || portfolio?.siteConfig?.about || {};
  const github = social.github || "https://github.com/Mehulpathak12";
  const linkedin = social.linkedin || "https://www.linkedin.com/in/mehul-2004-10-pathak";
  const leetcode = social.leetcode || "https://leetcode.com/u/mehulpathak";
  const twitter = social.twitter || "https://x.com/mehulpathak2004";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-neutral-200/60 bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-100">
          
          {/* Brand & Tagline */}
          <div className="text-center sm:text-left">
            <span className="text-base font-bold text-neutral-900 tracking-tight">
              Mehul Pathak
            </span>
            <p className="text-xs text-neutral-500 mt-1">
              Full Stack Software Developer & Applied AI Explorer
            </p>
          </div>

          {/* Social Links (Dynamic from Dashboard) */}
          <div className="flex items-center gap-3">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all"
              >
                <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />
              </a>
            )}
            {leetcode && (
              <a
                href={leetcode}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all"
              >
                <LeetCodeIcon className="w-4 h-4 text-amber-600" />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all"
              >
                <TwitterXIcon className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={scrollToTop}
              aria-label="Back to Top"
              className="w-9 h-9 rounded-full bg-neutral-900 text-white hover:bg-black flex items-center justify-center transition-all shadow-xs cursor-pointer ml-2"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 text-center sm:text-left">
          <p>© {currentYear} Mehul Pathak. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5">
            {sections.overview !== false && <a href="/#overview" className="hover:text-neutral-900 transition-colors">Overview</a>}
            {sections.projects !== false && <a href="/#projects" className="hover:text-neutral-900 transition-colors">Projects</a>}
            {sections.blogs !== false && <Link href="/blog" className="hover:text-neutral-900 transition-colors">Blog</Link>}
            {sections.journey !== false && <a href="/#journey" className="hover:text-neutral-900 transition-colors">Journey</a>}
            {sections.contact !== false && <a href="/#contact" className="hover:text-neutral-900 transition-colors">Contact</a>}
          </div>
        </div>
      </div>
    </footer>
  );
}

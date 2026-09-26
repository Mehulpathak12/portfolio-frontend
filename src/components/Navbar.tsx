"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const { handleLogoClick, isAdmin, portfolio } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sections = portfolio?.sections || {};

  // Track scroll state for responsive glass backdrop elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Primary curated desktop links for an airy, premium look
  const primaryDesktopLinks = [
    { label: "Projects", href: "/#projects", sectionKey: "projects" },
    { label: "Experience", href: "/#experience", sectionKey: "experience" },
    { label: "Skills", href: "/#skills", sectionKey: "skills" },
    { label: "Certificates", href: "/#certificates", sectionKey: "certificates" },
    { label: "Blog", href: "/blog", sectionKey: "blogs" },
    { label: "About", href: "/#about", sectionKey: "about" },
  ];

  // Full section links for mobile drawer
  const allMobileLinks = [
    { label: "Overview", href: "/#overview", sectionKey: "overview" },
    { label: "Projects", href: "/#projects", sectionKey: "projects" },
    { label: "Experience", href: "/#experience", sectionKey: "experience" },
    { label: "Skills", href: "/#skills", sectionKey: "skills" },
    { label: "Certificates", href: "/#certificates", sectionKey: "certificates" },
    { label: "Blog", href: "/blog", sectionKey: "blogs" },
    { label: "Milestones", href: "/#journey", sectionKey: "journey" },
    { label: "About", href: "/#about", sectionKey: "about" },
    { label: "Contact", href: "/#contact", sectionKey: "contact" },
  ];

  // Filter links dynamically: if a section is hidden in Admin, hide it from the nav
  const desktopNavLinks = primaryDesktopLinks.filter((link) => sections[link.sectionKey] !== false);
  const mobileNavLinks = allMobileLinks.filter((link) => sections[link.sectionKey] !== false);

  const resumeUrl =
    portfolio?.siteConfig?.hero?.resumeLink ||
    "https://drive.google.com/file/d/1N4h7X_MrmL1xsn-TegPZyhJ_S239UE2L/view";

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-40 mx-auto w-full max-w-5xl px-3 sm:px-6 pointer-events-none">
      {/* Floating Island Capsule */}
      <div
        className={`pointer-events-auto rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-2xl border border-neutral-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
            : "bg-white/75 backdrop-blur-xl border border-neutral-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* Brand Logo with 3x stealth click */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogoClick}
            title="Mehul Pathak (Click 3 times to unlock stealth admin mode)"
            className="group flex items-center gap-2.5 focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-semibold text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              MP
            </div>
            <span className="font-semibold text-neutral-900 text-sm tracking-tight group-hover:text-blue-600 transition-colors">
              Mehul Pathak
            </span>
          </button>
          {isAdmin && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              Admin
            </span>
          )}
        </div>

        {/* Curated Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {desktopNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100/70 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70 transition-all"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400" />
          </a>
          {sections.contact !== false && (
            <a
              href="/#contact"
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-neutral-900 hover:bg-black transition-all shadow-xs hover:shadow"
            >
              <span>Get in Touch</span>
            </a>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-1.5 md:hidden pointer-events-auto">
          {sections.contact !== false && (
            <a
              href="/#contact"
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-neutral-900 hover:bg-black transition-all"
            >
              Contact
            </a>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto mt-2 rounded-3xl bg-white/95 backdrop-blur-2xl border border-neutral-200/80 p-5 shadow-2xl animate-fade-in md:hidden">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {mobileNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-all flex items-center justify-center gap-1"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
            </a>
            {sections.contact !== false && (
              <a
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-black transition-all"
              >
                Get in Touch
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

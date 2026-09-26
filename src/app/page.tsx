"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OverviewSection from "@/components/OverviewSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificatesSection from "@/components/CertificatesSection";
import MilestonesSection from "@/components/MilestonesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StealthAdminBar from "@/components/StealthAdminBar";
import SecretLoginModal from "@/components/SecretLoginModal";
import UniversalSectionModal from "@/components/modals/UniversalSectionModal";
import ProjectModal from "@/components/modals/ProjectModal";
import ExperienceModal from "@/components/modals/ExperienceModal";
import CertificateModal from "@/components/modals/CertificateModal";
import BlogModal from "@/components/modals/BlogModal";

export default function Home() {
  const { portfolio, loading } = useAdmin();
  const sections = portfolio?.sections || {};

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-neutral-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        {sections.hero !== false && <HeroSection />}
        {sections.overview !== false && <OverviewSection />}
        {sections.skills !== false && <SkillsSection />}
        {sections.experience !== false && <ExperienceSection />}
        {sections.projects !== false && <ProjectsSection />}
        {sections.certificates !== false && <CertificatesSection />}
        {sections.journey !== false && <MilestonesSection />}
        {sections.about !== false && <AboutSection />}
        {sections.contact !== false && <ContactSection />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Stealth Admin Tools & Modals */}
      <StealthAdminBar />
      <SecretLoginModal />
      <UniversalSectionModal />
      <ProjectModal />
      <ExperienceModal />
      <CertificateModal />
      <BlogModal />
    </div>
  );
}

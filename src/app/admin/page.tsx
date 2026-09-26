"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import {
  ShieldCheck,
  LayoutDashboard,
  Layers,
  FolderGit2,
  Briefcase,
  Award,
  Mail,
  Trash2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  LogOut,
  ToggleLeft,
  ToggleRight,
  Eye,
  Plus,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
  Globe,
  Settings,
  BookOpen,
  Link2
} from "lucide-react";
import ProjectModal from "@/components/modals/ProjectModal";
import ExperienceModal from "@/components/modals/ExperienceModal";
import CertificateModal from "@/components/modals/CertificateModal";
import BlogModal from "@/components/modals/BlogModal";

export default function AdminDashboard() {
  const {
    isAdmin,
    adminUser,
    portfolio,
    authChecking,
    login,
    logout,
    refreshPortfolio,
    openEditModal,
    getAuthHeaders,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<"overview" | "content" | "links" | "projects" | "experience" | "certificates" | "blogs" | "sections" | "messages">("overview");

  // Links & Author Profiles State
  const [linksFormData, setLinksFormData] = useState({
    resumeLink: "",
    email: "",
    github: "",
    linkedin: "",
    twitter: "",
    leetcode: "",
    authorName: "",
    authorRole: "",
    authorImage: "",
    authorGithub: "",
    authorLinkedin: "",
    authorTwitter: "",
    authorWebsite: "",
  });
  const [savingLinks, setSavingLinks] = useState(false);
  const [linksSaveStatus, setLinksSaveStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Login form state for inline login if unauthenticated
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Content Editor State
  const [editingSection, setEditingSection] = useState<string>("hero");
  const [sectionFormData, setSectionFormData] = useState<any>({});
  const [savingSection, setSavingSection] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reordering, setReordering] = useState<string | null>(null);

  // Fetch messages when authenticated
  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  // Load section form data when editingSection changes
  useEffect(() => {
    if (portfolio?.siteConfig && editingSection) {
      setSectionFormData(portfolio.siteConfig[editingSection] || {});
      setSaveStatus(null);
    }
  }, [portfolio, editingSection]);

  // Load links and author bio form data
  useEffect(() => {
    if (portfolio?.siteConfig) {
      const cfg = portfolio.siteConfig;
      const bCfg = cfg.blogs || {};
      const aCfg = cfg.about || {};
      const hCfg = cfg.hero || {};
      const sCfg = cfg.socialLinks || {};

      setLinksFormData({
        resumeLink: hCfg.resumeLink || sCfg.resume || "https://drive.google.com/file/d/1N4h7X_MrmL1xsn-TegPZyhJ_S239UE2L/view",
        email: aCfg.email || sCfg.email || "mehulpathak48@gmail.com",
        github: aCfg.github || sCfg.github || "https://github.com/Mehulpathak12",
        linkedin: aCfg.linkedin || sCfg.linkedin || "https://www.linkedin.com/in/mehul-2004-10-pathak",
        twitter: aCfg.twitter || sCfg.twitter || "https://x.com/mehulpathak2004",
        leetcode: aCfg.leetcode || sCfg.leetcode || "https://leetcode.com/u/mehulpathak",
        authorName: bCfg.authorName || aCfg.name || "Mehul Pathak",
        authorRole: bCfg.authorRole || bCfg.authorBio || "Full-stack developer building robust web applications, exploring applied AI & RAG tooling in Python, and solving algorithmic problems.",
        authorImage: bCfg.authorImage || aCfg.image || "/image/about1.jpg",
        authorGithub: bCfg.authorGithub || aCfg.github || "https://github.com/Mehulpathak12",
        authorLinkedin: bCfg.authorLinkedin || aCfg.linkedin || "https://www.linkedin.com/in/mehul-2004-10-pathak",
        authorTwitter: bCfg.authorTwitter || aCfg.twitter || "https://x.com/mehulpathak2004",
        authorWebsite: bCfg.authorWebsite || "https://mehulpathak.tech",
      });
    }
  }, [portfolio]);

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLinks(true);
    setLinksSaveStatus(null);

    try {
      const headers = { "Content-Type": "application/json", ...getAuthHeaders() };

      // 1. Update hero resumeLink
      await fetch("/api/admin/section/hero", {
        method: "POST",
        headers,
        body: JSON.stringify({ resumeLink: linksFormData.resumeLink }),
      });

      // 2. Update about social links
      await fetch("/api/admin/section/about", {
        method: "POST",
        headers,
        body: JSON.stringify({
          github: linksFormData.github,
          linkedin: linksFormData.linkedin,
          twitter: linksFormData.twitter,
          leetcode: linksFormData.leetcode,
          email: linksFormData.email,
        }),
      });

      // 3. Update blogs author bio card and author links
      await fetch("/api/admin/section/blogs", {
        method: "POST",
        headers,
        body: JSON.stringify({
          authorName: linksFormData.authorName,
          authorRole: linksFormData.authorRole,
          authorBio: linksFormData.authorRole,
          authorImage: linksFormData.authorImage,
          authorGithub: linksFormData.authorGithub,
          authorLinkedin: linksFormData.authorLinkedin,
          authorTwitter: linksFormData.authorTwitter,
          authorWebsite: linksFormData.authorWebsite,
        }),
      });

      // 4. Update global socialLinks
      await fetch("/api/admin/section/socialLinks", {
        method: "POST",
        headers,
        body: JSON.stringify({
          github: linksFormData.github,
          linkedin: linksFormData.linkedin,
          twitter: linksFormData.twitter,
          leetcode: linksFormData.leetcode,
          email: linksFormData.email,
          resume: linksFormData.resumeLink,
        }),
      });

      setLinksSaveStatus({ type: "success", text: "All website links and author bio updated successfully in MongoDB Atlas!" });
      await refreshPortfolio();
    } catch (err: any) {
      setLinksSaveStatus({ type: "error", text: err.message || "Failed to update links" });
    } finally {
      setSavingLinks(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/admin/messages", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => (m.id || m._id) !== id));
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleToggleSection = async (sectionKey: string, currentVal: boolean) => {
    try {
      const res = await fetch("/api/admin/sections/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ section: sectionKey, enabled: !currentVal }),
      });
      if (res.ok) {
        await refreshPortfolio();
      }
    } catch (err) {
      console.error("Failed to toggle section:", err);
    }
  };

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    const isEmail = identifier.includes("@");
    const payload = isEmail ? { email: identifier, password } : { username: identifier, password };

    const res = await login(payload);
    setLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || "Invalid secret credentials.");
    }
  };

  const handleSaveSectionContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection(true);
    setSaveStatus(null);

    try {
      const res = await fetch(`/api/admin/section/${editingSection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(sectionFormData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus({ type: "success", text: `${editingSection.toUpperCase()} content saved successfully to MongoDB Atlas!` });
        await refreshPortfolio();
      } else {
        setSaveStatus({ type: "error", text: data.error || "Failed to update content." });
      }
    } catch (err: any) {
      setSaveStatus({ type: "error", text: err.message || "Network error" });
    } finally {
      setSavingSection(false);
    }
  };

  const handleReorder = async (type: "projects" | "experience" | "certificates" | "blogs", index: number, direction: "up" | "down") => {
    let list: any[] = [];
    if (type === "projects") list = [...(portfolio?.projects || [])];
    else if (type === "experience") list = [...(portfolio?.experiences || [])];
    else if (type === "certificates") list = [...(portfolio?.certificates || [])];
    else if (type === "blogs") list = [...(portfolio?.blogs || [])];

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap items locally
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Map each item to its new 1-based order index
    const payloadItems = list.map((item, idx) => ({
      id: item.id || item._id,
      order: idx + 1
    }));

    setReordering(`${type}-${index}`);
    try {
      const res = await fetch(`/api/admin/reorder/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ items: payloadItems })
      });
      if (res.ok) {
        await refreshPortfolio();
      }
    } catch (err) {
      console.error(`Failed to reorder ${type}:`, err);
    } finally {
      setReordering(null);
    }
  };

  // 1. Loading check
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <span className="text-xs text-neutral-400 font-medium">Verifying admin session...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fbfbfd]">
        <div className="apple-card p-8 sm:p-10 max-w-md w-full shadow-2xl relative">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto mb-5 shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Admin Console</h1>
            <p className="text-xs text-neutral-500 mt-1">Authenticate to access MongoDB controls</p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleInlineLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Email or Username
              </label>
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="mehulpathak48@gmail.com"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loggingIn ? <span>Authenticating...</span> : <span>Unlock Admin Console</span>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
            <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sectionsConfig = portfolio?.sections || {};

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-neutral-900 pb-24">
      {/* Header */}
      <header className="border-b border-neutral-200/80 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              title="Return to Portfolio"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-neutral-900 leading-tight">Admin Console</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  MongoDB Atlas Live
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Logged in as <span className="font-semibold text-neutral-800">{adminUser?.name || "Mehul Pathak"}</span> ({adminUser?.email || "Admin"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Site</span>
            </Link>
            <button
              onClick={() => logout()}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Bar */}
      <div className="border-b border-neutral-200/70 bg-white/60 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "content", label: "Edit Complete Website", icon: Edit3 },
            { id: "links", label: "Links & Author Bio", icon: Link2 },
            { id: "projects", label: "Projects", icon: FolderGit2, count: portfolio?.projects?.length },
            { id: "experience", label: "Experience", icon: Briefcase, count: portfolio?.experiences?.length },
            { id: "certificates", label: "Certificates", icon: Award, count: portfolio?.certificates?.length },
            { id: "blogs", label: "Blogs & Articles", icon: BookOpen, count: portfolio?.blogs?.length },
            { id: "sections", label: "Section Visibility", icon: ToggleRight },
            { id: "messages", label: "Inquiries", icon: Mail, count: messages.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div
                onClick={() => setActiveTab("projects")}
                className="apple-card p-5 cursor-pointer hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
                  <FolderGit2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-3xl font-extrabold text-neutral-900">{portfolio?.projects?.length || 0}</span>
                <span className="text-[11px] text-neutral-400 block mt-1">Live in MongoDB</span>
              </div>

              <div
                onClick={() => setActiveTab("experience")}
                className="apple-card p-5 cursor-pointer hover:border-purple-300 transition-all group"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Experience</span>
                  <Briefcase className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-3xl font-extrabold text-neutral-900">{portfolio?.experiences?.length || 0}</span>
                <span className="text-[11px] text-neutral-400 block mt-1">Timeline Roles</span>
              </div>

              <div
                onClick={() => setActiveTab("certificates")}
                className="apple-card p-5 cursor-pointer hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Certificates</span>
                  <Award className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-3xl font-extrabold text-neutral-900">{portfolio?.certificates?.length || 0}</span>
                <span className="text-[11px] text-neutral-400 block mt-1">Verified Credentials</span>
              </div>

              <div
                onClick={() => setActiveTab("blogs")}
                className="apple-card p-5 cursor-pointer hover:border-indigo-300 transition-all group"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Articles</span>
                  <BookOpen className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-3xl font-extrabold text-neutral-900">{portfolio?.blogs?.length || 0}</span>
                <span className="text-[11px] text-neutral-400 block mt-1">Technical Blog</span>
              </div>

              <div
                onClick={() => setActiveTab("messages")}
                className="apple-card p-5 cursor-pointer hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Inquiries</span>
                  <Mail className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-3xl font-extrabold text-neutral-900">{messages.length}</span>
                <span className="text-[11px] text-neutral-400 block mt-1">Visitor Messages</span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="apple-card p-6 sm:p-8">
              <h2 className="text-base font-bold text-neutral-900 mb-4">Quick Management Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => openEditModal("project")}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-left transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 block">Add New Project</span>
                  <span className="text-[11px] text-neutral-500">Upload screenshot, add live and github links</span>
                </button>

                <button
                  onClick={() => openEditModal("experience")}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-left transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 block">Add Work Experience</span>
                  <span className="text-[11px] text-neutral-500">Add internship, job, or hackathon contribution</span>
                </button>

                <button
                  onClick={() => openEditModal("certificate")}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-left transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 block">Add Certificate</span>
                  <span className="text-[11px] text-neutral-500">Add credentials, verification URL, and badge image</span>
                </button>

                <button
                  onClick={() => openEditModal("blog")}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-left transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 block">Write New Article</span>
                  <span className="text-[11px] text-neutral-500">Draft blog post with slug, markdown & cover</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EDIT COMPLETE WEBSITE ================= */}
        {activeTab === "content" && (
          <div className="apple-card p-6 sm:p-10 space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Complete Website Content Editor</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Select any section to modify copy, titles, bio, and credentials live in MongoDB Atlas.
                </p>
              </div>

              {/* Section Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {["hero", "about", "overview", "skills", "blogs", "journey", "contact"].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setEditingSection(sec);
                      setSectionFormData(portfolio?.siteConfig?.[sec] || {});
                      setSaveStatus(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                      editingSection === sec
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {saveStatus && (
              <div
                className={`p-4 rounded-2xl border flex items-center gap-2.5 text-xs ${
                  saveStatus.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {saveStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{saveStatus.text}</span>
              </div>
            )}

            {/* Dynamic Form for Selected Section */}
            <form onSubmit={handleSaveSectionContent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(sectionFormData).map(([key, value]) => {
                  if (key === "_id" || key === "id") return null;

                  // Render nested array of cards or categories cleanly, or simple string arrays
                  if (Array.isArray(value)) {
                    if (value.length === 0 || typeof value[0] === "string") {
                      const arrayLabel = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                      return (
                        <div key={key} className="col-span-full">
                          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                            {arrayLabel} (comma separated)
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(value) ? value.join(", ") : String(value || "")}
                            onChange={(e) => {
                              const arr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                              setSectionFormData({ ...sectionFormData, [key]: arr });
                            }}
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="col-span-full p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                          {key} ({value.length} items)
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {value.map((item: any, idx: number) => (
                            <div key={idx} className="p-4 rounded-xl bg-white border border-neutral-200 space-y-2">
                              <span className="text-[11px] font-bold text-neutral-400 block">Item {idx + 1}</span>
                              {Object.entries(item).map(([subK, subV]) => (
                                <div key={subK}>
                                  <label className="text-[10px] font-semibold text-neutral-500 uppercase block mb-1">
                                    {subK}
                                  </label>
                                  {Array.isArray(subV) ? (
                                    <input
                                      type="text"
                                      value={subV.join(", ")}
                                      onChange={(e) => {
                                        const newArr = [...value];
                                        newArr[idx][subK] = e.target.value.split(",").map((s) => s.trim());
                                        setSectionFormData({ ...sectionFormData, [key]: newArr });
                                      }}
                                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200"
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={String(subV || "")}
                                      onChange={(e) => {
                                        const newArr = [...value];
                                        newArr[idx][subK] = e.target.value;
                                        setSectionFormData({ ...sectionFormData, [key]: newArr });
                                      }}
                                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  const isLongText = key.toLowerCase().includes("bio") || key.toLowerCase().includes("subtitle") || key.toLowerCase().includes("description");
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

                  return (
                    <div key={key} className={isLongText ? "col-span-full" : ""}>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                        {label}
                      </label>
                      {isLongText ? (
                        <textarea
                          rows={4}
                          value={String(value || "")}
                          onChange={(e) => setSectionFormData({ ...sectionFormData, [key]: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(value || "")}
                          onChange={(e) => setSectionFormData({ ...sectionFormData, [key]: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingSection}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSection ? "Saving to MongoDB..." : `Save ${editingSection.toUpperCase()} Changes`}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB: LINKS & AUTHOR BIO ================= */}
        {activeTab === "links" && (
          <div className="apple-card p-6 sm:p-10 space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Website Links & Blog Author Profile</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Manage all external links, resume download URL, social accounts, and the author bio displayed at the end of every blog article.
                </p>
              </div>
            </div>

            {linksSaveStatus && (
              <div
                className={`p-4 rounded-2xl border flex items-center gap-2.5 text-xs ${
                  linksSaveStatus.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {linksSaveStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{linksSaveStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveLinks} className="space-y-8">
              
              {/* 1. Blog Author Bio Card Section */}
              <div className="p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 space-y-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Blog Author Bio Card (End of Every Article)
                  </h3>
                </div>
                <p className="text-xs text-neutral-500">
                  Customizes the author badge and bio card that appears at the bottom of every technical blog post.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Author Name
                    </label>
                    <input
                      type="text"
                      required
                      value={linksFormData.authorName}
                      onChange={(e) => setLinksFormData({ ...linksFormData, authorName: e.target.value })}
                      placeholder="Mehul Pathak"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Renders as &quot;Written by {linksFormData.authorName || 'Mehul Pathak'}&quot;</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Author Avatar Image URL
                    </label>
                    <input
                      type="text"
                      value={linksFormData.authorImage}
                      onChange={(e) => setLinksFormData({ ...linksFormData, authorImage: e.target.value })}
                      placeholder="/image/about1.jpg"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                    />
                  </div>

                  <div className="col-span-full">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Author Bio / Subtitle Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={linksFormData.authorRole}
                      onChange={(e) => setLinksFormData({ ...linksFormData, authorRole: e.target.value })}
                      placeholder="Full-stack developer building robust web applications, exploring applied AI & RAG tooling in Python, and solving algorithmic problems."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Author GitHub Link
                    </label>
                    <input
                      type="url"
                      value={linksFormData.authorGithub}
                      onChange={(e) => setLinksFormData({ ...linksFormData, authorGithub: e.target.value })}
                      placeholder="https://github.com/Mehulpathak12"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Author LinkedIn Link
                    </label>
                    <input
                      type="url"
                      value={linksFormData.authorLinkedin}
                      onChange={(e) => setLinksFormData({ ...linksFormData, authorLinkedin: e.target.value })}
                      placeholder="https://www.linkedin.com/in/mehul-2004-10-pathak"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Author Twitter / X Link
                    </label>
                    <input
                      type="url"
                      value={linksFormData.authorTwitter}
                      onChange={(e) => setLinksFormData({ ...linksFormData, authorTwitter: e.target.value })}
                      placeholder="https://x.com/mehulpathak2004"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Author Website Link
                    </label>
                    <input
                      type="url"
                      value={linksFormData.authorWebsite}
                      onChange={(e) => setLinksFormData({ ...linksFormData, authorWebsite: e.target.value })}
                      placeholder="https://mehulpathak.tech"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Global Website & Social Links */}
              <div className="p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 space-y-5">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Global Portfolio Links & Social Accounts
                  </h3>
                </div>
                <p className="text-xs text-neutral-500">
                  These links power the navigation bar &quot;Resume&quot; button, the footer social icons, and the contact section.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-full">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Resume Download Link (Navbar & Hero buttons)
                    </label>
                    <input
                      type="url"
                      required
                      value={linksFormData.resumeLink}
                      onChange={(e) => setLinksFormData({ ...linksFormData, resumeLink: e.target.value })}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Contact Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={linksFormData.email}
                      onChange={(e) => setLinksFormData({ ...linksFormData, email: e.target.value })}
                      placeholder="mehulpathak48@gmail.com"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={linksFormData.github}
                      onChange={(e) => setLinksFormData({ ...linksFormData, github: e.target.value })}
                      placeholder="https://github.com/Mehulpathak12"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={linksFormData.linkedin}
                      onChange={(e) => setLinksFormData({ ...linksFormData, linkedin: e.target.value })}
                      placeholder="https://www.linkedin.com/in/mehul-2004-10-pathak"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Twitter / X Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={linksFormData.twitter}
                      onChange={(e) => setLinksFormData({ ...linksFormData, twitter: e.target.value })}
                      placeholder="https://x.com/mehulpathak2004"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      LeetCode Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={linksFormData.leetcode}
                      onChange={(e) => setLinksFormData({ ...linksFormData, leetcode: e.target.value })}
                      placeholder="https://leetcode.com/u/mehulpathak"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingLinks}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingLinks ? "Saving All Links..." : "Save All Links & Profiles"}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ================= TAB 3: PROJECTS ================= */}
        {activeTab === "projects" && (
          <div className="apple-card p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Projects Manager</h2>
                <p className="text-xs text-neutral-500">Create, edit, or delete portfolio project cards</p>
              </div>
              <button
                onClick={() => openEditModal("project")}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="divide-y divide-neutral-100">
              {portfolio?.projects?.map((p: any, idx: number) => {
                const pId = p.id || p._id;
                const isFirst = idx === 0;
                const isLast = idx === ((portfolio.projects?.length || 0) - 1);
                const isMoving = reordering?.startsWith("projects-");

                return (
                  <div key={pId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Reorder Controls */}
                      <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 bg-neutral-50 border border-neutral-200/80 rounded-xl p-1">
                        <button
                          disabled={isFirst || isMoving}
                          onClick={() => handleReorder("projects", idx, "up")}
                          className="p-1 rounded-md hover:bg-white text-neutral-500 hover:text-blue-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          title="Move Up (Display earlier)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-bold font-mono text-neutral-500 px-1">
                          #{idx + 1}
                        </span>
                        <button
                          disabled={isLast || isMoving}
                          onClick={() => handleReorder("projects", idx, "down")}
                          className="p-1 rounded-md hover:bg-white text-neutral-500 hover:text-blue-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          title="Move Down (Display later)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-neutral-900">{p.title}</h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            {p.category}
                          </span>
                          {p.featured && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                              Featured
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-neutral-400">
                            order: {p.order !== undefined ? p.order : (idx + 1)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{p.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => openEditModal("project", p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete project "${p.title}"?`)) return;
                          await fetch(`/api/admin/projects/${pId}`, { method: "DELETE", headers: getAuthHeaders() });
                          await refreshPortfolio();
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: EXPERIENCE ================= */}
        {activeTab === "experience" && (
          <div className="apple-card p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Experience Manager</h2>
                <p className="text-xs text-neutral-500">Manage work history, internships, and hackathon milestones</p>
              </div>
              <button
                onClick={() => openEditModal("experience")}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="divide-y divide-neutral-100">
              {portfolio?.experiences?.map((exp: any, idx: number) => {
                const expId = exp.id || exp._id;
                const isFirst = idx === 0;
                const isLast = idx === ((portfolio.experiences?.length || 0) - 1);
                const isMoving = reordering?.startsWith("experience-");

                return (
                  <div key={expId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Reorder Controls */}
                      <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 bg-neutral-50 border border-neutral-200/80 rounded-xl p-1">
                        <button
                          disabled={isFirst || isMoving}
                          onClick={() => handleReorder("experience", idx, "up")}
                          className="p-1 rounded-md hover:bg-white text-neutral-500 hover:text-purple-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          title="Move Up (Display earlier)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-bold font-mono text-neutral-500 px-1">
                          #{idx + 1}
                        </span>
                        <button
                          disabled={isLast || isMoving}
                          onClick={() => handleReorder("experience", idx, "down")}
                          className="p-1 rounded-md hover:bg-white text-neutral-500 hover:text-purple-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          title="Move Down (Display later)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-neutral-900">{exp.title}</h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                            {exp.type}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            order: {exp.order !== undefined ? exp.order : (idx + 1)}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-neutral-700 mt-0.5">
                          {exp.company} {exp.location ? `• ${exp.location}` : ""} • {exp.startDate} - {exp.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => openEditModal("experience", exp)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete experience "${exp.title}"?`)) return;
                          await fetch(`/api/admin/experience/${expId}`, { method: "DELETE", headers: getAuthHeaders() });
                          await refreshPortfolio();
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 5: CERTIFICATES ================= */}
        {activeTab === "certificates" && (
          <div className="apple-card p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Certificates Manager</h2>
                <p className="text-xs text-neutral-500">Record verified credentials from Coursera, Udemy, GDG, etc.</p>
              </div>
              <button
                onClick={() => openEditModal("certificate")}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio?.certificates?.map((cert: any, idx: number) => {
                const certId = cert.id || cert._id;
                const isFirst = idx === 0;
                const isLast = idx === ((portfolio.certificates?.length || 0) - 1);
                const isMoving = reordering?.startsWith("certificates-");

                return (
                  <div key={certId} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
                    <div>
                      {/* Reorder and Rank Header */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600">
                            #{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            order: {cert.order !== undefined ? cert.order : (idx + 1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-0.5">
                          <button
                            disabled={isFirst || isMoving}
                            onClick={() => handleReorder("certificates", idx, "up")}
                            className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-blue-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                            title="Move Earlier"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={isLast || isMoving}
                            onClick={() => handleReorder("certificates", idx, "down")}
                            className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-blue-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                            title="Move Later"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-white border border-neutral-200">
                        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600 mb-1 inline-block">
                        {cert.provider}
                      </span>
                      <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{cert.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Issued {cert.date}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-neutral-200 flex items-center justify-between">
                      <button
                        onClick={() => openEditModal("certificate", cert)}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete certificate "${cert.title}"?`)) return;
                          await fetch(`/api/admin/certificates/${certId}`, { method: "DELETE", headers: getAuthHeaders() });
                          await refreshPortfolio();
                        }}
                        className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB: BLOGS ================= */}
        {activeTab === "blogs" && (
          <div className="apple-card p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Blogs & Technical Writing Manager</h2>
                <p className="text-xs text-neutral-500">Create, edit, reorder, and publish SEO-optimized technical articles</p>
              </div>
              <button
                onClick={() => openEditModal("blog")}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Article</span>
              </button>
            </div>

            <div className="divide-y divide-neutral-100">
              {portfolio?.blogs?.map((b: any, idx: number) => {
                const bId = b.id || b._id;
                const isFirst = idx === 0;
                const isLast = idx === ((portfolio.blogs?.length || 0) - 1);
                const isMoving = reordering?.startsWith("blogs-");

                return (
                  <div key={bId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Reorder Controls */}
                      <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 bg-neutral-50 border border-neutral-200/80 rounded-xl p-1">
                        <button
                          disabled={isFirst || isMoving}
                          onClick={() => handleReorder("blogs", idx, "up")}
                          className="p-1 rounded-md hover:bg-white text-neutral-500 hover:text-indigo-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          title="Move Up (Display earlier)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-bold font-mono text-neutral-500 px-1">
                          #{idx + 1}
                        </span>
                        <button
                          disabled={isLast || isMoving}
                          onClick={() => handleReorder("blogs", idx, "down")}
                          className="p-1 rounded-md hover:bg-white text-neutral-500 hover:text-indigo-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          title="Move Down (Display later)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {b.coverImage && (
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                          <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-neutral-900">{b.title}</h3>
                          {b.published ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Published
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              Draft
                            </span>
                          )}
                          {b.featured && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              Featured
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-neutral-400">
                            order: {b.order !== undefined ? b.order : (idx + 1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                          <span className="font-mono text-[11px] text-indigo-600">/blog/{b.slug}</span>
                          <span>•</span>
                          <span>{b.date}</span>
                          <span>•</span>
                          <span>{b.readingTime || "5 min read"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer"
                        title="View Article"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => openEditModal("blog", b)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete blog post "${b.title}"?`)) return;
                          await fetch(`/api/admin/blogs/${bId}`, { method: "DELETE", headers: getAuthHeaders() });
                          await refreshPortfolio();
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SECTION VISIBILITY ================= */}
        {activeTab === "sections" && (
          <div className="apple-card p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Section Visibility Toggles</h2>
              <p className="text-xs text-neutral-500">Instantly show or hide any section across the public portfolio</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "hero", label: "Hero Banner" },
                { key: "overview", label: "At a Glance (4 Domains)" },
                { key: "skills", label: "Tech Stack & Toolkit" },
                { key: "experience", label: "Work Experience & Journey" },
                { key: "projects", label: "Projects Showcase" },
                { key: "certificates", label: "Certificates & Credentials" },
                { key: "blogs", label: "Blogs & Technical Writing" },
                { key: "journey", label: "Radial Radar & Live Feeds" },
                { key: "about", label: "About Me Story" },
                { key: "contact", label: "Contact Form" },
              ].map(({ key, label }) => {
                const isEnabled = sectionsConfig[key] !== false;
                return (
                  <div
                    key={key}
                    onClick={() => handleToggleSection(key, isEnabled)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isEnabled
                        ? "bg-blue-50/50 border-blue-200 text-blue-900"
                        : "bg-neutral-50 border-neutral-200 text-neutral-400"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{label}</span>
                      <span className="text-[10px] text-neutral-500">ID: #{key}</span>
                    </div>
                    {isEnabled ? (
                      <ToggleRight className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 7: MESSAGES INBOX ================= */}
        {activeTab === "messages" && (
          <div className="apple-card p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Visitor Contact Messages</h2>
                <p className="text-xs text-neutral-500">Inquiries submitted through your portfolio contact form</p>
              </div>
              <button
                onClick={fetchMessages}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Refresh Inbox
              </button>
            </div>

            {loadingMessages ? (
              <div className="py-12 text-center text-xs text-neutral-500">Loading messages from MongoDB...</div>
            ) : messages.length === 0 ? (
              <div className="py-16 text-center text-xs text-neutral-400">No contact messages in the inbox.</div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {messages.map((m: any, i: number) => {
                  const msgId = m.id || m._id;
                  const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleString() : "";

                  return (
                    <div key={msgId || i} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 max-w-3xl">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-sm font-bold text-neutral-900">{m.name}</span>
                          <a href={`mailto:${m.email}`} className="text-xs text-blue-600 hover:underline">
                            &lt;{m.email}&gt;
                          </a>
                          {dateStr && <span className="text-[11px] text-neutral-400">• {dateStr}</span>}
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
                          {m.message}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteMessage(msgId)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center cursor-pointer flex items-center gap-1.5"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modals for Item Adding / Editing */}
      <ProjectModal />
      <ExperienceModal />
      <CertificateModal />
      <BlogModal />
    </div>
  );
}

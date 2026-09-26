"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogModal from "@/components/modals/BlogModal";
import SecretLoginModal from "@/components/SecretLoginModal";
import { useAdmin } from "@/context/AdminContext";
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Search,
  Tag,
  Layers,
  Cpu,
  Globe,
  Binary
} from "lucide-react";

export default function BlogIndexClient() {
  const { portfolio, isAdmin, loading, openEditModal, refreshPortfolio, getAuthHeaders } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [reordering, setReordering] = useState<string | null>(null);

  // If blog section is disabled in admin and user is not an authenticated admin, trigger 404
  if (!loading && portfolio && portfolio.sections?.blogs === false && !isAdmin) {
    notFound();
  }

  const blogHeader = portfolio?.siteConfig?.blogs || {
    eyebrow: "Articles & Engineering Insights",
    title: "Thoughts on software systems, AI tooling, and full-stack craft.",
    subtitle: "In-depth explorations of modern web applications, local RAG architectures, FastAPI patterns, and algorithmic thinking.",
  };

  const rawBlogs: any[] = portfolio?.blogs || [];
  // For public visitors, show only published; for admin, show all (with draft badge)
  const availableBlogs = isAdmin ? rawBlogs : rawBlogs.filter((b: any) => b.published !== false);

  // Available categories for division
  const categories = [
    { id: "all", label: "All Articles", icon: Layers },
    { id: "ai", label: "Applied AI & RAG", icon: Cpu },
    { id: "fullstack", label: "Full-Stack & Web", icon: Globe },
    { id: "systems", label: "Systems & Algorithms", icon: Binary },
  ];

  // Helper to test if a blog belongs to a category
  const matchesCategory = (blog: any, catId: string) => {
    if (catId === "all") return true;
    const cat = (blog.category || "").toLowerCase();
    const tags = Array.isArray(blog.tags) ? blog.tags.join(" ").toLowerCase() : (blog.tags || "").toLowerCase();
    const title = (blog.title || "").toLowerCase();
    const summary = (blog.summary || "").toLowerCase();
    const combined = `${cat} ${tags} ${title} ${summary}`;

    if (catId === "ai") {
      return combined.includes("ai") || combined.includes("rag") || combined.includes("llm") || combined.includes("machine learning");
    }
    if (catId === "fullstack") {
      return combined.includes("full stack") || combined.includes("next") || combined.includes("react") || combined.includes("node") || combined.includes("fastapi") || combined.includes("web");
    }
    if (catId === "systems") {
      return combined.includes("system") || combined.includes("dsa") || combined.includes("algorithm") || combined.includes("database") || combined.includes("performance");
    }
    return true;
  };

  // Filtered by search and selected category
  const filteredBlogs = useMemo(() => {
    return availableBlogs.filter((b) => {
      const matchesSearch =
        searchQuery === "" ||
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(b.tags) && b.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCat = matchesCategory(b, selectedCategory);
      return matchesSearch && matchesCat;
    });
  }, [availableBlogs, searchQuery, selectedCategory]);

  // Featured Article (if any)
  const featuredBlog = availableBlogs.find((b) => b.featured);

  // Reorder handler
  const handleReorder = async (index: number, direction: "up" | "down") => {
    const list = [...rawBlogs];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const payloadItems = list.map((item, idx) => ({
      id: item.id || item._id,
      order: idx + 1,
    }));

    setReordering(`blog-${index}`);
    try {
      const res = await fetch("/api/admin/blogs/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ items: payloadItems }),
      });
      if (res.ok) {
        await refreshPortfolio();
      }
    } catch (err) {
      console.error("Failed to reorder blogs:", err);
    } finally {
      setReordering(null);
    }
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete blog article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        await refreshPortfolio();
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-neutral-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 px-3 py-1.5 rounded-full bg-white border border-neutral-200/80 shadow-2xs hover:shadow transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal("blogs", blogHeader)}
                className="apple-edit-btn"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Header</span>
              </button>
              <button
                onClick={() => openEditModal("blog")}
                className="apple-edit-btn bg-neutral-900 text-white hover:bg-black"
              >
                <Plus className="w-3 h-3" />
                <span>Write Article</span>
              </button>
            </div>
          )}
        </div>

        {/* Hero Banner */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3 block">
            {blogHeader.eyebrow || "Engineering Journal & Notes"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.15]">
            {blogHeader.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            {blogHeader.subtitle}
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80">
          
          {/* Category Pills (Divided Sections Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, keyword, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
            />
          </div>
        </div>

        {/* Featured Story Callout (Only on 'All' category and if no search query) */}
        {selectedCategory === "all" && !searchQuery && featuredBlog && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Featured Deep Dive
              </span>
            </div>

            <article className="apple-card overflow-hidden bg-white border border-neutral-200/80 grid grid-cols-1 lg:grid-cols-12 group hover:shadow-2xl transition-all duration-300">
              <div className="lg:col-span-7 aspect-video lg:aspect-auto overflow-hidden bg-neutral-100 border-b lg:border-b-0 lg:border-r border-neutral-100">
                <Link href={`/blog/${featuredBlog.slug || featuredBlog.id}`}>
                  <img
                    src={featuredBlog.coverImage || "/image/project/skill.png"}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[260px]"
                  />
                </Link>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-xs text-neutral-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{featuredBlog.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredBlog.readingTime || "5 min read"}</span>
                    </span>
                  </div>

                  <Link href={`/blog/${featuredBlog.slug || featuredBlog.id}`}>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {featuredBlog.title}
                    </h2>
                  </Link>

                  <p className="mt-3 text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {featuredBlog.summary}
                  </p>

                  {featuredBlog.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {(Array.isArray(featuredBlog.tags) ? featuredBlog.tags : String(featuredBlog.tags).split(",")).map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                          #{t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={`/blog/${featuredBlog.slug || featuredBlog.id}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>Read Deep Dive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Divided Sections or Filtered Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 apple-card bg-white p-8">
            <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-700">No articles matched your criteria</h3>
            <p className="text-xs text-neutral-400 mt-1">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* If 'All' is selected and no search, we show divided sections with headers */}
            {selectedCategory === "all" && !searchQuery ? (
              <>
                {/* 1. Applied AI & RAG Division */}
                {availableBlogs.some((b) => matchesCategory(b, "ai")) && (
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                          Applied AI, LLMs & RAG Architectures
                        </h2>
                      </div>
                      <span className="text-xs font-semibold text-neutral-400">
                        {availableBlogs.filter((b) => matchesCategory(b, "ai")).length} Articles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableBlogs.filter((b) => matchesCategory(b, "ai")).map((blog, idx) => (
                        <BlogCard
                          key={blog.id || blog._id || idx}
                          blog={blog}
                          idx={idx}
                          isAdmin={isAdmin}
                          reordering={reordering}
                          onReorder={handleReorder}
                          onEdit={(b) => openEditModal("blog", b)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. Full-Stack & Web Architecture Division */}
                {availableBlogs.some((b) => matchesCategory(b, "fullstack")) && (
                  <section className="space-y-6 pt-6">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                          Full-Stack Web & Systems Engineering
                        </h2>
                      </div>
                      <span className="text-xs font-semibold text-neutral-400">
                        {availableBlogs.filter((b) => matchesCategory(b, "fullstack")).length} Articles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableBlogs.filter((b) => matchesCategory(b, "fullstack")).map((blog, idx) => (
                        <BlogCard
                          key={blog.id || blog._id || idx}
                          blog={blog}
                          idx={idx}
                          isAdmin={isAdmin}
                          reordering={reordering}
                          onReorder={handleReorder}
                          onEdit={(b) => openEditModal("blog", b)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. Algorithms & Other Technical Notes */}
                {availableBlogs.some((b) => !matchesCategory(b, "ai") && !matchesCategory(b, "fullstack")) && (
                  <section className="space-y-6 pt-6">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                      <div className="flex items-center gap-2">
                        <Binary className="w-4 h-4 text-emerald-600" />
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                          Algorithms, Data Structures & Tools
                        </h2>
                      </div>
                      <span className="text-xs font-semibold text-neutral-400">
                        {availableBlogs.filter((b) => !matchesCategory(b, "ai") && !matchesCategory(b, "fullstack")).length} Articles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableBlogs.filter((b) => !matchesCategory(b, "ai") && !matchesCategory(b, "fullstack")).map((blog, idx) => (
                        <BlogCard
                          key={blog.id || blog._id || idx}
                          blog={blog}
                          idx={idx}
                          isAdmin={isAdmin}
                          reordering={reordering}
                          onReorder={handleReorder}
                          onEdit={(b) => openEditModal("blog", b)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              /* Single unified grid when a specific category tab or search query is active */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog, idx) => (
                  <BlogCard
                    key={blog.id || blog._id || idx}
                    blog={blog}
                    idx={idx}
                    isAdmin={isAdmin}
                    reordering={reordering}
                    onReorder={handleReorder}
                    onEdit={(b) => openEditModal("blog", b)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Modals */}
      <BlogModal />
      <SecretLoginModal />
    </div>
  );
}

// Reusable Article Card Component
function BlogCard({
  blog,
  idx,
  isAdmin,
  reordering,
  onReorder,
  onEdit,
  onDelete,
}: {
  blog: any;
  idx: number;
  isAdmin: boolean;
  reordering: string | null;
  onReorder: (idx: number, dir: "up" | "down") => void;
  onEdit: (b: any) => void;
  onDelete: (id: string, title: string, e: React.MouseEvent) => void;
}) {
  const blogId = blog.id || blog._id;
  const tagsList = Array.isArray(blog.tags)
    ? blog.tags
    : (blog.tags ? String(blog.tags).split(",").map((t) => t.trim()) : []);

  return (
    <article className="apple-card overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300 relative bg-white border border-neutral-200/80">
      {/* Admin Quick Action Controls */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full shadow-md border border-neutral-200/80">
          <button
            disabled={idx === 0 || !!reordering}
            onClick={() => onReorder(idx, "up")}
            className="p-1 text-neutral-500 hover:text-blue-600 rounded-full disabled:opacity-20 cursor-pointer"
            title="Move Earlier"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            disabled={idx === 0 || !!reordering}
            onClick={() => onReorder(idx, "down")}
            className="p-1 text-neutral-500 hover:text-blue-600 rounded-full disabled:opacity-20 cursor-pointer"
            title="Move Later"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => onEdit(blog)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer"
            title="Edit Article"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => onDelete(blogId, blog.title, e)}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
            title="Delete Article"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <div>
        {/* Cover Image */}
        <Link href={`/blog/${blog.slug || blogId}`} className="block relative aspect-video w-full bg-neutral-100 overflow-hidden border-b border-neutral-100">
          <img
            src={blog.coverImage || "/image/project/skill.png"}
            alt={blog.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {blog.featured && (
            <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Featured</span>
            </span>
          )}
          {isAdmin && blog.published === false && (
            <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800 text-white shadow-xs">
              Draft (Hidden from Public)
            </span>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{blog.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{blog.readingTime || "5 min read"}</span>
            </span>
          </div>

          <Link href={`/blog/${blog.slug || blogId}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-base font-bold text-neutral-900 leading-snug line-clamp-2">
              {blog.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs text-neutral-600 line-clamp-3 leading-relaxed">
            {blog.summary}
          </p>

          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {tagsList.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="px-6 pb-6 pt-2">
        <Link
          href={`/blog/${blog.slug || blogId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read Full Article</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}

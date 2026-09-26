"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { BookOpen, Clock, Calendar, ArrowRight, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";

export default function BlogSection() {
  const { portfolio, isAdmin, openEditModal, refreshPortfolio, getAuthHeaders } = useAdmin();
  const [reordering, setReordering] = useState<string | null>(null);

  const blogHeader = portfolio?.siteConfig?.blogs || {
    eyebrow: "Articles & Insights",
    title: "Engineering Notes & Blog.",
    subtitle: "Thoughts on full-stack architecture, applied AI systems, developer tools, and software performance.",
  };

  const rawBlogs = portfolio?.blogs || [];
  // For public visitors, show only published; for admin, show all (with draft badge)
  const displayBlogs = isAdmin ? rawBlogs : rawBlogs.filter((b: any) => b.published !== false);

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

  if (displayBlogs.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <section id="blogs" className="py-20 sm:py-28 bg-[#f5f5f7]/60 border-t border-neutral-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              {blogHeader.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              {blogHeader.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {blogHeader.subtitle}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            {isAdmin && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayBlogs.map((blog: any, idx: number) => {
            const blogId = blog.id || blog._id;
            const tagsList = Array.isArray(blog.tags)
              ? blog.tags
              : (blog.tags ? blog.tags.split(",").map((t: string) => t.trim()) : []);

            return (
              <article
                key={blogId || idx}
                className="apple-card overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300 relative bg-white border border-neutral-200/80"
              >
                {/* Admin Quick Action Controls */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full shadow-md border border-neutral-200/80">
                    <button
                      disabled={idx === 0 || !!reordering}
                      onClick={() => handleReorder(idx, "up")}
                      className="p-1 text-neutral-500 hover:text-blue-600 rounded-full disabled:opacity-20 cursor-pointer"
                      title="Move Earlier"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={idx === displayBlogs.length - 1 || !!reordering}
                      onClick={() => handleReorder(idx, "down")}
                      className="p-1 text-neutral-500 hover:text-blue-600 rounded-full disabled:opacity-20 cursor-pointer"
                      title="Move Later"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => openEditModal("blog", blog)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(blogId, blog.title, e)}
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

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Meta: Reading Time & Date */}
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

                    {/* Title */}
                    <Link href={`/blog/${blog.slug || blogId}`} className="block group-hover:text-blue-600 transition-colors">
                      <h3 className="text-lg font-bold text-neutral-900 leading-snug line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Summary */}
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                      {blog.summary}
                    </p>

                    {/* Tags */}
                    {tagsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {tagsList.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Read More Link */}
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
          })}
        </div>

      </div>
    </section>
  );
}

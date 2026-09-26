"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  X,
  Save,
  Upload,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Image as ImageIcon,
  Copy,
  Check,
  PlusCircle,
  Trash2,
  Sparkles
} from "lucide-react";

export default function BlogModal() {
  const { activeEditModal, activeEditItem, closeEditModal, refreshPortfolio, getAuthHeaders } = useAdmin();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    category: "Full Stack",
    summary: "",
    content: "",
    coverImage: "/image/project/skill.png",
    images: [] as string[],
    tags: "AI & RAG, Architecture, Python",
    readingTime: "5 min read",
    published: true,
    featured: false,
    order: 0,
    date: "",
  });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingMulti, setUploadingMulti] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (activeEditModal === "blog" && activeEditItem) {
      setFormData({
        id: activeEditItem.id || activeEditItem._id || "",
        title: activeEditItem.title || "",
        slug: activeEditItem.slug || "",
        category: activeEditItem.category || "Full Stack",
        summary: activeEditItem.summary || "",
        content: activeEditItem.content || "",
        coverImage: activeEditItem.coverImage || "/image/project/skill.png",
        images: Array.isArray(activeEditItem.images) ? activeEditItem.images : [],
        tags: Array.isArray(activeEditItem.tags) ? activeEditItem.tags.join(", ") : (activeEditItem.tags || ""),
        readingTime: activeEditItem.readingTime || "5 min read",
        published: activeEditItem.published !== undefined ? Boolean(activeEditItem.published) : true,
        featured: Boolean(activeEditItem.featured),
        order: activeEditItem.order !== undefined ? Number(activeEditItem.order) : 0,
        date: activeEditItem.date || "",
      });
    } else if (activeEditModal === "blog") {
      setFormData({
        id: "",
        title: "",
        slug: "",
        category: "Full Stack",
        summary: "",
        content: "",
        coverImage: "/image/project/skill.png",
        images: [],
        tags: "AI & RAG, Architecture, Python",
        readingTime: "5 min read",
        published: true,
        featured: false,
        order: 0,
        date: "",
      });
    }
    setStatusMessage(null);
    setCopiedUrl(null);
  }, [activeEditModal, activeEditItem]);

  if (activeEditModal !== "blog") return null;

  // Auto-slug generator when title changes (if slug hasn't been manually heavily customized)
  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !prev.id || prev.slug === "" ? generatedSlug : prev.slug,
    }));
  };

  // Upload single cover image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          coverImage: data.url,
          images: prev.images.includes(data.url) ? prev.images : [...prev.images, data.url]
        }));
        setStatusMessage({ type: "success", text: "Cover image uploaded to Cloudinary!" });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Image upload failed" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload multiple images to Cloudinary simultaneously
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMulti(true);
    setUploadCount(files.length);
    setStatusMessage({ type: "success", text: `Uploading ${files.length} images to Cloudinary...` });

    const newUrls: string[] = [];
    const authHeaders = getAuthHeaders();

    for (let i = 0; i < files.length; i++) {
      const form = new FormData();
      form.append("file", files[i]);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: authHeaders,
          body: form,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          newUrls.push(data.url);
        }
      } catch (err) {
        console.error("Failed to upload image index", i, err);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newUrls],
      // If cover is default, use first uploaded
      coverImage: (!prev.coverImage || prev.coverImage.includes("/image/project/skill.png")) && newUrls.length > 0
        ? newUrls[0]
        : prev.coverImage,
    }));

    setUploadingMulti(false);
    setStatusMessage({
      type: "success",
      text: `Successfully uploaded ${newUrls.length} images to Cloudinary! You can insert them directly into markdown.`,
    });
  };

  const copyMarkdown = (url: string) => {
    const md = `![Image description](${url})`;
    navigator.clipboard.writeText(md);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const insertIntoContent = (url: string) => {
    const md = `\n\n![Image description](${url})\n\n`;
    setFormData((prev) => ({
      ...prev,
      content: prev.content + md,
    }));
    setStatusMessage({ type: "success", text: "Image markdown code inserted at the bottom of article!" });
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/blogs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: "Blog post saved successfully!" });
        await refreshPortfolio();
        setTimeout(() => closeEditModal(), 800);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to save blog post" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-4xl max-h-[94vh] flex flex-col bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                {formData.id ? "Edit Blog Article" : "Write New Blog Article"}
              </h2>
              <p className="text-xs text-neutral-500">
                SEO slugs, multi-image Cloudinary gallery, and markdown editor
              </p>
            </div>
          </div>
          <button
            onClick={closeEditModal}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Title, Category & Slug */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Building Practical RAG Pipelines with Python..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Category / Division
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                >
                  <option value="Applied AI">Applied AI & RAG</option>
                  <option value="Full Stack">Full Stack & Web</option>
                  <option value="System Architecture">System Architecture</option>
                  <option value="Algorithms">Algorithms & DSA</option>
                  <option value="Engineering Notes">Engineering Notes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                SEO URL Slug (e.g. /blog/my-post-title)
              </label>
              <div className="flex items-center">
                <span className="px-3.5 py-2 text-xs font-mono bg-neutral-100 text-neutral-500 border border-r-0 border-neutral-200 rounded-l-xl select-none">
                  /blog/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="building-practical-rag-pipelines"
                  className="flex-1 px-4 py-2 text-xs font-mono rounded-r-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics: Reading Time, Order, Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Reading Time
              </label>
              <input
                type="text"
                value={formData.readingTime}
                onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                placeholder="5 min read"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div className="flex flex-col justify-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300"
                />
                <span className="text-xs font-semibold text-neutral-700">Published Live</span>
              </label>
            </div>

            <div className="flex flex-col justify-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-neutral-300"
                />
                <span className="text-xs font-semibold text-neutral-700">Featured Post</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Tags & Keywords (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="AI & RAG, Architecture, Python, Vector Search"
              className="w-full px-4 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Summary / Meta Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Brief Summary (Used on Card & SEO Meta Description)
            </label>
            <textarea
              rows={2}
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="A concise, punchy 1-2 sentence overview of the article..."
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none font-sans"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Featured Cover Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none"
              />
              <label className="px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingCover ? "Uploading..." : "Upload Cover"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
            </div>
          </div>

          {/* Multiple Image Upload & Media Gallery */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Multiple Image Upload & Article Gallery
                </label>
                <p className="text-[11px] text-neutral-500">
                  Select multiple screenshots/diagrams at once. They will be stored in Cloudinary and can be copied or inserted directly into the markdown.
                </p>
              </div>

              <label className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shrink-0">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{uploadingMulti ? `Uploading ${uploadCount}...` : "Upload Multiple Images"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleImageUpload}
                  className="hidden"
                  disabled={uploadingMulti}
                />
              </label>
            </div>

            {/* Gallery Thumbnails List */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {formData.images.map((imgUrl, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-2xs flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                      <img src={imgUrl} alt={`Uploaded ${i + 1}`} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-neutral-400 block truncate mb-1.5">
                        Image #{i + 1}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => copyMarkdown(imgUrl)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Copy ![Image](url) to clipboard"
                        >
                          {copiedUrl === imgUrl ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{copiedUrl === imgUrl ? "Copied" : "Copy MD"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertIntoContent(imgUrl)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer transition-colors"
                          title="Append into content text"
                        >
                          Insert
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, coverImage: imgUrl }))}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer transition-colors"
                          title="Make Cover Image"
                        >
                          Cover
                        </button>

                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                          title="Delete from list"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-neutral-400 bg-white/50 rounded-xl border border-dashed border-neutral-200">
                No extra images uploaded yet. Click &quot;Upload Multiple Images&quot; to batch upload diagrams, architecture charts, or code screenshots.
              </div>
            )}
          </div>

          {/* Full Markdown Article Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Article Content (Markdown / Formatted Text)
              </label>
              <span className="text-[10px] text-neutral-400">
                Supports `---` dividers, `![alt](url)` images, `##` headings, and ````code blocks
              </span>
            </div>
            <textarea
              rows={13}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your article in Markdown here...&#10;&#10;## 1. System Architecture Overview&#10;Your insights...&#10;&#10;---&#10;&#10;## 2. Benchmark Comparisons&#10;&#10;```python&#10;def hello_world():&#10;    print('Clean RAG')&#10;```"
              className="w-full px-4 py-3 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono leading-relaxed"
            />
          </div>

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Saving to Atlas..." : "Save Blog Post"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

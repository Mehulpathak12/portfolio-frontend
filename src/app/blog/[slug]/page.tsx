import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from "next";
import { ArrowLeft, Clock, Calendar, Tag, Share2, Sparkles, BookOpen, Globe } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterXIcon } from "@/components/Icons";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogData(slug: string, token?: string) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`http://127.0.0.1:8000/api/blogs/${slug}`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return { blog: null, author: null };
    const data = await res.json();
    return { blog: data.blog || null, author: data.author || null };
  } catch (err) {
    console.error("Failed to fetch blog for slug:", slug, err);
    return { blog: null, author: null };
  }
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata(
  props: BlogPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await props.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const { blog } = await getBlogData(slug, token);

  if (!blog) {
    return {
      title: "Article Not Found | Mehul Pathak",
      description: "The requested article could not be found.",
    };
  }

  const siteUrl = "https://mehulpathak.tech";
  const articleUrl = `${siteUrl}/blog/${blog.slug}`;
  const coverUrl = blog.coverImage?.startsWith("http")
    ? blog.coverImage
    : `${siteUrl}${blog.coverImage || "/image/project/skill.png"}`;

  return {
    title: `${blog.title} | Mehul Pathak`,
    description: blog.summary,
    keywords: Array.isArray(blog.tags) ? blog.tags : (blog.tags ? blog.tags.split(",") : []),
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.summary,
      url: articleUrl,
      siteName: "Mehul Pathak Portfolio & Engineering Blog",
      type: "article",
      publishedTime: blog.createdAt,
      authors: ["Mehul Pathak"],
      tags: Array.isArray(blog.tags) ? blog.tags : undefined,
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.summary,
      images: [coverUrl],
      creator: "@mehulpathak2004",
    },
  };
}

// Helper: Enhanced markdown formatter supporting code blocks, subheadings, lists, dividers, and inline images
function renderMarkdownContent(content: string) {
  const lines = (content || "").split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";

  lines.forEach((line, i) => {
    // Code block toggle
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="my-6 rounded-2xl bg-neutral-900 text-neutral-100 p-5 overflow-x-auto font-mono text-xs sm:text-sm border border-neutral-800 shadow-md">
            {codeLang && <div className="text-[10px] text-neutral-400 font-sans uppercase mb-2 font-bold">{codeLang}</div>}
            <pre><code>{codeBuffer.join("\n")}</code></pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.replace("```", "").trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Section Horizontal Dividers (--- or ***)
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(
        <hr key={`divider-${i}`} className="my-10 border-t border-neutral-200/90" />
      );
      return;
    }

    // Inline Image: ![Alt text](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      elements.push(
        <figure key={`img-${i}`} className="my-8 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md">
          <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full max-h-[520px] object-cover" />
          {imgMatch[1] && (
            <figcaption className="text-xs text-neutral-500 text-center py-2.5 px-4 bg-neutral-50 border-t border-neutral-100">
              {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      return;
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl sm:text-2xl font-bold text-neutral-900 mt-8 mb-3 tracking-tight">
          {line.replace("### ", "")}
        </h3>
      );
      return;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-10 mb-4 tracking-tight border-b border-neutral-100 pb-2">
          {line.replace("## ", "")}
        </h2>
      );
      return;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-10 mb-4 tracking-tight">
          {line.replace("# ", "")}
        </h1>
      );
      return;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-blue-600 pl-4 py-1 my-4 italic text-neutral-600 text-sm sm:text-base">
          {line.replace("> ", "")}
        </blockquote>
      );
      return;
    }

    // Lists
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const itemText = line.substring(2);
      elements.push(
        <li key={i} className="ml-5 list-disc text-neutral-700 my-1 leading-relaxed text-sm sm:text-base">
          {itemText}
        </li>
      );
      return;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<div key={i} className="h-4" />);
      return;
    }

    // Standard Paragraph
    elements.push(
      <p key={i} className="text-neutral-700 leading-relaxed text-sm sm:text-base my-2">
        {line}
      </p>
    );
  });

  return elements;
}

export default async function BlogPostPage(props: BlogPageProps) {
  const { slug } = await props.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const { blog, author } = await getBlogData(slug, token);

  if (!blog) {
    notFound();
  }

  const tagsList = Array.isArray(blog.tags)
    ? blog.tags
    : (blog.tags ? blog.tags.split(",").map((t: string) => t.trim()) : []);

  // Schema.org BlogPosting Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.summary,
    image: blog.coverImage?.startsWith("http") ? blog.coverImage : `https://mehulpathak.tech${blog.coverImage || "/image/project/skill.png"}`,
    datePublished: blog.createdAt || blog.date,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: author?.name || "Mehul Pathak",
      url: author?.website || "https://mehulpathak.tech",
    },
    publisher: {
      "@type": "Person",
      name: author?.name || "Mehul Pathak",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://mehulpathak.tech/blog/${blog.slug}`,
    },
  };

  const authorName = author?.name || "Mehul Pathak";
  const authorBio = author?.role || author?.bio || "Full-stack developer building robust web applications, exploring applied AI & RAG tooling in Python, and solving algorithmic problems.";
  const authorImg = author?.image || "/image/about1.jpg";
  const authorGithub = author?.github || "https://github.com/Mehulpathak12";
  const authorLinkedin = author?.linkedin || "https://www.linkedin.com/in/mehul-2004-10-pathak";
  const authorTwitter = author?.twitter || "https://x.com/mehulpathak2004";
  const authorWebsite = author?.website || "https://mehulpathak.tech";

  return (
    <article className="min-h-screen bg-[#fbfbfd] text-neutral-900 selection:bg-blue-600 selection:text-white pt-10 pb-24">
      {/* Schema.org BlogPosting Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 shadow-xs hover:shadow transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            Portfolio Home
          </Link>
        </div>

        {/* Article Meta Bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-neutral-500 mb-4">
          <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{blog.category || "Engineering Article"}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{blog.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{blog.readingTime || "5 min read"}</span>
          </span>
        </div>

        {/* Main Article Title */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.15] mb-6">
          {blog.title}
        </h1>

        {/* Summary Lead Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-100/70 border border-neutral-200/80 mb-8 text-neutral-700 text-sm sm:text-base leading-relaxed font-normal">
          {blog.summary}
        </div>

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {tagsList.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-white border border-neutral-200/80 text-neutral-700 shadow-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Featured Cover Image */}
        {blog.coverImage && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-lg mb-12">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Markdown Body */}
        <div className="prose prose-neutral max-w-none text-neutral-800 text-base leading-relaxed">
          {renderMarkdownContent(blog.content)}
        </div>

        {/* Dynamic Author Bio Footer Card (Fully editable from Admin Dashboard) */}
        <div className="mt-16 pt-8 border-t border-neutral-200">
          <div className="apple-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 bg-white border border-neutral-200/90 shadow-md">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
              <img
                src={authorImg}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-base font-bold text-neutral-900">
                Written by {authorName}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {authorBio}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-neutral-600">
                {authorGithub && (
                  <a href={authorGithub} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors" title="GitHub">
                    <GitHubIcon className="w-4 h-4" />
                  </a>
                )}
                {authorLinkedin && (
                  <a href={authorLinkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" title="LinkedIn">
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                )}
                {authorTwitter && (
                  <a href={authorTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" title="Twitter / X">
                    <TwitterXIcon className="w-4 h-4" />
                  </a>
                )}
                {authorWebsite && (
                  <a href={authorWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" title="Website">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Technical Articles</span>
          </Link>
        </div>

      </div>
    </article>
  );
}
